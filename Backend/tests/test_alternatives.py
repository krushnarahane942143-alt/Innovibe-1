import pytest
from unittest.mock import patch, AsyncMock
from app.services.ai_integration import AIIntegrationError

def test_get_alternatives_success(client):
    # Mock the ai_service.get_alternatives to return a list of alternative IDs
    mock_alts = ["dest_101", "dest_102", "dest_103"]

    with patch("app.routers.alternatives.ai_service.get_alternatives", new_callable=AsyncMock) as mock_alts_call:
        mock_alts_call.return_value = mock_alts
        response = client.get("/alternatives/dest_1")

        assert response.status_code == 200
        data = response.json()
        assert data["id"] == "dest_1"
        assert data["alternatives"] == mock_alts

def test_get_alternatives_ai_error(client):
    # Mock the ai_service.get_alternatives to raise AIIntegrationError
    with patch("app.routers.alternatives.ai_service.get_alternatives", new_callable=AsyncMock) as mock_alts_call:
        mock_alts_call.side_effect = AIIntegrationError("AI service timed out")
        response = client.get("/alternatives/dest_1")

        assert response.status_code == 502
        assert response.json()["detail"] == "AI service timed out"

def test_get_alternatives_general_error(client):
    # Mock the ai_service.get_alternatives to raise a generic exception
    with patch("app.routers.alternatives.ai_service.get_alternatives", new_callable=AsyncMock) as mock_alts_call:
        mock_alts_call.side_effect = Exception("Unexpected error")
        response = client.get("/alternatives/dest_1")

        assert response.status_code == 500
        assert "Unexpected error" in response.json()["detail"]
