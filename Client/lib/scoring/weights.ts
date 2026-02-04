// Scoring weights configuration

export const SCORING_WEIGHTS = {
  parkProximity: 0.30,      // 30% - Access to green spaces
  transitProximity: 0.25,   // 25% - Public transit access
  roadProximity: 0.15,      // 15% - Road accessibility
  parkCount: 0.20,          // 20% - Number of nearby parks
  transitCount: 0.10,       // 10% - Number of transit options
};

export const BUSINESS_TYPE_PREFERENCES = {
  eco_cafe: {
    parkProximity: 0.40,
    transitProximity: 0.20,
    roadProximity: 0.10,
    parkCount: 0.20,
    transitCount: 0.10,
  },
  green_office: {
    parkProximity: 0.20,
    transitProximity: 0.35,
    roadProximity: 0.15,
    parkCount: 0.15,
    transitCount: 0.15,
  },
  sustainable_retail: {
    parkProximity: 0.15,
    transitProximity: 0.30,
    roadProximity: 0.25,
    parkCount: 0.15,
    transitCount: 0.15,
  },
  wellness_center: {
    parkProximity: 0.45,
    transitProximity: 0.20,
    roadProximity: 0.10,
    parkCount: 0.20,
    transitCount: 0.05,
  },
  coworking_space: {
    parkProximity: 0.20,
    transitProximity: 0.30,
    roadProximity: 0.20,
    parkCount: 0.15,
    transitCount: 0.15,
  },
};
