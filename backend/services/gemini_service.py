import google.generativeai as genai
from PIL import Image
import logging
from typing import Dict, Any, Optional
from utils.config import settings

logger = logging.getLogger(__name__)

class GeminiService:
    def __init__(self):
        genai.configure(api_key=settings.gemini_api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        self.detection_prompt = """
        Analyze this image for obstacle detection. Look for any objects, people, vehicles, or barriers that could be obstacles in a path or navigation context.

        Respond in JSON format with:
        {
            "has_obstacle": boolean,
            "obstacles": [
                {
                    "type": "string (person/vehicle/object/barrier)",
                    "confidence": float (0.0-1.0),
                    "description": "brief description"
                }
            ],
            "risk_level": "string (low/medium/high)",
            "recommendation": "string (action to take)"
        }
        
        Be precise and accurate. Only mark has_obstacle as true if there are clear obstacles that would impede movement or navigation.
        """
    
    async def analyze_image(self, image_path: str) -> Optional[Dict[str, Any]]:
        try:
            image = Image.open(image_path)
            response = await self._generate_content_async(image)
            
            if response and response.text:
                import json
                result = json.loads(response.text.strip().replace('```json', '').replace('```', ''))
                logger.info(f"Gemini analysis complete: {result.get('has_obstacle', False)} obstacles detected")
                return result
            
            return None
            
        except Exception as e:
            logger.error(f"Gemini service error: {e}")
            return None
    
    async def _generate_content_async(self, image: Image.Image):
        try:
            response = self.model.generate_content([self.detection_prompt, image])
            return response
        except Exception as e:
            logger.error(f"Gemini API error: {e}")
            return None
