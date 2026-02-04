'use client';

import { useState } from 'react';
import mapboxgl from 'mapbox-gl';

interface MapControlsProps {
  onToggle3D: () => void;
  onReset: () => void;
  is3D: boolean;
}

export default function MapControls({ onToggle3D, onReset, is3D }: MapControlsProps) {
  return (
    <div className="absolute top-4 right-4 flex flex-col space-y-2">
      <button
        onClick={onToggle3D}
        className="bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow text-sm font-medium text-slate-700 hover:text-emerald-600"
      >
        {is3D ? '2D View' : '3D View'}
      </button>
      
      <button
        onClick={onReset}
        className="bg-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-shadow text-sm font-medium text-slate-700 hover:text-emerald-600"
      >
        Reset View
      </button>
    </div>
  );
}
