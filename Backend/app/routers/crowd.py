# app/routers/crowd.py
from fastapi import APIRouter, HTTPException
from app.services.ai_integration import ai_service, AIIntegrationError
from datetime import datetime

router = APIRouter()

@router.get("/crowd/{id}")
async def get_crowd_status(id: str):
    try:
        crowd = await ai_service.predict_crowd(id)
        return {
            "id": id,
            "crowd": crowd,
            "updatedAt": datetime.utcnow().isoformat()
        }
    except AIIntegrationError as e:
        raise HTTPException(status_code=502, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
