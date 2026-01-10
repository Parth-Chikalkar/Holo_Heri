const express = require("express");
const router = express.Router();
const { askGemini } = require("../Controllers/aiController");

router.post("/ask", askGemini);

module.exports = router;