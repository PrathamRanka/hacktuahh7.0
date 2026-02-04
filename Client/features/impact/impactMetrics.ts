// Impact metrics type definitions

export interface ImpactMetric {
  id: string;
  label: string;
  value: number;
  unit: string;
  icon: string;
  color: string;
  description: string;
}

export const IMPACT_METRICS: ImpactMetric[] = [
  {
    id: 'carbon',
    label: 'Carbon Reduction',
    value: 0,
    unit: 'kg CO₂/month',
    icon: '🌍',
    color: 'emerald',
    description: 'Estimated monthly carbon emissions reduced',
  },
  {
    id: 'transit',
    label: 'Transit Usage',
    value: 0,
    unit: '%',
    icon: '🚌',
    color: 'blue',
    description: 'Increase in public transit usage',
  },
  {
    id: 'greenspace',
    label: 'Green Space Access',
    value: 0,
    unit: '%',
    icon: '🌳',
    color: 'green',
    description: 'Access to parks and green areas',
  },
  {
    id: 'wellbeing',
    label: 'Wellbeing Score',
    value: 0,
    unit: '/100',
    icon: '💚',
    color: 'teal',
    description: 'Overall environmental wellbeing',
  },
];
