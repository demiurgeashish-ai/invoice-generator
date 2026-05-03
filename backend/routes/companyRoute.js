const express = require('express');
const router = express.Router();
const companyConfig = require('../config/companyConfig');

// Public endpoint — no auth required
// Frontend calls this on startup to populate companyAtom
router.get('/company/config', (req, res) => {
  res.json({ success: true, data: companyConfig });
});

module.exports = router;
