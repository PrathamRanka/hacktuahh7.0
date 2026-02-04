// Green score calculation logic

const { normalizeDistance, normalizeCount } = require('./normalization.logic');

// Business type weights
const BUSINESS_WEIGHTS = {
  eco_cafe: {
    parkProximity: 0.40,
    transitProximity: 0.20,
    roadProximity: 0.10,
    parkCount: 0.20,
    transitCount: 0.10,
  },
  green_office: {
    parkProximity: 0.20,
    transitProximity: 0.35,
    roadProximity: 0.15,
    parkCount: 0.15,
    transitCount: 0.15,
  },
  sustainable_retail: {
    parkProximity: 0.15,
    transitProximity: 0.30,
    roadProximity: 0.25,
    parkCount: 0.15,
    transitCount: 0.15,
  },
  wellness_center: {
    parkProximity: 0.45,
    transitProximity: 0.20,
    roadProximity: 0.10,
    parkCount: 0.20,
    transitCount: 0.05,
  },
  coworking_space: {
    parkProximity: 0.20,
    transitProximity: 0.30,
    roadProximity: 0.20,
    parkCount: 0.15,
    transitCount: 0.15,
  },
};

// Default weights
const DEFAULT_WEIGHTS = {
  parkProximity: 0.30,
  transitProximity: 0.25,
  roadProximity: 0.15,
  parkCount: 0.20,
  transitCount: 0.10,
};

/**
 * Calculate green score for a location
 * @param {Object} metrics - Proximity metrics
 * @param {string} businessType - Business type identifier
 * @returns {Object} Score result with breakdown
 */
function calculateGreenScore(metrics, businessType) {
  // Get weights based on business type
  const weights = BUSINESS_WEIGHTS[businessType] || DEFAULT_WEIGHTS;

  // Normalize all metrics to 0-1
  const parkProximityScore = normalizeDistance(metrics.nearestParkDistance, 800);
  const transitProximityScore = normalizeDistance(metrics.nearestTransitDistance, 600);
  const roadProximityScore = normalizeDistance(metrics.nearestRoadDistance || 500, 200);
  const parkCountScore = normalizeCount(metrics.parksWithin2km, 8);
  const transitCountScore = normalizeCount(metrics.transitWithin1km, 5);

  // Calculate weighted score
  const rawScore =
    weights.parkProximity * parkProximityScore +
    weights.transitProximity * transitProximityScore +
    weights.roadProximity * roadProximityScore +
    weights.parkCount * parkCountScore +
    weights.transitCount * transitCountScore;

  // Convert to 0-100 scale
  const score = Math.round(rawScore * 100);

  // Determine tier
  let tier = 'Low';
  if (score >= 80) tier = 'Excellent';
  else if (score >= 60) tier = 'Good';
  else if (score >= 40) tier = 'Fair';

  return {
    score,
    tier,
    breakdown: {
      parkProximity: Math.round(parkProximityScore * 100),
      transitProximity: Math.round(transitProximityScore * 100),
      roadProximity: Math.round(roadProximityScore * 100),
      parkCount: Math.round(parkCountScore * 100),
      transitCount: Math.round(transitCountScore * 100),
    },
  };
}

module.exports = {
  calculateGreenScore,
  BUSINESS_WEIGHTS,
};
