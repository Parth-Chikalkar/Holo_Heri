const Site = require('../Models/Sites');
const fs = require('fs');
const path = require('path');

// Helper to safely convert numbers
const toInt = (v, d = 0) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : d;
};

/* 1. CREATE SITE (Local Storage) */
exports.createSite = async (req, res, next) => {
  try {
    
    const payload = req.body;

    if (!payload.title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    let thumbUrl = "";
    let glbUrl = "";
    
    // ⚠️ IMPORTANT: Change 'localhost' to your IP if testing on mobile/other devices
    const BASE_URL = "http://localhost:3000/"; 

    // Construct Local URLs
    if (req.files?.thumb?.[0]?.filename) {
        thumbUrl = BASE_URL + "uploads/" + req.files.thumb[0].filename;
    }

    if (req.files?.glb?.[0]?.filename) {
        glbUrl = BASE_URL + "uploads/" + req.files.glb[0].filename;
    }

    const doc = new Site({
      title: payload.title,
      location: payload.location,
      summary: payload.summary,
      tags: typeof payload.tags === 'string' 
            ? payload.tags.split(',').map(t => t.trim()).filter(t => t.length > 0) 
            : [],
      history: payload.history || "",
      architecture: payload.architecture || "",
      conservation: payload.conservation || "",
      modernRelevance: payload.modernRelevance || "",
      
      // Save Local URLs
      thumb: thumbUrl, 
      glb: glbUrl      
    });

    await doc.save();
    res.status(201).json({ success: true, message: "Site uploaded locally", site: doc });

  } catch (err) {
    console.error("🔥 FULL ERROR DETAILS:", err);
    res.status(500).json({ message: err.message || "Database Error" });
  }
};

/* 2. LIST ALL SITES */
exports.getSites = async (req, res, next) => {
  try {
    const page = Math.max(1, toInt(req.query.page, 1));
    const limit = Math.min(100, Math.max(1, toInt(req.query.limit, 12)));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.tag) filter.tags = req.query.tag;

    const textQuery = req.query.q ? { $text: { $search: req.query.q } } : {};
    const query = { ...filter, ...textQuery };

    const [items, total] = await Promise.all([
      Site.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Site.countDocuments(query)
    ]);

    res.json({
      page, limit, total,
      pages: Math.ceil(total / limit),
      data: items
    });
  } catch (err) {
    next(err);
  }
};

/* 3. GET BY ID (Fixed to use _id) */
exports.getSiteById = async (req, res, next) => {
  try {
    // FIX: Use findById because custom 'id' is gone
    const site = await Site.findById(req.params.id);
    if (!site) return res.status(404).json({ message: 'Site not found' });
    res.json(site);
  } catch (err) {
    next(err);
  }
};

/* 4. UPDATE SITE (Fixed to use _id & Local Files) */
exports.updateSite = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    const BASE_URL = "http://localhost:3000/"; 

    // Update URLs if new files are uploaded
    if (req.files?.thumb?.[0]?.filename) {
        payload.thumb = BASE_URL + "uploads/" + req.files.thumb[0].filename;
    }
    if (req.files?.glb?.[0]?.filename) {
        payload.glb = BASE_URL + "uploads/" + req.files.glb[0].filename;
    }

    // FIX: Use findByIdAndUpdate
    const updated = await Site.findByIdAndUpdate(
      req.params.id,
      { $set: payload },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'Site not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

/* 5. DELETE SITE (Fixed: Deletes Local Files) */
exports.deleteSite = async (req, res, next) => {
  try {
    const site = await Site.findById(req.params.id);
    if (!site) return res.status(404).json({ message: "Site not found" });

    // Helper to delete local files
    const deleteLocalFile = (fileUrl) => {
        if (!fileUrl) return;
        const fileName = fileUrl.split('/uploads/')[1];
        if (!fileName) return;

        const filePath = path.join(__dirname, '../uploads', fileName);
        
        fs.unlink(filePath, (err) => {
            if (err) console.error(`Failed to delete local file: ${filePath}`);
        });
    };

    deleteLocalFile(site.thumb);
    deleteLocalFile(site.glb);

    await Site.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully", id: req.params.id });

  } catch (err) {
    next(err);
  }
};