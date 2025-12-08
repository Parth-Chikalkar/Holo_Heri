require("dotenv").config();   // Load .env variables

const express = require("express");
const mongoose = require("mongoose");
const app = express();

const siteRoutes = require("./Routes/siteRoute"); 

mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log("MongoDB Error:", err));

app.use(express.json()); 

app.use("/api/sites", siteRoutes);

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
