const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure 'uploads' directory exists
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true }); // Added recursive for safety
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); 
  },
  filename: (req, file, cb) => {
    // Auto-generates filenames based on the field name
    // e.g. 'oldSitePhoto-1738229.jpg' or 'glb-1738229.glb'
    const ext = path.extname(file.originalname);
    cb(null, `${file.fieldname}-${Date.now()}${ext}`);
  }
});

// Filter to ensure correct file types (Prevents crashes)
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    
    // 1. If it's the 3D Model field
    if (file.fieldname === "glb") {
        if (ext !== '.glb' && ext !== '.gltf') {
            return cb(new Error("Only .glb or .gltf files are allowed for models!"), false);
        }
    } 
    // 2. If it's any of the Image fields
    else if (["thumb", "oldSitePhoto", "newSitePhoto"].includes(file.fieldname)) {
        if (!ext.match(/\.(jpg|jpeg|png|webp|gif)$/)) {
            return cb(new Error("Only image files are allowed!"), false);
        }
    }
    
    cb(null, true);
};

// Set Limit to 200MB to be safe
const upload = multer({ 
    storage: storage,
    limits: { fileSize: 200 * 1024 * 1024 }, // 200MB
    fileFilter: fileFilter 
});

module.exports = upload;