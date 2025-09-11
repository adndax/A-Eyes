const fs = require('fs-extra');
const path = require('path');
const logger = require('./logger');

class StorageManager {
  constructor() {
    this.storagePath = process.env.STORAGE_PATH || './storage/images';
    this.maxFiles = parseInt(process.env.MAX_STORAGE_SIZE) || 1000;
    this.cleanupInterval = parseInt(process.env.CLEANUP_INTERVAL) || 3600000;
    this.ready = false;
    this.stats = {
      totalFiles: 0,
      totalSize: 0,
      lastCleanup: null
    };
  }

  async initialize() {
    try {
      await fs.ensureDir(this.storagePath);
      await this.updateStats();
      this.startCleanupTimer();
      this.ready = true;
      logger.info('Storage manager initialized', { path: this.storagePath });
    } catch (error) {
      logger.error('Storage initialization failed', error);
      throw error;
    }
  }

  isReady() {
    return this.ready;
  }

  getStoragePath() {
    return this.storagePath;
  }

  async saveImage(buffer, timestamp) {
    const filename = `img_${timestamp}_${Date.now()}.jpg`;
    const filepath = path.join(this.storagePath, filename);
    
    try {
      await fs.writeFile(filepath, buffer);
      this.stats.totalFiles++;
      this.stats.totalSize += buffer.length;
      
      logger.debug('Image saved', { filename, size: buffer.length });
      
      if (this.stats.totalFiles > this.maxFiles) {
        await this.cleanup();
      }
      
      return `/images/${filename}`;
      
    } catch (error) {
      logger.error('Failed to save image', error);
      throw error;
    }
  }

  async cleanup() {
    try {
      const files = await fs.readdir(this.storagePath);
      const imageFiles = files
        .filter(file => file.match(/\.(jpg|jpeg|png)$/i))
        .map(file => ({
          name: file,
          path: path.join(this.storagePath, file),
          stat: fs.statSync(path.join(this.storagePath, file))
        }))
        .sort((a, b) => a.stat.mtime - b.stat.mtime);

      if (imageFiles.length > this.maxFiles) {
        const filesToDelete = imageFiles.slice(0, imageFiles.length - this.maxFiles);
        
        for (const file of filesToDelete) {
          await fs.unlink(file.path);
          this.stats.totalSize -= file.stat.size;
        }
        
        this.stats.totalFiles = this.maxFiles;
        this.stats.lastCleanup = new Date().toISOString();
        
        logger.info('Storage cleanup completed', { 
          deletedFiles: filesToDelete.length,
          remainingFiles: this.stats.totalFiles 
        });
      }
      
    } catch (error) {
      logger.error('Storage cleanup failed', error);
    }
  }

  async updateStats() {
    try {
      const files = await fs.readdir(this.storagePath);
      const imageFiles = files.filter(file => file.match(/\.(jpg|jpeg|png)$/i));
      
      let totalSize = 0;
      for (const file of imageFiles) {
        const stat = await fs.stat(path.join(this.storagePath, file));
        totalSize += stat.size;
      }
      
      this.stats.totalFiles = imageFiles.length;
      this.stats.totalSize = totalSize;
      
    } catch (error) {
      logger.error('Failed to update storage stats', error);
    }
  }

  async getStats() {
    await this.updateStats();
    return {
      ...this.stats,
      maxFiles: this.maxFiles,
      storagePath: this.storagePath,
      ready: this.ready
    };
  }

  startCleanupTimer() {
    setInterval(() => {
      this.cleanup().catch(err => 
        logger.error('Scheduled cleanup failed', err)
      );
    }, this.cleanupInterval);
  }
}

module.exports = StorageManager;