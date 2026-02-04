// Impact routes

const express = require('express');
const router = express.Router();
const { calculateImpact, compareImpact } = require('../controllers/impact.controller');

// POST /api/impact - Calculate impact
router.post('/', calculateImpact);

// POST /api/impact/compare - Compare two locations
router.post('/compare', compareImpact);

module.exports = router;
