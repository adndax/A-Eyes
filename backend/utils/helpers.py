import logging
import asyncio
from datetime import datetime
from pathlib import Path
from typing import Optional, Dict, Any
import json

def setup_logging(level: str = "INFO") -> logging.Logger:
    logging.basicConfig(
        level=getattr(logging, level),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.FileHandler('app.log'),
            logging.StreamHandler()
        ]
    )
    return logging.getLogger(__name__)

def ensure_directory(path: str) -> None:
    Path(path).mkdir(parents=True, exist_ok=True)

def get_timestamp() -> str:
    return datetime.now().strftime("%Y%m%d_%H%M%S")

def validate_image_path(path: str) -> bool:
    return Path(path).exists() and Path(path).suffix.lower() in ['.jpg', '.jpeg', '.png']

async def async_run_command(command: list[str]) -> tuple[str, str, int]:
    process = await asyncio.create_subprocess_exec(
        *command,
        stdout=asyncio.subprocess.PIPE,
        stderr=asyncio.subprocess.PIPE
    )
    stdout, stderr = await process.communicate()
    return stdout.decode(), stderr.decode(), process.returncode