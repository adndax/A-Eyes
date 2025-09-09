import os
from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    port: int = 8000
    debug: bool = False
    gemini_api_key: str = ""
    capture_interval: int = 5
    image_quality: int = 85
    camera_resolution: str = "1920x1080"
    images_path: str = "./images"
    log_level: str = "INFO"
    
    class Config:
        env_file = ".env"

settings = Settings()