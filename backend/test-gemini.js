const fs = require('fs');
const path = require('path');
require('dotenv').config();

const AIService = require('./services/ai');

async function testGeminiWithLocalImages() {
  console.log('Testing Gemini AI with local images...');
  
  try {
    // Initialize AI service
    const aiService = new AIService();
    await aiService.initialize();
    
    // Test images
    const imageFiles = ['1.png', '2.png', '3.png'];
    
    for (const imageFile of imageFiles) {
      const imagePath = path.join('./storage/images', imageFile);
      
      if (!fs.existsSync(imagePath)) {
        console.log(`❌ Image not found: ${imagePath}`);
        continue;
      }
      
      console.log(`\n📸 Analyzing: ${imageFile}`);
      console.log('=' .repeat(50));
      
      try {
        // Read image file
        const imageBuffer = fs.readFileSync(imagePath);
        console.log(`📊 Image size: ${imageBuffer.length} bytes`);
        
        // Analyze with Gemini
        const startTime = Date.now();
        const result = await aiService.analyzeImage(imageBuffer);
        const processingTime = Date.now() - startTime;
        
        // Display results
        console.log(`⏱️  Processing time: ${processingTime}ms`);
        console.log(`🔍 Objects detected: ${result.total_objects}`);
        console.log(`📝 Scene: ${result.scene_description}`);
        console.log(`🎯 Confidence: ${(result.confidence * 100).toFixed(1)}%`);
        
        if (result.objects && result.objects.length > 0) {
          console.log('\n🎯 Detected Objects:');
          result.objects.forEach((obj, index) => {
            console.log(`  ${index + 1}. ${obj.name}`);
            console.log(`     • Confidence: ${(obj.confidence * 100).toFixed(1)}%`);
            console.log(`     • Position: ${obj.position.angle}° (${obj.position.distance})`);
            console.log(`     • Size: ${obj.position.relative_size}`);
            if (obj.bbox) {
              console.log(`     • BBox: x:${obj.bbox.x}% y:${obj.bbox.y}% w:${obj.bbox.width}% h:${obj.bbox.height}%`);
            }
          });
        }
        
        // Save result to JSON
        const resultFile = path.join('./storage/images', `${path.parse(imageFile).name}_result.json`);
        fs.writeFileSync(resultFile, JSON.stringify(result, null, 2));
        console.log(`💾 Result saved: ${resultFile}`);
        
      } catch (error) {
        console.log(`❌ Error analyzing ${imageFile}:`, error.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.message.includes('GEMINI_API_KEY')) {
      console.log('\n💡 Make sure to set GEMINI_API_KEY in .env file');
    }
  }
}

// Run test
testGeminiWithLocalImages();