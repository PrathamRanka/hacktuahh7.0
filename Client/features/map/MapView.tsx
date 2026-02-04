'use client';

import { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import type { Recommendation } from '@/lib/types';
import { MAPBOX_CONFIG } from './map.config';
import BuildingMarkers from './BuildingMarkers';
import MapControls from './MapControls';

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
  const map = useRef<maplibregl.Map | null>(null);
  const [is3D, setIs3D] = useState(false);

  // Initialize MapLibre with OSM tiles
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm-tiles': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap contributors',
            maxzoom: 19,
          },
        },
        layers: [
          {
            id: 'osm-layer',
            type: 'raster',
            source: 'osm-tiles',
            minzoom: 0,
            maxzoom: 22,
          },
        ],
      },
      center: MAPBOX_CONFIG.center,
      zoom: 15,
      pitch: 0,
      bearing: 0,
    });

    // Add navigation controls
    map.current.addControl(
      new maplibregl.NavigationControl({
        visualizePitch: false,
        showZoom: true,
        showCompass: true,
      }),
      'top-right'
    );

    // Add scale control
    map.current.addControl(
      new maplibregl.ScaleControl({
        maxWidth: 100,
        unit: 'metric',
      }),
      'bottom-left'
    );

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
        zoom: 18,
        duration: 1500,
        essential: true,
      });
    }
  }, [selectedBuilding]);

  const handleToggle3D = () => {
    // 3D not available with free OSM tiles
    console.log('3D view requires premium tile source with building data');
  };

  const handleReset = () => {
    if (!map.current) return;
    map.current.flyTo({
      center: MAPBOX_CONFIG.center,
      zoom: 15,
      pitch: 0,
      bearing: 0,
      duration: 1500,
      essential: true,
    });
  };

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />

      {map.current && (
        <>
          <BuildingMarkers
            map={map.current as any}
            recommendations={recommendations}
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

      {/* Map info */}
      <div className="absolute bottom-4 right-4 bg-white/90 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-medium shadow-lg">
        🗺️ OpenStreetMap
      </div>
    </div>
  );
}
