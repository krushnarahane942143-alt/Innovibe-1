import pytest
from unittest.mock import patch

def test_generate_itinerary_success(client, sample_preference, sample_itinerary):
    # Request body
    request_body = {
        "destinationId": 10,
        "preferences": sample_preference
    }

    with patch("app.routers.itinerary.itinerary_generator.generate", return_value=sample_itinerary):
        response = client.post("/generate-itinerary", json=request_body)

        assert response.status_code == 200
        data = response.json()
        assert data["destination"]["name"] == sample_itinerary["destination"]["name"]
        assert len(data["days"]) == len(sample_itinerary["days"])
        assert data["total_estimated_cost"] == sample_itinerary["total_estimated_cost"]

def test_generate_itinerary_not_found(client, sample_preference):
    request_body = {
        "destinationId": 999, # Non-existent ID
        "preferences": sample_preference
    }

    with patch("app.routers.itinerary.itinerary_generator.generate", side_effect=ValueError("Destination not found")):
        response = client.post("/generate-itinerary", json=request_body)

        assert response.status_code == 404
        assert response.json()["detail"] == "Destination not found"

def test_generate_itinerary_bad_request(client, sample_preference):
    request_body = {
        "destinationId": 10,
        "preferences": sample_preference
    }

    with patch("app.routers.itinerary.itinerary_generator.generate", side_effect=Exception("Invalid preferences for this destination")):
        response = client.post("/generate-itinerary", json=request_body)

        assert response.status_code == 400
        assert "Invalid preferences" in response.json()["detail"]

def test_generate_itinerary_invalid_request_body(client):
    # Test with missing fields in request body
    invalid_request = {"destinationId": 10} # missing preferences
    response = client.post("/generate-itinerary", json=invalid_request)

    assert response.status_code == 422
