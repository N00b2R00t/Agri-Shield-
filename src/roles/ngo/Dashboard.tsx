import React from 'react';
import { UserProfile, Farm, WeatherSummary, CommunityReport } from '../../types';
import { Globe, MapPin, Activity, ShieldCheck, BarChart3, ArrowRight } from 'lucide-react';

interface NGODashboardProps {
  user: UserProfile;
  farms: Farm[];
  weather: WeatherSummary;
  reports: CommunityReport[];
  onNavigate: (tab: string) => void;
}

export const NGODashboard: React.FC<NGODashboardProps> = ({
  user,
  farms,
  weather,
  reports,
  onNavigate,
}) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-950 via-stone-900 to-stone-900 border border-blue-800/50 rounded-3xl p-6 shadow-xl text-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl z-10">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 border border-blue-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Globe className="w-3.5 h-3.5" />
            <span>NGO Climate Resilience & Vulnerability Desk • {user.organization || 'Global Climate Tech'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Specialist {user.name} 🌍
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            Monitor regional climate vulnerability metrics, smallholder drought adaptation rates, and GIS spatial hazard layers across East Africa.
          </p>
        </div>

        <button
          onClick={() => onNavigate('gis_map')}
          className="px-4 py-2.5 rounded-2xl bg-blue-500 hover:bg-blue-400 text-stone-950 font-bold text-xs flex items-center space-x-2 shadow-lg transition-all z-10"
        >
          <MapPin className="w-4 h-4" />
          <span>Launch Climate GIS Spatial Map</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2 text-stone-100">
          <div className="flex items-center justify-between text-stone-400 text-xs font-semibold">
            <span>Drought Risk Index</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">{weather.droughtProbability}%</div>
          <p className="text-[11px] text-stone-400">Regional water stress probability</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2 text-stone-100">
          <div className="flex items-center justify-between text-stone-400 text-xs font-semibold">
            <span>Flood Risk Probability</span>
            <Activity className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-black text-blue-300">{weather.floodProbability}%</div>
          <p className="text-[11px] text-stone-400">High catchment precipitation</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2 text-stone-100">
          <div className="flex items-center justify-between text-stone-400 text-xs font-semibold">
            <span>Monitored Smallholders</span>
            <Globe className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-emerald-400">{farms.length} Plots</div>
          <p className="text-[11px] text-stone-400">Targeting resilience programs</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2 text-stone-100">
          <div className="flex items-center justify-between text-stone-400 text-xs font-semibold">
            <span>Verified Incidents</span>
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-white">{reports.filter((r) => r.verified).length} Verified</div>
          <p className="text-[11px] text-stone-400">Out of {reports.length} crowdsourced reports</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-stone-200">NGO Analytical Workstations</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'gis_map', label: 'Climate GIS Map', desc: 'Spatial risk mapping', tab: 'gis_map' },
            { id: 'vulnerability', label: 'Vulnerability Index', desc: 'Smallholder resilience metrics', tab: 'vulnerability' },
            { id: 'simulator', label: 'Climate Simulator', desc: 'Scenario modeling', tab: 'simulator' },
            { id: 'reports', label: 'Field Incidents', desc: 'Crowdsourced validation', tab: 'reports' },
            { id: 'markets', label: 'Food Security Trends', desc: 'Price stability analytics', tab: 'markets' },
            { id: 'settings', label: 'NGO Profile', desc: 'Institutional focus sector', tab: 'settings' },
            { id: 'support', label: 'Impact Exporter', desc: 'Knowledge hub & reports', tab: 'support' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.tab)}
              className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 hover:border-blue-500/50 text-left transition-all group"
            >
              <div className="text-xs font-bold text-stone-100 group-hover:text-blue-400 flex items-center justify-between">
                <span>{item.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-blue-400 transition-transform" />
              </div>
              <p className="text-[10px] text-stone-400 mt-1">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
