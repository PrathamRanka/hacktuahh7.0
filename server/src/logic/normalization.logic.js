// Normalization functions for scoring

/**
 * Normalize distance to 0-1 score (closer = higher score)
 * Uses exponential decay
 */
function normalizeDistance(distanceMeters, optimalDistance = 500) {
  if (distanceMeters <= 0) return 1;
  if (distanceMeters >= 5000) return 0;
  
  // Exponential decay: score decreases as distance increases
  const score = Math.exp(-distanceMeters / optimalDistance);
  return Math.max(0, Math.min(1, score));
}

/**
 * Normalize count to 0-1 score (more = higher score)
 */
function normalizeCount(count, maxCount = 10) {
  if (count <= 0) return 0;
  if (count >= maxCount) return 1;
  
  return count / maxCount;
}

/**
 * Linear normalization
 */
function normalizeLinear(value, min, max) {
  if (value <= min) return 0;
  if (value >= max) return 1;
  
  return (value - min) / (max - min);
}

module.exports = {
  normalizeDistance,
  normalizeCount,
  normalizeLinear,
};
