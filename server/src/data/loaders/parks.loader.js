/**
 * parks.loader.js
 * Load and validate parks GeoJSON data
 * Provides normalized access to park/green space locations
 */

const fs = require('fs');
const path = require('path');

// Cache for loaded data
let parksCache = null;

/**
 * Load parks from GeoJSON file
 * @returns {Array<Object>} Array of park objects with normalized structure
 */
function loadParks() {
  // Return cached data if available
  if (parksCache) {
    return parksCache;
  }

  try {
    const filePath = path.join(__dirname, '../static/patiala_parks.geojson');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.warn(`Parks GeoJSON file not found at ${filePath}`);
      return [];
    }

    const fileContent = fs.readFileSync(filePath, 'utf8');
    const geojson = JSON.parse(fileContent);

    // Validate GeoJSON structure
    if (!geojson || geojson.type !== 'FeatureCollection') {
      throw new Error('Invalid GeoJSON: must be a FeatureCollection');
    }

    if (!Array.isArray(geojson.features)) {
      throw new Error('Invalid GeoJSON: features must be an array');
    }

    // Normalize and validate features
    const parks = geojson.features
      .map((feature, index) => normalizePark(feature, index))
      .filter(park => park !== null);

    parksCache = parks;
    console.log(`Loaded ${parks.length} parks from GeoJSON`);
    
    return parks;
  } catch (error) {
    console.error('Error loading parks:', error.message);
    return [];
  }
}

/**
 * Normalize a park feature to standard format
 * @param {Object} feature - GeoJSON feature
 * @param {number} index - Feature index for ID generation
 * @returns {Object|null} Normalized park object or null if invalid
 */
function normalizePark(feature, index) {
  try {
    if (!feature || !feature.geometry) {
      return null;
    }

    const { geometry, properties = {} } = feature;

    // Extract coordinates based on geometry type
    let lat, lng;

    if (geometry.type === 'Point') {
      [lng, lat] = geometry.coordinates;
    } else if (geometry.type === 'Polygon' || geometry.type === 'MultiPolygon') {
      // Calculate centroid for polygons
      const coords = geometry.type === 'Polygon' 
        ? geometry.coordinates[0]
        : geometry.coordinates[0][0];
      
      const centroid = calculatePolygonCentroid(coords);
      lat = centroid.lat;
      lng = centroid.lng;
    } else {
      console.warn(`Unsupported geometry type: ${geometry.type}`);
      return null;
    }

    // Validate coordinates
    if (!isValidCoordinate(lat, lng)) {
      console.warn(`Invalid coordinates at index ${index}: lat=${lat}, lng=${lng}`);
      return null;
    }

    // Generate ID if not present
    const id = properties.id || properties.ID || properties.park_id || `P${index + 1}`;

    return {
      id: String(id),
      lat,
      lng,
      name: properties.name || properties.park_name || `Park ${index + 1}`,
      type: properties.type || properties.park_type || 'park',
      area: properties.area || properties.park_area || null,
      amenities: properties.amenities || [],
      accessibility: properties.accessibility || 'public',
      properties: { ...properties } // Keep original properties
    };
  } catch (error) {
    console.warn(`Error normalizing park at index ${index}:`, error.message);
    return null;
  }
}

/**
 * Calculate centroid of a polygon
 * @param {Array<Array<number>>} coordinates - Polygon coordinates
 * @returns {Object} Centroid {lat, lng}
 */
function calculatePolygonCentroid(coordinates) {
  if (!Array.isArray(coordinates) || coordinates.length === 0) {
    throw new Error('Invalid polygon coordinates');
  }

  let sumLat = 0;
  let sumLng = 0;
  let count = 0;

  for (const coord of coordinates) {
    if (Array.isArray(coord) && coord.length >= 2) {
      sumLng += coord[0];
      sumLat += coord[1];
      count++;
    }
  }

  return {
    lat: sumLat / count,
    lng: sumLng / count
  };
}

/**
 * Validate coordinate values
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {boolean} True if valid
 */
function isValidCoordinate(lat, lng) {
  return typeof lat === 'number' && typeof lng === 'number' &&
         !isNaN(lat) && !isNaN(lng) &&
         lat >= -90 && lat <= 90 &&
         lng >= -180 && lng <= 180;
}

/**
 * Get park by ID
 * @param {string} id - Park ID
 * @returns {Object|null} Park object or null
 */
function getParkById(id) {
  const parks = loadParks();
  return parks.find(p => p.id === String(id)) || null;
}

/**
 * Filter parks by type
 * @param {string} type - Park type
 * @returns {Array<Object>} Filtered parks
 */
function getParksByType(type) {
  const parks = loadParks();
  return parks.filter(p => p.type === type);
}

/**
 * Get all unique park types
 * @returns {Array<string>} Array of park types
 */
function getParkTypes() {
  const parks = loadParks();
  const types = new Set(parks.map(p => p.type));
  return Array.from(types);
}

/**
 * Clear cache (useful for testing or reloading)
 */
function clearCache() {
  parksCache = null;
}

/**
 * Get parks count
 * @returns {number} Number of loaded parks
 */
function getParksCount() {
  const parks = loadParks();
  return parks.length;
}

module.exports = {
  loadParks,
  getParkById,
  getParksByType,
  getParkTypes,
  getParksCount,
  clearCache
};
