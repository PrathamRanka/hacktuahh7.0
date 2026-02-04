'use client';

import { useEffect, useState } from 'react';
import ImpactRow from './ImpactRow';
import Card from '../ui/Card';
import type { ImpactData } from '@/lib/types';
import { apiClient } from '@/lib/api/client';

interface ImpactSimulationProps {
  lat: number;
  lng: number;
  businessType?: string;
}

export default function ImpactSimulation({ lat, lng, businessType }: ImpactSimulationProps) {
  const [impact, setImpact] = useState<ImpactData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchImpact = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.calculateImpact(lat, lng, businessType);
        if (response.success && response.impact) {
          setImpact(response.impact);
        }
      } catch (error) {
        console.error('Failed to fetch impact:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImpact();
  }, [lat, lng, businessType]);

  if (isLoading) {
    return (
      <Card>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-slate-600">Calculating impact...</p>
          </div>
        </div>
      </Card>
    );
  }

  if (!impact) {
    return (
      <Card>
        <p className="text-center text-slate-500 py-8">No impact data available</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <h3 className="text-lg font-semibold text-slate-900 mb-4">Environmental Impact</h3>
        <div className="space-y-4">
          <ImpactRow
            icon="🌍"
            label="Carbon Reduction"
            value={impact.carbonReduction}
            unit="kg CO₂/mo"
            color="emerald"
            description="Monthly carbon emissions reduced"
          />
          <ImpactRow
            icon="🚌"
            label="Transit Usage"
            value={impact.transitUsageIncrease}
            unit="%"
            color="blue"
            description="Increase in public transit usage"
          />
          <ImpactRow
            icon="🌳"
            label="Green Space Access"
            value={impact.greenSpaceAccess}
            unit="%"
            color="emerald"
            description="Access to parks and green areas"
          />
          <ImpactRow
            icon="💚"
            label="Wellbeing Score"
            value={impact.wellbeingScore}
            unit="/100"
            color="emerald"
            description="Overall environmental wellbeing"
          />
        </div>
      </Card>

      {impact.projections && (
        <Card>
          <h3 className="text-lg font-semibold text-slate-900 mb-4">Projections</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-emerald-50 rounded-lg p-4">
              <p className="text-sm text-emerald-600 font-medium mb-1">Yearly Impact</p>
              <p className="text-2xl font-bold text-emerald-900">
                {impact.projections.yearly.carbonReduction} kg
              </p>
              <p className="text-xs text-emerald-600 mt-1">
                ≈ {impact.projections.yearly.equivalentTrees} trees
              </p>
            </div>
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-600 font-medium mb-1">Monthly Impact</p>
              <p className="text-2xl font-bold text-blue-900">
                {impact.projections.monthly.carbonReduction} kg
              </p>
              <p className="text-xs text-blue-600 mt-1">
                {impact.projections.monthly.transitUsageIncrease} transit
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
