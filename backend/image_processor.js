const fs = require("fs").promises;
const path = require("path");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const AIService = require("./services/ai");

class ImageProcessor {
  constructor() {
    this.aiService = null;
    this.processing = false;
    this.queueFile = path.join(__dirname, "storage", "process_queue.txt");
    this.resultDir = path.join(__dirname, "storage", "results");
    this.processedFile = path.join(__dirname, "storage", "processed_log.txt");
    this.checkInterval = 2000;
  }

  async initialize() {
    this.aiService = new AIService();
    await this.ensureDirectories();
    console.log("Image Processor initialized");
    console.log(`Results directory: ${this.resultDir}`);
    this.startMonitoring();
    this.startApiServer();
  }

  async ensureDirectories() {
    const dirs = [
      path.join(__dirname, "storage"),
      path.join(__dirname, "storage", "images"),
      this.resultDir,
    ];
    for (const dir of dirs) {
      try {
        await fs.mkdir(dir, { recursive: true });
      } catch (e) {
        // direktori sudah ada, abaikan
      }
    }
  }

  startApiServer() {
    const app = express();
    const port = process.env.API_PORT || 3000;
    app.use(cors());

    app.get("/api/latest-analysis", async (req, res) => {
      try {
        const files = await fs.readdir(this.resultDir);
        const jsonFiles = files.filter((f) => f.endsWith("_analysis.json"));

        if (jsonFiles.length === 0) {
          return res.status(404).json({ message: "No analysis files found." });
        }

        let latestFile = null;
        let latestTime = 0;

        for (const file of jsonFiles) {
          const filePath = path.join(this.resultDir, file);
          const stats = await fs.stat(filePath);
          if (stats.mtimeMs > latestTime) {
            latestTime = stats.mtimeMs;
            latestFile = file;
          }
        }

        if (!latestFile) {
          return res
            .status(404)
            .json({ message: "Could not determine the latest file." });
        }

        const latestFilePath = path.join(this.resultDir, latestFile);
        const fileContent = await fs.readFile(latestFilePath, "utf8");

        res.setHeader("Content-Type", "application/json");
        res.send(fileContent);
      } catch (error) {
        console.error("API Error on /latest-analysis:", error);
        res.status(500).json({ error: "Failed to retrieve latest analysis." });
      }
    });

    app.listen(port, () => {
      console.log(`API server listening on http://0.0.0.0:${port}`);
    });
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
      await fs.access(this.queueFile);
      const queueContent = await fs.readFile(this.queueFile, "utf8");
      const lines = queueContent.trim().split("\n").filter(Boolean);
      if (lines.length === 0) return;

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
      await fs.writeFile(this.queueFile, "");
      this.processing = false;
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error("Error processing queue:", error.message);
      }
      this.processing = false;
    }
  }

  async processImage(queueItem) {
    const { filename, filepath, timestamp, sequence } = queueItem;
    try {
      console.log(`\nProcessing: ${filename}`);
      console.log("=".repeat(60));
      await fs.access(filepath);
      const startTime = Date.now();
      const result = await this.aiService.analyzeImage(filepath);
      const processingTime = Date.now() - startTime;
      if (!result) {
        throw new Error("AI analysis returned no result.");
      }
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
      const baseName = path.parse(filename).name;
      const resultFilename = `${baseName}_analysis.json`;
      const resultPath = path.join(this.resultDir, resultFilename);
      await fs.writeFile(resultPath, JSON.stringify(analysisResult, null, 2));
      console.log(`Analysis saved: ${resultFilename}`);
      const logEntry = {
        timestamp: new Date().toISOString(),
        filename,
        sequence,
        objects_detected: result.total_objects,
        processing_time: processingTime,
        result_file: resultFilename,
      };
      await fs.appendFile(this.processedFile, JSON.stringify(logEntry) + "\n");
    } catch (error) {
      console.error(`Error processing ${filename}:`, error.message);
      const errorEntry = {
        timestamp: new Date().toISOString(),
        filename,
        error: error.message,
        sequence,
      };
      const errorLogPath = path.join(__dirname, "storage", "error_log.txt");
      await fs.appendFile(errorLogPath, JSON.stringify(errorEntry) + "\n");
    }
  }
}

async function main() {
  console.log("Starting Image Processor");
  try {
    const processor = new ImageProcessor();
    await processor.initialize();
  } catch (error) {
    console.error("Failed to start processor:", error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = ImageProcessor;
