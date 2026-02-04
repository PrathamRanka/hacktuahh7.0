'use client';

import { useState } from 'react';
import Modal from '../ui/Modal';
import BuildingInfo from './BuildingInfo';
import BusinessFit from './BusinessFit';
import LeasingInfo from './LeasingInfo';
import ImpactSimulation from '../impact/ImpactSimulation';
import type { Recommendation } from '@/lib/types';

interface BuildingModalProps {
  building: Recommendation | null;
  onClose: () => void;
  businessType?: string;
}

export default function BuildingModal({ building, onClose, businessType }: BuildingModalProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'fit' | 'impact' | 'leasing'>('info');

  if (!building) return null;

  const tabs = [
    { id: 'info' as const, label: 'Overview', icon: '📊' },
    { id: 'fit' as const, label: 'Business Fit', icon: '🎯' },
    { id: 'impact' as const, label: 'Impact', icon: '🌍' },
    { id: 'leasing' as const, label: 'Leasing', icon: '🏢' },
  ];

  return (
    <Modal
      isOpen={!!building}
      onClose={onClose}
      title={`Building ${building.id} - Rank #${building.rank}`}
      size="xl"
    >
      <div className="flex flex-col md:flex-row">
        {/* 3D Preview Placeholder */}
        <div className="md:w-1/2 bg-gradient-to-br from-slate-100 to-slate-200 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="w-32 h-32 bg-white rounded-lg shadow-lg mx-auto mb-4 flex items-center justify-center">
              <svg className="w-16 h-16 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <p className="text-sm text-slate-600">3D Building Preview</p>
            <p className="text-xs text-slate-500 mt-1">Coming soon with model-viewer</p>
          </div>
        </div>

        {/* Content */}
        <div className="md:w-1/2">
          {/* Tabs */}
          <div className="border-b border-slate-200 px-6 pt-4">
            <div className="flex space-x-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-white text-emerald-600 border-b-2 border-emerald-600'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <span className="mr-1">{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {activeTab === 'info' && <BuildingInfo building={building} />}
            {activeTab === 'fit' && (
              <BusinessFit
                businessFitScore={building.businessFitScore}
                businessType={businessType}
              />
            )}
            {activeTab === 'impact' && (
              <ImpactSimulation
                lat={building.lat}
                lng={building.lng}
                businessType={businessType}
              />
            )}
            {activeTab === 'leasing' && <LeasingInfo />}
          </div>
        </div>
      </div>
    </Modal>
  );
}
