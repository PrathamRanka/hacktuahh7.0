import fs from "fs";

// 1. Read raw GeoJSON
const raw = JSON.parse(
  fs.readFileSync("../Data/export.geojson", "utf8")
);

// 2. Allowed building types
const ALLOWED_BUILDINGS = new Set([
  "commercial",
  "retail",
  "office",
  "government",
  "school",
  "hospital",
  "mixed_use",
  "yes"
]);

let idCounter = 1;

// 3. Clean + normalize
const cleanedFeatures = raw.features
  .filter(f => {
    const building = f.properties?.building;
    return building && ALLOWED_BUILDINGS.has(building);
  })
  .map(f => ({
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates: f.geometry.coordinates
    },
    properties: {
      id: idCounter++,
      name: f.properties?.name || null,
      building_type: f.properties.building
    }
  }));

// 4. Final clean GeoJSON
const cleaned = {
  type: "FeatureCollection",
  features: cleanedFeatures
};

// 5. Write output
fs.writeFileSync(
  "../public/data/patiala_buildings.geojson",
  JSON.stringify(cleaned, null, 2)
);

console.log("✅ Raw features:", raw.features.length);
console.log("✅ Clean features:", cleanedFeatures.length);
console.log("📁 Output → public/data/patiala_buildings.geojson");
