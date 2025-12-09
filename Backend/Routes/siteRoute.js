const express = require('express');
const router = express.Router();
const siteController = require('../Controllers/siteController');
const upload = require('../utils/upload'); 

router.route('/')
  .get(siteController.getSites)
  // 🛑 THIS IS THE CRITICAL PART
  .post(upload.fields([
      { name: 'thumb', maxCount: 1 }, 
      { name: 'glb', maxCount: 1 },
      { name: 'oldSitePhoto', maxCount: 1 }, // <--- MUST BE HERE
      { name: 'newSitePhoto', maxCount: 1 }  // <--- MUST BE HERE
  ]), siteController.createSite);

router.route('/:id')
  .get(siteController.getSiteById)
  .put(upload.fields([
      { name: 'thumb', maxCount: 1 }, 
      { name: 'glb', maxCount: 1 },
      { name: 'oldSitePhoto', maxCount: 1 }, // <--- MUST BE HERE
      { name: 'newSitePhoto', maxCount: 1 }  // <--- MUST BE HERE
  ]), siteController.updateSite)
  .delete(siteController.deleteSite);

module.exports = router;