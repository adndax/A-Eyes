#!/bin/bash

echo "Starting A-Eyes Backend System"
echo "================================="

# Create required directories
mkdir -p storage/images
mkdir -p storage/results

# Function to kill background processes on exit
cleanup() {
    echo -e "\nShutting down all processes..."
    jobs -p | xargs -r kill
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start Python MQTT subscriber
echo "Starting MQTT Image Subscriber..."
cd services
python3 mqtt_subscriber.py &
MQTT_PID=$!
cd ..

# Wait a moment for MQTT to initialize
sleep 2

# Start Node.js image processor
echo "Starting Gemini Image Processor..."
node image_processor.js &
PROCESSOR_PID=$!

echo -e "\nSystem started successfully!"
echo "MQTT Subscriber PID: $MQTT_PID"
echo "Image Processor PID: $PROCESSOR_PID"
echo -e "\nPress Ctrl+C to stop all processes"
echo "Monitoring logs..."

# Wait for both processes
wait