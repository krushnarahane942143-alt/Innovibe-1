import pytest
from unittest.mock import patch

def test_get_destinations_success(client, sample_destination):
    # Mock the data_loader.get_destinations to return a list containing our sample destination
    # Note: the router expects a list of dicts from the loader
    mock_data = [{"name": sample_destination["name"], "country": sample_destination["country"], "description": sample_destination["description"]}]

    with patch("app.routers.destinations.data_loader.get_destinations", return_value=mock_data):
        response = client.get("/destinations/")

        assert response.status_code == 200
        data = response.json()
        assert isinstance(data, list)
        assert len(data) == 1
        assert data[0]["name"] == sample_destination["name"]
        assert data[0]["country"] == sample_destination["country"]

def test_get_destinations_empty(client):
    with patch("app.routers.destinations.data_loader.get_destinations", return_value=[]):
        response = client.get("/destinations/")

        assert response.status_code == 200
        assert response.json() == []
