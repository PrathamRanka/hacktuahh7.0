// GeoJSON loader for parks data

const fs = require('fs').promises;
const path = require('path');

let parksCache = null;

/**
 * Load parks from GeoJSON file
 */
async function loadParks() {
  if (parksCache) {
    return parksCache;
  }

  try {
    const filePath = path.join(__dirname, '../static/patiala_parks.geojson');
    const data = await fs.readFile(filePath, 'utf8');
    const geojson = JSON.parse(data);

    // Extract park features
    const parks = [];

    geojson.features.forEach((feature, index) => {
      if (feature.geometry.type === 'Point') {
        parks.push({
          id: feature.id?.toString() || `park-${index}`,
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0],
          name: feature.properties?.name || 'Park',
          tags: feature.properties || {},
        });
      } else if (feature.geometry.type === 'Polygon' || feature.geometry.type === 'MultiPolygon') {
        // Calculate centroid for polygons
        const coords = feature.geometry.type === 'Polygon' 
          ? feature.geometry.coordinates[0]
          : feature.geometry.coordinates[0][0];
        
        const lngs = coords.map(c => c[0]);
        const lats = coords.map(c => c[1]);
        const centroidLng = lngs.reduce((a, b) => a + b, 0) / lngs.length;
        const centroidLat = lats.reduce((a, b) => a + b, 0) / lats.length;

        parks.push({
          id: feature.id?.toString() || `park-${index}`,
          lat: centroidLat,
          lng: centroidLng,
          name: feature.properties?.name || 'Green Space',
          tags: feature.properties || {},
        });
      }
    });

    parksCache = parks;
    console.log(`Loaded ${parks.length} parks from GeoJSON`);
    return parks;
  } catch (error) {
    console.error('Failed to load parks:', error);
    throw new Error('Parks data not available');
  }
}

/**
 * Clear cache
 */
function clearCache() {
  parksCache = null;
}

module.exports = {
  loadParks,
  clearCache,
};
