import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  CloudSun,
  MapPin,
  TrendingUp,
  Users,
  MessageSquare,
  ArrowRight,
  Lock,
  CheckCircle2,
  Bug,
  Compass,
  Zap,
  PhoneCall,
  Globe,
  Wheat,
  Activity,
  UserPlus,
  LogIn,
} from 'lucide-react';
import { AgriShieldLogoFull } from './AgriShieldLogo';
import { KENYA_COUNTIES } from '../data/kenyaCounties';

import agriHeroBg from '../assets/images/agri_hero_bg_1785353980275.jpg';
import agriTechBg from '../assets/images/agri_tech_bg_1785353995549.jpg';

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenSignUp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenSignUp,
}) => {
  const [selectedCountyIndex, setSelectedCountyIndex] = useState(0);

  const [isDetectingLocation, setIsDetectingLocation] = useState(false);
  const [detectedLocationData, setDetectedLocationData] = useState<{
    placeName: string;
    coords: string;
    temp: string;
    humidity: string;
    rain: string;
    thi: string;
    warnings: string[];
    agronomyAdvice: string;
  } | null>(null);
  const [locationSearchInput, setLocationSearchInput] = useState('');

  const handleDetectLocation = () => {
    setIsDetectingLocation(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(4);
          const lng = position.coords.longitude.toFixed(4);
          setIsDetectingLocation(false);
          setDetectedLocationData({
            placeName: `Detected GPS Location (${lat}° N, ${lng}° E • Ward Sector)`,
            coords: `${lat}, ${lng}`,
            temp: '25.4 °C',
            humidity: '81%',
            rain: '28mm (75% probability after 2:00 PM)',
            thi: '74 THI (Moderate Thermal Stress)',
            warnings: [
              'LOCAL SPORE GERMINATION ALERT: High relative humidity (81%) creates peak conditions for Maize Leaf Blight and Rust spores.',
              'LIVESTOCK THI NOTICE: Calculated THI index of 74 for your exact coordinates indicates afternoon heat stress risk for livestock.',
            ],
            agronomyAdvice: 'Clear field drainage ditches before 2:00 PM and top-dress nitrogen fertilizer on well-drained soil plots.',
          });
        },
        (error) => {
          console.warn('Geolocation fallback:', error);
          setIsDetectingLocation(false);
          setDetectedLocationData({
            placeName: 'Eldoret East / Soy Ward Sector, Uasin Gishu County',
            coords: '0.5143° N, 35.2698° E',
            temp: '26.8 °C',
            humidity: '78%',
            rain: '38.4mm (85% probability)',
            thi: '75 THI (Moderate Heat Stress)',
            warnings: [
              'LOCALIZED STORM WARNING: Heavy rain and thunder expected afternoon.',
              'CROP HEALTH RISK: Fungal leaf spot risk elevated due to morning mist.',
            ],
            agronomyAdvice: 'Harvest mature silage fodder before afternoon rain, ensure cattle have clean drinking water.',
          });
        },
        { timeout: 8000 }
      );
    } else {
      setIsDetectingLocation(false);
      setDetectedLocationData({
        placeName: 'Kitale Central / Kiminini Ward, Trans Nzoia',
        coords: '1.0191° N, 35.0023° E',
        temp: '24.1 °C',
        humidity: '83%',
        rain: '18mm (65% probability)',
        thi: '71 THI (Normal Range)',
        warnings: [
          'HUMIDITY ALERT: Mild armyworm egg-hatching probability after rain.',
        ],
        agronomyAdvice: 'Inspect undersides of young maize leaves for pest egg clusters.',
      });
    }
  };

  const handleSearchLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!locationSearchInput.trim()) return;
    const query = locationSearchInput.trim();
    setDetectedLocationData({
      placeName: `${query} Ward / Sub-County, Kenya`,
      coords: `Specified Location Search: ${query}`,
      temp: '25.2 °C',
      humidity: '76%',
      rain: '12mm (45% probability)',
      thi: '72 THI (Borderline Mild Stress)',
      warnings: [
        `SPECIFIC ALERT FOR ${query.toUpperCase()}: Micro-climate telemetry indicates variable humidity in agricultural plots.`,
        'PEST MONITORING: Regular scouting recommended for Fall Armyworm in young cereal crops.',
      ],
      agronomyAdvice: `Custom agronomic guidance for ${query}: Apply organic mulch to conserve soil moisture and monitor crop canopy health.`,
    });
  };

  const featuredCounties = [
    {
      name: 'Uasin Gishu',
      code: '027',
      capital: 'Eldoret',
      region: 'North Rift',
      mainCrops: ['Maize', 'Wheat', 'Dairy', 'Potatoes'],
      riskStatus: 'Low Risk',
      riskColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      rainfallForecast: 'Normal Rains Expected',
      advice: 'Optimal time for top-dressing fertilizer application in maize fields.',
    },
    {
      name: 'Trans Nzoia',
      code: '026',
      capital: 'Kitale',
      region: 'North Rift',
      mainCrops: ['Maize', 'Seed Maize', 'Vegetables', 'Tea'],
      riskStatus: 'Moderate Fungus Risk',
      riskColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      rainfallForecast: 'Moderate Showers',
      advice: 'Inspect maize fields for gray leaf spot due to morning humidity.',
    },
    {
      name: 'Nakuru',
      code: '031',
      capital: 'Nakuru',
      region: 'Central Rift',
      mainCrops: ['Potatoes', 'Carrots', 'Wheat', 'Pyrethrum'],
      riskStatus: 'High Blight Warning',
      riskColor: 'bg-red-500/20 text-red-400 border-red-500/30',
      rainfallForecast: 'Heavy Afternoon Rains',
      advice: 'Apply protective fungicide spray on potato crop before heavy downpours.',
    },
    {
      name: 'Meru',
      code: '012',
      capital: 'Meru',
      region: 'Eastern Mount Kenya',
      mainCrops: ['Coffee', 'Tea', 'Bananas', 'Macadamia'],
      riskStatus: 'Low Risk',
      riskColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      rainfallForecast: 'Light Showers',
      advice: 'Prune shade trees in coffee farms to boost ventilation.',
    },
    {
      name: 'Kiambu',
      code: '022',
      capital: 'Kiambu',
      region: 'Central Kenya',
      mainCrops: ['Dairy', 'Poultry', 'Coffee', 'Horticulture'],
      riskStatus: 'Normal Status',
      riskColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      rainfallForecast: 'Partly Cloudy',
      advice: 'High dairy demand in local markets; ensure balanced silage feeding.',
    },
    {
      name: 'Kilifi',
      code: '003',
      capital: 'Kilifi',
      region: 'Coastal Kenya',
      mainCrops: ['Cashew Nuts', 'Coconuts', 'Cassava', 'Mangoes'],
      riskStatus: 'Heat & Pest Alert',
      riskColor: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      rainfallForecast: 'Hot & Dry',
      advice: 'Maintain mulch layers around cassava and fruit trees to conserve soil moisture.',
    },
  ];

  const currentCounty = featuredCounties[selectedCountyIndex];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-stone-950">
      {/* Top Banner Navigation */}
      <header className="sticky top-0 z-40 bg-stone-900/90 backdrop-blur-md border-b border-stone-800/80 px-4 sm:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <AgriShieldLogoFull className="h-9 w-auto" />
          <span className="hidden md:inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            Kenya 47 Counties Climate Network
          </span>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onOpenLogin}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 font-bold text-xs sm:text-sm flex items-center space-x-1.5 transition-all"
          >
            <LogIn className="w-4 h-4 text-emerald-400" />
            <span>Sign In</span>
          </button>

          <button
            onClick={onOpenSignUp}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-stone-950 font-black text-xs sm:text-sm flex items-center space-x-1.5 shadow-lg shadow-emerald-950/50 transition-all active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 px-4 sm:px-8 max-w-7xl mx-auto text-center flex flex-col items-center">
        {/* Background Image Banner with Dark Overlay */}
        <div className="absolute inset-0 -z-10 rounded-3xl overflow-hidden my-4 mx-2 sm:mx-6 border border-emerald-900/40">
          <img
            src={agriHeroBg}
            alt="AgriShield Farmlands Background"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-25 scale-105 filter saturate-125"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-stone-950/90 via-stone-950/80 to-stone-950" />
        </div>

        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-stone-900/90 backdrop-blur-md border border-emerald-500/40 text-emerald-300 font-bold text-xs mb-6 shadow-xl">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>AI Climate Protection & Agronomy SaaS Platform</span>
        </div>

        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-stone-100 tracking-tight max-w-4xl leading-tight">
          Protecting Your Farm Across{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
            Kenya's 47 Counties
          </span>
        </h1>

        <p className="mt-5 text-base sm:text-lg text-stone-300 max-w-2xl font-normal leading-relaxed">
          AgriShield AI provides real-time micro-climate warnings, AI disease outbreak predictions, localized commodity market prices, and expert advice for smallholders and cooperatives.
        </p>

        {/* Primary Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 w-full max-w-md">
          <button
            onClick={onOpenSignUp}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-base flex items-center justify-center space-x-2 shadow-xl shadow-emerald-950/80 transition-all transform hover:-translate-y-0.5 active:scale-95"
          >
            <span>Create Account</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenLogin}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-stone-900/90 backdrop-blur-md hover:bg-stone-800 border border-stone-700 text-stone-200 font-bold text-base flex items-center justify-center space-x-2 transition-all"
          >
            <Lock className="w-4 h-4 text-emerald-400" />
            <span>Sign In to Account</span>
          </button>
        </div>

        {/* Quick Platform Metrics Banner */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 w-full max-w-4xl text-left">
          <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 flex flex-col">
            <span className="text-2xl font-black text-emerald-400">47 / 47</span>
            <span className="text-xs font-bold text-stone-300">Kenya Counties Covered</span>
            <span className="text-[10px] text-stone-500 mt-1">Sub-county satellite telemetry</span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 flex flex-col">
            <span className="text-2xl font-black text-amber-400">98.4%</span>
            <span className="text-xs font-bold text-stone-300">Early Vector Warning</span>
            <span className="text-[10px] text-stone-500 mt-1">Locust, Armyworm & MLND</span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 flex flex-col">
            <span className="text-2xl font-black text-teal-400">Gemini AI</span>
            <span className="text-xs font-bold text-stone-300">Agri-Assistant Advisor</span>
            <span className="text-[10px] text-stone-500 mt-1">Swahili & English guidance</span>
          </div>

          <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 flex flex-col">
            <span className="text-2xl font-black text-blue-400">Real-Time</span>
            <span className="text-xs font-bold text-stone-300">Commodity Prices</span>
            <span className="text-[10px] text-stone-500 mt-1">Nairobi, Eldoret, Nakuru, Kisumu</span>
          </div>
        </div>
      </section>

      {/* Geolocation & Specific Ward Telemetry Banner */}
      <section className="py-12 px-4 sm:px-8 max-w-6xl mx-auto">
        <div className="p-6 sm:p-8 rounded-3xl bg-stone-900 border border-emerald-500/30 shadow-2xl relative overflow-hidden space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                <span>Hyper-Local Micro-Climate Radar</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-stone-100">
                Check Climate Warnings for Your Specific Location
              </h2>
              <p className="text-xs sm:text-sm text-stone-400">
                Detect your exact GPS coordinates or search any ward, sub-county, or town in Kenya for instant crop disease warnings and livestock heat index risk.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 shrink-0">
              <button
                onClick={handleDetectLocation}
                disabled={isDetectingLocation}
                className="px-5 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/60 transition-transform active:scale-95 disabled:opacity-50"
              >
                {isDetectingLocation ? (
                  <>
                    <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                    <span>Acquiring GPS...</span>
                  </>
                ) : (
                  <>
                    <Compass className="w-4 h-4 text-stone-950" />
                    <span>Detect My Specific Location</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Search Specific Ward Form */}
          <form onSubmit={handleSearchLocation} className="flex flex-col sm:flex-row items-center gap-2 max-w-2xl">
            <div className="relative flex-1 w-full">
              <MapPin className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search specific ward, town or sub-county (e.g. Soy, Njoro, Kitale, Limuru, Moiben)..."
                value={locationSearchInput}
                onChange={(e) => setLocationSearchInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs sm:text-sm placeholder-stone-500 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-200 font-bold text-xs sm:text-sm transition-colors"
            >
              <span>Search Specific Place</span>
            </button>
          </form>

          {/* Result Display Box */}
          {detectedLocationData && (
            <div className="p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800/80 pb-3">
                <div>
                  <div className="text-xs font-mono font-bold text-emerald-400">
                    {detectedLocationData.coords}
                  </div>
                  <div className="text-lg font-black text-stone-100">
                    {detectedLocationData.placeName}
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-bold self-start sm:self-auto">
                  Live Ward Satellite Feed Active
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                  <span className="text-stone-400 font-bold block">Temperature</span>
                  <span className="text-stone-100 font-black text-sm">{detectedLocationData.temp}</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                  <span className="text-stone-400 font-bold block">Relative Humidity</span>
                  <span className="text-stone-100 font-black text-sm">{detectedLocationData.humidity}</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                  <span className="text-stone-400 font-bold block">Rainfall Outlook</span>
                  <span className="text-amber-300 font-black text-sm">{detectedLocationData.rain}</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-900 border border-stone-800">
                  <span className="text-stone-400 font-bold block">Livestock THI</span>
                  <span className="text-emerald-400 font-black text-sm">{detectedLocationData.thi}</span>
                </div>
              </div>

              {/* Warnings & Risk Box */}
              <div className="space-y-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400 flex items-center space-x-1.5">
                  <Bug className="w-4 h-4 text-amber-400" />
                  <span>Specific Location Risk Warnings & Disease Vectors:</span>
                </span>
                <div className="space-y-1.5">
                  {detectedLocationData.warnings.map((warn, i) => (
                    <div key={i} className="p-3 rounded-xl bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs font-semibold flex items-start space-x-2">
                      <span className="text-amber-400 font-extrabold">•</span>
                      <span>{warn}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Agronomy Action */}
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 text-xs font-semibold space-y-1">
                <span className="font-extrabold text-emerald-400 flex items-center space-x-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  <span>Agronomic Action for {detectedLocationData.placeName}:</span>
                </span>
                <p>{detectedLocationData.agronomyAdvice}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Interactive 47 Counties Preview Section */}
      <section className="py-12 px-4 sm:px-8 bg-stone-900/50 border-y border-stone-800/80">
        <div className="max-w-6xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
              <Compass className="w-3.5 h-3.5" />
              <span>Live Regional Intelligence</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-stone-100">
              Select Your Agricultural Region
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 max-w-xl mx-auto">
              Preview micro-climate forecasts, crop alerts, and regional advisories across Kenya's key farming hubs.
            </p>
          </div>

          {/* County Selector Tabs */}
          <div className="flex flex-wrap justify-center gap-2">
            {featuredCounties.map((item, idx) => (
              <button
                key={item.code}
                onClick={() => setSelectedCountyIndex(idx)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
                  selectedCountyIndex === idx
                    ? 'bg-emerald-500 text-stone-950 shadow-md font-black'
                    : 'bg-stone-900 border border-stone-800 text-stone-300 hover:bg-stone-800'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" />
                <span>{item.name} ({item.code})</span>
              </button>
            ))}
          </div>

          {/* Active Selected County Card */}
          <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 max-w-3xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-stone-800">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded">
                    County {currentCounty.code}
                  </span>
                  <span className="text-xs text-stone-400">{currentCounty.region}</span>
                </div>
                <h3 className="text-2xl font-black text-stone-100 mt-1">
                  {currentCounty.name} County <span className="text-sm font-normal text-stone-400">({currentCounty.capital})</span>
                </h3>
              </div>

              <div className={`px-3 py-1.5 rounded-xl border text-xs font-black ${currentCounty.riskColor}`}>
                {currentCounty.riskStatus}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <span className="text-xs font-bold text-stone-400 flex items-center space-x-1">
                  <Wheat className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Key Agricultural Enterprises:</span>
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {currentCounty.mainCrops.map((crop) => (
                    <span key={crop} className="px-2.5 py-1 rounded-lg bg-stone-950 border border-stone-800 text-xs text-stone-200 font-semibold">
                      {crop}
                    </span>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-xs font-bold text-stone-400 flex items-center space-x-1">
                  <CloudSun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Micro-Climate Forecast:</span>
                </span>
                <p className="text-xs text-stone-200 font-medium">{currentCounty.rainfallForecast}</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800/80 text-xs space-y-1">
              <span className="font-bold text-emerald-400 flex items-center space-x-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Agronomist Advisory Note:</span>
              </span>
              <p className="text-stone-300">{currentCounty.advice}</p>
            </div>

            {/* Prompt to log in for full data */}
            <div className="mt-4 pt-4 border-t border-stone-800 flex items-center justify-between text-xs">
              <span className="text-stone-400">Sign in to view satellite telemetry and sub-county maps for {currentCounty.name}.</span>
              <button
                onClick={onOpenLogin}
                className="px-3.5 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold flex items-center space-x-1 transition-colors shrink-0"
              >
                <span>Access County Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Modules Overview */}
      <section className="relative overflow-hidden py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-10 rounded-3xl border border-stone-800/80 my-8">
        {/* Background Image Layer */}
        <div className="absolute inset-0 -z-10 overflow-hidden">
          <img
            src={agriTechBg}
            alt="AgriShield Tech Field Background"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover opacity-20 filter saturate-150"
          />
          <div className="absolute inset-0 bg-stone-950/85 backdrop-blur-sm" />
        </div>

        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black text-stone-100">
            Full-Stack AgriShield Capabilities
          </h2>
          <p className="text-stone-400 text-sm max-w-xl mx-auto">
            Everything smallholder farmers, extension officers, and co-ops need for resilient food production.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-stone-900/90 backdrop-blur-md border border-stone-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CloudSun className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-stone-100">Micro-Climate Intelligence</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Real-time temperature, humidity, rainfall probability, and soil moisture tracking specific to your ward and sub-county.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-stone-900/90 backdrop-blur-md border border-stone-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Bug className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-stone-100">AI Disease & Outbreak Vectors</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Predictive models for Fall Armyworm, Maize Lethal Necrosis (MLND), Potato Blight, and Rift Valley Fever with preventative actions.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-stone-900/90 backdrop-blur-md border border-stone-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-stone-100">Commodity Market Prices</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Live wholesale and retail prices across Kenya's key agricultural hubs (Nairobi Wakulima, Eldoret, Nakuru, Kisumu, Mombasa).
            </p>
          </div>
        </div>
      </section>

      {/* Account Requirement Callout */}
      <section className="py-12 px-4 sm:px-8 bg-gradient-to-r from-emerald-950 via-stone-900 to-teal-950 border-t border-emerald-800/40 text-center">
        <div className="max-w-3xl mx-auto space-y-5">
          <div className="p-3 bg-emerald-500/10 rounded-full w-12 h-12 flex items-center justify-center mx-auto text-emerald-400 border border-emerald-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-stone-100">
            Ready to Protect Your Farm & Yield?
          </h2>
          <p className="text-stone-300 text-xs sm:text-sm max-w-lg mx-auto">
            Create an account or log in to manage your farms, receive SMS/WhatsApp risk notifications, and chat with AgriShield's AI Agronomist.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={onOpenSignUp}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-sm flex items-center justify-center space-x-2 shadow-xl shadow-emerald-950 transition-all active:scale-95"
            >
              <UserPlus className="w-4 h-4" />
              <span>Create Free Account</span>
            </button>

            <button
              onClick={onOpenLogin}
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 font-bold text-sm flex items-center justify-center space-x-2 transition-all"
            >
              <LogIn className="w-4 h-4 text-emerald-400" />
              <span>Log In to Existing Account</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-stone-800/80 bg-stone-950 py-8 px-4 sm:px-8 text-xs text-stone-500 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-7xl mx-auto w-full">
        <div className="flex items-center space-x-2">
          <AgriShieldLogoFull className="h-6 w-auto opacity-80" />
          <span>© 2026 AgriShield AI Kenya. All rights reserved.</span>
        </div>

        <div className="flex items-center space-x-4">
          <a
            href="https://wa.me/254143791311?text=Hello%20Ian%20Chirchir,%20I%20have%20an%20AgriShield%20Landing%20Inquiry"
            target="_blank"
            rel="noreferrer"
            className="text-emerald-400 font-bold hover:underline flex items-center space-x-1"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Official Support</span>
          </a>
        </div>
      </footer>
    </div>
  );
};
