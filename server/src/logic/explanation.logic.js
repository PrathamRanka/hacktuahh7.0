/**
 * explanation.logic.js
 * Generate human-readable explanations for recommendations
 * Provides transparency and actionable insights
 */

const { getScoreTier } = require('./greenScore.logic');

/**
 * Generate explanation for a location recommendation
 * @param {Object} locationData - Complete location data with scores
 * @returns {string} Human-readable explanation
 */
function generateExplanation(locationData) {
  const {
    greenScore = 0,
    businessFitScore = 0,
    metrics = {},
    businessType = 'unknown'
  } = locationData;

  const parts = [];

  // Overall assessment
  const tier = getScoreTier(greenScore);
  parts.push(`This location has ${tier.toLowerCase()} sustainability (score: ${(greenScore * 100).toFixed(0)}%).`);

  // Park proximity explanation
  if (metrics.nearestParkDistance !== undefined) {
    const parkDist = Math.round(metrics.nearestParkDistance);
    if (parkDist < 200) {
      parts.push(`Excellent park access at just ${parkDist}m away.`);
    } else if (parkDist < 500) {
      parts.push(`Good park proximity at ${parkDist}m.`);
    } else if (parkDist < 1000) {
      parts.push(`Moderate park access (${parkDist}m away).`);
    } else {
      parts.push(`Limited park access (${parkDist}m away).`);
    }
  }

  // Transit access explanation
  if (metrics.nearestTransitDistance !== undefined) {
    const transitDist = Math.round(metrics.nearestTransitDistance);
    if (transitDist < 150) {
      parts.push(`Outstanding transit connectivity at ${transitDist}m.`);
    } else if (transitDist < 400) {
      parts.push(`Strong transit access at ${transitDist}m.`);
    } else if (transitDist < 800) {
      parts.push(`Adequate transit access (${transitDist}m).`);
    } else {
      parts.push(`Limited transit options (${transitDist}m away).`);
    }
  }

  // Density insights
  const parkCount = metrics.parksWithinRadius || 0;
  const transitCount = metrics.transitWithinRadius || 0;

  if (parkCount > 2 || transitCount > 4) {
    parts.push(`Rich environmental amenities with ${parkCount} parks and ${transitCount} transit stops nearby.`);
  }

  // Business fit explanation
  if (businessFitScore > 0.7) {
    parts.push(`Highly suitable for your business type.`);
  } else if (businessFitScore > 0.5) {
    parts.push(`Good match for your business needs.`);
  } else if (businessFitScore > 0.3) {
    parts.push(`Moderate fit for your business type.`);
  }

  return parts.join(' ');
}

/**
 * Generate detailed explanation with breakdown
 * @param {Object} locationData - Complete location data
 * @param {Object} scoreBreakdown - Detailed score components
 * @returns {Object} Structured explanation
 */
function generateDetailedExplanation(locationData, scoreBreakdown) {
  const summary = generateExplanation(locationData);
  
  const strengths = [];
  const weaknesses = [];
  const recommendations = [];

  // Analyze components
  if (scoreBreakdown && scoreBreakdown.components) {
    const { components } = scoreBreakdown;

    // Park proximity analysis
    if (components.parkProximity) {
      if (components.parkProximity.score > 0.7) {
        strengths.push('Excellent access to green spaces');
      } else if (components.parkProximity.score < 0.3) {
        weaknesses.push('Limited park proximity');
        recommendations.push('Consider locations closer to parks for better sustainability score');
      }
    }

    // Transit analysis
    if (components.transitAccess) {
      if (components.transitAccess.score > 0.7) {
        strengths.push('Strong public transportation connectivity');
      } else if (components.transitAccess.score < 0.3) {
        weaknesses.push('Poor transit accessibility');
        recommendations.push('Look for locations near bus stops or transit hubs');
      }
    }

    // Density analysis
    if (components.parkDensity && components.parkDensity.score > 0.6) {
      strengths.push('Multiple parks in the vicinity');
    }

    if (components.transitDensity && components.transitDensity.score > 0.6) {
      strengths.push('Multiple transit options available');
    }
  }

  return {
    summary,
    strengths,
    weaknesses,
    recommendations
  };
}

/**
 * Generate comparison explanation between two locations
 * @param {Object} location1 - First location data
 * @param {Object} location2 - Second location data
 * @returns {string} Comparison explanation
 */
function generateComparisonExplanation(location1, location2) {
  const score1 = location1.greenScore || 0;
  const score2 = location2.greenScore || 0;

  const diff = Math.abs(score1 - score2);
  const better = score1 > score2 ? 'first' : 'second';

  if (diff < 0.05) {
    return 'Both locations have very similar sustainability scores.';
  }

  const parts = [`The ${better} location scores ${(diff * 100).toFixed(0)}% higher.`];

  // Compare specific metrics
  const park1 = location1.metrics?.nearestParkDistance || Infinity;
  const park2 = location2.metrics?.nearestParkDistance || Infinity;

  if (Math.abs(park1 - park2) > 200) {
    const closer = park1 < park2 ? 'first' : 'second';
    parts.push(`The ${closer} location has significantly better park access.`);
  }

  const transit1 = location1.metrics?.nearestTransitDistance || Infinity;
  const transit2 = location2.metrics?.nearestTransitDistance || Infinity;

  if (Math.abs(transit1 - transit2) > 150) {
    const closer = transit1 < transit2 ? 'first' : 'second';
    parts.push(`The ${closer} location offers superior transit connectivity.`);
  }

  return parts.join(' ');
}

/**
 * Generate impact explanation for sustainability metrics
 * @param {Object} impactData - Impact calculation results
 * @returns {string} Impact explanation
 */
function generateImpactExplanation(impactData) {
  const {
    carbonReduction = 0,
    transitUsageIncrease = 0,
    greenSpaceAccess = 0
  } = impactData;

  const parts = [];

  if (carbonReduction > 0) {
    parts.push(`Estimated ${carbonReduction.toFixed(1)}kg CO₂ reduction per month through improved transit access.`);
  }

  if (transitUsageIncrease > 0) {
    parts.push(`Expected ${(transitUsageIncrease * 100).toFixed(0)}% increase in public transit usage.`);
  }

  if (greenSpaceAccess > 0) {
    parts.push(`${(greenSpaceAccess * 100).toFixed(0)}% improvement in green space accessibility.`);
  }

  if (parts.length === 0) {
    return 'Limited environmental impact data available.';
  }

  return parts.join(' ');
}

/**
 * Generate chat-style explanation (conversational)
 * @param {string} question - User's question
 * @param {Object} context - Relevant context data
 * @returns {string} Conversational response
 */
function generateChatExplanation(question, context) {
  const lowerQuestion = question.toLowerCase();

  // Green score questions
  if (lowerQuestion.includes('green score') || lowerQuestion.includes('sustainability')) {
    return `The green score measures environmental sustainability based on proximity to parks, access to public transit, and overall green infrastructure. Higher scores (0.7+) indicate excellent sustainability, while lower scores suggest room for improvement.`;
  }

  // Park-related questions
  if (lowerQuestion.includes('park')) {
    return `Parks and green spaces are crucial for sustainability. We measure both the distance to the nearest park and the number of parks within walking distance. Locations within 300m of a park score highest.`;
  }

  // Transit questions
  if (lowerQuestion.includes('transit') || lowerQuestion.includes('bus')) {
    return `Public transportation access reduces carbon emissions and improves sustainability. We evaluate proximity to transit stops and the number of options available. Locations within 200m of transit score best.`;
  }

  // Business fit questions
  if (lowerQuestion.includes('business') || lowerQuestion.includes('suitable')) {
    return `Business fit scores how well a location matches your specific business type's needs. Different businesses have different requirements - for example, cafés benefit from park views, while offices prioritize transit access.`;
  }

  // Default response
  return `I can help explain green scores, park proximity, transit access, business suitability, and environmental impact. What would you like to know more about?`;
}

module.exports = {
  generateExplanation,
  generateDetailedExplanation,
  generateComparisonExplanation,
  generateImpactExplanation,
  generateChatExplanation
};
