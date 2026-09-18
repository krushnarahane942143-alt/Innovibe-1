import pytest
from unittest.mock import patch, AsyncMock
from app.services.ai_integration import AIIntegrationError

def test_get_crowd_status_success(client):
    # Mock the ai_service.predict_crowd to return a sample crowd prediction
    mock_crowd = {
        "destinationId": "dest_1",
        "level": "Medium",
        "percentage": 45,
        "confidence": 0.85
    }

    with patch("app.routers.crowd.ai_service.predict_crowd", new_callable=AsyncMock) as mock_predict:
        mock_predict.return_value = mock_crowd
        response = client.get("/crowd/dest_1")

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == "dest_1"
        assert data["crowd"]["level"] == "Medium"
        assert "updatedAt" in data

def test_get_crowd_status_ai_error(client):
    # Mock the ai_service.predict_crowd to raise AIIntegrationError
    with patch("app.routers.crowd.ai_service.predict_crowd", new_callable=AsyncMock) as mock_predict:
        mock_predict.side_effect = AIIntegrationError("AI service unavailable")
        response = client.get("/crowd/dest_1")

        assert response.status_code == 502
        assert response.json()["detail"] == "AI service unavailable"

def test_get_crowd_status_general_error(client):
    # Mock the ai_service.predict_crowd to raise a generic exception
    with patch("app.routers.crowd.ai_service.predict_crowd", new_callable=AsyncMock) as mock_predict:
        mock_predict.side_effect = Exception("Something went wrong")
        response = client.get("/crowd/dest_1")

        assert response.status_code == 500
        assert "Something went wrong" in response.json()["detail"]
