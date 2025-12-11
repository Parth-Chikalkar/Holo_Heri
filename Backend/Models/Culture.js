const mongoose = require('mongoose');

const CultureSchema = new mongoose.Schema({

  // Basic Info
  title: { type: String, required: true }, 
  category: { type: String, required: true }, // 🆕 Added Category (e.g. Dance, Food)
  region: { type: String },                
  thumb: { type: String },                 
  summary: { type: String },               
  tags: [{ type: String }],                

  // 3D Asset
  glb: { type: String, default: "" },      

  // --- CULTURE SPECIFIC NARRATIVES ---
  origins: { type: String, default: "" },      
  technique: { type: String, default: "" },    
  lineage: { type: String, default: "" },      
  significance: { type: String, default: "" }, 

}, {
  timestamps: true 
});

CultureSchema.index({ title: 'text', category: 'text', region: 'text', tags: 'text' });

module.exports = mongoose.model("Culture", CultureSchema);