// models/Site.js
const mongoose = require('mongoose');


const SiteSchema = new mongoose.Schema({

  title: { type: String, required: true },
  location: { type: String },
  thumb: { type: String },
  summary: { type: String },
  tags: [{ type: String }],
  glb: { type: String, default: "" },
 

  // -------- NEW ATTRIBUTES --------
  history: { type: String, default: "" },
  architecture: { type: String, default: "" },
  conservation: { type: String, default: "" },
  modernRelevance: { type: String, default: "" },


}, {
  timestamps: true   // createdAt & updatedAt
});


module.exports = mongoose.model("Site", SiteSchema);
