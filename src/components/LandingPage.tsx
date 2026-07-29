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

interface LandingPageProps {
  onOpenLogin: () => void;
  onOpenSignUp: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onOpenLogin,
  onOpenSignUp,
}) => {
  const [selectedCountyIndex, setSelectedCountyIndex] = useState(0);

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
      <section className="relative overflow-hidden pt-12 pb-16 px-4 sm:px-8 max-w-7xl mx-auto text-center flex flex-col items-center">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-stone-900 border border-emerald-500/30 text-emerald-300 font-bold text-xs mb-6 shadow-md">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>AI-Powered Climate Protection & Agronomy for Kenyan Agriculture</span>
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
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-base flex items-center justify-center space-x-2 shadow-xl shadow-emerald-950/80 transition-all transform hover:-translate-y-0.5 active:scale-95"
          >
            <span>Create Account</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          <button
            onClick={onOpenLogin}
            className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 font-bold text-base flex items-center justify-center space-x-2 transition-all"
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
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto space-y-10">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-black text-stone-100">
            Full-Stack AgriShield Capabilities
          </h2>
          <p className="text-stone-400 text-sm max-w-xl mx-auto">
            Everything smallholder farmers, extension officers, and co-ops need for resilient food production.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CloudSun className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-stone-100">Micro-Climate Intelligence</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Real-time temperature, humidity, rainfall probability, and soil moisture tracking specific to your ward and sub-county.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
              <Bug className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-stone-100">AI Disease & Outbreak Vectors</h3>
            <p className="text-xs text-stone-400 leading-relaxed">
              Predictive models for Fall Armyworm, Maize Lethal Necrosis (MLND), Potato Blight, and Rift Valley Fever with preventative actions.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-stone-900 border border-stone-800 space-y-3">
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
