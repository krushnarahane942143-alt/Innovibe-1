from typing import List
from app.models.schemas import Itinerary, Destination, Business, Preference
from app.services.data_loader import data_loader

class ItineraryGenerator:
    def generate(self, destination_id: any, pref: Preference) -> Itinerary:
        # Cast destination_id to int as the data loader uses int IDs
        try:
            dest_id = int(destination_id)
        except (ValueError, TypeError):
            raise ValueError("Invalid destination ID provided")

        # 1. Find destination
        destinations = data_loader.get_destinations()
        dest_data = next((d for d in destinations if d["id"] == dest_id), None)
        if not dest_data:
            raise ValueError("Destination not found")

        dest = Destination(
            name=dest_data["name"],
            country=dest_data["country"],
            description=dest_data.get("description")
        )

        # 2. Find and filter businesses
        businesses_all = data_loader.get_businesses()
        dest_businesses = [b for b in businesses_all if b["destination_id"] == dest_id]

        if not dest_businesses:
            # If no businesses found for this destination, we can't really generate a day-by-day list of businesses
            # But for the sake of the requirement, we'll provide an empty list of days or some generic activities.
            # However, usually, there should be some data.
            pass

        # Filter by interests (prefer businesses in categories that match interests)
        matched_businesses = []
        other_businesses = []

        for b in dest_businesses:
            if any(interest.lower() in b["category"].lower() for interest in pref.interests):
                matched_businesses.append(b)
            else:
                other_businesses.append(b)

        # Combine them, prioritizing matched ones
        pool = matched_businesses + other_businesses

        # 3. Generate days
        days = []
        total_cost = 0.0

        # Cost mapping for categories (dummy data for computation)
        category_costs = {
            "Landmark": 20.0,
            "Museum": 25.0,
            "Cafe": 15.0,
            "Restaurant": 40.0,
            "Park": 0.0,
            "Digital Art": 30.0
        }
        default_cost = 20.0

        # We want to distribute activities across the duration
        # Let's say 2-3 activities per day
        activities_per_day = 3

        for day_idx in range(pref.duration):
            day_activities = []
            for i in range(activities_per_day):
                if not pool:
                    break

                # Cycle through the pool to ensure we have activities for every day
                biz_data = pool[(day_idx * activities_per_day + i) % len(pool)]

                cost = category_costs.get(biz_data["category"], default_cost)

                biz = Business(
                    name=biz_data["name"],
                    category=biz_data["category"],
                    rating=biz_data["rating"],
                    address=f"Somewhere in {dest.name}",
                    description=f"A great {biz_data['category']} in {dest.name}"
                )
                day_activities.append(biz)
                total_cost += cost

            days.append(day_activities)

        # Add a base cost for accommodation, food, and transport per day
        # Estimated: Acc $100, Food $50, Trans $20 per day
        total_cost += pref.duration * (100 + 50 + 20)

        return Itinerary(
            destination=dest,
            days=days,
            total_estimated_cost=total_cost
        )

itinerary_generator = ItineraryGenerator()
