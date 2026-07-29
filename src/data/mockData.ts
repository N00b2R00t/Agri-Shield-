import {
  Farm,
  UserProfile,
  WeatherSummary,
  Recommendation,
  CommunityReport,
  DiseaseRiskPrediction,
  MarketPrice,
  AlertNotification,
} from '../types';

export const INITIAL_USER: UserProfile = {
  id: 'usr-admin-ian',
  name: 'Ian Kipkoech Chirchir',
  email: 'iankipkoechchirchir06@gmail.com',
  phone: '0143791311',
  role: 'admin',
  country: 'Kenya',
  county: 'Uasin Gishu',
  organization: 'AgriShield AI Developer & Administration',
  primaryFocus: 'Mixed Agribusiness',
};

export const INITIAL_USERS: UserProfile[] = [
  INITIAL_USER,
  {
    id: 'usr-farmer-001',
    name: 'Samuel Kiprop',
    email: 'samuel.kiprop@agrishield.org',
    phone: '+254 712 345 678',
    role: 'farmer',
    country: 'Kenya',
    county: 'Uasin Gishu',
    organization: 'Eldoret Dairy & Crop Co-operative',
    primaryFocus: 'Mixed Agribusiness',
  },
  {
    id: 'usr-officer-002',
    name: 'Dr. Jane Chebet',
    email: 'jane.chebet@agri.go.ke',
    phone: '+254 722 987 654',
    role: 'extension_officer',
    country: 'Kenya',
    county: 'Nakuru',
    organization: 'Ministry of Agriculture Extension Dept',
    primaryFocus: 'Crops',
  },
  {
    id: 'usr-researcher-003',
    name: 'Prof. David Omondi',
    email: 'david.omondi@kalro.org',
    phone: '+254 733 112 233',
    role: 'ngo',
    country: 'Kenya',
    county: 'Uasin Gishu',
    organization: 'KALRO Climate Research Center',
    primaryFocus: 'Livestock',
  },
];

export const INITIAL_FARMS: Farm[] = [];

export const INITIAL_WEATHER: WeatherSummary = {
  currentTemp: 25.4,
  tempMin: 15.0,
  tempMax: 29.5,
  humidity: 76,
  rainfallMm: 14.2,
  rainfallProb: 65,
  windSpeedKmH: 14.0,
  uvIndex: 8,
  soilMoisturePercent: 62,
  rainRiskLevel: 'Medium',
  heatStressLevel: 'Moderate',
  livestockThi: 72.0,
  droughtProbability: 15,
  floodProbability: 40,
  frostRiskLevel: 'None',
  forecast: [
    { date: '2026-07-28', dayName: 'Today', tempMax: 29, tempMin: 15, precipitationMm: 14.2, precipitationProb: 65, humidity: 76, windSpeedKmH: 14, uvIndex: 8, condition: 'Scattered Rain & Mild Clouds', iconName: 'cloud-rain', livestockThi: 72 },
    { date: '2026-07-29', dayName: 'Wed', tempMax: 28, tempMin: 16, precipitationMm: 18.0, precipitationProb: 70, humidity: 80, windSpeedKmH: 12, uvIndex: 7, condition: 'Afternoon Showers', iconName: 'cloud-drizzle', livestockThi: 73 },
    { date: '2026-07-30', dayName: 'Thu', tempMax: 27, tempMin: 14, precipitationMm: 4.0, precipitationProb: 30, humidity: 65, windSpeedKmH: 10, uvIndex: 9, condition: 'Partly Cloudy', iconName: 'cloud-sun', livestockThi: 69 },
    { date: '2026-07-31', dayName: 'Fri', tempMax: 29, tempMin: 15, precipitationMm: 0.0, precipitationProb: 10, humidity: 55, windSpeedKmH: 10, uvIndex: 10, condition: 'Sunny & Clear', iconName: 'sun', livestockThi: 71 },
    { date: '2026-08-01', dayName: 'Sat', tempMax: 30, tempMin: 16, precipitationMm: 0.0, precipitationProb: 5, humidity: 50, windSpeedKmH: 9, uvIndex: 10, condition: 'Warm & Clear', iconName: 'sun', livestockThi: 74 },
    { date: '2026-08-02', dayName: 'Sun', tempMax: 28, tempMin: 15, precipitationMm: 2.0, precipitationProb: 20, humidity: 58, windSpeedKmH: 11, uvIndex: 8, condition: 'Mild Clouds', iconName: 'cloud', livestockThi: 70 },
    { date: '2026-08-03', dayName: 'Mon', tempMax: 27, tempMin: 14, precipitationMm: 10.0, precipitationProb: 50, humidity: 68, windSpeedKmH: 13, uvIndex: 7, condition: 'Light Rain', iconName: 'cloud-rain', livestockThi: 68 },
  ],
};

export const INITIAL_RECOMMENDATIONS: Recommendation[] = [];

export const INITIAL_REPORTS: CommunityReport[] = [];

export const INITIAL_DISEASE_PREDICTIONS: DiseaseRiskPrediction[] = [];

export const INITIAL_MARKET_PRICES: MarketPrice[] = [];

export const INITIAL_NOTIFICATIONS: AlertNotification[] = [];

