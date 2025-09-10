const express = require("express");
const multer = require("multer");
const fs = require("fs");
const cors = require("cors");
const { analyzeImage } = require("./services/gemini");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors());

// Multer setup for image uploads
const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
});
const upload = multer({ storage });

// POST /upload - receive image from Raspberry Pi
app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    const imagePath = req.file.path;
    const imageBuffer = fs.readFileSync(imagePath);
    const base64Image = imageBuffer.toString("base64");

    const result = await analyzeImage(base64Image);
    console.log("Gemini Response:", result);

    res.json({ success: true, result });
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// Optional: mobile app polling endpoint
app.get("/status", (req, res) => {
  // placeholder: return latest processed result
  res.json({ status: "OK", latestGuidance: "Obstacle on your right." });
});

app.listen(PORT, () => console.log(`Backend running on http://localhost:${PORT}`));