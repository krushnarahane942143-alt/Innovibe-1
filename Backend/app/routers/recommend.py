from fastapi import APIRouter
from typing import List
from app.models.schemas import Preference, RecommendedDestination
from app.services.recommendation_engine import recommendation_engine

router = APIRouter(
    prefix="/recommend",
    tags=["recommendations"]
)

@router.post("/", response_model=List[RecommendedDestination])
async def recommend_destinations(preferences: Preference):
    """
    Get personalized destination recommendations based on user preferences.
    """
    return recommendation_engine.recommend(preferences)
