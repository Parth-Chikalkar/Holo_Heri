const multer = require("multer");
const path = require("path");

/*
  We use memoryStorage because:
  - Files are NOT saved locally
  - Files are uploaded directly to Google Drive
*/
const storage = multer.memoryStorage();

/*
  File type validation
  (Matches your existing logic exactly)
*/
const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();

  // 3D Models
  if (file.fieldname === "glb") {
    if (![".glb", ".gltf"].includes(ext)) {
      return cb(new Error("Only .glb or .gltf files are allowed for models"), false);
    }
  }

  // Images
  else if (["thumb", "oldSitePhoto", "newSitePhoto"].includes(file.fieldname)) {
    if (!ext.match(/\.(jpg|jpeg|png|webp)$/)) {
      return cb(new Error("Only image files are allowed"), false);
    }
  }

  cb(null, true);
};

/*
  Multer config
  - 200MB max (your requirement)
*/
const upload = multer({
  storage,
  limits: {
    fileSize: 200 * 1024 * 1024 // 200MB
  },
  fileFilter
});

module.exports = upload;
