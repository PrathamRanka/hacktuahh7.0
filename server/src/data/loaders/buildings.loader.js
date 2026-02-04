/**
 * buildings.loader.js
 * Load and validate building GeoJSON data
 * Provides normalized access to building locations
 */

const fs = require('fs');
const path = require('path');

// Cache for loaded data
let buildingsCache = null;

/**
 * Load buildings from GeoJSON file
 * @returns {Array<Object>} Array of building objects with normalized structure
 */
function loadBuildings() {
  // Return cached data if available
  if (buildingsCache) {
    return buildingsCache;
  }

  try {
    const filePath = path.join(__dirname, '../static/patiala_buildings.geojson');
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      console.warn(`Buildings GeoJSON file not found at ${filePath}`);
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
    const buildings = geojson.features
      .map((feature, index) => normalizeBuilding(feature, index))
      .filter(building => building !== null);

    buildingsCache = buildings;
    console.log(`Loaded ${buildings.length} buildings from GeoJSON`);
    
    return buildings;
  } catch (error) {
    console.error('Error loading buildings:', error.message);
    return [];
  }
}

/**
 * Normalize a building feature to standard format
 * @param {Object} feature - GeoJSON feature
 * @param {number} index - Feature index for ID generation
 * @returns {Object|null} Normalized building object or null if invalid
 */
function normalizeBuilding(feature, index) {
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
      // Use centroid or first coordinate
      const coords = geometry.type === 'Polygon' 
        ? geometry.coordinates[0][0]
        : geometry.coordinates[0][0][0];
      [lng, lat] = coords;
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
    const id = properties.id || properties.ID || properties.building_id || `B${index + 1}`;

    return {
      id: String(id),
      lat,
      lng,
      type: properties.type || properties.building_type || 'commercial',
      name: properties.name || properties.building_name || null,
      address: properties.address || null,
      area: properties.area || properties.building_area || null,
      floors: properties.floors || properties.num_floors || null,
      properties: { ...properties } // Keep original properties
    };
  } catch (error) {
    console.warn(`Error normalizing building at index ${index}:`, error.message);
    return null;
  }
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
 * Get building by ID
 * @param {string} id - Building ID
 * @returns {Object|null} Building object or null
 */
function getBuildingById(id) {
  const buildings = loadBuildings();
  return buildings.find(b => b.id === String(id)) || null;
}

/**
 * Filter buildings by type
 * @param {string} type - Building type
 * @returns {Array<Object>} Filtered buildings
 */
function getBuildingsByType(type) {
  const buildings = loadBuildings();
  return buildings.filter(b => b.type === type);
}

/**
 * Get all unique building types
 * @returns {Array<string>} Array of building types
 */
function getBuildingTypes() {
  const buildings = loadBuildings();
  const types = new Set(buildings.map(b => b.type));
  return Array.from(types);
}

/**
 * Clear cache (useful for testing or reloading)
 */
function clearCache() {
  buildingsCache = null;
}

/**
 * Get buildings count
 * @returns {number} Number of loaded buildings
 */
function getBuildingsCount() {
  const buildings = loadBuildings();
  return buildings.length;
}

module.exports = {
  loadBuildings,
  getBuildingById,
  getBuildingsByType,
  getBuildingTypes,
  getBuildingsCount,
  clearCache
};
