const { spawn } = require("child_process");
const path = require("path");
const logger = require("./logger");

class AIService {
  constructor() {
    this.ready = true;
    console.log("YOLOv10 service initialized (local)");
  }

  isReady() {
    return this.ready;
  }

  async analyzeImage(imagePath) {
    if (!this.ready) {
      throw new Error("AI service not ready");
    }

    return new Promise((resolve, reject) => {
      const scriptPath = path.join(__dirname, "yolo_detector.py");
      const pythonProcess = spawn("python", [scriptPath, imagePath]);

      let resultData = "";
      let errorData = "";

      pythonProcess.stdout.on("data", (data) => {
        resultData += data.toString();
      });

      pythonProcess.stderr.on("data", (data) => {
        errorData += data.toString();
      });

      pythonProcess.on("close", (code) => {
        if (code !== 0) {
          console.error("YOLO script execution failed", {
            code,
            error: errorData,
          });
          return reject(new Error(`YOLO script failed: ${errorData}`));
        }
        try {
          const result = JSON.parse(resultData);
          resolve(result);
        } catch (e) {
          console.error("Failed to parse YOLO script output", {
            output: resultData,
          });
          reject(new Error("Invalid JSON from YOLO script"));
        }
      });
    });
  }
}

module.exports = AIService;
