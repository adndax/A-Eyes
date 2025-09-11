const sharp = require('sharp');
const logger = require('./logger');

class ImageProcessor {
  constructor() {
    this.maxSize = parseInt(process.env.MAX_IMAGE_SIZE) || 5242880;
    this.quality = parseInt(process.env.IMAGE_QUALITY) || 90;
  }

  async processBase64(base64Data) {
    const base64Image = base64Data.replace(/^data:image\/[a-z]+;base64,/, '');
    const inputBuffer = Buffer.from(base64Image, 'base64');

    if (inputBuffer.length > this.maxSize) {
      throw new Error(`Image size exceeds limit: ${inputBuffer.length} bytes`);
    }

    try {
      const image = sharp(inputBuffer);
      const metadata = await image.metadata();
      
      let processedImage = image
        .jpeg({ quality: this.quality })
        .resize(1920, 1080, { 
          fit: 'inside',
          withoutEnlargement: true 
        });

      const buffer = await processedImage.toBuffer();
      const finalMetadata = await sharp(buffer).metadata();

      logger.debug('Image processed', {
        originalSize: inputBuffer.length,
        processedSize: buffer.length,
        dimensions: `${finalMetadata.width}x${finalMetadata.height}`
      });

      return {
        buffer,
        width: finalMetadata.width,
        height: finalMetadata.height,
        format: finalMetadata.format,
        originalSize: inputBuffer.length,
        processedSize: buffer.length
      };
      
    } catch (error) {
      logger.error('Image processing failed', error);
      throw new Error(`Image processing failed: ${error.message}`);
    }
  }

  async validateImage(buffer) {
    try {
      const metadata = await sharp(buffer).metadata();
      return {
        isValid: true,
        format: metadata.format,
        width: metadata.width,
        height: metadata.height
      };
    } catch (error) {
      return { isValid: false, error: error.message };
    }
  }
}

module.exports = ImageProcessor;