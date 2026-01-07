const Site = require('../Models/Sites');
const Culture = require('../Models/Culture');
const fs = require('fs');
const path = require('path');
const { uploadToDrive } = require("../Utils/drive");

// Helper to safely convert numbers
const toInt = (v, d = 0) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : d;
};

/* ========================================================= */
/* SITE CONTROLLER                      */
/* ========================================================= */

/* 1. CREATE SITE (Google Drive) */
exports.createSite = async (req, res, next) => {
  try {
    const payload = req.body;

    if (!payload.title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    // Initialize URLs
    let thumbUrl = "";
    let glbUrl = "";
    let oldSiteUrl = "";
    let newSiteUrl = "";

    // 1. Handle Main Thumbnail
    if (req.files?.thumb?.[0]) {
      thumbUrl = await uploadToDrive(req.files.thumb[0]);
    }

    // 2. Handle 3D Model
    if (req.files?.glb?.[0]) {
      glbUrl = await uploadToDrive(req.files.glb[0]);
    }

    // 3. Handle Old Structure Photo
    if (req.files?.oldSitePhoto?.[0]) {
      oldSiteUrl = await uploadToDrive(req.files.oldSitePhoto[0]);
    }

    // 4. Handle New Structure Photo
    if (req.files?.newSitePhoto?.[0]) {
      newSiteUrl = await uploadToDrive(req.files.newSitePhoto[0]);
    }

    const doc = new Site({
      title: payload.title,
      location: payload.location,
      summary: payload.summary,
      tags: typeof payload.tags === 'string' 
            ? payload.tags.split(',').map(t => t.trim()).filter(t => t.length > 0) 
            : [],
      
      // Detailed Info
      history: payload.history || "",
      architecture: payload.architecture || "",
      conservation: payload.conservation || "",
      modernRelevance: payload.modernRelevance || "",
      
      // Comparison Info
      oldStructureDesc: payload.oldStructureDesc || "",
      newStructureDesc: payload.newStructureDesc || "",

      // Saved Drive URLs
      thumb: thumbUrl, 
      glb: glbUrl,
      oldSitePhoto: oldSiteUrl, 
      newSitePhoto: newSiteUrl
    });

    await doc.save();
    console.log("✅ Site Created with Drive Files");
    res.status(201).json({ success: true, message: "Site uploaded to Drive", site: doc });

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

/* 3. GET SITE BY ID */
exports.getSiteById = async (req, res, next) => {
  try {
    const site = await Site.findById(req.params.id);
    if (!site) return res.status(404).json({ message: 'Site not found' });
    res.json(site);
  } catch (err) {
    next(err);
  }
};

/* 4. UPDATE SITE (Google Drive) */
exports.updateSite = async (req, res, next) => {
  try {
    const payload = { ...req.body };

    // Update URLs if new files are uploaded
    if (req.files?.thumb?.[0]) {
        payload.thumb = await uploadToDrive(req.files.thumb[0]);
    }
    if (req.files?.glb?.[0]) {
        payload.glb = await uploadToDrive(req.files.glb[0]);
    }
    // Handle New Comparison Files
    if (req.files?.oldSitePhoto?.[0]) {
        payload.oldSitePhoto = await uploadToDrive(req.files.oldSitePhoto[0]);
    }
    if (req.files?.newSitePhoto?.[0]) {
        payload.newSitePhoto = await uploadToDrive(req.files.newSitePhoto[0]);
    }

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

/* 5. DELETE SITE */
exports.deleteSite = async (req, res, next) => {
  try {
    const site = await Site.findById(req.params.id);
    if (!site) return res.status(404).json({ message: "Site not found" });

    // Helper: Only try to delete if it's a local file, ignore Drive links
    const deleteLocalFile = (fileUrl) => {
        if (!fileUrl) return;
        if (fileUrl.includes("drive.google.com")) return; // Skip Drive files

        const fileName = fileUrl.split('/uploads/')[1];
        if (!fileName) return;

        const filePath = path.join(__dirname, '../uploads', fileName);
        
        fs.unlink(filePath, (err) => {
            if (err) console.error(`Failed to delete local file: ${filePath}`);
        });
    };

    // Cleanup local files (Backwards compatibility)
    deleteLocalFile(site.thumb);
    deleteLocalFile(site.glb);
    deleteLocalFile(site.oldSitePhoto);
    deleteLocalFile(site.newSitePhoto);

    await Site.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully", id: req.params.id });

  } catch (err) {
    next(err);
  }
};


/* ========================================================= */
/* CULTURE CONTROLLER                    */
/* ========================================================= */

/* CREATE CULTURE (Google Drive) */
exports.createCulture = async (req, res, next) => {
  try {
    const payload = req.body;

    if (!payload.title || !payload.category) {
      return res.status(400).json({ message: 'Title and Category are required' });
    }

    let thumbUrl = "";
    let glbUrl = "";

    // Handle File Uploads to Drive
    if (req.files?.thumb?.[0]) {
        thumbUrl = await uploadToDrive(req.files.thumb[0]);
    }
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