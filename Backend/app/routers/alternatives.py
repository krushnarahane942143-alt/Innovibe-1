# app/routers/alternatives.py
from fastapi import APIRouter, HTTPException
from app.services.ai_integration import ai_service, AIIntegrationError

router = APIRouter()

@router.get("/alternatives/{id}")
async def get_alternatives(id: str):
    try:
        # Get alternative destination IDs from AI service
        alt_ids = await ai_service.get_alternatives(id)

        return {
            "id": id,
            "alternatives": alt_ids
        }
    except AIIntegrationError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
