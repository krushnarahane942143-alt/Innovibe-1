import pytest
from fastapi.testclient import TestClient
from app.main import app

@pytest.fixture
def client():
    return TestClient(app)

@pytest.fixture
def sample_preference():
    return {
        "budget": 2000.0,
        "interests": ["culture", "food"],
        "duration": 5,
        "destination": "Paris",
        "season": "Spring",
        "travelType": "Luxury"
    }

@pytest.fixture
def sample_destination():
    return {
        "name": "Paris",
        "country": "France",
        "description": "The city of light"
    }

@pytest.fixture
def sample_recommended_destination():
    return {
        "name": "Paris",
        "country": "France",
        "description": "The city of light",
        "matchScore": 95.5
    }

@pytest.fixture
def sample_itinerary():
    return {
        "destination": {
            "name": "Paris",
            "country": "France",
            "description": "The city of light"
        },
        "days": [
            [
                {
                    "id": 1,
                    "destination_id": 10,
                    "name": "Louvre Museum",
                    "category": "Museum",
                    "rating": 4.8,
                    "address": "Somewhere in Paris",
                    "description": "A great Museum in Paris"
                }
            ]
        ],
        "total_estimated_cost": 1500.0
    }
