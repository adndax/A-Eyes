const fs = require("fs");
const path = require("path");
const { promisify } = require("util");
require("dotenv").config();

const AIService = require("./services/ai");

const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const appendFile = promisify(fs.appendFile);

class ImageProcessor {
  constructor() {
    this.aiService = null;
    this.processing = false;
    this.queueFile = "./storage/process_queue.txt";
    this.resultDir = "./storage/results";
    this.processedFile = "./storage/processed_log.txt";
    this.checkInterval = 2000;
  }

  async initialize() {
    this.aiService = new AIService();
    await this.aiService.initialize();
    await this.ensureDirectories();

    console.log("Image Processor initialized");
    console.log(`Results directory: ${this.resultDir}`);

    this.startMonitoring();
  }

  async ensureDirectories() {
    const dirs = ["./storage", "./storage/images", this.resultDir];
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  startMonitoring() {
    console.log("Monitoring for new images...");

    setInterval(() => {
      if (!this.processing) {
        this.processQueue();
      }
    }, this.checkInterval);
  }

  async processQueue() {
    try {
      if (!fs.existsSync(this.queueFile)) {
        return;
      }

      const queueContent = await readFile(this.queueFile, "utf8");
      const lines = queueContent
        .trim()
        .split("\n")
        .filter((line) => line.length > 0);

      if (lines.length === 0) {
        return;
      }

      this.processing = true;
      console.log(`Processing ${lines.length} items in queue`);

      for (const line of lines) {
        try {
          const queueItem = JSON.parse(line);
          await this.processImage(queueItem);
        } catch (error) {
          console.error("Error processing queue item:", error.message);
        }
      }

      await writeFile(this.queueFile, "");
      this.processing = false;
    } catch (error) {
      console.error("Error processing queue:", error.message);
      this.processing = false;
    }
  }

  async processImage(queueItem) {
    const { filename, filepath, timestamp, sequence } = queueItem;

    try {
      console.log(`\nProcessing: ${filename}`);
      console.log("=".repeat(60));

      if (!fs.existsSync(filepath)) {
        console.log(`Image file not found: ${filepath}`);
        return;
      }

      const imageBuffer = await readFile(filepath);
      console.log(`Image size: ${imageBuffer.length.toLocaleString()} bytes`);

      const startTime = Date.now();
      const result = await this.aiService.analyzeImage(imageBuffer);
      const processingTime = Date.now() - startTime;

      const analysisResult = {
        metadata: {
          filename,
          timestamp,
          sequence,
          processing_time: processingTime,
          processed_at: new Date().toISOString(),
        },
        analysis: result,
      };

      console.log(`Processing time: ${processingTime}ms`);
      console.log(`Objects detected: ${result.total_objects}`);
      console.log(`Scene: ${result.scene_description}`);
      console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);

      if (result.objects && result.objects.length > 0) {
        console.log("\nDetected Objects:");
        result.objects.forEach((obj, index) => {
          console.log(`  ${index + 1}. ${obj.name}`);
          console.log(`     Confidence: ${(obj.confidence * 100).toFixed(1)}%`);
          console.log(`     Angle: ${obj.position.angle}°`);
          console.log(`     Distance: Level ${obj.position.distance}`);
          console.log(`     Size: ${obj.position.relative_size}`);
          if (obj.bbox) {
            console.log(
              `     BBox: x:${obj.bbox.x}% y:${obj.bbox.y}% w:${obj.bbox.width}% h:${obj.bbox.height}%`
            );
          }
        });
      }

      const baseName = path.parse(filename).name;
      const resultFilename = `${baseName}_analysis.json`;
      const resultPath = path.join(this.resultDir, resultFilename);

      await writeFile(resultPath, JSON.stringify(analysisResult, null, 2));
      console.log(`Analysis saved: ${resultFilename}`);

      const logEntry = {
        timestamp: new Date().toISOString(),
        filename,
        sequence,
        objects_detected: result.total_objects,
        processing_time: processingTime,
        result_file: resultFilename,
      };

      await appendFile(this.processedFile, JSON.stringify(logEntry) + "\n");

      console.log(`Processing completed for ${filename}`);
    } catch (error) {
      console.error(`Error processing ${filename}:`, error.message);

      const errorEntry = {
        timestamp: new Date().toISOString(),
        filename,
        error: error.message,
        sequence,
      };

      await appendFile(
        "./storage/error_log.txt",
        JSON.stringify(errorEntry) + "\n"
      );
    }
  }

  async getStats() {
    try {
      const stats = {
        total_processed: 0,
        total_objects_detected: 0,
        average_processing_time: 0,
        last_processed: null,
      };

      if (fs.existsSync(this.processedFile)) {
        const logContent = await readFile(this.processedFile, "utf8");
        const entries = logContent
          .trim()
          .split("\n")
          .filter((line) => line.length > 0)
          .map((line) => JSON.parse(line));

        stats.total_processed = entries.length;
        stats.total_objects_detected = entries.reduce(
          (sum, entry) => sum + entry.objects_detected,
          0
        );
        stats.average_processing_time =
          entries.reduce((sum, entry) => sum + entry.processing_time, 0) /
          entries.length;
        stats.last_processed = entries[entries.length - 1]?.timestamp;
      }

      return stats;
    } catch (error) {
      console.error("Error getting stats:", error.message);
      return null;
    }
  }
}

async function main() {
  console.log("Starting Image Processor");

  try {
    const processor = new ImageProcessor();
    await processor.initialize();

    process.on("SIGINT", async () => {
      console.log("\nShutting down...");
      const stats = await processor.getStats();
      if (stats) {
        console.log("\nFinal Stats:");
        console.log(`   Total processed: ${stats.total_processed}`);
        console.log(
          `   Total objects detected: ${stats.total_objects_detected}`
        );
        console.log(
          `   Average processing time: ${stats.average_processing_time?.toFixed(
            0
          )}ms`
        );
      }
      process.exit(0);
    });

    setInterval(async () => {
      const stats = await processor.getStats();
      if (stats && stats.total_processed > 0) {
        console.log(
          `\nStats: ${stats.total_processed} processed | ${
            stats.total_objects_detected
          } objects detected | Avg: ${stats.average_processing_time?.toFixed(
            0
          )}ms`
        );
      }
    }, 30000);
  } catch (error) {
    console.error("Failed to start processor:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = ImageProcessor;
