from fastapi import APIRouter
from typing import List
from app.models.schemas import Destination
from app.services.data_loader import data_loader

router = APIRouter(
    prefix="/destinations",
    tags=["destinations"]
)

@router.get("/", response_model=List[Destination])
async def get_destinations():
    """
    Retrieve a list of all available travel destinations.
    """
    destinations_data = data_loader.get_destinations()
    return [
        Destination(
            name=dest.get("name"),
            country=dest.get("country"),
            description=dest.get("description")
        )
        for dest in destinations_data
    ]
