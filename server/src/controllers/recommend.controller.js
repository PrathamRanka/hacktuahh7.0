// Recommendation controller

const { getRecommendations, getScore } = require('../services/scoring.service');

/**
 * POST /api/recommend
 * Get location recommendations for a business type
 */
async function recommend(req, res) {
  try {
    const { businessType, limit } = req.body;

    if (!businessType) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'businessType is required',
          code: 'MISSING_BUSINESS_TYPE',
        },
      });
    }

    const recommendations = await getRecommendations(businessType, limit || 20);

    res.json({
      success: true,
      recommendations,
      count: recommendations.length,
    });
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to generate recommendations',
        code: 'RECOMMENDATION_ERROR',
      },
    });
  }
}

/**
 * POST /api/recommend/score
 * Get green score for a specific location
 */
async function score(req, res) {
  try {
    const { lat, lng, businessType } = req.body;

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'lat and lng are required',
          code: 'MISSING_COORDINATES',
        },
      });
    }

    const scoreData = await getScore(lat, lng, businessType);

    res.json({
      success: true,
      score: scoreData,
    });
  } catch (error) {
    console.error('Score error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to calculate score',
        code: 'SCORE_ERROR',
      },
    });
  }
}

/**
 * GET /api/recommend/business-types
 * Get available business types
 */
function getBusinessTypes(req, res) {
  const businessTypes = [
    {
      id: 'eco_cafe',
      name: 'Eco-Friendly Café',
      description: 'Sustainable café with focus on park views and customer accessibility',
    },
    {
      id: 'green_office',
      name: 'Green Office Space',
      description: 'Environmentally conscious office with excellent transit access',
    },
    {
      id: 'sustainable_retail',
      name: 'Sustainable Retail',
      description: 'Eco-friendly retail store in high-traffic sustainable areas',
    },
    {
      id: 'wellness_center',
      name: 'Wellness Center',
      description: 'Health and wellness facility near green spaces',
    },
    {
      id: 'coworking_space',
      name: 'Co-working Space',
      description: 'Collaborative workspace with diverse transit options',
    },
  ];

  res.json({
    success: true,
    businessTypes,
  });
}

module.exports = {
  recommend,
  score,
  getBusinessTypes,
};
