// Geospatial service for distance calculations

/**
 * Calculate distance between two points using Haversine formula
 * @param {number} lat1 - Latitude of point 1
 * @param {number} lng1 - Longitude of point 1
 * @param {number} lat2 - Latitude of point 2
 * @param {number} lng2 - Longitude of point 2
 * @returns {number} Distance in meters
 */
function haversineDistance(lat1, lng1, lat2, lng2) {
  const R = 6371000; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Find nearest point from a list
 */
function findNearest(lat, lng, points) {
  if (points.length === 0) return null;

  let nearest = points[0];
  let minDistance = haversineDistance(lat, lng, nearest.lat, nearest.lng);

  for (let i = 1; i < points.length; i++) {
    const distance = haversineDistance(lat, lng, points[i].lat, points[i].lng);
    if (distance < minDistance) {
      minDistance = distance;
      nearest = points[i];
    }
  }

  return { point: nearest, distance: minDistance };
}

/**
 * Count points within radius
 */
function countWithinRadius(lat, lng, points, radiusMeters) {
  return points.filter(point => {
    const distance = haversineDistance(lat, lng, point.lat, point.lng);
    return distance <= radiusMeters;
  }).length;
}

/**
 * Calculate proximity metrics for a building
 */
function calculateProximityMetrics(building, parks, transit) {
  const nearestPark = findNearest(building.lat, building.lng, parks);
  const nearestTransit = findNearest(building.lat, building.lng, transit);

  return {
    nearestParkDistance: nearestPark?.distance || 10000,
    nearestTransitDistance: nearestTransit?.distance || 10000,
    nearestRoadDistance: 500, // Placeholder - roads not used in current scoring
    parksWithin2km: countWithinRadius(building.lat, building.lng, parks, 2000),
    transitWithin1km: countWithinRadius(building.lat, building.lng, transit, 1000),
    nearestPark: nearestPark?.point,
    nearestTransit: nearestTransit?.point,
  };
}

module.exports = {
  haversineDistance,
  findNearest,
  countWithinRadius,
  calculateProximityMetrics,
};
