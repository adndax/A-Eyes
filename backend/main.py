from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import logging
from utils.config import settings
from utils.helpers import setup_logging, ensure_directory
from api.routes import router

setup_logging(settings.log_level)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Obstacle Detection Backend",
    description="Backend service for Raspberry Pi obstacle detection using Gemini Vision API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router, prefix="/api/v1")

@app.on_event("startup")
async def startup_event():
    ensure_directory(settings.images_path)
    logger.info("Obstacle Detection Backend started successfully")

@app.on_event("shutdown")
async def shutdown_event():
    logger.info("Obstacle Detection Backend shutting down")

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=settings.port,
        reload=settings.debug,
        log_level=settings.log_level.lower()
    )