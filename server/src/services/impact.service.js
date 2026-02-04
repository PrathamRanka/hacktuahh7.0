/**
 * impact.service.js
 * Calculate environmental impact and sustainability projections
 * Estimates carbon reduction and transit usage improvements
 */

/**
 * Calculate environmental impact for a location
 * @param {Object} locationData - Location with scores and metrics
 * @returns {Object} Impact calculations
 */
function calculateImpact(locationData) {
  const {
    greenScore = 0,
    metrics = {}
  } = locationData;

  const {
    nearestTransitDistance = Infinity,
    transitWithinRadius = 0,
    nearestParkDistance = Infinity,
    parksWithinRadius = 0
  } = metrics;

  // Estimate carbon reduction based on transit access
  const carbonReduction = estimateCarbonReduction(nearestTransitDistance, transitWithinRadius);

  // Estimate transit usage increase
  const transitUsageIncrease = estimateTransitUsage(nearestTransitDistance, transitWithinRadius);

  // Estimate green space access improvement
  const greenSpaceAccess = estimateGreenSpaceAccess(nearestParkDistance, parksWithinRadius);

  // Estimate employee wellbeing score
  const wellbeingScore = estimateWellbeing(greenScore, metrics);

  // Calculate overall impact score
  const impactScore = (
    (carbonReduction / 50) * 0.4 +  // Normalize to 0-1 range
    transitUsageIncrease * 0.3 +
    greenSpaceAccess * 0.3
  );

  return {
    impactScore: Math.min(1, impactScore),
    carbonReduction,
    transitUsageIncrease,
    greenSpaceAccess,
    wellbeingScore,
    projections: generateProjections(carbonReduction, transitUsageIncrease)
  };
}

/**
 * Estimate monthly carbon reduction in kg CO2
 * Based on improved transit access reducing car usage
 * @param {number} transitDistance - Distance to nearest transit (meters)
 * @param {number} transitCount - Number of transit options nearby
 * @returns {number} Estimated kg CO2 reduction per month
 */
function estimateCarbonReduction(transitDistance, transitCount) {
  // Assumptions:
  // - Average car emits ~0.2 kg CO2 per km
  // - Average commute is 10 km each way, 20 days/month
  // - Good transit access reduces car trips

  if (transitDistance > 1000) {
    return 0; // Too far for practical transit use
  }

  // Base reduction potential (kg CO2/month)
  const baseReduction = 40; // ~10 km * 2 trips/day * 20 days * 0.1 kg/km

  // Distance factor (closer = better)
  let distanceFactor;
  if (transitDistance < 200) {
    distanceFactor = 1.0;
  } else if (transitDistance < 400) {
    distanceFactor = 0.8;
  } else if (transitDistance < 700) {
    distanceFactor = 0.5;
  } else {
    distanceFactor = 0.2;
  }

  // Density factor (more options = better)
  const densityFactor = Math.min(1, 0.5 + (transitCount * 0.1));

  return baseReduction * distanceFactor * densityFactor;
}

/**
 * Estimate transit usage increase as percentage
 * @param {number} transitDistance - Distance to nearest transit
 * @param {number} transitCount - Number of transit options
 * @returns {number} Percentage increase (0-1)
 */
function estimateTransitUsage(transitDistance, transitCount) {
  if (transitDistance > 1000) {
    return 0;
  }

  // Base usage increase
  let baseIncrease = 0.3; // 30% baseline

  // Distance bonus
  if (transitDistance < 150) {
    baseIncrease += 0.3;
  } else if (transitDistance < 300) {
    baseIncrease += 0.2;
  } else if (transitDistance < 500) {
    baseIncrease += 0.1;
  }

  // Density bonus
  const densityBonus = Math.min(0.2, transitCount * 0.04);

  return Math.min(1, baseIncrease + densityBonus);
}

/**
 * Estimate green space access improvement
 * @param {number} parkDistance - Distance to nearest park
 * @param {number} parkCount - Number of parks nearby
 * @returns {number} Access score (0-1)
 */
function estimateGreenSpaceAccess(parkDistance, parkCount) {
  if (parkDistance > 2000) {
    return 0;
  }

  // Distance score
  let distanceScore;
  if (parkDistance < 200) {
    distanceScore = 1.0;
  } else if (parkDistance < 500) {
    distanceScore = 0.8;
  } else if (parkDistance < 1000) {
    distanceScore = 0.5;
  } else {
    distanceScore = 0.2;
  }

  // Density score
  const densityScore = Math.min(1, parkCount * 0.25);

  return (distanceScore * 0.7) + (densityScore * 0.3);
}

/**
 * Estimate employee wellbeing score
 * @param {number} greenScore - Overall green score
 * @param {Object} metrics - Environmental metrics
 * @returns {number} Wellbeing score (0-100)
 */
function estimateWellbeing(greenScore, metrics) {
  // Base wellbeing from green score
  const baseWellbeing = greenScore * 60; // Max 60 points

  // Bonus for park proximity (max 20 points)
  const parkDistance = metrics.nearestParkDistance || Infinity;
  let parkBonus = 0;
  if (parkDistance < 300) {
    parkBonus = 20;
  } else if (parkDistance < 600) {
    parkBonus = 15;
  } else if (parkDistance < 1000) {
    parkBonus = 10;
  }

  // Bonus for transit access (max 20 points)
  const transitDistance = metrics.nearestTransitDistance || Infinity;
  let transitBonus = 0;
  if (transitDistance < 200) {
    transitBonus = 20;
  } else if (transitDistance < 400) {
    transitBonus = 15;
  } else if (transitDistance < 700) {
    transitBonus = 10;
  }

  return Math.min(100, baseWellbeing + parkBonus + transitBonus);
}

/**
 * Generate future projections
 * @param {number} carbonReduction - Monthly carbon reduction
 * @param {number} transitUsage - Transit usage increase
 * @returns {Object} Projection data
 */
function generateProjections(carbonReduction, transitUsage) {
  return {
    monthly: {
      carbonReduction: carbonReduction.toFixed(1),
      transitUsageIncrease: (transitUsage * 100).toFixed(0) + '%'
    },
    yearly: {
      carbonReduction: (carbonReduction * 12).toFixed(1),
      equivalentTrees: Math.ceil((carbonReduction * 12) / 20) // ~20kg CO2 per tree/year
    },
    fiveYear: {
      carbonReduction: (carbonReduction * 60).toFixed(1),
      equivalentTrees: Math.ceil((carbonReduction * 60) / 20)
    }
  };
}

/**
 * Compare impact between two locations
 * @param {Object} location1Data - First location data
 * @param {Object} location2Data - Second location data
 * @returns {Object} Impact comparison
 */
function compareImpact(location1Data, location2Data) {
  const impact1 = calculateImpact(location1Data);
  const impact2 = calculateImpact(location2Data);

  const carbonDiff = impact1.carbonReduction - impact2.carbonReduction;
  const transitDiff = impact1.transitUsageIncrease - impact2.transitUsageIncrease;

  return {
    location1: impact1,
    location2: impact2,
    differences: {
      carbonReduction: carbonDiff,
      transitUsage: transitDiff,
      betterChoice: impact1.impactScore > impact2.impactScore ? 'location1' : 'location2'
    }
  };
}

/**
 * Calculate aggregate impact for multiple locations
 * @param {Array<Object>} locations - Array of location data
 * @returns {Object} Aggregate impact
 */
function calculateAggregateImpact(locations) {
  if (!Array.isArray(locations) || locations.length === 0) {
    return {
      totalCarbonReduction: 0,
      averageTransitUsage: 0,
      averageWellbeing: 0
    };
  }

  const impacts = locations.map(loc => calculateImpact(loc));

  const totalCarbonReduction = impacts.reduce((sum, i) => sum + i.carbonReduction, 0);
  const averageTransitUsage = impacts.reduce((sum, i) => sum + i.transitUsageIncrease, 0) / impacts.length;
  const averageWellbeing = impacts.reduce((sum, i) => sum + i.wellbeingScore, 0) / impacts.length;

  return {
    totalCarbonReduction,
    averageTransitUsage,
    averageWellbeing,
    locationsAnalyzed: locations.length
  };
}

module.exports = {
  calculateImpact,
  compareImpact,
  calculateAggregateImpact,
  estimateCarbonReduction,
  estimateTransitUsage,
  estimateGreenSpaceAccess,
  estimateWellbeing
};
