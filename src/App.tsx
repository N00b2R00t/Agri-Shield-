import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  Farm,
  WeatherSummary,
  Recommendation,
  CommunityReport,
  DiseaseRiskPrediction,
  MarketPrice,
  AlertNotification,
  UserRole,
} from './types';
import {
  INITIAL_USER,
  INITIAL_FARMS,
  INITIAL_WEATHER,
  INITIAL_RECOMMENDATIONS,
  INITIAL_REPORTS,
  INITIAL_DISEASE_PREDICTIONS,
  INITIAL_MARKET_PRICES,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';

// UI Components
import { Navbar } from './components/Navbar';
import { RoleBanner } from './components/RoleBanner';
import { DashboardOverview } from './components/DashboardOverview';
import { InteractiveMap } from './components/InteractiveMap';
import { SmartRecommendations } from './components/SmartRecommendations';
import { CommunityIntel } from './components/CommunityIntel';
import { AIRiskPrediction } from './components/AIRiskPrediction';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { MarketIntelligence } from './components/MarketIntelligence';
import { AdminExtensionDashboard } from './components/AdminExtensionDashboard';
import { AIAssistantModal } from './components/AIAssistantModal';
import { FarmerProfileModal } from './components/FarmerProfileModal';

import {
  LayoutDashboard,
  Sparkles,
  MapPin,
  Users,
  Bug,
  Zap,
  Store,
  Building2,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';

export default function App() {
  const [user, setUser] = useState<UserProfile>(INITIAL_USER);
  const [farms, setFarms] = useState<Farm[]>(INITIAL_FARMS);
  const [activeFarm, setActiveFarm] = useState<Farm>(INITIAL_FARMS[0]);

  const [weather, setWeather] = useState<WeatherSummary>(INITIAL_WEATHER);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(INITIAL_RECOMMENDATIONS);
  const [reports, setReports] = useState<CommunityReport[]>(INITIAL_REPORTS);
  const [predictions, setPredictions] = useState<DiseaseRiskPrediction[]>(INITIAL_DISEASE_PREDICTIONS);
  const [markets, setMarkets] = useState<MarketPrice[]>(INITIAL_MARKET_PRICES);
  const [notifications, setNotifications] = useState<AlertNotification[]>(INITIAL_NOTIFICATIONS);

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'recommendations' | 'map' | 'community' | 'risk_prediction' | 'whatif' | 'markets' | 'admin'
  >('dashboard');

  const [showAssistant, setShowAssistant] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Load weather when active farm changes
  useEffect(() => {
    async function loadWeather() {
      try {
        const res = await fetch(`/api/weather?lat=${activeFarm.lat}&lng=${activeFarm.lng}`);
        if (res.ok) {
          const wData = await res.json();
          setWeather(wData);
        }
      } catch (err) {
        console.log('Error fetching weather:', err);
      }
    }
    loadWeather();
  }, [activeFarm]);

  // Handle role change
  const handleChangeRole = (newRole: UserRole) => {
    setUser({ ...user, role: newRole });
    if (newRole === 'admin' || newRole === 'extension_officer') {
      setActiveTab('admin');
    }
  };

  // Handle adding community report
  const handleAddReport = async (newRep: Partial<CommunityReport>) => {
    const reportData = {
      ...newRep,
      userId: user.id,
      userName: user.name,
      farmName: activeFarm.name,
      lat: activeFarm.lat + (Math.random() * 0.01 - 0.005),
      lng: activeFarm.lng + (Math.random() * 0.01 - 0.005),
    };

    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reportData),
      });
      if (res.ok) {
        const created = await res.json();
        setReports([created, ...reports]);
      }
    } catch (err) {
      const fallbackRep: CommunityReport = {
        id: `rep-${Date.now()}`,
        userId: user.id,
        userName: user.name,
        farmName: activeFarm.name,
        reportType: newRep.reportType || 'pest',
        cropAffected: newRep.cropAffected || activeFarm.cropType,
        severity: newRep.severity || 'high',
        description: newRep.description || 'Observed pest activity in field.',
        photoUrl: newRep.photoUrl,
        lat: activeFarm.lat,
        lng: activeFarm.lng,
        createdAt: new Date().toISOString(),
        verified: true,
        upvotes: 1,
        distanceKm: 0.5,
      };
      setReports([fallbackRep, ...reports]);
    }
  };

  // Handle upvoting report
  const handleUpvoteReport = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
  };

  // Handle verifying report
  const handleVerifyReport = (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, verified: true } : r))
    );
  };

  // Handle recommendation status change
  const handleRecommendationStatusChange = (
    id: string,
    newStatus: 'accepted' | 'completed' | 'dismissed'
  ) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
  };

  // Refresh AI recommendations via Gemini
  const handleRefreshAI = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/gemini/recommendations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farm: activeFarm,
          weather,
          nearbyReports: reports,
        }),
      });
      if (res.ok) {
        const freshRecs = await res.json();
        setRecommendations(freshRecs);
      }
    } catch (err) {
      console.error('Failed to generate fresh AI recommendations:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Handle update farm profile
  const handleUpdateFarm = (updated: Partial<Farm>) => {
    const updatedFarm = { ...activeFarm, ...updated };
    setActiveFarm(updatedFarm);
    setFarms((prev) => prev.map((f) => (f.id === updatedFarm.id ? updatedFarm : f)));
  };

  // Broadcast Alert from Extension Officer
  const handleSendBroadcast = (title: string, message: string) => {
    const newNotif: AlertNotification = {
      id: `notif-${Date.now()}`,
      title,
      type: 'weather_warning',
      severity: 'critical',
      message,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications([newNotif, ...notifications]);
  };

  const navTabs = [
    { id: 'dashboard', label: 'Farm Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'recommendations', label: 'Smart Recommendations', icon: <Sparkles className="w-4 h-4 text-emerald-400" />, badge: recommendations.filter(r => r.status === 'pending').length },
    { id: 'map', label: 'Interactive GIS Map', icon: <MapPin className="w-4 h-4" /> },
    { id: 'community', label: 'Community Intel', icon: <Users className="w-4 h-4" />, badge: reports.length },
    { id: 'risk_prediction', label: 'AI Disease Prediction', icon: <Bug className="w-4 h-4" /> },
    { id: 'whatif', label: 'What-If Simulator', icon: <Zap className="w-4 h-4 text-amber-400" /> },
    { id: 'markets', label: 'Market Prices', icon: <Store className="w-4 h-4" /> },
    { id: 'admin', label: 'Extension & Admin', icon: <Building2 className="w-4 h-4" /> },
  ];

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans flex flex-col antialiased selection:bg-emerald-500 selection:text-white">
      
      {/* Navbar Header */}
      <Navbar
        user={user}
        activeFarm={activeFarm}
        farms={farms}
        onSelectFarm={(f) => setActiveFarm(f)}
        onChangeRole={handleChangeRole}
        onOpenNewFarmModal={() => setShowProfileModal(true)}
        onOpenProfileModal={() => setShowProfileModal(true)}
        notifications={notifications}
        onOpenAssistant={() => setShowAssistant(true)}
      />

      {/* Persona View Perspective Banner */}
      <RoleBanner role={user.role} onChangeRole={handleChangeRole} />

      {/* Main App Workspace Navigation Tabs Bar */}
      <div className="bg-stone-900 text-stone-200 border-b border-stone-800 shadow-inner">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 text-xs font-semibold no-scrollbar">
            {navTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-xl whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-emerald-500 text-stone-950 font-extrabold shadow-md'
                      : 'text-stone-300 hover:text-white hover:bg-stone-800'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.badge !== undefined && tab.badge > 0 && (
                    <span
                      className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                        isActive ? 'bg-stone-950 text-emerald-300' : 'bg-emerald-500/20 text-emerald-300'
                      }`}
                    >
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Active Tab View Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {activeTab === 'dashboard' && (
          <DashboardOverview
            farm={activeFarm}
            weather={weather}
            recommendations={recommendations}
            onOpenAssistant={() => setShowAssistant(true)}
            onOpenMap={() => setActiveTab('map')}
            onOpenWhatIf={() => setActiveTab('whatif')}
            onOpenReportModal={() => setActiveTab('community')}
          />
        )}

        {activeTab === 'recommendations' && (
          <SmartRecommendations
            recommendations={recommendations}
            onStatusChange={handleRecommendationStatusChange}
            onRefreshAI={handleRefreshAI}
            isGeneratingAI={isGeneratingAI}
          />
        )}

        {activeTab === 'map' && (
          <InteractiveMap
            activeFarm={activeFarm}
            farms={farms}
            reports={reports}
            markets={markets}
            onRequestNewReport={() => setActiveTab('community')}
          />
        )}

        {activeTab === 'community' && (
          <CommunityIntel
            reports={reports}
            onAddReport={handleAddReport}
            onUpvoteReport={handleUpvoteReport}
            onVerifyReport={handleVerifyReport}
            isExtensionOfficer={user.role === 'extension_officer' || user.role === 'admin'}
            onRequestOpenMapWithReport={() => setActiveTab('map')}
          />
        )}

        {activeTab === 'risk_prediction' && (
          <AIRiskPrediction predictions={predictions} />
        )}

        {activeTab === 'whatif' && (
          <WhatIfSimulator farm={activeFarm} />
        )}

        {activeTab === 'markets' && (
          <MarketIntelligence markets={markets} />
        )}

        {activeTab === 'admin' && (
          <AdminExtensionDashboard
            role={user.role}
            farms={farms}
            reports={reports}
            onVerifyReport={handleVerifyReport}
            onSendBroadcast={handleSendBroadcast}
          />
        )}

      </main>

      {/* Floating AI Assistant Chatbot Trigger Button (Bottom Right) */}
      <button
        onClick={() => setShowAssistant(true)}
        className="fixed bottom-6 right-6 z-40 p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 text-stone-950 font-bold shadow-2xl shadow-emerald-900/50 flex items-center space-x-2 transition-transform hover:scale-105 active:scale-95 border border-emerald-300"
      >
        <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
        <span className="text-xs hidden sm:inline font-black uppercase tracking-wider">
          AgriShield AI Advisor
        </span>
      </button>

      {/* Modals */}
      <AIAssistantModal
        isOpen={showAssistant}
        onClose={() => setShowAssistant(false)}
        farm={activeFarm}
        weather={weather}
        reports={reports}
      />

      <FarmerProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={user}
        activeFarm={activeFarm}
        onUpdateFarm={handleUpdateFarm}
      />

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 py-6 text-xs text-center space-y-1">
        <div className="font-semibold text-stone-300">
          AgriShield AI — Intelligent Climate Risk & Farm Decision Support Platform
        </div>
        <div className="text-[11px] text-stone-500">
          Powered by Gemini 3.6 Flash & Open-Meteo Climate Datasets • Climate Tech Hackathon MVP
        </div>
      </footer>

    </div>
  );
}
