'use client';

import { useState } from 'react';
import mapboxgl from 'mapbox-gl';

interface MapControlsProps {
  map: mapboxgl.Map;
}

export default function MapControls({ map }: MapControlsProps) {
  const [is3D, setIs3D] = useState(true);

  const toggle3D = () => {
    const newPitch = is3D ? 0 : 60;
    map.easeTo({ pitch: newPitch, duration: 1000 });
    setIs3D(!is3D);
  };

  const resetView = () => {
    map.flyTo({
      center: [76.3869, 30.3398],
      zoom: 13,
      pitch: 60,
      bearing: 0,
      duration: 1500,
    });
  };

  return (
    <div className="absolute bottom-6 left-6 flex flex-col space-y-2">
      <button
        onClick={toggle3D}
        className="bg-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-sm font-medium text-slate-700 hover:text-slate-900"
      >
        {is3D ? '2D View' : '3D View'}
      </button>
      
      <button
        onClick={resetView}
        className="bg-white px-4 py-2 rounded-lg shadow-lg hover:shadow-xl transition-shadow text-sm font-medium text-slate-700 hover:text-slate-900"
      >
        Reset View
      </button>
    </div>
  );
}
