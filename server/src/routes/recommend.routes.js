// Recommendation routes

const express = require('express');
const router = express.Router();
const { recommend, score, getBusinessTypes } = require('../controllers/recommend.controller');

// POST /api/recommend - Get recommendations
router.post('/', recommend);

// POST /api/recommend/score - Get score for specific location
router.post('/score', score);

// GET /api/recommend/business-types - Get available business types
router.get('/business-types', getBusinessTypes);

module.exports = router;
