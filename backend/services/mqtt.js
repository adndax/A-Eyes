const mqtt = require('mqtt');
const logger = require('./logger');

class MQTTService {
  constructor() {
    this.client = null;
    this.connected = false;
    this.imageHandler = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    
    this.config = {
      brokerUrl: process.env.MQTT_BROKER_URL,
      clientId: process.env.MQTT_CLIENT_ID || 'vision_backend',
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
      topics: {
        image: process.env.MQTT_TOPIC_IMAGE,
        result: process.env.MQTT_TOPIC_RESULT
      },
      qos: parseInt(process.env.MQTT_QOS) || 1
    };
  }

  async connect() {
    const options = {
      clientId: this.config.clientId,
      clean: true,
      connectTimeout: 4000,
      keepalive: 60,
      reconnectPeriod: 1000
    };

    if (this.config.username) {
      options.username = this.config.username;
      options.password = this.config.password;
    }

    try {
      this.client = mqtt.connect(this.config.brokerUrl, options);
      this.setupEventHandlers();
      
      return new Promise((resolve, reject) => {
        this.client.on('connect', () => {
          this.connected = true;
          this.reconnectAttempts = 0;
          logger.info('MQTT connected');
          
          this.client.subscribe(this.config.topics.image, { qos: this.config.qos }, (err) => {
            if (err) {
              logger.error('MQTT subscription failed', err);
              reject(err);
            } else {
              logger.info(`Subscribed to ${this.config.topics.image}`);
              resolve();
            }
          });
        });

        this.client.on('error', reject);
      });
    } catch (error) {
      logger.error('MQTT connection failed', error);
      throw error;
    }
  }

  setupEventHandlers() {
    this.client.on('message', (topic, message) => {
      if (topic === this.config.topics.image && this.imageHandler) {
        try {
          const payload = JSON.parse(message.toString());
          this.imageHandler(payload);
        } catch (error) {
          logger.error('Invalid MQTT message format', error);
        }
      }
    });

    this.client.on('error', (error) => {
      logger.error('MQTT error', error);
      this.connected = false;
    });

    this.client.on('close', () => {
      logger.warn('MQTT connection closed');
      this.connected = false;
    });

    this.client.on('reconnect', () => {
      this.reconnectAttempts++;
      if (this.reconnectAttempts <= this.maxReconnectAttempts) {
        logger.info(`MQTT reconnecting (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
      }
    });

    this.client.on('offline', () => {
      logger.warn('MQTT client offline');
      this.connected = false;
    });
  }

  onImageReceived(handler) {
    this.imageHandler = handler;
  }

  async publishResult(result) {
    if (!this.connected) {
      throw new Error('MQTT not connected');
    }

    return new Promise((resolve, reject) => {
      const payload = JSON.stringify(result);
      
      this.client.publish(
        this.config.topics.result, 
        payload, 
        { qos: this.config.qos }, 
        (error) => {
          if (error) {
            logger.error('Failed to publish result', error);
            reject(error);
          } else {
            logger.debug('Analysis result published');
            resolve();
          }
        }
      );
    });
  }

  isConnected() {
    return this.connected;
  }

  async disconnect() {
    if (this.client) {
      return new Promise((resolve) => {
        this.client.end(false, {}, () => {
          logger.info('MQTT disconnected');
          resolve();
        });
      });
    }
  }
}

module.exports = MQTTService;