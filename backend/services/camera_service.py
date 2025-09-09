import asyncio
from pathlib import Path
from typing import Optional
import logging
from utils.config import settings
from utils.helpers import ensure_directory, get_timestamp, async_run_command

logger = logging.getLogger(__name__)

class CameraService:
    def __init__(self):
        self.images_path = Path(settings.images_path)
        ensure_directory(str(self.images_path))
        self.is_capturing = False
        self.current_image: Optional[str] = None
        
    async def capture_image(self) -> Optional[str]:
        timestamp = get_timestamp()
        filename = f"capture_{timestamp}.jpg"
        filepath = self.images_path / filename
        
        command = [
            "rpicam-still",
            "-o", str(filepath),
            "--quality", str(settings.image_quality),
            "--width", settings.camera_resolution.split('x')[0],
            "--height", settings.camera_resolution.split('x')[1],
            "--immediate"
        ]
        
        try:
            stdout, stderr, returncode = await async_run_command(command)
            
            if returncode == 0 and filepath.exists():
                self.current_image = str(filepath)
                logger.info(f"Image captured: {filename}")
                return str(filepath)
            else:
                logger.error(f"Camera capture failed: {stderr}")
                return None
                
        except Exception as e:
            logger.error(f"Camera service error: {e}")
            return None
    
    async def start_continuous_capture(self, callback=None):
        self.is_capturing = True
        logger.info("Starting continuous camera capture")
        
        while self.is_capturing:
            image_path = await self.capture_image()
            if image_path and callback:
                await callback(image_path)
            await asyncio.sleep(settings.capture_interval)
    
    def stop_capture(self):
        self.is_capturing = False
        logger.info("Stopping camera capture")
    
    def get_current_image(self) -> Optional[str]:
        return self.current_image