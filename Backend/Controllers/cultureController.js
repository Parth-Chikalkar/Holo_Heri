const Culture = require('../Models/Culture');

// ⚠️ Ensure this matches your running port (4000)
const BASE_URL = "http://localhost:4000/"; 

/* CREATE CULTURE */
exports.createCulture = async (req, res, next) => {
  try {
    const payload = req.body;

    if (!payload.title || !payload.category) {
      return res.status(400).json({ message: 'Title and Category are required' });
    }

    let thumbUrl = "";
    let glbUrl = "";

    // Handle File Uploads
    if (req.files?.thumb?.[0]?.filename) {
        thumbUrl = BASE_URL + "uploads/" + req.files.thumb[0].filename;
    }
    if (req.files?.glb?.[0]?.filename) {
        glbUrl = BASE_URL + "uploads/" + req.files.glb[0].filename;
    }

    const doc = new Culture({
      title: payload.title,
      category: payload.category, // 🆕 Save the Category
      region: payload.location,   // Maps Frontend 'location' -> DB 'region'
      summary: payload.summary,
      tags: typeof payload.tags === 'string' ? payload.tags.split(',').map(t=>t.trim()) : [],
      
      // Map Narrative Fields
      origins: payload.history || "",       
      technique: payload.architecture || "", 
      lineage: payload.conservation || "",   
      significance: payload.modernRelevance || "", 

      thumb: thumbUrl,
      glb: glbUrl
    });

    await doc.save();
    res.status(201).json({ success: true, message: "Cultural Form Saved", data: doc });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error" });
  }
};

/* GET ALL CULTURES */
/* GET ALL CULTURES */
exports.getCultures = async (req, res, next) => {
  try {
    // 👇 ADD .sort({ createdAt: -1 }) to show newest first
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

