require("dotenv").config(); 
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000; // Make sure this is 3000

// --- 1. KILL ZOMBIE PROCESSES ---
// (If you get EADDRINUSE, change PORT to 3001 or restart computer)

// --- 2. GLOBAL MIDDLEWARE ---
app.use(express.json({ limit: '200mb' })); 
app.use(express.urlencoded({ limit: '200mb', extended: true }));

// Allow API calls from Frontend
app.use(cors({
    origin: "http://localhost:5173", // Check your frontend port!
    credentials: true 
}));

// --- 3. THE FIX: STATIC FILES WITH FORCED HEADERS ---
// We attach this function BEFORE express.static to force permissions
const setHeaders = (req, res, next) => {
    // A. Allow React to access this file
    res.header("Access-Control-Allow-Origin", "http://localhost:5173");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Credentials", "true");
    
    // B. Tell Model Viewer this is a 3D file (Crucial!)
    if (req.url.endsWith('.glb')) {
        res.header('Content-Type', 'model/gltf-binary');
    }
    next();
};

// Apply the headers AND serve the folder
app.use('/uploads', setHeaders, express.static(path.join(__dirname, 'uploads')));

// --- 4. DATABASE & ROUTES ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.log("❌ MongoDB Error:", err));

app.use("/api/holoheri/sites", require("./Routes/siteRoute"));
app.use("/api/holoheri/users", require("./Routes/userRoute")); 

// --- 5. START SERVER (SINGLE CALL) ---
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
 
});

// Set timeout to 10 minutes
server.setTimeout(600000);