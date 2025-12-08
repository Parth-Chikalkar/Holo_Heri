const express = require('express');
const router = express.Router();

// Import the controller (adjust the path to where your controller file is located)
const siteController = require('../Controllers/siteController');
router.route('/')
  .get(siteController.getSites)
  .post(siteController.createSite);

router.route('/:id')
  .get(siteController.getSiteById)
  .put(siteController.updateSite);

module.exports = router;