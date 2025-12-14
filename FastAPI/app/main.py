"""
Main FastAPI application entry point.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

from app.api import routes
from app.core.config import settings
from app.services.ml_service import MLService

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Global ML service instance
ml_service = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """
    Lifespan context manager for startup and shutdown events.
    Models are loaded once at startup and kept in memory.
    """
    global ml_service
    
    # Startup: Load ML models
    logger.info("Starting up application...")
    logger.info("Loading ML models and preprocessors...")
    
    try:
        ml_service = MLService(models_dir=settings.MODELS_DIR)
        ml_service.load_models()
        app.state.ml_service = ml_service
        logger.info("✅ ML models loaded successfully")
    except Exception as e:
        logger.error(f"❌ Failed to load ML models: {str(e)}")
        raise
    
    yield
    
    # Shutdown: Cleanup
    logger.info("Shutting down application...")


# Create FastAPI application
app = FastAPI(
    title=settings.PROJECT_NAME,
    description=settings.DESCRIPTION,
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.allowed_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(routes.router, prefix=settings.API_PREFIX)


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint - API information."""
    return {
        "message": "Breast Cancer Detection API",
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "/api/v1/health"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
