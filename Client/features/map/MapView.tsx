'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Recommendation } from '@/lib/types';
import { MAPBOX_CONFIG, getMarkerColor } from './map.config';
import BuildingMarkers from './BuildingMarkers';
import MapControls from './MapControls';
import { calculateProximityMetrics } from '@/lib/geo/proximity';
import { calculateGreenScore } from '@/lib/scoring/greenScore';
import { generateExplanation } from '@/lib/ai/explain';

interface MapViewProps {
  recommendations: Recommendation[];
  onBuildingSelect: (building: Recommendation) => void;
  selectedBuilding: Recommendation | null;
}

export default function MapView({
  recommendations,
  onBuildingSelect,
  selectedBuilding,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [is3D, setIs3D] = useState(true);
  const [scoredRecommendations, setScoredRecommendations] = useState<Recommendation[]>([]);

  // Load and process GeoJSON data
  useEffect(() => {
    const loadGeoData = async () => {
      try {
        const [buildingsRes, parksRes, transitRes] = await Promise.all([
          fetch('/data/patiala_buildings.geojson'),
          fetch('/data/patiala_parks.geojson'),
          fetch('/data/patiala_bus_stops.geojson'),
        ]);

        const buildings = await buildingsRes.json();
        const parks = await parksRes.json();
        const transit = await transitRes.json();

        // Extract coordinates from GeoJSON
        const parkPoints = parks.elements
          .filter((el: any) => el.type === 'node' || el.geometry)
          .map((el: any) => ({
            lat: el.lat || (el.geometry?.[0]?.lat),
            lng: el.lon || (el.geometry?.[0]?.lon),
          }))
          .filter((p: any) => p.lat && p.lng);

        const transitPoints = transit.elements
          .filter((el: any) => el.type === 'node')
          .map((el: any) => ({ lat: el.lat, lng: el.lon }));

        // Score buildings
        const scored = buildings.elements
          .filter((el: any) => el.type === 'node' && el.lat && el.lon)
          .slice(0, 50) // Limit to 50 buildings for performance
          .map((building: any, index: number) => {
            const metrics = calculateProximityMetrics(
              building.lat,
              building.lon,
              parkPoints,
              transitPoints,
              [] // Roads not used in current scoring
            );

            const scoreResult = calculateGreenScore(metrics);
            const explanation = generateExplanation(scoreResult, metrics);

            return {
              id: `building-${building.id}`,
              lat: building.lat,
              lng: building.lon,
              name: building.tags?.name || `Building ${index + 1}`,
              greenScore: scoreResult.score / 100,
              tier: scoreResult.tier,
              businessFitScore: 0.75,
              rank: 0,
              explanation,
              metrics: {
                nearestParkDistance: Math.round(metrics.nearestParkDistance),
                nearestTransitDistance: Math.round(metrics.nearestTransitDistance),
                parksWithinRadius: metrics.parksWithin2km,
                transitWithinRadius: metrics.transitWithin1km,
              },
            };
          })
          .sort((a: any, b: any) => b.greenScore - a.greenScore)
          .map((building: any, index: number) => ({ ...building, rank: index + 1 }))
          .slice(0, 20); // Top 20 recommendations

        setScoredRecommendations(scored);
      } catch (error) {
        console.error('Failed to load GeoJSON data:', error);
      }
    };

    loadGeoData();
  }, []);

  // Initialize Mapbox
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: MAPBOX_CONFIG.style,
      center: MAPBOX_CONFIG.center,
      zoom: MAPBOX_CONFIG.zoom,
      pitch: 60,
      bearing: -17.6,
      antialias: true,
    });

    map.current.on('load', async () => {
      if (!map.current) return;

      // Add 3D buildings layer
      const layers = map.current.getStyle().layers;
      const labelLayerId = layers?.find(
        (layer) => layer.type === 'symbol' && layer.layout?.['text-field']
      )?.id;

      map.current.addLayer(
        {
          id: '3d-buildings',
          source: 'composite',
          'source-layer': 'building',
          filter: ['==', 'extrude', 'true'],
          type: 'fill-extrusion',
          minzoom: 15,
          paint: {
            'fill-extrusion-color': '#aaa',
            'fill-extrusion-height': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'height'],
            ],
            'fill-extrusion-base': [
              'interpolate',
              ['linear'],
              ['zoom'],
              15,
              0,
              15.05,
              ['get', 'min_height'],
            ],
            'fill-extrusion-opacity': 0.6,
          },
        },
        labelLayerId
      );

      // Load and add GeoJSON layers
      try {
        // Parks layer
        const parksRes = await fetch('/data/patiala_parks.geojson');
        const parksData = await parksRes.json();
        
        map.current!.addSource('parks', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: parksData.elements
              .filter((el: any) => el.geometry)
              .map((el: any) => ({
                type: 'Feature',
                geometry: {
                  type: 'Polygon',
                  coordinates: [el.geometry.map((coord: any) => [coord.lon, coord.lat])],
                },
                properties: el.tags || {},
              })),
          },
        });

        map.current!.addLayer({
          id: 'parks-fill',
          type: 'fill',
          source: 'parks',
          paint: {
            'fill-color': '#10b981',
            'fill-opacity': 0.3,
          },
        });

        // Bus stops layer
        const transitRes = await fetch('/data/patiala_bus_stops.geojson');
        const transitData = await transitRes.json();

        map.current!.addSource('transit', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: transitData.elements
              .filter((el: any) => el.type === 'node')
              .map((el: any) => ({
                type: 'Feature',
                geometry: {
                  type: 'Point',
                  coordinates: [el.lon, el.lat],
                },
                properties: el.tags || {},
              })),
          },
        });

        map.current!.addLayer({
          id: 'transit-points',
          type: 'circle',
          source: 'transit',
          paint: {
            'circle-radius': 6,
            'circle-color': '#3b82f6',
            'circle-stroke-width': 2,
            'circle-stroke-color': '#ffffff',
          },
        });
      } catch (error) {
        console.error('Failed to add GeoJSON layers:', error);
      }
    });

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // Fly to selected building
  useEffect(() => {
    if (selectedBuilding && map.current) {
      map.current.flyTo({
        center: [selectedBuilding.lng, selectedBuilding.lat],
        zoom: 17,
        pitch: 60,
        duration: 1500,
      });
    }
  }, [selectedBuilding]);

  const handleToggle3D = () => {
    if (!map.current) return;
    const newPitch = is3D ? 0 : 60;
    map.current.easeTo({ pitch: newPitch, duration: 1000 });
    setIs3D(!is3D);
  };

  const handleReset = () => {
    if (!map.current) return;
    map.current.flyTo({
      center: MAPBOX_CONFIG.center,
      zoom: MAPBOX_CONFIG.zoom,
      pitch: 60,
      bearing: -17.6,
      duration: 1500,
    });
  };

  // Use scored recommendations if available, otherwise use props
  const displayRecommendations = recommendations.length > 0 ? recommendations : scoredRecommendations;

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {map.current && (
        <>
          <BuildingMarkers
            map={map.current}
            recommendations={displayRecommendations}
            onSelect={onBuildingSelect}
            selectedId={selectedBuilding?.id}
          />
          <MapControls
            onToggle3D={handleToggle3D}
            onReset={handleReset}
            is3D={is3D}
          />
        </>
      )}
    </div>
  );
}
