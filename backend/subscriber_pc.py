import paho.mqtt.client as mqtt
import base64
import json
import os
from datetime import datetime
from pathlib import Path

BROKER = "192.168.1.12"
PORT = 1883
TOPIC = "home/cam/1/image"
STORAGE_DIR = "../storage/images"
TRIGGER_FILE = "../storage/process_queue.txt"

def ensure_directories():
    """Create required directories"""
    Path(STORAGE_DIR).mkdir(parents=True, exist_ok=True)
    Path("../storage").mkdir(parents=True, exist_ok=True)

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("Connected to MQTT broker")
        client.subscribe(TOPIC)
        print(f"Subscribed to topic: {TOPIC}")
        print(f"Saving images to: {STORAGE_DIR}")
    else:
        print(f"Connection failed, code: {rc}")

def on_message(client, userdata, msg):
    try:
        # Parse MQTT message
        data = json.loads(msg.payload.decode("utf-8"))
        b64_image = data["image_b64"]
        sequence = data.get("seq", "unknown")
        timestamp = data.get("timestamp", datetime.now().isoformat())
        
        # Decode base64 image
        img_bytes = base64.b64decode(b64_image)
        
        # Generate filename with timestamp
        current_time = datetime.now()
        filename = f"frame_{sequence}_{current_time.strftime('%Y%m%d_%H%M%S')}.jpg"
        filepath = os.path.join(STORAGE_DIR, filename)
        
        # Save image
        with open(filepath, "wb") as f:
            f.write(img_bytes)
        
        print(f"Saved: {filename} ({len(img_bytes):,} bytes)")
        
        # Create processing queue entry
        queue_entry = {
            "filename": filename,
            "filepath": filepath,
            "timestamp": timestamp,
            "sequence": sequence,
            "size": len(img_bytes),
            "received_at": current_time.isoformat()
        }
        
        # Append to processing queue
        with open(TRIGGER_FILE, "a") as f:
            f.write(json.dumps(queue_entry) + "\n")
        
        print(f"📝 Added to processing queue: {filename}")
        
    except json.JSONDecodeError:
        print("Invalid JSON in MQTT message")
    except Exception as e:
        print(f"Error processing message: {e}")

def on_disconnect(client, userdata, rc):
    if rc != 0:
        print("Unexpected disconnection")

def main():
    print("Starting MQTT Image Subscriber")
    
    # Ensure directories exist
    ensure_directories()
    
    # Setup MQTT client
    client = mqtt.Client(mqtt.CallbackAPIVersion.VERSION1)
    client.on_connect = on_connect
    client.on_message = on_message
    client.on_disconnect = on_disconnect
    
    try:
        print(f"🔌 Connecting to broker: {BROKER}:{PORT}")
        client.connect(BROKER, PORT, 60)
        client.loop_forever()
        
    except KeyboardInterrupt:
        print("\nShutting down...")
        client.disconnect()
    except Exception as e:
        print(f"Connection error: {e}")

if __name__ == "__main__":
    main()