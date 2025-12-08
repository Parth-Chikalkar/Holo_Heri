const express = require('express');
const router = express.Router();
const siteController = require('../Controllers/siteController');
const upload = require('../utils/upload'); 

router.route('/')
  .get(siteController.getSites)
  .post(upload.fields([
      { name: 'thumb', maxCount: 1 }, 
      { name: 'glb', maxCount: 1 }
  ]), siteController.createSite);

router.route('/:id')
  .get(siteController.getSiteById)
  .put(upload.fields([
      { name: 'thumb', maxCount: 1 }, 
      { name: 'glb', maxCount: 1 }
  ]), siteController.updateSite)
  
  // ✅ FIX: Ensure this says 'deleteSite' (NOT deleteGLB)
  .delete(siteController.deleteSite); 

module.exports = router;