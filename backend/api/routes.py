from fastapi import APIRouter, HTTPException, WebSocket, WebSocketDisconnect
from typing import Dict, Any, Optional
import logging
import asyncio
from services.camera_service import CameraService
from services.gemini_service import GeminiService
from services.notification_service import NotificationService

logger = logging.getLogger(__name__)

router = APIRouter()
camera_service = CameraService()
gemini_service = GeminiService()
notification_service = NotificationService()

@router.get("/health")
async def health_check() -> Dict[str, str]:
    return {"status": "healthy", "service": "obstacle-detection-backend"}

@router.post("/capture")
async def manual_capture() -> Dict[str, Any]:
    try:
        image_path = await camera_service.capture_image()
        if not image_path:
            raise HTTPException(status_code=500, detail="Failed to capture image")
        
        return {
            "success": True,
            "image_path": image_path,
            "message": "Image captured successfully"
        }
    except Exception as e:
        logger.error(f"Manual capture error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze")
async def manual_analyze() -> Dict[str, Any]:
    try:
        current_image = camera_service.get_current_image()
        if not current_image:
            raise HTTPException(status_code=404, detail="No image available for analysis")
        
        result = await gemini_service.analyze_image(current_image)
        if not result:
            raise HTTPException(status_code=500, detail="Analysis failed")
        
        return {
            "success": True,
            "analysis": result,
            "image_path": current_image
        }
    except Exception as e:
        logger.error(f"Manual analysis error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status")
async def get_status() -> Dict[str, Any]:
    return {
        "camera_active": camera_service.is_capturing,
        "current_image": camera_service.get_current_image(),
        "last_notification": notification_service.get_last_notification(),
        "active_connections": len(notification_service.active_connections)
    }

@router.post("/start")
async def start_detection() -> Dict[str, str]:
    try:
        if camera_service.is_capturing:
            return {"message": "Detection already running"}
        
        await notification_service.send_status_update("starting", "Obstacle detection starting...")
        
        async def process_image(image_path: str):
            result = await gemini_service.analyze_image(image_path)
            if result:
                await notification_service.send_obstacle_alert(result, image_path)
        
        asyncio.create_task(camera_service.start_continuous_capture(process_image))
        
        await notification_service.send_status_update("active", "Obstacle detection is now active")
        return {"message": "Obstacle detection started successfully"}
        
    except Exception as e:
        logger.error(f"Start detection error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/stop")
async def stop_detection() -> Dict[str, str]:
    try:
        camera_service.stop_capture()
        await notification_service.send_status_update("stopped", "Obstacle detection stopped")
        return {"message": "Obstacle detection stopped successfully"}
    except Exception as e:
        logger.error(f"Stop detection error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@router.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await notification_service.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        notification_service.disconnect(websocket)