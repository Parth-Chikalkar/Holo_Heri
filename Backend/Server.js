require("dotenv").config(); 
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require('axios');
const cultureRoute = require('./Routes/cultureRoute');
const siteRoute = require("./Routes/siteRoute");
const userRoute = require("./Routes/userRoute");

const app = express();
const PORT = process.env.PORT || 3000;

// --- GLOBAL MIDDLEWARE ---
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

// --- DATABASE ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// --- ROUTES --- // Ensure axios is installed

// --- SIMPLE GOOGLE DRIVE PROXY ---
app.get('/api/proxy-model', async (req, res) => {
  const fileId = req.query.id;
  if (!fileId) return res.status(400).send("No File ID provided");

  try {
    const driveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

    // 1. Fetch the file from Google as a stream
    const response = await axios({
      method: 'GET',
      url: driveUrl,
      responseType: 'stream'
    });

    // 2. Pass the headers to the frontend so it knows it's a 3D model
    res.set({
      'Content-Type': response.headers['content-type'] || 'application/octet-stream',
      'Access-Control-Allow-Origin': 'http://localhost:5173', // Must match your React URL
      'Cache-Control': 'public, max-age=3600', // Cache for speed
    });

    // 3. Pipe the file data to React
    response.data.pipe(res);

  } catch (error) {
    console.error("Proxy Error:", error.message);
    res.status(500).send("Failed to fetch model.");
  }
});
app.use("/api/holoheri/sites", siteRoute);
app.use("/api/holoheri/users", userRoute);
app.use("/api/holoheri/culture", cultureRoute);

// --- START SERVER ---
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

// Large upload safety
server.setTimeout(600000);
