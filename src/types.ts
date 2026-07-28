export type UserRole = 'farmer' | 'extension_officer' | 'ngo' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  country: string;
  county: string;
  organization?: string;
}

export type CropType = 'Maize' | 'Sorghum' | 'Tomatoes' | 'Beans' | 'Coffee' | 'Wheat' | 'Rice' | 'Cassava';
export type SoilType = 'Loam' | 'Clay' | 'Sandy' | 'Silt' | 'Volcanic';
export type GrowthStage = 'Land Prep' | 'Vegetative / Early Growth' | 'Flowering / Tasseling' | 'Maturation' | 'Ready to Harvest';
export type IrrigationMethod = 'Rainfed' | 'Drip Irrigation' | 'Furrow / Flood' | 'Sprinkler' | 'Manual Watering';

export interface Farm {
  id: string;
  userId: string;
  name: string;
  locationName: string;
  country: string;
  county: string;
  lat: number;
  lng: number;
  areaHectares: number;
  cropType: CropType;
  plantingDate: string;
  growthStage: GrowthStage;
  irrigationMethod: IrrigationMethod;
  soilType: SoilType;
  boundaryCoordinates: [number, number][];
  riskScore: number; // 0 - 100
  cropHealthScore: number; // 0 - 100
}

export interface DayForecast {
  date: string;
  dayName: string;
  tempMax: number;
  tempMin: number;
  precipitationMm: number;
  precipitationProb: number;
  humidity: number;
  windSpeedKmH: number;
  uvIndex: number;
  condition: string;
  iconName: string;
}

export interface WeatherSummary {
  currentTemp: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  rainfallMm: number;
  rainfallProb: number;
  windSpeedKmH: number;
  uvIndex: number;
  soilMoisturePercent: number;
  rainRiskLevel: 'Low' | 'Medium' | 'High' | 'Severe';
  heatStressLevel: 'Low' | 'Moderate' | 'High' | 'Extreme';
  droughtProbability: number; // %
  floodProbability: number; // %
  frostRiskLevel: 'None' | 'Low' | 'Moderate' | 'High';
  forecast: DayForecast[];
}

export type RecommendationType = 'irrigation' | 'planting' | 'harvest' | 'pest_control' | 'fertilizer' | 'crop_switch';
export type PriorityLevel = 'high' | 'medium' | 'low';

export interface Recommendation {
  id: string;
  farmId: string;
  title: string;
  actionType: RecommendationType;
  priority: PriorityLevel;
  summary: string;
  reason: string;
  confidenceScore: number; // percentage, e.g. 92
  supportingData: string[];
  potentialImpact: string; // e.g., "+18% Germination Rate & -25% Washout Risk"
  suggestedActionSteps: string[];
  status: 'pending' | 'accepted' | 'dismissed' | 'completed';
  createdAt: string;
}

export type ReportSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ReportType = 'pest' | 'disease' | 'flood' | 'drought' | 'water_shortage' | 'erosion' | 'livestock';

export interface CommunityReport {
  id: string;
  userId: string;
  userName: string;
  farmName: string;
  reportType: ReportType;
  cropAffected: string;
  severity: ReportSeverity;
  description: string;
  photoUrl?: string;
  lat: number;
  lng: number;
  createdAt: string;
  verified: boolean;
  upvotes: number;
  distanceKm?: number;
}

export interface DiseaseRiskPrediction {
  id: string;
  diseaseName: string;
  pestName?: string;
  cropTarget: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  riskScore: number; // 0 - 100
  spreadVector: string;
  triggerFactors: string[];
  mitigationStrategy: string;
  predictedArea: string;
  outbreakProbabilityNext7Days: number; // %
}

export interface WhatIfInput {
  cropType: CropType;
  plantingDateOffsetDays: number; // -14 to +14
  irrigationLevelPercent: number; // 0 to 200%
  fertilizerKgPerHa: number;
  expectedWeatherScenario: 'normal' | 'moderate_drought' | 'severe_drought' | 'heavy_flooding' | 'heatwave';
}

export interface WhatIfOutput {
  expectedYieldTonsPerHa: number;
  yieldChangePercent: number;
  diseaseRiskPercent: number;
  profitEstimateUSD: number;
  profitChangeUSD: number;
  waterUsageLiters: number;
  carbonFootprintKgCo2: number;
  aiExplanation: string;
  keyRecommendations: string[];
}

export interface MarketPrice {
  id: string;
  cropName: CropType;
  marketName: string;
  distanceKm: number;
  pricePerKg: number; // USD or local currency equivalent
  currency: string;
  priceChangePercent: number;
  trend: 'up' | 'down' | 'stable';
  advice: string;
  region: string;
  lastUpdated: string;
}

export interface AlertNotification {
  id: string;
  farmId?: string;
  title: string;
  type: 'flood' | 'heatwave' | 'pest' | 'disease' | 'weather_warning' | 'harvest_reminder';
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
  quickActions?: string[];
}
