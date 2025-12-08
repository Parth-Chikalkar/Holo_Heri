const cloudinary = require("./cloudinary");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const multer = require("multer");

const glbStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "heritage-glbs",
    resource_type: "raw",   // IMPORTANT for .glb .gltf .bin
    allowed_formats: ["glb", "gltf", "bin"]
  },
});

module.exports = multer({ storage: glbStorage });
