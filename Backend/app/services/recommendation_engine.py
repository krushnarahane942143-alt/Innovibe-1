# app/services/recommendation_engine.py
from typing import List, Dict, Any
from app.models.schemas import Preference, RecommendedDestination
from app.services.data_loader import data_loader

class RecommendationEngine:
    def __init__(self):
        self.weights = {
            "interests": 0.3,
            "budget": 0.2,
            "travelType": 0.2,
            "season": 0.2,
            "distance": 0.1
        }

    def score_destination(self, pref: Preference, dest: Dict[str, Any]) -> float:
        score = 0.0

        # 1. Interests Score (0-100)
        dest_interests = set(dest.get("interests", []))
        user_interests = set(pref.interests)
        if user_interests:
            matched_interests = user_interests & dest_interests
            interest_score = (len(matched_interests) / len(user_interests)) * 100
        else:
            interest_score = 100
        score += interest_score * self.weights["interests"]

        # 2. Budget Score (0-100)
        est_cost = dest.get("estimatedCost", 0)
        if est_cost <= pref.budget:
            budget_score = 100
        elif pref.budget == 0:
            budget_score = 0
        else:
            # Decay score as cost increases beyond budget
            diff = est_cost - pref.budget
            # budget_score drops to 0 if cost is 50% over budget
            budget_score = max(0, 100 - (diff / (pref.budget * 0.5)) * 100)
        score += budget_score * self.weights["budget"]

        # 3. Travel Type Score (0-100)
        dest_travel_type = dest.get("travelType", "").lower()
        user_travel_type = pref.travelType.lower()
        travel_type_score = 100 if user_travel_type == dest_travel_type else 0
        score += travel_type_score * self.weights["travelType"]

        # 4. Season Score (0-100)
        # dest.get("bestTime") might be a list or a string
        best_time = dest.get("bestTime", "")
        if isinstance(best_time, list):
            best_times = [t.lower() for t in best_time]
        else:
            best_times = [best_time.lower()]

        user_season = pref.season.lower()
        season_score = 100 if any(user_season in t for t in best_times) else 0
        score += season_score * self.weights["season"]

        # 5. Distance Score (0-100)
        dist = dest.get("distance", 0)
        # Distance score: 100 at 0km, 0 at 10,000km
        distance_score = max(0, 100 - (dist / 10000) * 100)
        score += distance_score * self.weights["distance"]

        return round(score, 2)

    def recommend(self, pref: Preference) -> List[RecommendedDestination]:
        destinations = data_loader.get_destinations()
        ranked = []

        for dest_data in destinations:
            score = self.score_destination(pref, dest_data)
            # Extract only the fields that Destination schema expects
            dest_obj = RecommendedDestination(
                name=dest_data.get("name"),
                country=dest_data.get("country"),
                description=dest_data.get("description"),
                matchScore=score
            )
            ranked.append(dest_obj)

        ranked.sort(key=lambda x: x.matchScore, reverse=True)
        return ranked

recommendation_engine = RecommendationEngine()
