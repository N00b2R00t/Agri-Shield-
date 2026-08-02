import React from 'react';
import { UserProfile, Farm, WeatherSummary, CommunityReport, DiseaseRiskPrediction } from '../../types';
import { Building2, Users, Radio, AlertTriangle, MapPin, Activity, CheckCircle2, ArrowRight } from 'lucide-react';

interface ExtensionDashboardProps {
  user: UserProfile;
  farms: Farm[];
  usersList: UserProfile[];
  weather: WeatherSummary;
  reports: CommunityReport[];
  predictions: DiseaseRiskPrediction[];
  onNavigate: (tab: string) => void;
}

export const ExtensionDashboard: React.FC<ExtensionDashboardProps> = ({
  user,
  farms = [],
  usersList = [],
  weather,
  reports = [],
  predictions = [],
  onNavigate,
}) => {
  const farmersCount = (usersList || []).filter((u) => u?.role === 'farmer').length;
  const criticalPredictions = (predictions || []).filter((p) => p?.riskLevel === 'Critical' || p?.riskLevel === 'High');

  return (
    <div className="space-y-6">
      {/* Extension Officer Header */}
      <div className="bg-gradient-to-r from-cyan-950 via-stone-900 to-stone-900 border border-cyan-800/50 rounded-3xl p-6 shadow-xl text-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl z-10">
          <div className="inline-flex items-center space-x-2 bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Building2 className="w-3.5 h-3.5" />
            <span>Agricultural Extension Command • {user.county || 'Uasin Gishu'} Sub-County</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Officer {user.name} 🌾
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            Regional agricultural monitoring unit. Dispatch county emergency alerts, inspect smallholder plots, and review disease outbreaks across assigned wards.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 z-10">
          <button
            onClick={() => onNavigate('broadcast')}
            className="px-4 py-2.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-stone-950 font-bold text-xs flex items-center space-x-2 shadow-lg transition-all"
          >
            <Radio className="w-4 h-4" />
            <span>Dispatch Emergency Broadcast</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2 text-stone-100">
          <div className="flex items-center justify-between text-stone-400 text-xs font-semibold">
            <span>Registered Farmers</span>
            <Users className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{farmersCount} Farmers</div>
          <p className="text-[11px] text-stone-400">Under county supervision</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2 text-stone-100">
          <div className="flex items-center justify-between text-stone-400 text-xs font-semibold">
            <span>Total Inspected Acreage</span>
            <MapPin className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{farms.reduce((acc, f) => acc + (f.areaHectares || 0), 0).toFixed(1)} Ha</div>
          <p className="text-[11px] text-stone-400">{farms.length} Active plot plots</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2 text-stone-100">
          <div className="flex items-center justify-between text-stone-400 text-xs font-semibold">
            <span>Critical Outbreaks</span>
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-300">{criticalPredictions.length} High Risks</div>
          <p className="text-[11px] text-stone-400">{reports.length} Field incident reports</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2 text-stone-100">
          <div className="flex items-center justify-between text-stone-400 text-xs font-semibold">
            <span>County Rain Forecast</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-cyan-300">{weather?.rainfallMm ?? 0} mm</div>
          <p className="text-[11px] text-stone-400">{weather?.rainfallProb ?? 0}% Probability today</p>
        </div>
      </div>

      {/* Extension Officer Navigation Grid */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-stone-200">Extension Command Workstations</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'farms', label: 'Regional Farmers', desc: 'County plot directory', tab: 'regional_farms' },
            { id: 'broadcast', label: 'SMS & Push Dispatch', desc: 'Send emergency alerts', tab: 'broadcast' },
            { id: 'advisory', label: 'Field Advisory', desc: 'Custom agronomist tips', tab: 'field_advisory' },
            { id: 'radar', label: 'Outbreak Radar', desc: 'Vector spread tracking', tab: 'outbreak_radar' },
            { id: 'simulations', label: 'Yield Simulator', desc: 'Drought scenario modeling', tab: 'simulations' },
            { id: 'settings', label: 'Officer Credentials', desc: 'County & sub-county setup', tab: 'settings' },
            { id: 'support', label: 'Ministry Support', desc: 'Field officer guidelines', tab: 'support' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.tab)}
              className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 hover:border-cyan-500/50 text-left transition-all group"
            >
              <div className="text-xs font-bold text-stone-100 group-hover:text-cyan-400 flex items-center justify-between">
                <span>{item.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-cyan-400 transition-transform" />
              </div>
              <p className="text-[10px] text-stone-400 mt-1">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
