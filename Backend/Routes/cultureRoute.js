const express = require('express');
const router = express.Router();
const cultureController = require('../Controllers/cultureController');


router.route('/')
  .get(cultureController.getCultures) 
  .post(cultureController.createCulture); 

router.route('/:id')
  .get(cultureController.getCultureById);

module.exports = router;