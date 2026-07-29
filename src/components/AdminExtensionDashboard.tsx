import React, { useState } from 'react';
import { Farm, CommunityReport, UserRole, UserProfile } from '../types';
import { AdminUserManagement } from './AdminUserManagement';
import { KENYA_COUNTIES } from '../data/kenyaCounties';
import {
  Building2,
  Users,
  ShieldAlert,
  Send,
  Search,
  Radio,
  Check,
  BarChart3,
  PieChart,
  Activity,
  UserPlus,
  HelpCircle,
  MessageSquare,
  KeyRound,
} from 'lucide-react';

interface AdminExtensionDashboardProps {
  currentUser: UserProfile;
  usersList: UserProfile[];
  farms: Farm[];
  reports: CommunityReport[];
  onVerifyReport: (id: string) => void;
  onSendBroadcast: (title: string, message: string) => void;
  onAddUser: (newUser: UserProfile) => void;
  onUpdateUserRole: (id: string, newRole: UserRole) => void;
  onDeleteUser: (id: string) => void;
}

export const AdminExtensionDashboard: React.FC<AdminExtensionDashboardProps> = ({
  currentUser,
  usersList,
  farms,
  reports,
  onVerifyReport,
  onSendBroadcast,
  onAddUser,
  onUpdateUserRole,
  onDeleteUser,
}) => {
  const [activeTab, setActiveTab] = useState<'farms' | 'users' | 'analytics'>('farms');
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCounty, setSelectedCounty] = useState<string>('all');

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) return;

    onSendBroadcast(broadcastTitle, broadcastMessage);
    setBroadcastSent(true);
    setTimeout(() => setBroadcastSent(false), 4000);
    setBroadcastTitle('');
    setBroadcastMessage('');
  };

  const filteredFarms = (farms || []).filter((f) => {
    const matchesSearch =
      (f.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.county || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (f.cropType || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCounty = selectedCounty === 'all' || f.county === selectedCounty;
    return matchesSearch && matchesCounty;
  });

  // Risk distribution metrics
  const highRiskFarms = farms.filter((f) => f.riskScore > 65).length;
  const mediumRiskFarms = farms.filter((f) => f.riskScore >= 40 && f.riskScore <= 65).length;
  const lowRiskFarms = farms.filter((f) => f.riskScore < 40).length;

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
              <h2 className="text-lg font-bold text-stone-50 tracking-tight flex items-center space-x-2">
                <span>AgriShield AI Regional Command Center</span>
                {currentUser.role === 'admin' && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500 text-stone-950 font-black">
                    ADMIN
                  </span>
                )}
              </h2>
              <p className="text-xs text-stone-400">
                County: Uasin Gishu & Nakuru • Active Monitoring: {farms.length} Registered Farms • Support: <strong>Ian Chirchir (0143791311)</strong>
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <a
              href="https://wa.me/254143791311?text=Hello%20Ian%20Chirchir,%20Admin%20Support"
              target="_blank"
              rel="noreferrer"
              className="px-3 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-700 text-emerald-300 font-bold text-xs flex items-center space-x-1.5 transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400" />
              <span>WhatsApp Admin: 0143791311</span>
            </a>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-800 text-xs font-bold gap-2">
          <button
            onClick={() => setActiveTab('farms')}
            className={`px-4 py-2.5 rounded-t-xl flex items-center space-x-2 transition-colors ${
              activeTab === 'farms'
                ? 'bg-stone-800 text-emerald-400 border-t-2 border-emerald-500'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Farm Registry & Broadcast</span>
          </button>

          <button
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-t-xl flex items-center space-x-2 transition-colors ${
              activeTab === 'users'
                ? 'bg-stone-800 text-emerald-400 border-t-2 border-emerald-500'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>User & Access Management ({usersList.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 rounded-t-xl flex items-center space-x-2 transition-colors ${
              activeTab === 'analytics'
                ? 'bg-stone-800 text-emerald-400 border-t-2 border-emerald-500'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics & Risk Charts</span>
          </button>
        </div>

        {/* Aggregate Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-xl bg-stone-800 border border-stone-750">
            <span className="text-stone-400 font-medium block">Total Farms Monitored</span>
            <span className="text-xl font-black text-white mt-0.5 block">{farms.length} Farms</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-800 border border-stone-750">
            <span className="text-stone-400 font-medium block">Registered Users</span>
            <span className="text-xl font-black text-blue-400 mt-0.5 block">{usersList.length} Accounts</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-800 border border-stone-750">
            <span className="text-stone-400 font-medium block">Outbreak Warnings Today</span>
            <span className="text-xl font-black text-red-400 mt-0.5 block">{reports.length} Reports</span>
          </div>
          <div className="p-3 rounded-xl bg-stone-800 border border-stone-750">
            <span className="text-stone-400 font-medium block">Regional Food Resilience</span>
            <span className="text-xl font-black text-emerald-400 mt-0.5 block">86% Stable</span>
          </div>
        </div>
      </div>

      {/* TAB 1: FARMS & BROADCAST */}
      {activeTab === 'farms' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Multi-Farm Table (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <h3 className="text-base font-bold text-stone-900 flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>Smallholder Farm Registry & Risk Table</span>
              </h3>

              <div className="flex items-center space-x-2">
                <select
                  value={selectedCounty}
                  onChange={(e) => setSelectedCounty(e.target.value)}
                  className="px-2.5 py-1.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 bg-stone-50 focus:outline-none"
                >
                  <option value="all">All 47 Counties</option>
                  {KENYA_COUNTIES.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>

                <div className="relative w-40 sm:w-48">
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
                  placeholder="e.g. CRITICAL: Heavy Rain & Vector Outbreak Warning"
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
                  placeholder="Instructions for farmers regarding drainage, acaricide spray schedules..."
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900"
                  required
                />
              </div>

              {broadcastSent && (
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center space-x-2 border border-emerald-300">
                  <Check className="w-4 h-4 text-emerald-700" />
                  <span>Broadcast Alert successfully dispatched to all registered farmers!</span>
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
      )}

      {/* TAB 2: ADMIN USER MANAGEMENT */}
      {activeTab === 'users' && (
        <AdminUserManagement
          currentUser={currentUser}
          usersList={usersList}
          onAddUser={onAddUser}
          onUpdateUserRole={onUpdateUserRole}
          onDeleteUser={onDeleteUser}
        />
      )}

      {/* TAB 3: ANALYTICS & RISK CHARTS */}
      {activeTab === 'analytics' && (
        <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-150">
            <h3 className="text-base font-bold text-stone-900 flex items-center space-x-2">
              <PieChart className="w-5 h-5 text-emerald-600" />
              <span>Regional Climate Risk Analytics & Dashboard Metrics</span>
            </h3>
            <span className="text-xs text-stone-500 font-medium">Real-time aggregate data</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            
            {/* Risk Breakdown */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
              <h4 className="text-xs font-extrabold text-stone-700 uppercase">Risk Level Distribution</h4>
              <div className="space-y-2 text-xs font-semibold">
                <div className="flex justify-between items-center">
                  <span className="text-red-700">High Risk (&gt;65%)</span>
                  <span className="font-bold text-stone-900">{highRiskFarms} Farms</span>
                </div>
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-red-500 h-full"
                    style={{ width: `${(highRiskFarms / (farms.length || 1)) * 100}%` }}
                  />
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-amber-700">Moderate Risk (40-65%)</span>
                  <span className="font-bold text-stone-900">{mediumRiskFarms} Farms</span>
                </div>
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-amber-500 h-full"
                    style={{ width: `${(mediumRiskFarms / (farms.length || 1)) * 100}%` }}
                  />
                </div>

                <div className="flex justify-between items-center pt-1">
                  <span className="text-emerald-700">Low Risk (&lt;40%)</span>
                  <span className="font-bold text-stone-900">{lowRiskFarms} Farms</span>
                </div>
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full"
                    style={{ width: `${(lowRiskFarms / (farms.length || 1)) * 100}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Role Breakdown */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
              <h4 className="text-xs font-extrabold text-stone-700 uppercase">User Accounts by Role</h4>
              <div className="space-y-2 text-xs font-semibold">
                <div className="flex justify-between items-center">
                  <span>Farmers</span>
                  <span className="font-bold text-emerald-600">
                    {usersList.filter((u) => u.role === 'farmer').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Extension Officers</span>
                  <span className="font-bold text-blue-600">
                    {usersList.filter((u) => u.role === 'extension_officer').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Researchers / NGOs</span>
                  <span className="font-bold text-purple-600">
                    {usersList.filter((u) => u.role === 'ngo').length}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Administrators</span>
                  <span className="font-bold text-amber-600">
                    {usersList.filter((u) => u.role === 'admin').length}
                  </span>
                </div>
              </div>
            </div>

            {/* Developer Contact Card */}
            <div className="p-4 rounded-xl bg-emerald-950 text-emerald-100 border border-emerald-800 space-y-3">
              <div className="flex items-center space-x-2 text-emerald-300">
                <KeyRound className="w-4 h-4 text-emerald-400" />
                <h4 className="text-xs font-extrabold uppercase">Platform Admin & Developer</h4>
              </div>
              <div className="text-xs space-y-1">
                <div className="font-bold text-white">Ian Kipkoech Chirchir</div>
                <div className="text-emerald-300 text-[11px]">iankipkoechchirchir06@gmail.com</div>
                <div className="text-emerald-300 font-mono text-[11px]">WhatsApp / Tel: 0143791311</div>
              </div>
              <a
                href="https://wa.me/254143791311?text=Hello%20Ian%20Chirchir"
                target="_blank"
                rel="noreferrer"
                className="mt-2 w-full py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs flex items-center justify-center space-x-1.5 transition-colors"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Contact Admin Directly</span>
              </a>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

