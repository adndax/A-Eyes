import asyncio
import json
import logging
from typing import Dict, Any, Set
from fastapi import WebSocket
from datetime import datetime

logger = logging.getLogger(__name__)

class NotificationService:
    def __init__(self):
        self.active_connections: Set[WebSocket] = set()
        self.last_notification: Dict[str, Any] = {}
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.add(websocket)
        logger.info(f"WebSocket connected. Total connections: {len(self.active_connections)}")
    
    def disconnect(self, websocket: WebSocket):
        self.active_connections.discard(websocket)
        logger.info(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")
    
    async def send_obstacle_alert(self, detection_result: Dict[str, Any], image_path: str):
        if not detection_result.get('has_obstacle', False):
            return
        
        alert_data = {
            "type": "obstacle_detected",
            "timestamp": datetime.now().isoformat(),
            "data": {
                "obstacles": detection_result.get('obstacles', []),
                "risk_level": detection_result.get('risk_level', 'medium'),
                "recommendation": detection_result.get('recommendation', 'Be cautious'),
                "image_path": image_path
            }
        }
        
        await self._broadcast_message(alert_data)
        self.last_notification = alert_data
        logger.warning(f"Obstacle alert sent: {detection_result.get('risk_level', 'unknown')} risk level")
    
    async def send_status_update(self, status: str, message: str):
        status_data = {
            "type": "status_update",
            "timestamp": datetime.now().isoformat(),
            "data": {
                "status": status,
                "message": message
            }
        }
        
        await self._broadcast_message(status_data)
    
    async def _broadcast_message(self, message: Dict[str, Any]):
        if not self.active_connections:
            return
        
        message_str = json.dumps(message)
        disconnected = set()
        
        for connection in self.active_connections.copy():
            try:
                await connection.send_text(message_str)
            except Exception as e:
                logger.error(f"Failed to send message to WebSocket: {e}")
                disconnected.add(connection)
        
        for connection in disconnected:
            self.disconnect(connection)
    
    def get_last_notification(self) -> Dict[str, Any]:
        return self.last_notification