const express = require('express');
const router = express.Router();
const siteController = require('../Controllers/siteController');


router.route('/')
  .get(siteController.getSites)

  .post(siteController.createSite); 

router.route('/:id')
  .get(siteController.getSiteById)
  
  .put(siteController.updateSite) 
  .delete(siteController.deleteSite);

module.exports = router;