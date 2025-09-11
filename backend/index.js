const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const logger = require('./services/logger');
const MQTTService = require('./services/mqtt');
const AIService = require('./services/ai');
const ImageProcessor = require('./services/imageProcessor');
const StorageManager = require('./services/storageManager');
const { validateImagePayload } = require('./utils/validation');

class VisionBackend {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.storageManager = new StorageManager();
    this.imageProcessor = new ImageProcessor();
    this.aiService = new AIService();
    this.mqttService = new MQTTService();
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupMQTTHandlers();
  }

  setupMiddleware() {
    this.app.use(cors());
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    this.app.use('/images', express.static(this.storageManager.getStoragePath()));
  }

  setupRoutes() {
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        services: {
          mqtt: this.mqttService.isConnected(),
          ai: this.aiService.isReady(),
          storage: this.storageManager.isReady()
        },
        uptime: process.uptime(),
        timestamp: new Date().toISOString()
      });
    });

    this.app.post('/analyze', async (req, res) => {
      try {
        const { error } = validateImagePayload(req.body);
        if (error) {
          return res.status(400).json({ error: error.details[0].message });
        }

        const result = await this.processImageData(req.body);
        res.json(result);
      } catch (err) {
        logger.error('Manual analysis failed', err);
        res.status(500).json({ error: 'Analysis failed' });
      }
    });

    this.app.get('/stats', async (req, res) => {
      const stats = await this.storageManager.getStats();
      res.json(stats);
    });
  }

  setupMQTTHandlers() {
    this.mqttService.onImageReceived(async (payload) => {
      try {
        const { error } = validateImagePayload(payload);
        if (error) {
          logger.error('Invalid MQTT payload', error);
          return;
        }

        const result = await this.processImageData(payload);
        await this.mqttService.publishResult(result);
        
      } catch (err) {
        logger.error('MQTT image processing failed', err);
        await this.mqttService.publishResult({
          success: false,
          error: err.message,
          timestamp: Date.now()
        });
      }
    });
  }

  async processImageData(payload) {
    const startTime = Date.now();
    const { base64Data, timestamp, metadata = {} } = payload;
    
    logger.info('Processing image', { timestamp, size: base64Data.length });

    const processedImage = await this.imageProcessor.processBase64(base64Data);
    const savedPath = await this.storageManager.saveImage(processedImage.buffer, timestamp);
    const analysis = await this.aiService.analyzeImage(processedImage.buffer);

    const result = {
      success: true,
      timestamp,
      processing_time: Date.now() - startTime,
      image: {
        path: savedPath,
        width: processedImage.width,
        height: processedImage.height,
        size: processedImage.buffer.length
      },
      analysis: {
        objects: analysis.objects,
        scene_description: analysis.scene_description,
        total_objects: analysis.total_objects,
        processing_confidence: analysis.confidence
      },
      metadata
    };

    logger.info('Image processed successfully', { 
      timestamp, 
      objects: analysis.total_objects,
      processing_time: result.processing_time 
    });

    return result;
  }

  async start() {
    await this.storageManager.initialize();
    await this.aiService.initialize();
    await this.mqttService.connect();

    this.app.listen(this.port, () => {
      logger.info(`Vision backend started on port ${this.port}`);
    });

    process.on('SIGTERM', () => this.shutdown());
    process.on('SIGINT', () => this.shutdown());
  }

  async shutdown() {
    logger.info('Shutting down...');
    await this.mqttService.disconnect();
    process.exit(0);
  }
}

const backend = new VisionBackend();
backend.start().catch(err => {
  logger.error('Failed to start backend', err);
  process.exit(1);
});