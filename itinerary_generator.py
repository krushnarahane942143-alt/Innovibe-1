"""
itinerary_generator.py
----------------------
Functions:
  - generate_itinerary(preferences, destinations)
      Generate a multi-day travel itinerary using the Gemini API, filtered by
      user interests. Falls back to a simple 1-day plan if the API or parsing fails.
"""

from crowd_prediction import destinations
import os
import json
import re

from google import genai
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


def generate_itinerary(preferences, destinations):
    """Generate a travel itinerary using Gemini based on user preferences.

    Parameters:
        preferences (dict): Keys:
            - days (int): Number of days for the itinerary.
            - budget (str): One of "low", "medium", "high".
            - interests (list[str]): Tags to match against destination tags
              (e.g. ["beach", "culture", "nature"]).
            - group_type (str): One of "solo", "couple", "friends", "family".
        destinations (list[dict]): Each dict has keys:
            - name (str), city (str), tags (list[str]), rating (float),
              crowd_pattern (str).

    Returns:
        dict: Itinerary with shape:
            {
              "days": [
                {
                  "day": <int>,
                  "activities": [
                    {
                      "time_slot": "morning"|"afternoon"|"evening",
                      "place": <str, a name from destinations>,
                      "duration_hours": <int>,
                      "reason": <str>
                    }
                  ]
                }
              ]
            }
        dict: {"error": "no destinations provided"} if the destinations list is
        empty and no fallback can be constructed.

    Invalid input:
        Raises RuntimeError if GEMINI_API_KEY is not set in the environment.
        If destinations is empty, returns {"error": "no destinations provided"}.
        If the Gemini API call or JSON parsing fails twice, returns a 1-day
        fallback itinerary using the top-rated destination.
    """

    # 0. Guard: no destinations at all
    if not destinations:
        return {"error": "no destinations provided"}

    # 1. Configure Gemini API key from .env (never hardcoded)
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError(
            "GEMINI_API_KEY not found in environment. "
            "Make sure it is set in your .env file."
        )
    client = genai.Client(api_key=api_key)

    # 2. Filter destinations to those sharing at least one tag with interests
    interests = set(preferences.get("interests", []))
    filtered = [
        d for d in destinations
        if interests.intersection(set(d.get("tags", [])))
    ]

    # If nothing matches, fall back to using all destinations
    if not filtered:
        filtered = destinations

    # 3. Build the prompt
    days = preferences.get("days", 1)
    budget = preferences.get("budget", "medium")
    group_type = preferences.get("group_type", "solo")
    interests_list = preferences.get("interests", [])

    # Serialize filtered destinations as context for the prompt
    dest_lines = []
    for d in filtered:
        dest_lines.append(
            f"- {d['name']} (city: {d.get('city','')}, "
            f"tags: {', '.join(d.get('tags', []))}, "
            f"rating: {d.get('rating', '')}, "
            f"crowd_pattern: {d.get('crowd_pattern', '')})"
        )
    dest_context = "\n".join(dest_lines)

    prompt = f"""You are a travel itinerary planner.

User preferences:
- Days: {days}
- Budget: {budget}
- Group type: {group_type}
- Interests: {', '.join(interests_list)}

Available destinations (pre-filtered to match the user's interests):
{dest_context}

Create a {days}-day itinerary using ONLY the destinations listed above.
Each day should have activities spread across time slots (morning, afternoon, evening).

IMPORTANT: Respond with ONLY valid JSON. Do NOT include any markdown formatting
(like ```json or ```), and do NOT include any explanation text before or after
the JSON.

Return EXACTLY this JSON shape:
{{
  "days": [
    {{
      "day": 1,
      "activities": [
        {{
          "time_slot": "morning",
          "place": "<name from the destinations list>",
          "duration_hours": 2,
          "reason": "<short reason tied to the user's interests>"
        }}
      ]
    }}
  ]
}}
"""

    def _call_gemini(contents):
        """Send a prompt (or conversation) to Gemini and return raw response text."""
        response = client.models.generate_content(
            model="gemini-3.6-flash",
            contents=contents,
        )
        return response.text

    def _strip_markdown(text):
        """Remove surrounding ```json ... ``` fences if present."""
        text = text.strip()
        # Remove leading ```json or ``` and trailing ```
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
        return text.strip()

    def _parse_itinerary(text):
        """Strip fences and parse JSON. Raises on failure."""
        cleaned = _strip_markdown(text)
        return json.loads(cleaned)

    # 4. First API attempt
    messages = [{"role": "user", "parts": [{"text": prompt}]}]
    raw_response = None
    try:
        raw_response = _call_gemini(messages)
        itinerary = _parse_itinerary(raw_response)
        return itinerary
    except (json.JSONDecodeError, ValueError, Exception) as e:
        print(f"[Itinerary generation warning] Falling back: {e}")
        # 5. Retry ONCE with a follow-up telling the model it wasn't valid JSON
        try:
            retry_messages = messages + [
                {"role": "model", "parts": [{"text": raw_response if raw_response is not None else "(no response received)"}]},
                {
                    "role": "user",
                    "parts": [
                        {
                            "text": (
                                "Your last response was not valid JSON. "
                                "Please try again and respond with ONLY valid JSON "
                                "matching the requested shape, with no markdown fences "
                                "or extra text."
                            )
                        }
                    ],
                },
            ]
            raw_retry = _call_gemini(retry_messages)
            itinerary = _parse_itinerary(raw_retry)
            return itinerary
        except (json.JSONDecodeError, ValueError, Exception) as e:
            print(f"[Itinerary generation warning] Falling back: {e}")
            # 6. Fallback: 1-day itinerary using the top-rated destination
            top = max(filtered, key=lambda d: d.get("rating", 0))
            fallback = {
                "days": [
                    {
                        "day": 1,
                        "activities": [
                            {
                                "time_slot": "morning",
                                "place": top["name"],
                                "duration_hours": 2,
                                "reason": (
                                    "Top-rated destination matching your "
                                    "interests as a fallback itinerary."
                                ),
                            }
                        ],
                    }
                ]
            }
            return fallback


# ---------------------------------------------------------------------------
# Test call
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    sample_preferences = {
        "days": 3,
        "budget": "medium",
        "interests": ["beach", "culture", "nature"],
        "group_type": "couple",
    }



    result = generate_itinerary(sample_preferences, destinations)
    print(json.dumps(result, indent=2))
