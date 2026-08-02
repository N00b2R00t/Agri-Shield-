import React from 'react';
import { UserProfile, Farm, WeatherSummary, Recommendation, AlertNotification } from '../../types';
import { Sprout, CloudRain, ShieldAlert, Sparkles, MapPin, Activity, Heart, ArrowRight } from 'lucide-react';

interface FarmerDashboardProps {
  user: UserProfile;
  farms: Farm[];
  weather: WeatherSummary;
  recommendations: Recommendation[];
  notifications: AlertNotification[];
  onNavigate: (tab: string) => void;
  onOpenNewFarm: () => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  user,
  farms = [],
  weather,
  recommendations = [],
  notifications = [],
  onNavigate,
  onOpenNewFarm,
}) => {
  const farmList = farms || [];
  const activeFarm = farmList[0] || null;
  const highPriorityRecs = (recommendations || []).filter((r) => r?.priority === 'high');
  const unreadAlerts = (notifications || []).filter((n) => !n?.read);

  const currentTemp = weather?.currentTemp ?? 24;
  const rainfallMm = weather?.rainfallMm ?? 0;
  const rainfallProb = weather?.rainfallProb ?? 10;
  const livestockThi = weather?.livestockThi ?? 72;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-stone-900 to-stone-900 border border-emerald-800/50 rounded-3xl p-6 shadow-xl text-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl z-10">
          <div className="inline-flex items-center space-x-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Sprout className="w-3.5 h-3.5" />
            <span>Farmer Operations Portal • {user.county || 'Kenya'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Karibu, {user.name}! 👋
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            Your personalized smallholder dashboard. Monitor crop health, weather forecasts, livestock thermal stress, and market prices in real-time.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <button
            onClick={() => onNavigate('advisory')}
            className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center space-x-2 shadow-lg transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>View AI Smart Advisory ({recommendations.length})</span>
          </button>
          <button
            onClick={onOpenNewFarm}
            className="px-4 py-2.5 rounded-2xl bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold text-xs border border-stone-700 transition-all"
          >
            + Register New Plot
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2 text-stone-100">
          <div className="flex items-center justify-between text-stone-400 text-xs font-semibold">
            <span>Registered Farms</span>
            <MapPin className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{farms.length} Plots</div>
          <p className="text-[11px] text-stone-400">
            {activeFarm ? `Active: ${activeFarm.name} (${activeFarm.areaHectares} Ha)` : 'No active farm selected'}
          </p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2 text-stone-100">
          <div className="flex items-center justify-between text-stone-400 text-xs font-semibold">
            <span>Local Micro-Climate</span>
            <CloudRain className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-300">{currentTemp}°C / {rainfallMm}mm</div>
          <p className="text-[11px] text-stone-400">
            Rain chance today: <span className="text-emerald-400 font-bold">{rainfallProb}%</span>
          </p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2 text-stone-100">
          <div className="flex items-center justify-between text-stone-400 text-xs font-semibold">
            <span>Crop & Livestock Health</span>
            <Heart className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">
            {activeFarm ? `${activeFarm.cropHealthScore}% Health` : '92% Average'}
          </div>
          <p className="text-[11px] text-stone-400">
            THI Stress Index: <span className="text-amber-400 font-bold">{livestockThi}</span>
          </p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2 text-stone-100">
          <div className="flex items-center justify-between text-stone-400 text-xs font-semibold">
            <span>Active Risk Alerts</span>
            <ShieldAlert className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">{unreadAlerts.length} Unread</div>
          <p className="text-[11px] text-stone-400">
            {highPriorityRecs.length} High-priority advisory actions
          </p>
        </div>
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-stone-200 flex items-center space-x-2">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>Farmer Workspace Direct Actions</span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'farms', label: 'My Plots & Livestock', desc: 'Manage acreage & herds', tab: 'my_farms' },
            { id: 'alerts', label: 'Risk Alerts', desc: 'Pest & flood warnings', tab: 'risk_alerts' },
            { id: 'advisory', label: 'Smart Advisory', desc: 'AI step-by-step guidance', tab: 'advisory' },
            { id: 'community', label: 'Community Intel', desc: 'Neighbor reports', tab: 'community' },
            { id: 'markets', label: 'Market Prices', desc: 'Grain & milk prices', tab: 'markets' },
            { id: 'support', label: 'Agent Support', desc: 'Extension directory', tab: 'support' },
            { id: 'settings', label: 'My Settings', desc: 'Cooperative & password', tab: 'settings' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.tab)}
              className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 hover:border-emerald-500/50 text-left transition-all group"
            >
              <div className="text-xs font-bold text-stone-100 group-hover:text-emerald-400 flex items-center justify-between">
                <span>{item.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
              <p className="text-[10px] text-stone-400 mt-1">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
