import paho.mqtt.client as mqtt
import base64, json
from datetime import datetime

BROKER = "192.168.1.12"  # IP Raspberry Pi kamu
PORT = 1883
TOPIC = "home/cam/1/image"

def on_connect(client, userdata, flags, rc):
    if rc == 0:
        print("✅ Connected to broker")
        client.subscribe(TOPIC)
        print(f"Subscribed to topic: {TOPIC}")
    else:
        print("❌ Connection failed, code:", rc)

def on_message(client, userdata, msg):
    try:
        data = json.loads(msg.payload.decode("utf-8"))
        b64 = data["image_b64"]
        img_bytes = base64.b64decode(b64)

        # Simpan ke file jpg dengan timestamp
        fname = f"frame_{data['seq']}_{datetime.now().strftime('%H%M%S')}.jpg"
        with open(fname, "wb") as f:
            f.write(img_bytes)
        print(f"📸 Saved {fname}, size={len(img_bytes)} bytes")

    except Exception as e:
        print("Error processing message:", e)

def main():
    client = mqtt.Client()
    client.on_connect = on_connect
    client.on_message = on_message

    client.connect(BROKER, PORT, 60)
    client.loop_forever()

if __name__ == "__main__":
    main()