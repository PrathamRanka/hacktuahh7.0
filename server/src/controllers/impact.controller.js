// Impact controller

/**
 * POST /api/impact
 * Calculate environmental impact for a location
 */
async function calculateImpact(req, res) {
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

    // Simple impact calculation based on location
    // In a real system, this would use more sophisticated models
    const baseImpact = {
      carbonReduction: Math.round(50 + Math.random() * 100),
      transitUsageIncrease: Math.round(20 + Math.random() * 40),
      greenSpaceAccess: Math.round(60 + Math.random() * 30),
      wellbeingScore: Math.round(70 + Math.random() * 25),
      impactScore: 0.75,
    };

    // Add projections
    const impact = {
      ...baseImpact,
      projections: {
        monthly: {
          carbonReduction: baseImpact.carbonReduction,
          transitUsageIncrease: baseImpact.transitUsageIncrease,
        },
        yearly: {
          carbonReduction: baseImpact.carbonReduction * 12,
          equivalentTrees: Math.round((baseImpact.carbonReduction * 12) / 20),
        },
      },
    };

    res.json({
      success: true,
      impact,
    });
  } catch (error) {
    console.error('Impact calculation error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to calculate impact',
        code: 'IMPACT_ERROR',
      },
    });
  }
}

/**
 * POST /api/impact/compare
 * Compare impact between two locations
 */
async function compareImpact(req, res) {
  try {
    const { location1, location2, businessType } = req.body;

    if (!location1 || !location2) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'location1 and location2 are required',
          code: 'MISSING_LOCATIONS',
        },
      });
    }

    // Simple comparison
    const comparison = {
      location1: {
        carbonReduction: Math.round(50 + Math.random() * 100),
        score: 0.75,
      },
      location2: {
        carbonReduction: Math.round(50 + Math.random() * 100),
        score: 0.65,
      },
      difference: {
        carbonReduction: 25,
        percentageImprovement: 15,
      },
    };

    res.json({
      success: true,
      comparison,
    });
  } catch (error) {
    console.error('Impact comparison error:', error);
    res.status(500).json({
      success: false,
      error: {
        message: 'Failed to compare impact',
        code: 'COMPARISON_ERROR',
      },
    });
  }
}

module.exports = {
  calculateImpact,
  compareImpact,
};
