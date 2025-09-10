const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzeImage(base64Image) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });

  const result = await model.generateContent([
    { inlineData: { mimeType: "image/jpeg", data: base64Image } },
    "Describe the obstacles or objects in this image for a blind runner.",
  ]);

  const response = await result.response;
  return response.text();
}

module.exports = { analyzeImage };