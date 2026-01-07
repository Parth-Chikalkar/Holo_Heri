const Culture = require('../Models/Culture');
const { uploadToDrive } = require("../Utils/drive"); // Import the Drive helper

/* CREATE CULTURE (Google Drive) */
exports.createCulture = async (req, res, next) => {
  try {
    const payload = req.body;

    // Validation
    if (!payload.title || !payload.category) {
      return res.status(400).json({ message: 'Title and Category are required' });
    }

    let thumbUrl = "";
    let glbUrl = "";

    // 1. Handle Thumbnail Upload to Drive
    if (req.files?.thumb?.[0]) {
        thumbUrl = await uploadToDrive(req.files.thumb[0]);
    }

    // 2. Handle 3D Model Upload to Drive
    if (req.files?.glb?.[0]) {
        glbUrl = await uploadToDrive(req.files.glb[0]);
    }

    const doc = new Culture({
      title: payload.title,
      category: payload.category, 
      region: payload.location,   // Maps Frontend 'location' -> DB 'region'
      summary: payload.summary,
      tags: typeof payload.tags === 'string' ? payload.tags.split(',').map(t=>t.trim()) : [],
      
      // Map Narrative Fields
      origins: payload.history || "",       
      technique: payload.architecture || "", 
      lineage: payload.conservation || "",   
      significance: payload.modernRelevance || "", 

      // Save the Drive URLs
      thumb: thumbUrl,
      glb: glbUrl
    });

    await doc.save();
    console.log("✅ Culture Created with Drive Files");
    res.status(201).json({ success: true, message: "Cultural Form Saved", data: doc });

  } catch (err) {
    console.error("🔥 Error creating culture:", err);
    res.status(500).json({ message: "Server Error" });
  }
};

/* GET ALL CULTURES */
exports.getCultures = async (req, res, next) => {
  try {
    // Sort by newest first
    const items = await Culture.find().sort({ createdAt: -1 });
    res.json({ data: items });
  } catch (err) {
    next(err);
  }
};

/* GET SINGLE CULTURE */
exports.getCultureById = async (req, res, next) => {
  try {
    const item = await Culture.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Not Found' });
    res.json(item);
  } catch (err) {
    next(err);
  }
};