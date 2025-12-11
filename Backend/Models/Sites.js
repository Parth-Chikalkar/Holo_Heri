const mongoose = require('mongoose');

// Multi-language content schema
const MultiLangContentSchema = new mongoose.Schema({
  en: { type: String, default: "" },
  hi: { type: String, default: "" },
  de: { type: String, default: "" },
  fr: { type: String, default: "" },
  mr: { type: String, default: "" },
  ta: { type: String, default: "" },
  te: { type: String, default: "" },
  kn: { type: String, default: "" }
}, { _id: false });

const SiteSchema = new mongoose.Schema({

  // Basic fields remain as primary/default (usually English)
  title: { type: String, required: true },
  location: { type: String },
  thumb: { type: String },
  summary: { type: String },
  tags: [{ type: String }],
  glb: { type: String, default: "" },

  // Multi-language support for key fields
  translations: {
    title: { type: MultiLangContentSchema, default: {} },
    location: { type: MultiLangContentSchema, default: {} },
    summary: { type: MultiLangContentSchema, default: {} },
    history: { type: MultiLangContentSchema, default: {} },
    architecture: { type: MultiLangContentSchema, default: {} },
    conservation: { type: MultiLangContentSchema, default: {} },
    modernRelevance: { type: MultiLangContentSchema, default: {} },
    oldStructureDesc: { type: MultiLangContentSchema, default: {} },
    newStructureDesc: { type: MultiLangContentSchema, default: {} }
  },

  // -------- EXISTING ATTRIBUTES (English fallback) --------
  history: { type: String, default: "" },
  architecture: { type: String, default: "" },
  conservation: { type: String, default: "" },
  modernRelevance: { type: String, default: "" },

  // -------- COMPARISON ATTRIBUTES --------
  
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