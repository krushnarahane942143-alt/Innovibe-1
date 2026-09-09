"""
crowd_prediction.py
-------------------
Functions:
  - predict_crowd(destination_name, date_str)
      Predict crowd level ("low"/"medium"/"high") for a destination on a given date.
  - get_alternatives(destination_name, top_n=3)
      Return up to top_n similar destinations in the same city, ranked by tag overlap then rating.
"""

from datetime import datetime

destinations = [
    {
        "name": "Goa Beach",
        "city": "Goa",
        "tags": ["beach", "nightlife", "sunset"],
        "rating": 4.5,
        "crowd_pattern": "weekend_high"
    },
    {
        "name": "Anjuna Flea Market",
        "city": "Goa",
        "tags": ["shopping", "culture", "nightlife"],
        "rating": 4.2,
        "crowd_pattern": "weekend_high"
    },
    {
        "name": "Palolem Beach",
        "city": "Goa",
        "tags": ["beach", "relaxed", "nature"],
        "rating": 4.6,
        "crowd_pattern": "low"
    },
    {
        "name": "Dudhsagar Falls",
        "city": "Goa",
        "tags": ["nature", "adventure", "waterfall"],
        "rating": 4.4,
        "crowd_pattern": "festival_high"
    },
    {
        "name": "Basilica of Bom Jesus",
        "city": "Goa",
        "tags": ["culture", "history", "religious"],
        "rating": 4.3,
        "crowd_pattern": "weekend_high"
    }
]

festival_dates = [
    "2026-01-26",  # Republic Day
    "2026-03-04",  # Holi (placeholder date, check actual)
    "2026-10-20",  # Diwali (placeholder date, check actual)
    "2026-12-25",  # Christmas
]

def predict_crowd(destination_name, date_str):
    """Predict the crowd level for a destination on a given date.

    Parameters:
        destination_name (str): Name of the destination, matching the "name"
            field in the `destinations` list (e.g. "Goa Beach").
        date_str (str): Date in "YYYY-MM-DD" format (e.g. "2026-09-12").

    Returns:
        str: One of "low", "medium", or "high" indicating predicted crowd level.
        dict: {"error": "unknown destination"} if destination_name is not found.

    Invalid input:
        Returns {"error": "unknown destination"} if the name doesn't match any
        known destination.
    """
    # date_str looks like "2026-09-12"
    date_obj = datetime.strptime(date_str, "%Y-%m-%d")
    is_weekend = date_obj.weekday() >= 5  # Saturday=5, Sunday=6

    is_festival = date_str in festival_dates

    # find the destination in our list
    dest = None
    for d in destinations:
        if d["name"] == destination_name:
            dest = d
            break

    if dest is None:
        return {"error": "unknown destination"}

    if is_festival:
        if dest["crowd_pattern"] in ["weekend_high", "festival_high"]:
            return "high"
        else:
            return "medium"

    if is_weekend:
        if dest["crowd_pattern"] == "weekend_high":
            return "high"
        else:
            return "medium"

    return "low"

def get_alternatives(destination_name, top_n=3):
    """Find similar alternative destinations in the same city.

    Parameters:
        destination_name (str): Name of the destination to find alternatives for,
            matching the "name" field in the `destinations` list.
        top_n (int, optional): Maximum number of alternatives to return.
            Defaults to 3.

    Returns:
        list[dict]: Up to top_n candidate destinations, each with keys:
            "name" (str), "overlap_score" (int), "rating" (float),
            "crowd_pattern" (str). Sorted by overlap_score then rating,
            descending.
        dict: {"error": "unknown destination"} if destination_name is not found.

    Invalid input:
        Returns {"error": "unknown destination"} if the name doesn't match any
        known destination.
    """
    # find the destination we're trying to find alternatives for
    target = None
    for d in destinations:
        if d["name"] == destination_name:
            target = d
            break

    if target is None:
        return {"error": "unknown destination"}

    candidates = []
    for d in destinations:
        if d["name"] == destination_name:
            continue  # don't recommend the same place as its own alternative

        if d["city"] != target["city"]:
            continue  # only suggest places in the same city

        shared_tags = set(d["tags"]) & set(target["tags"])
        overlap_score = len(shared_tags)

        if overlap_score == 0:
            continue  # not similar enough to bother suggesting

        candidates.append({
            "name": d["name"],
            "overlap_score": overlap_score,
            "rating": d["rating"],
            "crowd_pattern": d["crowd_pattern"]
        })

    candidates.sort(key=lambda c: (c["overlap_score"], c["rating"]), reverse=True)

    return candidates[:top_n]


if __name__ == "__main__":
    print(predict_crowd("Goa Beach", "2026-09-09"))
    print(predict_crowd("Dudhsagar Falls", "2026-10-20"))   # festival date -> should be "high"
    print(predict_crowd("Palolem Beach", "2026-09-12"))      # weekend but low-pattern -> should be "medium"
    print(predict_crowd("Made Up Place", "2026-09-12"))

    print(get_alternatives("Goa Beach"))     # exists -> should return list of alternatives
