const Site = require('../Models/Sites');

const toInt = (v, d = 0) => {
  const n = parseInt(v, 10);
  return Number.isFinite(n) ? n : d;
};

/* CREATE */
exports.createSite = async (req, res, next) => {
  try {
    const payload = req.body || {};
    if (!payload.id || !payload.title) {
      return res.status(400).json({ message: 'id and title are required' });
    }

    const exists = await Site.findOne({ id: payload.id });
    if (exists) return res.status(409).json({ message: 'Site with this id already exists' });

    const doc = new Site({
      ...payload,
      history: payload.history || "",
      architecture: payload.architecture || "",
      conservation: payload.conservation || "",
      modernRelevance: payload.modernRelevance || "",
      glb: payload.glb || "",
      isFeatured: payload.isFeatured === true,
      isActive: payload.isActive !== false,
      views: toInt(payload.views, 0),
      ratings: payload.ratings || { count: 0, average: 0 },
      metadata: payload.metadata || { fileSizeBytes: 0, notes: "" }
    });

    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    next(err);
  }
};

/* LIST ALL */
exports.getSites = async (req, res, next) => {
  try {
    const page = Math.max(1, toInt(req.query.page, 1));
    const limit = Math.min(100, Math.max(1, toInt(req.query.limit, 12)));
    const skip = (page - 1) * limit;

    const filter = {};
    if (req.query.tag) filter.tags = req.query.tag;
    if (req.query.isFeatured !== undefined) filter.isFeatured = req.query.isFeatured === 'true';
    if (req.query.isActive !== undefined) filter.isActive = req.query.isActive === 'true';

    const textQuery = req.query.q ? { $text: { $search: req.query.q } } : {};

    const query = { ...filter, ...textQuery };

    const [items, total] = await Promise.all([
      Site.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Site.countDocuments(query)
    ]);

    res.json({
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
      data: items
    });
  } catch (err) {
    next(err);
  }
};

/* GET BY ID */
exports.getSiteById = async (req, res, next) => {
  try {
    const site = await Site.findOne({ id: req.params.id });
    if (!site) return res.status(404).json({ message: 'Site not found' });
    res.json(site);
  } catch (err) {
    next(err);
  }
};

/* UPDATE (PUT) */
exports.updateSite = async (req, res, next) => {
  try {
    const payload = { ...req.body };
    delete payload.id;

    const updated = await Site.findOneAndUpdate(
      { id: req.params.id },
      { $set: payload },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'Site not found' });
    res.json(updated);
  } catch (err) {
    next(err);
  }
};


const cloudinary = require("../Utils/cloudinary");

// DELETE GLB (Cloudinary + MongoDB)

/* DELETE GLB (Cloudinary + MongoDB + DELETE SITE) */
exports.deleteGLB = async (req, res, next) => {
  try {
    const { id } = req.params;

    const site = await Site.findOne({ id });
    if (!site) return res.status(404).json({ message: "Site not found" });

    if (!site.glb) {
      return res.status(400).json({ message: "No GLB file exists for this site" });
    }

    // Extract Cloudinary public_id
    const glbUrl = site.glb;
    const parts = glbUrl.split("/");
    const publicIdWithExt = parts.slice(parts.indexOf("heritage-glbs")).join("/");
    const publicId = publicIdWithExt.replace(".glb", "");

    // Delete file from Cloudinary
    await cloudinary.uploader.destroy(publicId, {
      resource_type: "raw"
    });

    // Delete entire site from DB
    await Site.findOneAndDelete({ id });

    res.json({
      message: "GLB deleted & Site deleted successfully",
      deleted_from_cloudinary: publicId,
      deleted_site_id: id
    });

  } catch (err) {
    next(err);
  }
};



