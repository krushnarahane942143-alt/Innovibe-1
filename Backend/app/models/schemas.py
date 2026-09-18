from pydantic import BaseModel, Field
from typing import List, Optional

class Preference(BaseModel):
    budget: float = Field(..., description="The maximum budget for the trip")
    interests: List[str] = Field(..., description="List of interests, e.g., ['culture', 'food', 'nature']")
    duration: int = Field(..., description="Duration of the trip in days")
    destination: str = Field(..., description="The target destination city or country")
    season: str = Field(..., description="Preferred travel season, e.g., 'Summer', 'Winter'")
    travelType: str = Field(..., description="Type of travel, e.g., 'Adventure', 'Relaxation', 'Luxury'")

class Destination(BaseModel):
    name: str = Field(..., description="Name of the destination")
    country: str = Field(..., description="Country of the destination")
    description: Optional[str] = Field(None, description="A brief description of the destination")

class RecommendedDestination(Destination):
    matchScore: float = Field(..., description="The match score of the destination (0-100)")

class Business(BaseModel):
    id: int = Field(..., description="Unique identifier of the business")
    destination_id: int = Field(..., description="ID of the destination where the business is located")
    name: str = Field(..., description="Name of the business/attraction")
    category: str = Field(..., description="Category of the business, e.g., 'Restaurant', 'Museum'")
    rating: float = Field(..., description="Rating of the business")
    crowd: Optional[str] = Field(None, description="Crowd level, e.g., 'HIGH', 'MEDIUM', 'LOW'")
    address: Optional[str] = Field(None, description="Address of the business")
    description: Optional[str] = Field(None, description="Description of the business")

class Itinerary(BaseModel):
    destination: Destination = Field(..., description="The destination for the itinerary")
    days: List[List[Business]] = Field(..., description="A list of days, each containing a list of businesses/activities to visit")
    total_estimated_cost: float = Field(..., description="Total estimated cost of the itinerary")

class GenerateItineraryRequest(BaseModel):
    destinationId: int = Field(..., description="ID of the destination")
    preferences: Preference = Field(..., description="User's travel preferences")

class Error(BaseModel):
    detail: str = Field(..., description="Detailed error message")
