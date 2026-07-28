import React, { useState } from 'react';
import { Farm, CommunityReport, UserRole } from '../types';
import {
  Building2,
  Users,
  ShieldAlert,
  Send,
  CheckCircle,
  MapPin,
  FileText,
  Search,
  Radio,
  Check,
} from 'lucide-react';

interface AdminExtensionDashboardProps {
  role: UserRole;
  farms: Farm[];
  reports: CommunityReport[];
  onVerifyReport: (id: string) => void;
  onSendBroadcast: (title: string, message: string) => void;
}

export const AdminExtensionDashboard: React.FC<AdminExtensionDashboardProps> = ({
  role,
  farms,
  reports,
  onVerifyReport,
  onSendBroadcast,
}) => {
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;

    onSendBroadcast(broadcastTitle, broadcastMessage);
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 4000);
    setBroadcastTitle('');
    setBroadcastMessage('');
  };

  const filteredFarms = farms.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.county.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.cropType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      
      {/* Top Regional Metrics Header */}
      <div className="bg-stone-900 text-stone-100 rounded-2xl p-5 border border-stone-800 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-blue-600 text-white shadow-md">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-50 tracking-tight">
                Regional Climate & Extension Officer Command Center
              </h2>
              <p className="text-xs text-stone-400">
                County: Nakuru, Kenya • Active Monitoring Zone: 124 Registered Farms
              </p>
            </div>
          </div>

          <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-950 text-blue-300 border border-blue-800">
            Role: {role.toUpperCase().replace('_', ' ')}
          </span>
        </div>

        {/* Aggregate Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-stone-800 border border-stone-750">
            <span className="text-stone-400 font-medium block">Total Farms Monitored</span>
            <span className="text-xl font-black text-white mt-0.5 block">{farms.length} Registered</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-800 border border-stone-750">
            <span className="text-stone-400 font-medium block">Avg Regional Climate Risk</span>
            <span className="text-xl font-black text-amber-400 mt-0.5 block">62 / 100</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-800 border border-stone-750">
            <span className="text-stone-400 font-medium block">Outbreak Reports Today</span>
            <span className="text-xl font-black text-red-400 mt-0.5 block">{reports.length} Reports</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-800 border border-stone-750">
            <span className="text-stone-400 font-medium block">Food Security Index</span>
            <span className="text-xl font-black text-emerald-400 mt-0.5 block">84% Stable</span>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Multi-Farm Registry Table + Broadcast Warning Dispatcher */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Multi-Farm Table (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-stone-900 flex items-center space-x-2">
              <Users className="w-5 h-5 text-blue-600" />
              <span>Smallholder Farm Registry & Risk Table</span>
            </h3>

            <div className="relative w-48">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-2.5" />
              <input
                type="text"
                placeholder="Search farm or crop..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-stone-300 text-xs text-stone-900 bg-stone-50"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-600 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
                <tr>
                  <th className="p-2.5">Farm Name</th>
                  <th className="p-2.5">Crops & Livestock</th>
                  <th className="p-2.5">Location</th>
                  <th className="p-2.5">Risk Score</th>
                  <th className="p-2.5">Health Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-150 font-medium text-stone-800">
                {filteredFarms.map((f) => (
                  <tr key={f.id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-2.5 font-bold text-stone-900">{f.name}</td>
                    <td className="p-2.5">
                      <div className="font-semibold">{f.cropType}</div>
                      {f.livestockType && (
                        <div className="text-[11px] text-amber-700 font-medium">
                          {f.livestockType} ({f.headCount || 10} head)
                        </div>
                      )}
                    </td>
                    <td className="p-2.5 text-stone-600">{f.locationName}</td>
                    <td className="p-2.5">
                      <span
                        className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                          f.riskScore > 70
                            ? 'bg-red-100 text-red-800'
                            : f.riskScore > 40
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {f.riskScore}%
                      </span>
                    </td>
                    <td className="p-2.5 font-bold text-emerald-700">{f.cropHealthScore}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Broadcast Climate Warning Dispatcher (5 cols) */}
        <div className="lg:col-span-5 bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center space-x-2 border-b border-stone-100 pb-3">
            <div className="p-1.5 rounded-lg bg-red-100 text-red-800">
              <Radio className="w-5 h-5 text-red-600 animate-pulse" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">Broadcast Climate Alert</h3>
              <p className="text-xs text-stone-500">Dispatch SMS & In-App alert to all regional farmers</p>
            </div>
          </div>

          <form onSubmit={handleBroadcastSubmit} className="space-y-3 text-xs font-medium">
            <div>
              <label className="block text-stone-700 font-bold mb-1">Alert Headline</label>
              <input
                type="text"
                placeholder="e.g. CRITICAL: 38mm Heavy Rain & Washout Warning"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 font-bold"
                required
              />
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">Warning Message Content</label>
              <textarea
                rows={4}
                placeholder="Instructions for farmers regarding drainage, seed protection, or pest containment..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900"
                required
              />
            </div>

            {broadcastSent && (
              <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center space-x-2 border border-emerald-300">
                <Check className="w-4 h-4 text-emerald-700" />
                <span>Broadcast Alert successfully dispatched to 124 farmers in Nakuru!</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center justify-center space-x-2 shadow-md transition-transform active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Broadcast Warning to Regional Farmers</span>
            </button>
          </form>
        </div>

      </div>

    </div>
  );
};
