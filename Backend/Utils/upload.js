const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure 'uploads' directory exists automatically
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); 
  },
  filename: (req, file, cb) => {
    // Save file as: glb-123456789.glb
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  }
});

// Set Limit to 200MB to be safe
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 200 * 1024 * 1024 } 
});

module.exports = upload;