# app/routers/itinerary.py
from fastapi import APIRouter, HTTPException
from app.models.schemas import Preference, Itinerary, GenerateItineraryRequest
from app.services.itinerary_generator import itinerary_generator

router = APIRouter()

@router.post("/generate-itinerary", response_model=Itinerary)
async def generate_itinerary(request: GenerateItineraryRequest):
    try:
        return itinerary_generator.generate(request.destinationId, request.preferences)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
