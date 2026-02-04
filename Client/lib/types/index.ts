// Core TypeScript types for CarbonCompass

export interface Recommendation {
  id: string;
  lat: number;
  lng: number;
  greenScore: number;
  businessFitScore?: number;
  rank: number;
  tier: string;
  explanation: string;
  name?: string;
  metrics?: LocationMetrics;
}

export interface LocationMetrics {
  nearestParkDistance: number;
  nearestTransitDistance: number;
  parksWithinRadius: number;
  transitWithinRadius: number;
  nearestPark?: {
    id: string;
    name: string;
    distance: number;
  };
  nearestTransit?: {
    id: string;
    name: string;
    distance: number;
  };
}

export interface ImpactData {
  impactScore: number;
  carbonReduction: number;
  transitUsageIncrease: number;
  greenSpaceAccess: number;
  wellbeingScore: number;
  projections: {
    monthly: {
      carbonReduction: string;
      transitUsageIncrease: string;
    };
    yearly: {
      carbonReduction: string;
      equivalentTrees: number;
    };
    fiveYear?: {
      carbonReduction: string;
      equivalentTrees: number;
    };
  };
}

export interface ChatMessage {
  id: string;
  message: string;
  type: 'user' | 'assistant';
  timestamp: string;
}

export interface BusinessType {
  id: string;
  name: string;
  icon: string;
  description: string;
  preferences?: {
    parkProximity: number;
    transitAccess: number;
    footTraffic: number;
    quietness: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    code: string;
  };
}

export interface ImpactResponse {
  success: boolean;
  impact?: ImpactData;
  error?: {
    message: string;
    code: string;
  };
}
