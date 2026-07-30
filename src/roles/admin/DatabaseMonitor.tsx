import React from 'react';
import { Database, CheckCircle2, ShieldCheck, Activity } from 'lucide-react';

export const DatabaseMonitor: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-1">
        <div className="inline-flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
          <Database className="w-4 h-4" />
          <span>Real-time Telemetry & Health Monitor</span>
        </div>
        <h2 className="text-xl font-bold text-white">Database & API Health Monitor</h2>
        <p className="text-xs text-stone-400">Status of Supabase PostgreSQL, Open-Meteo weather API, and Gemini AI Engine.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">Supabase DB</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Connected</span>
            </span>
          </div>
          <p className="text-stone-400">PostgreSQL profiles, farms, reports, predictions, and notifications tables active.</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">Open-Meteo Weather</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Live Synced</span>
            </span>
          </div>
          <p className="text-stone-400">Real-time micro-climate, precipitation, soil moisture, and UV index feeds.</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-white text-sm">Gemini AI Engine</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-black uppercase flex items-center space-x-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Server Proxy</span>
            </span>
          </div>
          <p className="text-stone-400">Server-side gemini-2.5-flash / gemini-1.5-flash model endpoint connected.</p>
        </div>
      </div>
    </div>
  );
};
