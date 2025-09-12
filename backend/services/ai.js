const { GoogleGenerativeAI } = require("@google/generative-ai");
const logger = require("./logger");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

class AIService {
  constructor() {
    this.genAI = null;
    this.model = null;
    this.ready = false;
    this.config = {
      apiKey: process.env.GEMINI_API_KEY,
      modelName: process.env.GEMINI_MODEL || "gemini-1.5-flash",
      timeout: parseInt(process.env.PROCESSING_TIMEOUT) || 30000,
      maxRetries: 3,
      initialDelay: 1000,
    };
  }

  async initialize() {
    if (!this.config.apiKey) {
      throw new Error("GEMINI_API_KEY not configured");
    }

    try {
      this.genAI = new GoogleGenerativeAI(this.config.apiKey);
      this.model = this.genAI.getGenerativeModel({
        model: this.config.modelName,
      });
      this.ready = true;
      logger.info("Gemini AI service initialized");
    } catch (error) {
      logger.error("Failed to initialize Gemini AI", error);
      throw error;
    }
  }

  isReady() {
    return this.ready;
  }

  async analyzeImage(imageBuffer) {
    if (!this.ready) {
      throw new Error("AI service not ready");
    }

    const base64Image = imageBuffer.toString("base64");
    const prompt = `
Analyze this image for object detection. Return a JSON response with this exact structure:
{
  "objects": [
    {
      "name": "object_type",
      "confidence": 0.95,
      "position": {
        "angle": -15,
        "distance": "2",
        "relative_size": "small"
      },
      "bbox": {
        "x": 10,
        "y": 20, 
        "width": 30,
        "height": 40
      }
    }
  ],
  "scene_description": "brief scene description",
  "total_objects": 1,
  "confidence": 0.90
}

Requirements:
- angle: -90 to +90 degrees (0 = center, negative = left, positive = right)
- distance: "1", "2", or "3"
- relative_size: "small", "medium", or "large"  
- bbox: coordinates as percentages (0-100)
- confidence: 0.0 to 1.0 for overall analysis quality

Provide accurate position estimates based on object placement in the frame.`;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: "image/jpeg",
      },
    };

    for (let attempt = 1; attempt <= this.config.maxRetries; attempt++) {
      try {
        const startTime = Date.now();
        const result = await Promise.race([
          this.model.generateContent([prompt, imagePart]),
          new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error("Analysis timeout")),
              this.config.timeout
            )
          ),
        ]);

        const response = await result.response;
        const text = response.text();
        const processingTime = Date.now() - startTime;
        logger.debug("Gemini analysis completed", { processingTime });

        return this.parseAnalysisResult(text);
      } catch (error) {
        const isOverloaded = error.message && error.message.includes("503");

        if (isOverloaded && attempt < this.config.maxRetries) {
          const delay = this.config.initialDelay * Math.pow(2, attempt - 1);
          logger.warn(
            `Model overloaded. Retrying in ${
              delay / 1000
            }s... (Attempt ${attempt}/${this.config.maxRetries})`
          );
          await sleep(delay);
        } else {
          logger.error(
            `Gemini analysis failed after ${attempt} attempts`,
            error
          );
          throw new Error(`AI analysis failed: ${error.message}`);
        }
      }
    }
  }

  parseAnalysisResult(text) {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Invalid AI response format");
    }

    const result = JSON.parse(jsonMatch[0]);

    return {
      objects: (result.objects || []).map((obj) => ({
        name: obj.name || "unknown",
        confidence: this.clamp(obj.confidence || 0.5, 0, 1),
        position: {
          angle: this.clamp(obj.position?.angle || 0, -90, 90),
          distance: this.validateDistance(obj.position?.distance),
          relative_size: this.validateSize(obj.position?.relative_size),
        },
        bbox: obj.bbox
          ? {
              x: this.clamp(obj.bbox.x || 0, 0, 100),
              y: this.clamp(obj.bbox.y || 0, 0, 100),
              width: this.clamp(obj.bbox.width || 0, 0, 100),
              height: this.clamp(obj.bbox.height || 0, 0, 100),
            }
          : null,
      })),
      scene_description: result.scene_description || "Scene analyzed",
      total_objects: result.objects?.length || 0,
      confidence: this.clamp(result.confidence || 0.8, 0, 1),
    };
  }

  clamp(value, min, max) {
    return Math.max(min, Math.min(max, parseFloat(value) || min));
  }

  validateDistance(distance) {
    const distanceNum = parseInt(distance, 10);
    return distanceNum >= 1 && distanceNum <= 3 ? String(distanceNum) : "2";
  }

  validateSize(size) {
    const valid = ["small", "medium", "large"];
    return valid.includes(size) ? size : "medium";
  }
}

module.exports = AIService;
