export type UserRole = 'farmer' | 'extension_officer' | 'ngo' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  country: string;
  county: string;
  subCounty?: string;
  ward?: string;
  organization?: string;
  primaryFocus?: 'Crops' | 'Livestock' | 'Mixed Agribusiness';
  primaryCrop?: string;
  primaryLivestock?: string;
  password?: string;
  passwordUpdatedAt?: string;
  deviceId?: string;
  sessionExpiresAt?: number;
}

export type AssetCategory = 'crop' | 'livestock' | 'mixed';

export type CropType =
  | 'Maize'
  | 'Sorghum'
  | 'Tomatoes'
  | 'Beans'
  | 'Coffee'
  | 'Wheat'
  | 'Rice'
  | 'Cassava'
  | 'Napier / Pasture Forage';

export type LivestockType =
  | 'Dairy Cattle (Friesian/Ayrshire)'
  | 'Beef Cattle (Boran/Zebu)'
  | 'Goats & Sheep (Dorper/Galla)'
  | 'Poultry (Kienyeji / Layers)'
  | 'Apiculture (Honeybees)'
  | 'Aquaculture (Tilapia/Catfish)';

export type SoilType = 'Loam' | 'Clay' | 'Sandy' | 'Silt' | 'Volcanic' | 'Pasture Rangeland';
export type GrowthStage =
  | 'Land Prep'
  | 'Vegetative / Early Growth'
  | 'Flowering / Tasseling'
  | 'Maturation'
  | 'Ready to Harvest'
  | 'Lactation / Milking'
  | 'Breeding / Calving'
  | 'Grazing & Growth'
  | 'Egg Laying Cycle';

export type IrrigationMethod =
  | 'Rainfed'
  | 'Drip Irrigation'
  | 'Furrow / Flood'
  | 'Sprinkler'
  | 'Manual Watering'
  | 'Borehole / Livestock Trough';

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
  category: AssetCategory;
  cropType: CropType;
  livestockType?: LivestockType;
  headCount?: number; // E.g., 24 Dairy Cows or 350 Poultry
  plantingDate: string;
  growthStage: GrowthStage;
  irrigationMethod: IrrigationMethod;
  soilType: SoilType;
  boundaryCoordinates?: [number, number][];
  riskScore: number; // 0 - 100
  cropHealthScore: number; // 0 - 100
  livestockHealthScore?: number; // 0 - 100
  thiIndex?: number; // Temperature Humidity Index (THI > 72 indicates heat stress)
  waterRequirementLitersPerDay?: number;
  forageAvailabilityPercent?: number;
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
  livestockThi?: number; // Temperature Humidity Index forecast
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
  livestockThi: number; // Current THI for livestock
  droughtProbability: number; // %
  floodProbability: number; // %
  frostRiskLevel: 'None' | 'Low' | 'Moderate' | 'High';
  forecast: DayForecast[];
}

export type RecommendationType =
  | 'irrigation'
  | 'planting'
  | 'harvest'
  | 'pest_control'
  | 'fertilizer'
  | 'crop_switch'
  | 'livestock_shelter'
  | 'fodder_preservation'
  | 'vaccination'
  | 'pasture_rotation'
  | 'water_management';

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
  potentialImpact: string; // e.g., "+18% Milk Output & -25% Thermal Shock Risk"
  suggestedActionSteps: string[];
  status: 'pending' | 'accepted' | 'dismissed' | 'completed';
  createdAt: string;
  assetCategory?: AssetCategory;
}

export type ReportSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ReportType =
  | 'pest'
  | 'disease'
  | 'flood'
  | 'drought'
  | 'water_shortage'
  | 'erosion'
  | 'livestock_disease'
  | 'pasture_depletion';

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
  cropTarget: string; // E.g., "Maize & Sorghum" or "Dairy Cattle & Goats"
  category: AssetCategory;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  riskScore: number; // 0 - 100
  spreadVector: string;
  triggerFactors: string[];
  mitigationStrategy: string;
  predictedArea: string;
  outbreakProbabilityNext7Days: number; // %
}

export interface WhatIfInput {
  simulationType: 'crop' | 'livestock';
  cropType: CropType;
  livestockType?: LivestockType;
  headCount?: number;
  shadeAccess?: boolean;
  fodderReserveDays?: number;
  waterSupplyPercent?: number;
  plantingDateOffsetDays: number; // -14 to +14
  irrigationLevelPercent: number; // 0 to 200%
  fertilizerKgPerHa: number;
  expectedWeatherScenario: 'normal' | 'moderate_drought' | 'severe_drought' | 'heavy_flooding' | 'heatwave';
}

export interface WhatIfOutput {
  expectedYieldTonsPerHa?: number;
  milkProductionLitersDay?: number;
  livestockHeatStressRisk?: 'Low' | 'Moderate' | 'High' | 'Severe';
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
  itemCategory: 'crop' | 'livestock' | 'dairy_poultry';
  itemName: string; // e.g., "Maize", "Fresh Milk", "Dorper Goat", "Kienyeji Eggs"
  cropName?: CropType;
  marketName: string;
  distanceKm: number;
  pricePerUnit: number; // USD or local currency equivalent
  unit: string; // "90kg Bag", "Liter", "Head", "Tray"
  pricePerKg?: number; // legacy backwards compatibility
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
  type: 'flood' | 'heatwave' | 'pest' | 'disease' | 'weather_warning' | 'harvest_reminder' | 'livestock_health';
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
