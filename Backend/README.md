# Travel Recommendation & Itinerary System

A comprehensive FastAPI-based backend system for travel recommendations, crowd analysis, and automated itinerary generation. This system leverages a modular architecture to provide personalized travel suggestions and AI-driven insights.

## 🏗 Architecture

The application follows a layered architecture to ensure separation of concerns and maintainability:

- **API Layer (`app/routers/`)**: Defines the RESTful endpoints, handles request validation using Pydantic, and routes requests to the appropriate service.
- **Service Layer (`app/services/`)**: Contains the core business logic.
    - `recommendation_engine.py`: Implements the logic for personalized destination matching.
    - `itinerary_generator.py`: Handles the creation of detailed travel plans.
    - `ai_integration.py`: Manages interactions with AI services for crowd prediction and alternatives.
    - `data_loader.py`: Manages data retrieval from the local JSON store.
- **Model Layer (`app/models/`)**: Defines the data structures (schemas) used across the application for consistency and type safety.
- **Data Layer (`app/data/`)**: Uses JSON files as a lightweight data store for destinations, businesses, and itineraries.
- **Utility Layer (`app/utils/`)**: Provides shared helper functions for logging, pagination, and standardized API responses.

## 🛠 Prerequisites

- **Python**: 3.10 or higher
- **Package Manager**: `pip`
- **Optional**: [Docker](https://www.docker.com/) and [Docker Compose](https://docs.docker.com/compose/)

## 🚀 Local Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Python Fast API only"
```

### 2. Set Up Virtual Environment
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# macOS/Linux
python3 -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the Application
```bash
uvicorn app.main:app --reload
```
The server will start at `http://127.0.0.1:8000`. You can access the interactive API documentation at `http://127.0.0.1:8000/docs`.

### 🐳 Running with Docker
```bash
docker-compose up --build
```

## 📡 API Reference

### Destinations
**List All Destinations**
- `GET /destinations`
- **Description**: Retrieves a list of all available travel destinations.
- **Example**:
  ```bash
  curl -X GET http://127.0.0.1:8000/destinations
  ```

### Recommendations
**Get Personalized Recommendations**
- `POST /recommend`
- **Description**: Recommends destinations based on user preferences.
- **Request Body**:
  ```json
  {
    "budget": "medium",
    "interests": ["nature", "culture"],
    "duration": 7
  }
  ```
- **Example**:
  ```bash
  curl -X POST http://127.0.0.1:8000/recommend \
    -H "Content-Type: application/json" \
    -d '{"budget": "medium", "interests": ["nature", "culture"], "duration": 7}'
  ```

### Crowd Analysis
**Get Crowd Status**
- `GET /crowd/{id}`
- **Description**: Predicts the current crowd level for a specific destination.
- **Example**:
  ```bash
  curl -X GET http://127.0.0.1:8000/crowd/destination_123
  ```

### Alternatives
**Get Alternative Destinations**
- `GET /alternatives/{id}`
- **Description**: Suggests similar destinations as alternatives to the given ID.
- **Example**:
  ```bash
  curl -X GET http://127.0.0.1:8000/alternatives/destination_123
  ```

### Itinerary
**Generate Travel Itinerary**
- `POST /generate-itinerary`
- **Description**: Generates a full itinerary for a destination based on user preferences.
- **Request Body**:
  ```json
  {
    "destinationId": "destination_123",
    "preferences": {
      "budget": "high",
      "interests": ["luxury", "food"]
    }
  }
  ```
- **Example**:
  ```bash
  curl -X POST http://127.0.0.1:8000/generate-itinerary \
    -H "Content-Type: application/json" \
    -d '{"destinationId": "destination_123", "preferences": {"budget": "high", "interests": ["luxury", "food"]}}'
  ```

## ⚙️ Environment Variables

The application uses a `.env` file or system environment variables for configuration.

| Variable | Description | Default |
| :--- | :--- | :--- |
| `APP_NAME` | Name of the application | `FastAPI App` |
| `ENVIRONMENT` | Deployment environment (`development`, `production`) | `development` |
| `DEBUG` | Enable/disable debug mode | `True` |
| `API_V1_STR` | API version prefix | `/api/v1` |
| `CORS_ORIGINS` | List of allowed origins for CORS | `["*"]` |

## 📈 Scaling Notes

To move this system from a prototype to a production-ready application, consider the following:

1. **Database Migration**: Replace JSON file storage with a robust database like **PostgreSQL** for structured data and **MongoDB** for flexible itinerary schemas.
2. **Caching Layer**: Implement **Redis** to cache expensive AI recommendations and crowd status predictions to reduce latency and API costs.
3. **Asynchronous Task Queue**: Use **Celery** with **RabbitMQ/Redis** for itinerary generation and AI processing to avoid blocking the main request thread.
4. **Load Balancing**: Deploy the application using **Gunicorn** with multiple worker processes and put it behind an **Nginx** reverse proxy.
5. **Container Orchestration**: Use **Kubernetes** for horizontal scaling, automated rollouts, and self-healing of API pods.
6. **AI Model Optimization**: Move from generic AI calls to fine-tuned models or a dedicated RAG (Retrieval-Augmented Generation) pipeline for more accurate travel data.
