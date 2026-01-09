const express = require('express');
const router = express.Router();
const cultureController = require('../Controllers/cultureController');
const upload = require('../utils/upload'); // Uses the same upload utility

router.route('/')
  .get(cultureController.getCultures)
  .post(upload.fields([
      { name: 'thumb', maxCount: 1 }, 
      { name: 'glb', maxCount: 1 }
  ]), cultureController.createCulture);

router.route('/:id')
  .get(cultureController.getCultureById);

module.exports = router;