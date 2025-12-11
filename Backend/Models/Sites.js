const mongoose = require('mongoose');

const SiteSchema = new mongoose.Schema({

  title: { type: String, required: true },
  location: { type: String },
  thumb: { type: String },
  summary: { type: String },
  tags: [{ type: String }],
  glb: { type: String, default: "" },

  // -------- EXISTING ATTRIBUTES --------
  history: { type: String, default: "" },
  architecture: { type: String, default: "" },
  conservation: { type: String, default: "" },
  modernRelevance: { type: String, default: "" },

  // -------- NEW COMPARISON ATTRIBUTES --------
  
  // 1. Old Structure (Historical View)
  oldSitePhoto: { type: String, default: "" }, // URL to the old photo
  oldStructureDesc: { type: String, default: "" }, // Description of how it used to look

  // 2. New Structure (Current View)
  newSitePhoto: { type: String, default: "" }, // URL to the modern/restored photo
  newStructureDesc: { type: String, default: "" }, // Description of current state/changes

}, {
  timestamps: true   // createdAt & updatedAt
});

module.exports = mongoose.model("Site", SiteSchema);