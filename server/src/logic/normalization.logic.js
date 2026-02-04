/**
 * normalization.logic.js
 * Pure functions for normalizing data values to [0, 1] range
 * Used for consistent scoring across different metrics
 */

/**
 * Normalize a value to [0, 1] range using min-max normalization
 * @param {number} value - The value to normalize
 * @param {number} min - Minimum possible value
 * @param {number} max - Maximum possible value
 * @returns {number} Normalized value between 0 and 1
 */
function normalizeMinMax(value, min, max) {
  if (max === min) return 0.5; // Avoid division by zero
  const normalized = (value - min) / (max - min);
  return Math.max(0, Math.min(1, normalized)); // Clamp to [0, 1]
}

/**
 * Inverse normalization - lower values get higher scores
 * Useful for distance metrics where closer is better
 * @param {number} value - The value to normalize
 * @param {number} min - Minimum possible value
 * @param {number} max - Maximum possible value
 * @returns {number} Inverse normalized value between 0 and 1
 */
function normalizeInverse(value, min, max) {
  const normalized = normalizeMinMax(value, min, max);
  return 1 - normalized;
}

/**
 * Normalize using logarithmic scale
 * Useful for metrics with exponential distributions
 * @param {number} value - The value to normalize
 * @param {number} min - Minimum possible value (must be > 0)
 * @param {number} max - Maximum possible value
 * @returns {number} Log-normalized value between 0 and 1
 */
function normalizeLog(value, min, max) {
  if (min <= 0 || max <= 0 || value <= 0) {
    return normalizeMinMax(value, min, max); // Fallback to linear
  }
  const logValue = Math.log(value);
  const logMin = Math.log(min);
  const logMax = Math.log(max);
  return normalizeMinMax(logValue, logMin, logMax);
}

/**
 * Normalize distance to a score (closer = better)
 * Uses exponential decay for smooth scoring
 * @param {number} distance - Distance in meters
 * @param {number} optimalDistance - Distance that gets score of ~0.95
 * @param {number} decayRate - How quickly score drops (default: 0.001)
 * @returns {number} Score between 0 and 1
 */
function normalizeDistance(distance, optimalDistance = 100, decayRate = 0.001) {
  if (distance < 0) return 0;
  if (distance === 0) return 1;

  // Exponential decay: score = e^(-decayRate * distance)
  const score = Math.exp(-decayRate * distance);
  return Math.max(0, Math.min(1, score));
}

/**
 * Normalize a count to a score with diminishing returns
 * More is better, but with logarithmic scaling
 * @param {number} count - The count value
 * @param {number} baseline - Count that gives score of 0.5
 * @returns {number} Score between 0 and 1
 */
function normalizeCount(count, baseline = 5) {
  if (count <= 0) return 0;
  if (baseline <= 0) baseline = 1;

  // Logarithmic scaling: score = log(count + 1) / log(baseline * 2 + 1)
  const score = Math.log(count + 1) / Math.log(baseline * 2 + 1);
  return Math.max(0, Math.min(1, score));
}

/**
 * Apply sigmoid normalization for smooth S-curve
 * Centers around midpoint with configurable steepness
 * @param {number} value - The value to normalize
 * @param {number} midpoint - Value that maps to 0.5
 * @param {number} steepness - How steep the curve is (default: 1)
 * @returns {number} Score between 0 and 1
 */
function normalizeSigmoid(value, midpoint, steepness = 1) {
  const x = steepness * (value - midpoint);
  return 1 / (1 + Math.exp(-x));
}

/**
 * Normalize array of values to [0, 1] range
 * @param {number[]} values - Array of values to normalize
 * @returns {number[]} Array of normalized values
 */
function normalizeArray(values) {
  if (!Array.isArray(values) || values.length === 0) return [];

  const min = Math.min(...values);
  const max = Math.max(...values);

  return values.map((v) => normalizeMinMax(v, min, max));
}

/**
 * Calculate percentile rank for a value in a dataset
 * @param {number} value - The value to rank
 * @param {number[]} dataset - Array of values for comparison
 * @returns {number} Percentile rank between 0 and 1
 */
function normalizePercentile(value, dataset) {
  if (!Array.isArray(dataset) || dataset.length === 0) return 0.5;

  const sorted = [...dataset].sort((a, b) => a - b);
  const index = sorted.findIndex((v) => v >= value);

  if (index === -1) return 1; // Value is larger than all
  if (index === 0) return 0; // Value is smaller than all

  return index / sorted.length;
}

module.exports = {
  normalizeMinMax,
  normalizeInverse,
  normalizeLog,
  normalizeDistance,
  normalizeCount,
  normalizeSigmoid,
  normalizeArray,
  normalizePercentile,
};
