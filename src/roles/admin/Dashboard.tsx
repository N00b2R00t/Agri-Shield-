import React from 'react';
import { UserProfile, Farm, CommunityReport, DiseaseRiskPrediction } from '../../types';
import { ShieldCheck, Users, Database, Radio, Activity, ArrowRight, Lock } from 'lucide-react';

interface AdminDashboardProps {
  user: UserProfile;
  usersList: UserProfile[];
  farms: Farm[];
  reports: CommunityReport[];
  predictions: DiseaseRiskPrediction[];
  onNavigate: (tab: string) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  user,
  usersList = [],
  farms = [],
  reports = [],
  predictions = [],
  onNavigate,
}) => {
  const userCount = (usersList || []).length;
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-950 via-stone-900 to-stone-900 border border-red-800/50 rounded-3xl p-6 shadow-xl text-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
        <div className="space-y-2 max-w-2xl z-10">
          <div className="inline-flex items-center space-x-2 bg-red-500/20 text-red-300 border border-red-500/30 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5" />
            <span>System Master Director Control Panel • Full Authority</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white">
            Administrator {user.name} 🛡️
          </h1>
          <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
            Full platform administration. Reassign user roles (Farmer, Extension Officer, NGO, Admin), oversee real-time Supabase sync, and broadcast critical system alerts.
          </p>
        </div>

        <button
          onClick={() => onNavigate('users')}
          className="px-4 py-2.5 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg transition-all z-10"
        >
          <Users className="w-4 h-4" />
          <span>Manage Users & Roles ({userCount})</span>
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2 text-stone-100">
          <div className="flex items-center justify-between text-stone-400 text-xs font-semibold">
            <span>Total Registered Accounts</span>
            <Users className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white">{userCount} Accounts</div>
          <p className="text-[11px] text-stone-400">Synced with Supabase DB</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2 text-stone-100">
          <div className="flex items-center justify-between text-stone-400 text-xs font-semibold">
            <span>Registered Farms</span>
            <Database className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-300">{farms.length} Plots</div>
          <p className="text-[11px] text-stone-400">Acreage total: {farms.reduce((a, f) => a + f.areaHectares, 0).toFixed(1)} Ha</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2 text-stone-100">
          <div className="flex items-center justify-between text-stone-400 text-xs font-semibold">
            <span>Active Risk Engines</span>
            <Activity className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300">{predictions.length} Models</div>
          <p className="text-[11px] text-stone-400">Fall Armyworm & ECF telemetry</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 space-y-2 text-stone-100">
          <div className="flex items-center justify-between text-stone-400 text-xs font-semibold">
            <span>Field Incidents</span>
            <Radio className="w-4 h-4 text-red-400" />
          </div>
          <div className="text-2xl font-black text-red-300">{reports.length} Incidents</div>
          <p className="text-[11px] text-stone-400">{reports.filter((r) => r.verified).length} Verified</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-stone-200">System Admin Control Stations</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { id: 'users', label: 'User Role Manager', desc: 'Reassign roles in real-time', tab: 'users' },
            { id: 'broadcast', label: 'Global Alert Dispatcher', desc: 'System-wide push alerts', tab: 'broadcast' },
            { id: 'risk', label: 'Disease Risk Engines', desc: 'Outbreak vector telemetry', tab: 'risk' },
            { id: 'db_monitor', label: 'Database Telemetry', desc: 'Supabase sync status & logs', tab: 'db_monitor' },
            { id: 'market_admin', label: 'Market Feed Editor', desc: 'Grain & livestock rates', tab: 'market_admin' },
            { id: 'settings', label: 'Security & Policies', desc: 'API keys & access rules', tab: 'settings' },
            { id: 'support', label: 'Audit Logs & Help', desc: 'Developer support channel', tab: 'support' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onNavigate(item.tab)}
              className="p-3.5 rounded-2xl bg-stone-950 border border-stone-800 hover:border-red-500/50 text-left transition-all group"
            >
              <div className="text-xs font-bold text-stone-100 group-hover:text-red-400 flex items-center justify-between">
                <span>{item.label}</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-500 group-hover:text-red-400 transition-transform" />
              </div>
              <p className="text-[10px] text-stone-400 mt-1">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
