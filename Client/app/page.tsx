'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import BusinessSelector from '@/features/business-select/BusinessSelector';
import RecommendationList from '@/features/recommendations/RecommendationList';
import ChatPanel from '@/features/chat/ChatPanel';
import BuildingModal from '@/features/building-details/BuildingModal';
import type { Recommendation } from '@/lib/types';

// Dynamically import map to avoid SSR issues with Mapbox
const MapView = dynamic(() => import('@/features/map/MapView'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-100">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-600">Loading 3D Map...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const [selectedBusinessType, setSelectedBusinessType] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<Recommendation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBusinessSelect = async (businessTypeId: string) => {
    setSelectedBusinessType(businessTypeId);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ businessType: businessTypeId, limit: 10 }),
      });

      const data = await response.json();
      
      if (data.success) {
        setRecommendations(data.recommendations || []);
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBuildingSelect = (building: Recommendation) => {
    setSelectedBuilding(building);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="h-[calc(100vh-8rem)] flex">
      {/* Left Sidebar - Business Selection */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Select Business Type
          </h2>
          <p className="text-sm text-slate-600">
            Choose your business category to find sustainable locations
          </p>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4">
          <BusinessSelector
            onSelect={handleBusinessSelect}
            selected={selectedBusinessType}
          />
        </div>
      </div>

      {/* Center - 3D Map */}
      <div className="flex-1 relative">
        <MapView
          recommendations={recommendations}
          onBuildingSelect={handleBuildingSelect}
          selectedBuilding={selectedBuilding}
        />
        
        {isLoading && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-slate-700">Finding locations...</span>
            </div>
          </div>
        )}
      </div>

      {/* Right Sidebar - Recommendations & Chat */}
      <div className="w-96 bg-white border-l border-slate-200 flex flex-col">
        {/* Recommendations */}
        <div className="flex-1 overflow-y-auto border-b border-slate-200">
          <div className="p-6 border-b border-slate-200 bg-slate-50">
            <h2 className="text-lg font-semibold text-slate-900">
              Recommendations
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              {recommendations.length > 0
                ? `${recommendations.length} sustainable locations found`
                : 'Select a business type to see recommendations'}
            </p>
          </div>
          
          <RecommendationList
            recommendations={recommendations}
            onSelect={handleBuildingSelect}
            selectedId={selectedBuilding?.id}
          />
        </div>

        {/* Chat Panel */}
        <div className="h-96">
          <ChatPanel
            businessType={selectedBusinessType}
            selectedBuilding={selectedBuilding}
          />
        </div>
      </div>

      {/* Building Details Modal */}
      <BuildingModal
        building={isModalOpen ? selectedBuilding : null}
        onClose={handleCloseModal}
        businessType={selectedBusinessType || undefined}
      />
    </div>
  );
}
