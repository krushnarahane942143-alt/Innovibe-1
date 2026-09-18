# app/routers/businesses.py
from fastapi import APIRouter, Query
from typing import List, Optional
from app.models.schemas import Business
from app.services.business_service import business_service

router = APIRouter()

@router.get("/businesses", response_model=List[Business])
async def get_businesses(
    destinationId: Optional[int] = Query(None),
    category: Optional[str] = Query(None),
    limit: int = Query(10, ge=1),
    offset: int = Query(0, ge=0)
):
    return business_service.get_businesses(destinationId, category, limit, offset)
