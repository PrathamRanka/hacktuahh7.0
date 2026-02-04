// GeoJSON loader for buildings data

const fs = require('fs').promises;
const path = require('path');

let buildingsCache = null;

/**
 * Load buildings from GeoJSON file
 */
async function loadBuildings() {
  if (buildingsCache) {
    return buildingsCache;
  }

  try {
    const filePath = path.join(__dirname, '../static/patiala_buildings.geojson');
    const data = await fs.readFile(filePath, 'utf8');
    const geojson = JSON.parse(data);

    // Extract building features with coordinates
    const buildings = geojson.features
      .filter(feature => feature.geometry && feature.geometry.type === 'Point')
      .map((feature, index) => ({
        id: feature.id?.toString() || `building-${index}`,
        lat: feature.geometry.coordinates[1],
        lng: feature.geometry.coordinates[0],
        name: feature.properties?.name || null,
        tags: feature.properties || {},
      }));

    buildingsCache = buildings;
    console.log(`Loaded ${buildings.length} buildings from GeoJSON`);
    return buildings;
  } catch (error) {
    console.error('Failed to load buildings:', error);
    throw new Error('Buildings data not available');
  }
}

/**
 * Clear cache (useful for testing)
 */
function clearCache() {
  buildingsCache = null;
}

module.exports = {
  loadBuildings,
  clearCache,
};
