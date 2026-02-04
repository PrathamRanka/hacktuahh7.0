// Health check routes

const express = require('express');
const router = express.Router();

// GET /api/health - Basic health check
router.get('/', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// GET /api/health/detailed - Detailed health check
router.get('/detailed', async (req, res) => {
  try {
    const { loadBuildings } = require('../data/loaders/buildings.loader');
    const { loadParks } = require('../data/loaders/parks.loader');
    const { loadTransit } = require('../data/loaders/transit.loader');

    const [buildings, parks, transit] = await Promise.all([
      loadBuildings(),
      loadParks(),
      loadTransit(),
    ]);

    res.json({
      success: true,
      status: 'healthy',
      data: {
        buildings: buildings.length,
        parks: parks.length,
        transit: transit.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

module.exports = router;
