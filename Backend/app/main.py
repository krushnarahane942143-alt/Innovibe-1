from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.routers import destinations, recommend, crowd, alternatives, itinerary

app = FastAPI(
    title=settings.APP_NAME,
    version="1.0.0",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(destinations.router)
app.include_router(recommend.router)
app.include_router(crowd.router)
app.include_router(alternatives.router)
app.include_router(itinerary.router)

@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint to verify the application is running.
    """
    return {"status": "healthy", "version": "1.0.0"}

@app.get("/", tags=["Root"])
async def root():
    return {"message": f"Welcome to {settings.APP_NAME}"}
