/**
 * distance.util.js
 * Geospatial distance calculations using Haversine formula
 * All distances returned in meters
 */

// Earth's radius in meters
const EARTH_RADIUS_METERS = 6371000;

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Convert radians to degrees
 * @param {number} radians - Angle in radians
 * @returns {number} Angle in degrees
 */
function toDegrees(radians) {
  return radians * (180 / Math.PI);
}

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of first point
 * @param {number} lon1 - Longitude of first point
 * @param {number} lat2 - Latitude of second point
 * @param {number} lon2 - Longitude of second point
 * @returns {number} Distance in meters
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  // Validate inputs
  if (!isValidCoordinate(lat1, lon1) || !isValidCoordinate(lat2, lon2)) {
    throw new Error('Invalid coordinates provided');
  }

  const φ1 = toRadians(lat1);
  const φ2 = toRadians(lat2);
  const Δφ = toRadians(lat2 - lat1);
  const Δλ = toRadians(lon2 - lon1);

  // Haversine formula
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return EARTH_RADIUS_METERS * c;
}

/**
 * Find nearest point from a list of points
 * @param {number} lat - Reference latitude
 * @param {number} lon - Reference longitude
 * @param {Array<Object>} points - Array of points with lat/lng properties
 * @returns {Object|null} Nearest point with distance property added
 */
function findNearest(lat, lon, points) {
  if (!Array.isArray(points) || points.length === 0) {
    return null;
  }

  let nearest = null;
  let minDistance = Infinity;

  for (const point of points) {
    const pointLat = point.lat || point.latitude;
    const pointLon = point.lng || point.lon || point.longitude;

    if (!isValidCoordinate(pointLat, pointLon)) {
      continue; // Skip invalid points
    }

    const distance = calculateDistance(lat, lon, pointLat, pointLon);

    if (distance < minDistance) {
      minDistance = distance;
      nearest = { ...point, distance };
    }
  }

  return nearest;
}

/**
 * Find all points within a radius
 * @param {number} lat - Reference latitude
 * @param {number} lon - Reference longitude
 * @param {Array<Object>} points - Array of points with lat/lng properties
 * @param {number} radiusMeters - Search radius in meters
 * @returns {Array<Object>} Points within radius with distance property added
 */
function findWithinRadius(lat, lon, points, radiusMeters) {
  if (!Array.isArray(points) || points.length === 0) {
    return [];
  }

  if (radiusMeters <= 0) {
    throw new Error('Radius must be positive');
  }

  const withinRadius = [];

  for (const point of points) {
    const pointLat = point.lat || point.latitude;
    const pointLon = point.lng || point.lon || point.longitude;

    if (!isValidCoordinate(pointLat, pointLon)) {
      continue;
    }

    const distance = calculateDistance(lat, lon, pointLat, pointLon);

    if (distance <= radiusMeters) {
      withinRadius.push({ ...point, distance });
    }
  }

  // Sort by distance (closest first)
  return withinRadius.sort((a, b) => a.distance - b.distance);
}

/**
 * Calculate bounding box for a point and radius
 * Useful for filtering before precise distance calculations
 * @param {number} lat - Center latitude
 * @param {number} lon - Center longitude
 * @param {number} radiusMeters - Radius in meters
 * @returns {Object} Bounding box {minLat, maxLat, minLon, maxLon}
 */
function getBoundingBox(lat, lon, radiusMeters) {
  if (!isValidCoordinate(lat, lon)) {
    throw new Error('Invalid coordinates');
  }

  // Angular distance in radians
  const angularDistance = radiusMeters / EARTH_RADIUS_METERS;

  const latRad = toRadians(lat);
  const lonRad = toRadians(lon);

  const minLat = toDegrees(latRad - angularDistance);
  const maxLat = toDegrees(latRad + angularDistance);

  // Account for longitude variation with latitude
  const Δlon = Math.asin(Math.sin(angularDistance) / Math.cos(latRad));
  const minLon = toDegrees(lonRad - Δlon);
  const maxLon = toDegrees(lonRad + Δlon);

  return {
    minLat: Math.max(minLat, -90),
    maxLat: Math.min(maxLat, 90),
    minLon: Math.max(minLon, -180),
    maxLon: Math.min(maxLon, 180)
  };
}

/**
 * Check if coordinates are within bounding box
 * @param {number} lat - Latitude to check
 * @param {number} lon - Longitude to check
 * @param {Object} bbox - Bounding box
 * @returns {boolean} True if within bounds
 */
function isWithinBoundingBox(lat, lon, bbox) {
  return lat >= bbox.minLat && lat <= bbox.maxLat &&
         lon >= bbox.minLon && lon <= bbox.maxLon;
}

/**
 * Validate coordinate values
 * @param {number} lat - Latitude
 * @param {number} lon - Longitude
 * @returns {boolean} True if valid
 */
function isValidCoordinate(lat, lon) {
  return typeof lat === 'number' && typeof lon === 'number' &&
         !isNaN(lat) && !isNaN(lon) &&
         lat >= -90 && lat <= 90 &&
         lon >= -180 && lon <= 180;
}

/**
 * Calculate center point (centroid) of multiple coordinates
 * @param {Array<Object>} points - Array of points with lat/lng
 * @returns {Object|null} Center point {lat, lng}
 */
function calculateCentroid(points) {
  if (!Array.isArray(points) || points.length === 0) {
    return null;
  }

  let x = 0, y = 0, z = 0;

  for (const point of points) {
    const lat = point.lat || point.latitude;
    const lon = point.lng || point.lon || point.longitude;

    if (!isValidCoordinate(lat, lon)) {
      continue;
    }

    const latRad = toRadians(lat);
    const lonRad = toRadians(lon);

    x += Math.cos(latRad) * Math.cos(lonRad);
    y += Math.cos(latRad) * Math.sin(lonRad);
    z += Math.sin(latRad);
  }

  const total = points.length;
  x /= total;
  y /= total;
  z /= total;

  const centralLon = Math.atan2(y, x);
  const centralSquareRoot = Math.sqrt(x * x + y * y);
  const centralLat = Math.atan2(z, centralSquareRoot);

  return {
    lat: toDegrees(centralLat),
    lng: toDegrees(centralLon)
  };
}

module.exports = {
  calculateDistance,
  findNearest,
  findWithinRadius,
  getBoundingBox,
  isWithinBoundingBox,
  isValidCoordinate,
  calculateCentroid,
  toRadians,
  toDegrees,
  EARTH_RADIUS_METERS
};
