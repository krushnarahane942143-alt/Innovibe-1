import pytest
from unittest.mock import patch

def test_recommend_destinations_success(client, sample_preference, sample_recommended_destination):
    # Mock the recommendation_engine.recommend to return a list containing our sample recommended destination
    mock_recommendations = [sample_recommended_destination]

    with patch("app.routers.recommend.recommendation_engine.recommend", return_value=mock_recommendations):
        response = client.post("/recommend/", json=sample_preference)

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 1
        assert data[0]["name"] == sample_recommended_destination["name"]
        assert data[0]["matchScore"] == sample_recommended_destination["matchScore"]

def test_recommend_destinations_invalid_preferences(client):
    # Test with missing required fields in preferences
    invalid_preference = {"budget": 1000} # missing interests, duration, etc.
    response = client.post("/recommend/", json=invalid_preference)

    assert response.status_code == 422 # Unprocessable Entity
