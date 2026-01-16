require("dotenv").config(); 
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require('axios');
const cultureRoute = require('./Routes/cultureRoute');
const siteRoute = require("./Routes/siteRoute");
const userRoute = require("./Routes/userRoute");
const aiRoute = require("./Routes/aiRoutes");
const app = express();
const PORT = process.env.PORT || 3000;

// --- GLOBAL MIDDLEWARE ---
app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));

// ✅ Allow all origins or use specific ENV
app.use(cors({
    origin: "*", // Change this to process.env.FRONTEND_URL for stricter security later
    credentials: true
}));

// --- DATABASE ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

// --- ROUTES ---

// ✅ 1. ADD THIS: Root Route to prevent 404 on Homepage
app.get('/', (req, res) => {
    res.send("<h1>Server is Running 🚀</h1>");
});

// Cron-job
app.get('/api/holoheri/health',(req,res)=>{
  return res.json({message :"ok", sucess : true});
})

// --- SIMPLE GOOGLE DRIVE PROXY ---
app.get('/api/proxy-model', async (req, res) => {
  const fileId = req.query.id;
  if (!fileId) return res.status(400).send("No File ID provided");

  try {
    const driveUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

    const response = await axios({
      method: 'GET',
      url: driveUrl,
      responseType: 'stream'
    });

    res.set({
      'Content-Type': response.headers['content-type'] || 'application/octet-stream',
      'Access-Control-Allow-Origin': '*', 
      'Cache-Control': 'public, max-age=3600',
    });

    response.data.pipe(res);

  } catch (error) {
    console.error("Proxy Error:", error.message);
    res.status(500).send("Failed to fetch model.");
  }
});

app.use("/api/holoheri/sites", siteRoute);
app.use("/api/holoheri/users", userRoute);
app.use("/api/holoheri/culture", cultureRoute);
app.use("/api/holoheri/ai",aiRoute);
// --- START SERVER ---
const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

server.setTimeout(600000);