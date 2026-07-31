import React from 'react';
import {
  CloudRain,
  Thermometer,
  Droplets,
  Bug,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  MapPin,
  Calendar,
  Zap,
  ArrowUpRight,
  ShieldAlert,
  Wind,
} from 'lucide-react';
import { Farm, WeatherSummary, Recommendation } from '../types';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';

interface DashboardOverviewProps {
  farm: Farm | null;
  weather: WeatherSummary;
  recommendations: Recommendation[];
  onOpenAssistant: () => void;
  onOpenMap: () => void;
  onOpenWhatIf: () => void;
  onOpenReportModal: () => void;
  onOpenNewFarmModal?: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  farm,
  weather,
  recommendations,
  onOpenAssistant,
  onOpenMap,
  onOpenWhatIf,
  onOpenReportModal,
  onOpenNewFarmModal,
}) => {
  const safeWeather = weather || {
    county: 'Uasin Gishu',
    locationName: 'Eldoret Sector',
    currentTemp: 24,
    tempMin: 14,
    tempMax: 26,
    humidity: 65,
    windSpeedKmH: 12,
    rainfallMm: 12.5,
    rainfallProb: 35,
    rainRiskLevel: 'Moderate',
    droughtProbability: 15,
    floodProbability: 10,
    soilMoisturePercent: 68,
    cropPestRiskScore: 30,
    livestockThi: 72,
    forecast: [
      { dayName: 'Today', tempMax: 26, tempMin: 14, precipitationMm: 12.5, precipitationProb: 35 },
      { dayName: 'Tomorrow', tempMax: 25, tempMin: 13, precipitationMm: 8.0, precipitationProb: 25 },
      { dayName: 'Day 3', tempMax: 27, tempMin: 15, precipitationMm: 2.0, precipitationProb: 10 },
      { dayName: 'Day 4', tempMax: 28, tempMin: 15, precipitationMm: 0.0, precipitationProb: 5 },
      { dayName: 'Day 5', tempMax: 26, tempMin: 14, precipitationMm: 15.0, precipitationProb: 60 },
      { dayName: 'Day 6', tempMax: 24, tempMin: 13, precipitationMm: 20.0, precipitationProb: 75 },
      { dayName: 'Day 7', tempMax: 25, tempMin: 14, precipitationMm: 5.0, precipitationProb: 20 },
    ],
  };

  const pendingHighRecs = farm
    ? (recommendations || []).filter((r) => r && r.farmId === farm.id && r.status === 'pending' && r.priority === 'high')
    : [];

  // Prepare chart data from forecast
  const chartData = (safeWeather?.forecast || []).map((f) => ({
    name: f.dayName,
    RainfallMm: f.precipitationMm,
    RainProb: f.precipitationProb,
    TempMax: f.tempMax,
    TempMin: f.tempMin,
  }));

  return (
    <div className="space-y-6">
      
      {/* Top Welcome / Farm Context Banner */}
      {!farm ? (
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden space-y-4 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <ShieldAlert className="w-4 h-4" />
              <span>Regional Climate Radar Active</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-stone-100">
              No Registered Farm or Shamba
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Register your farm location to unlock personalized AI climate models, crop disease risk predictions, field livestock heat index alerts, and custom decision support.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            {onOpenNewFarmModal && (
              <button
                onClick={onOpenNewFarmModal}
                className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/60 transition-transform active:scale-95"
              >
                <span>+ Register New Farm</span>
              </button>
            )}
            <button
              onClick={onOpenAssistant}
              className="w-full sm:w-auto px-4 py-3 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 border border-stone-700"
            >
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Ask AI Assistant</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-emerald-950 rounded-2xl p-5 sm:p-6 text-stone-100 shadow-xl border border-stone-800 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                <span>Real-Time Climate Risk Intelligence</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {farm.name}
              </h1>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-stone-300">
                <span className="flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5 text-stone-400" />
                  <span>{farm.locationName}</span>
                </span>
                <span>•</span>
                <span className="font-semibold text-emerald-300">
                  {farm.category === 'livestock' ? 'Livestock Agribusiness' : farm.category === 'mixed' ? 'Mixed Crops & Livestock' : 'Crop Agribusiness'}
                </span>
                <span>•</span>
                <span>Crops: {farm.cropType} ({farm.growthStage})</span>
                {farm.livestockType && (
                  <>
                    <span>•</span>
                    <span className="text-amber-300 font-semibold">
                      Livestock: {farm.livestockType} ({farm.headCount || 12} Head)
                    </span>
                  </>
                )}
                <span>•</span>
                <span>{farm.areaHectares} Hectares</span>
                <span>•</span>
                <span>Soil: {farm.soilType}</span>
              </div>
            </div>

            {/* Action Triggers */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={onOpenAssistant}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-950/40 transition-transform active:scale-95"
              >
                <Sparkles className="w-4 h-4" />
                <span>Ask AI Farming Assistant</span>
              </button>
              <button
                onClick={onOpenWhatIf}
                className="px-3.5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs border border-stone-700 flex items-center space-x-1.5 transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                <span>What-If Simulator</span>
              </button>
              <button
                onClick={onOpenReportModal}
                className="px-3.5 py-2 rounded-xl bg-red-950/80 hover:bg-red-900 text-red-200 font-semibold text-xs border border-red-800/80 flex items-center space-x-1.5 transition-colors"
              >
                <Bug className="w-3.5 h-3.5 text-red-400" />
                <span>Report Outbreak</span>
              </button>
            </div>
          </div>

          {/* High Urgency Recommendation Alert Banner */}
          {pendingHighRecs.length > 0 && pendingHighRecs[0] && (
            <div className="mt-4 p-3 rounded-xl bg-red-950/90 border border-red-700/80 text-red-100 flex items-start sm:items-center justify-between gap-3 shadow-md">
              <div className="flex items-start space-x-2.5">
                <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5 sm:mt-0 animate-pulse" />
                <div>
                  <div className="font-bold text-xs text-red-200">
                    CRITICAL DECISION: {pendingHighRecs[0].title}
                  </div>
                  <div className="text-[11px] text-red-300 opacity-90 line-clamp-1">
                    {pendingHighRecs[0].summary}
                  </div>
                </div>
              </div>
              <span className="text-[10px] uppercase tracking-wider font-extrabold bg-red-800 px-2.5 py-1 rounded-md shrink-0">
                {pendingHighRecs[0].confidenceScore}% Confidence
              </span>
            </div>
          )}
        </div>
      )}

      {/* Climate & Risk Bento Cards (5 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Card 1: Today's Climate Risk Index */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Climate Risk Index
            </span>
            <div className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center font-bold text-xs">
              {farm ? `${farm.riskScore}%` : 'N/A'}
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-stone-900">{safeWeather?.rainRiskLevel || 'Moderate'}</span>
            <span className="text-xs text-stone-500 font-medium">Risk Exposure</span>
          </div>
          <div className="mt-2 w-full bg-stone-100 h-2 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                (farm?.riskScore ?? 50) > 70 ? 'bg-red-500' : (farm?.riskScore ?? 50) > 40 ? 'bg-amber-500' : 'bg-emerald-500'
              }`}
              style={{ width: `${farm?.riskScore ?? 0}%` }}
            />
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            Washout risk: <strong className="text-stone-800">{safeWeather?.floodProbability ?? 10}%</strong> | Pest risk high
          </p>
        </div>

        {/* Card 2: Crop & Livestock Health Score */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              {farm?.livestockType ? 'Farm & Livestock Health' : 'Crop Health'}
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-xs">
              {farm ? `${farm.cropHealthScore}%` : 'N/A'}
            </div>
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-emerald-800">
              {farm?.livestockHealthScore ? `${farm.livestockHealthScore}%` : 'Optimal'}
            </span>
            <span className="text-xs text-emerald-600 font-medium">Vigor Score</span>
          </div>
          <div className="mt-2 w-full bg-stone-100 h-2 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${farm?.cropHealthScore ?? 0}%` }}
            />
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            {farm ? `${farm.cropType} ${farm.livestockType ? `• ${farm.livestockType}` : ''}` : 'No Registered Farm'}
          </p>
        </div>

        {/* Card 3: Soil Moisture & Livestock THI Heat Stress */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              {farm?.livestockType ? 'THI Heat Index' : 'Soil Moisture'}
            </span>
            <Droplets className="w-5 h-5 text-blue-500" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-stone-900">
              {safeWeather?.livestockThi ? safeWeather.livestockThi : `${safeWeather?.soilMoisturePercent ?? 68}%`}
            </span>
            <span className="text-xs text-amber-600 font-medium">
              {safeWeather?.livestockThi && safeWeather.livestockThi > 72 ? 'Mild Heat Stress' : 'Moisture Saturation'}
            </span>
          </div>
          <div className="mt-2 w-full bg-stone-100 h-2 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${safeWeather?.soilMoisturePercent ?? 68}%` }}
            />
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            Soil: <strong className="text-stone-800">{safeWeather?.soilMoisturePercent ?? 68}%</strong> | Flood: <strong className="text-stone-800">{safeWeather?.floodProbability ?? 10}%</strong>
          </p>
        </div>

        {/* Card 4: Disease Exposure Probability */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Pest / Disease Risk
            </span>
            <Bug className="w-5 h-5 text-amber-500" />
          </div>
          <div className="mt-3 flex items-baseline space-x-2">
            <span className="text-2xl font-black text-amber-700">74%</span>
            <span className="text-xs text-amber-600 font-semibold">High Threat</span>
          </div>
          <div className="mt-2 w-full bg-stone-100 h-2 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-amber-500" style={{ width: '74%' }} />
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            Armyworm reported within <strong className="text-stone-800">2.1 km</strong>
          </p>
        </div>

        {/* Card 5: Market Opportunity */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Market Opportunity
            </span>
            <TrendingUp className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="mt-3 flex items-baseline space-x-1">
            <span className="text-2xl font-black text-emerald-700">+14.2%</span>
            <span className="text-xs text-stone-500 font-medium">Price Surge</span>
          </div>
          <p className="text-xs text-stone-700 font-semibold mt-1">
            Nakuru Wholesale Market
          </p>
          <p className="text-[11px] text-emerald-600 font-medium mt-1">
            High buyer demand for early harvest
          </p>
        </div>

      </div>

      {/* Main Charts & Weather Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Weather Forecast & Rain Chart (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
            <div>
              <h2 className="text-base font-bold text-stone-900 flex items-center space-x-2">
                <CloudRain className="w-5 h-5 text-blue-600" />
                <span>7-Day Rainfall & Temperature Outlook</span>
              </h2>
              <p className="text-xs text-stone-500">
                Data synced from Open-Meteo API • Local soil moisture simulation
              </p>
            </div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="flex items-center space-x-1 text-blue-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block" />
                <span>Rainfall (mm)</span>
              </span>
              <span className="flex items-center space-x-1 text-amber-600 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                <span>Max Temp (°C)</span>
              </span>
            </div>
          </div>

          {/* Recharts Composed Chart */}
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e7e5e4" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#78716c' }} />
                <YAxis yAxisId="left" orientation="left" stroke="#3b82f6" tick={{ fontSize: 11 }} />
                <YAxis yAxisId="right" orientation="right" stroke="#f59e0b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#1c1917', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar yAxisId="left" dataKey="RainfallMm" fill="#3b82f6" radius={[6, 6, 0, 0]} name="Rainfall (mm)" />
                <Line yAxisId="right" type="monotone" dataKey="TempMax" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} name="Max Temp (°C)" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* 7 Day Micro Card Row */}
          <div className="grid grid-cols-7 gap-1.5 pt-2 border-t border-stone-100">
            {(safeWeather?.forecast || []).map((f, i) => (
              <div
                key={i}
                className={`p-2 rounded-xl text-center border text-xs transition-colors ${
                  i === 0 ? 'bg-blue-50 border-blue-200 font-bold text-blue-900' : 'bg-stone-50 border-stone-150 text-stone-700'
                }`}
              >
                <div className="text-[10px] text-stone-500 font-medium">{f.dayName}</div>
                <div className="text-xs font-extrabold mt-1 text-stone-900">{f.tempMax}°</div>
                <div className="text-[10px] text-blue-600 font-bold mt-1">{f.precipitationMm}mm</div>
                <div className="text-[9px] text-stone-400 mt-0.5">{f.precipitationProb}% prob</div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Farm Environmental Summary Panel (1 col) */}
        <div className="bg-stone-900 text-stone-100 rounded-2xl p-5 border border-stone-800 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-800">
              <h3 className="text-sm font-bold text-stone-100 flex items-center space-x-2">
                <Thermometer className="w-4 h-4 text-emerald-400" />
                <span>Micro-Climate Conditions</span>
              </h3>
              <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 font-semibold border border-emerald-800">
                Live Sensor Feed
              </span>
            </div>

            <div className="space-y-3.5 mt-4 text-xs">
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-800/80 border border-stone-750">
                <span className="text-stone-400 flex items-center space-x-1.5">
                  <Thermometer className="w-4 h-4 text-amber-400" />
                  <span>Current Air Temp</span>
                </span>
                <span className="font-bold text-stone-100 text-sm">{safeWeather?.currentTemp ?? 24}°C</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-800/80 border border-stone-750">
                <span className="text-stone-400 flex items-center space-x-1.5">
                  <Droplets className="w-4 h-4 text-blue-400" />
                  <span>Relative Humidity</span>
                </span>
                <span className="font-bold text-stone-100 text-sm">{safeWeather?.humidity ?? 65}%</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-800/80 border border-stone-750">
                <span className="text-stone-400 flex items-center space-x-1.5">
                  <Wind className="w-4 h-4 text-teal-400" />
                  <span>Wind Speed / Direction</span>
                </span>
                <span className="font-bold text-stone-100 text-sm">{safeWeather?.windSpeedKmH ?? 12} km/h (NE)</span>
              </div>

              <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-800/80 border border-stone-750">
                <span className="text-stone-400 flex items-center space-x-1.5">
                  <CloudRain className="w-4 h-4 text-indigo-400" />
                  <span>24h Expected Rainfall</span>
                </span>
                <span className="font-bold text-blue-400 text-sm">{safeWeather?.rainfallMm ?? 12.5} mm</span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenMap}
            className="w-full py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-emerald-300 font-semibold text-xs flex items-center justify-center space-x-2 border border-stone-700 transition-colors"
          >
            <MapPin className="w-4 h-4 text-emerald-400" />
            <span>Open Interactive Farm GIS Map</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-stone-400" />
          </button>
        </div>

      </div>

    </div>
  );
};
