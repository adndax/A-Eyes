import sys
import json
from ultralytics import YOLO
from PIL import Image

def estimate_position(box, img_width, img_height):
    x_center = box[0] + box[2] / 2
    angle = ((x_center / img_width) - 0.5) * 180
    
    box_area = (box[2] * box[3]) / (img_width * img_height)
    if box_area > 0.25:
        relative_size = "large"
    elif box_area > 0.05:
        relative_size = "medium"
    else:
        relative_size = "small"

    distance = "3"
    if relative_size == "large":
        distance = "1"
    elif relative_size == "medium":
        distance = "2"

    return {
        "angle": round(angle, 2),
        "distance": distance,
        "relative_size": relative_size,
    }

def detect_objects(image_path):
    try:
        img = Image.open(image_path)
        
        target_width = 416
        w_percent = (target_width / float(img.size[0]))
        h_size = int((float(img.size[1]) * float(w_percent)))
        img = img.resize((target_width, h_size), Image.Resampling.LANCZOS)
        
        model = YOLO('yolov10n.pt')
        results = model(img, verbose=False) 
        
        img_width, img_height = img.size
        detected_objects = []
        
        for result in results:
            boxes = result.boxes
            for box in boxes:
                xywhn = box.xywhn[0]
                
                x_percent = float(xywhn[0] - xywhn[2] / 2) * 100
                y_percent = float(xywhn[1] - xywhn[3] / 2) * 100
                width_percent = float(xywhn[2]) * 100
                height_percent = float(xywhn[3]) * 100

                bbox_percent = {
                    "x": round(x_percent, 2),
                    "y": round(y_percent, 2),
                    "width": round(width_percent, 2),
                    "height": round(height_percent, 2),
                }

                obj = {
                    "name": result.names[int(box.cls)],
                    "confidence": round(float(box.conf), 2),
                    "position": estimate_position(xywhn, img_width, img_height),
                    "bbox": bbox_percent
                }
                detected_objects.append(obj)
        
        output = {
            "objects": detected_objects,
            "scene_description": f"Detected {len(detected_objects)} objects using YOLOv10.",
            "total_objects": len(detected_objects),
            "confidence": 0.99
        }
        
        print(json.dumps(output))

    except Exception as e:
        error_output = {"error": str(e)}
        print(json.dumps(error_output), file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        image_path = sys.argv[1]
        detect_objects(image_path)
    else:
        print(json.dumps({"error": "No image path provided"}), file=sys.stderr)
        sys.exit(1)