'use client';

import ProgressBar from '../ui/ProgressBar';

interface ImpactRowProps {
  icon: string;
  label: string;
  value: number;
  unit: string;
  color: 'emerald' | 'blue' | 'yellow' | 'red';
  description?: string;
}

export default function ImpactRow({ icon, label, value, unit, color, description }: ImpactRowProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl">{icon}</span>
          <div>
            <h4 className="font-medium text-slate-900">{label}</h4>
            {description && <p className="text-xs text-slate-500">{description}</p>}
          </div>
        </div>
        <span className="text-lg font-bold text-slate-900">
          {value}
          <span className="text-sm text-slate-500 ml-1">{unit}</span>
        </span>
      </div>
      <ProgressBar value={value} max={100} color={color} size="md" />
    </div>
  );
}
