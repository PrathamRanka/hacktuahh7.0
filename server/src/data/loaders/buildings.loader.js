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

    // Extract building nodes with coordinates
    const buildings = geojson.elements
      .filter(el => el.type === 'node' && el.lat && el.lon)
      .map(el => ({
        id: el.id.toString(),
        lat: el.lat,
        lng: el.lon,
        name: el.tags?.name || null,
        tags: el.tags || {},
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
