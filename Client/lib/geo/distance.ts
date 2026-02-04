// Geospatial distance calculations using Haversine formula

/**
 * Calculate distance between two points using Haversine formula
 * @param lat1 Latitude of point 1
 * @param lon1 Longitude of point 1
 * @param lat2 Latitude of point 2
 * @param lon2 Longitude of point 2
 * @returns Distance in meters
 */
export function haversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

/**
 * Find nearest point from a list of points
 */
export function findNearest(
  lat: number,
  lng: number,
  points: Array<{ lat: number; lng: number; [key: string]: any }>
): { point: any; distance: number } | null {
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
export function countWithinRadius(
  lat: number,
  lng: number,
  points: Array<{ lat: number; lng: number }>,
  radiusMeters: number
): number {
  return points.filter((point) => {
    const distance = haversineDistance(lat, lng, point.lat, point.lng);
    return distance <= radiusMeters;
  }).length;
}
