// Business type definitions and metadata

export interface BusinessType {
  id: string;
  name: string;
  icon: string;
  description: string;
  color: string;
}

export const BUSINESS_TYPES: BusinessType[] = [
  {
    id: 'eco_cafe',
    name: 'Eco-Friendly Café',
    icon: '☕',
    description: 'Sustainable café with focus on park views and customer accessibility',
    color: 'from-amber-500 to-orange-500',
  },
  {
    id: 'green_office',
    name: 'Green Office Space',
    icon: '🏢',
    description: 'Environmentally conscious office with excellent transit access',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    id: 'sustainable_retail',
    name: 'Sustainable Retail',
    icon: '🛍️',
    description: 'Eco-friendly retail store in high-traffic sustainable areas',
    color: 'from-purple-500 to-pink-500',
  },
  {
    id: 'wellness_center',
    name: 'Wellness Center',
    icon: '🧘',
    description: 'Health and wellness facility near green spaces',
    color: 'from-green-500 to-emerald-500',
  },
  {
    id: 'coworking_space',
    name: 'Co-working Space',
    icon: '💼',
    description: 'Collaborative workspace with diverse transit options',
    color: 'from-indigo-500 to-violet-500',
  },
];

export const getBusinessTypeById = (id: string): BusinessType | undefined => {
  return BUSINESS_TYPES.find((type) => type.id === id);
};
