'use client';

import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import type { Recommendation } from '@/lib/types';
import { MAPBOX_CONFIG, getMarkerColor } from './map.config';
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
  const map = useRef<mapboxgl.Map | null>(null);
  const [is3D, setIs3D] = useState(true);

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

    map.current.on('load', () => {
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

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {map.current && (
        <>
          <BuildingMarkers
            map={map.current}
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
    </div>
  );
}
