/**
 * businessFit.logic.js
 * Logic for calculating business type suitability scores
 * Matches business types with location characteristics
 */

// Business type definitions with their environmental preferences
const BUSINESS_TYPES = {
  eco_cafe: {
    name: 'Eco-Friendly Café',
    preferences: {
      parkProximity: 0.9,      // High preference for park views
      transitAccess: 0.8,      // Good transit for customers
      footTraffic: 0.7,        // Moderate foot traffic needed
      quietness: 0.6           // Somewhat quiet environment
    },
    idealMetrics: {
      nearestParkDistance: 150,
      nearestTransitDistance: 300,
      parksWithinRadius: 2,
      transitWithinRadius: 3
    }
  },
  green_office: {
    name: 'Green Office Space',
    preferences: {
      parkProximity: 0.7,
      transitAccess: 0.9,      // Critical for employees
      footTraffic: 0.3,        // Low foot traffic preferred
      quietness: 0.8           // Quiet environment important
    },
    idealMetrics: {
      nearestParkDistance: 300,
      nearestTransitDistance: 200,
      parksWithinRadius: 1,
      transitWithinRadius: 5
    }
  },
  sustainable_retail: {
    name: 'Sustainable Retail Store',
    preferences: {
      parkProximity: 0.6,
      transitAccess: 0.9,      // High customer accessibility
      footTraffic: 0.9,        // High foot traffic essential
      quietness: 0.2           // Busy areas preferred
    },
    idealMetrics: {
      nearestParkDistance: 400,
      nearestTransitDistance: 150,
      parksWithinRadius: 1,
      transitWithinRadius: 6
    }
  },
  wellness_center: {
    name: 'Wellness Center',
    preferences: {
      parkProximity: 0.95,     // Very high - nature connection
      transitAccess: 0.7,
      footTraffic: 0.4,
      quietness: 0.9           // Very quiet environment
    },
    idealMetrics: {
      nearestParkDistance: 100,
      nearestTransitDistance: 400,
      parksWithinRadius: 3,
      transitWithinRadius: 2
    }
  },
  coworking_space: {
    name: 'Co-working Space',
    preferences: {
      parkProximity: 0.7,
      transitAccess: 0.95,     // Critical for diverse members
      footTraffic: 0.5,
      quietness: 0.6
    },
    idealMetrics: {
      nearestParkDistance: 250,
      nearestTransitDistance: 180,
      parksWithinRadius: 2,
      transitWithinRadius: 5
    }
  }
};

/**
 * Calculate business fit score for a location
 * @param {string} businessType - Type of business
 * @param {Object} locationMetrics - Environmental metrics of location
 * @returns {number} Business fit score (0-1)
 */
function calculateBusinessFit(businessType, locationMetrics) {
  const business = BUSINESS_TYPES[businessType];
  
  if (!business) {
    throw new Error(`Unknown business type: ${businessType}`);
  }

  if (!locationMetrics || typeof locationMetrics !== 'object') {
    throw new Error('Invalid location metrics');
  }

  const {
    nearestParkDistance = Infinity,
    nearestTransitDistance = Infinity,
    parksWithinRadius = 0,
    transitWithinRadius = 0
  } = locationMetrics;

  // Calculate how well location matches ideal metrics
  const parkDistanceScore = calculateMetricFit(
    nearestParkDistance,
    business.idealMetrics.nearestParkDistance,
    500 // tolerance range
  );

  const transitDistanceScore = calculateMetricFit(
    nearestTransitDistance,
    business.idealMetrics.nearestTransitDistance,
    400
  );

  const parkDensityScore = calculateMetricFit(
    parksWithinRadius,
    business.idealMetrics.parksWithinRadius,
    2
  );

  const transitDensityScore = calculateMetricFit(
    transitWithinRadius,
    business.idealMetrics.transitWithinRadius,
    3
  );

  // Weight scores by business preferences
  const weightedScore = (
    parkDistanceScore * business.preferences.parkProximity +
    transitDistanceScore * business.preferences.transitAccess +
    parkDensityScore * 0.3 +  // Fixed weight for density metrics
    transitDensityScore * 0.4
  ) / (
    business.preferences.parkProximity +
    business.preferences.transitAccess +
    0.3 + 0.4
  );

  return Math.max(0, Math.min(1, weightedScore));
}

/**
 * Calculate how well a metric matches ideal value
 * Uses Gaussian-like scoring centered on ideal
 * @param {number} actual - Actual metric value
 * @param {number} ideal - Ideal metric value
 * @param {number} tolerance - Acceptable deviation range
 * @returns {number} Fit score (0-1)
 */
function calculateMetricFit(actual, ideal, tolerance) {
  const deviation = Math.abs(actual - ideal);
  
  if (deviation === 0) return 1;
  if (deviation > tolerance * 2) return 0;
  
  // Gaussian-like decay
  const score = Math.exp(-(deviation * deviation) / (2 * tolerance * tolerance));
  return Math.max(0, Math.min(1, score));
}

/**
 * Get business fit breakdown for transparency
 * @param {string} businessType - Type of business
 * @param {Object} locationMetrics - Environmental metrics
 * @returns {Object} Detailed fit breakdown
 */
function getBusinessFitBreakdown(businessType, locationMetrics) {
  const business = BUSINESS_TYPES[businessType];
  
  if (!business) {
    throw new Error(`Unknown business type: ${businessType}`);
  }

  const {
    nearestParkDistance = Infinity,
    nearestTransitDistance = Infinity,
    parksWithinRadius = 0,
    transitWithinRadius = 0
  } = locationMetrics;

  const parkDistanceScore = calculateMetricFit(
    nearestParkDistance,
    business.idealMetrics.nearestParkDistance,
    500
  );

  const transitDistanceScore = calculateMetricFit(
    nearestTransitDistance,
    business.idealMetrics.nearestTransitDistance,
    400
  );

  const parkDensityScore = calculateMetricFit(
    parksWithinRadius,
    business.idealMetrics.parksWithinRadius,
    2
  );

  const transitDensityScore = calculateMetricFit(
    transitWithinRadius,
    business.idealMetrics.transitWithinRadius,
    3
  );

  const totalScore = calculateBusinessFit(businessType, locationMetrics);

  return {
    businessType: business.name,
    totalScore,
    components: {
      parkDistance: {
        actual: nearestParkDistance,
        ideal: business.idealMetrics.nearestParkDistance,
        score: parkDistanceScore,
        preference: business.preferences.parkProximity
      },
      transitDistance: {
        actual: nearestTransitDistance,
        ideal: business.idealMetrics.nearestTransitDistance,
        score: transitDistanceScore,
        preference: business.preferences.transitAccess
      },
      parkDensity: {
        actual: parksWithinRadius,
        ideal: business.idealMetrics.parksWithinRadius,
        score: parkDensityScore
      },
      transitDensity: {
        actual: transitWithinRadius,
        ideal: business.idealMetrics.transitWithinRadius,
        score: transitDensityScore
      }
    }
  };
}

/**
 * Get all available business types
 * @returns {Array<Object>} List of business types with metadata
 */
function getAvailableBusinessTypes() {
  return Object.keys(BUSINESS_TYPES).map(key => ({
    id: key,
    name: BUSINESS_TYPES[key].name,
    preferences: BUSINESS_TYPES[key].preferences
  }));
}

/**
 * Validate business type
 * @param {string} businessType - Business type to validate
 * @returns {boolean} True if valid
 */
function isValidBusinessType(businessType) {
  return businessType in BUSINESS_TYPES;
}

module.exports = {
  calculateBusinessFit,
  getBusinessFitBreakdown,
  getAvailableBusinessTypes,
  isValidBusinessType,
  BUSINESS_TYPES
};
