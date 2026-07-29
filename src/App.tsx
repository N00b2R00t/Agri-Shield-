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
  INITIAL_USERS,
  INITIAL_FARMS,
  INITIAL_WEATHER,
  INITIAL_RECOMMENDATIONS,
  INITIAL_REPORTS,
  INITIAL_DISEASE_PREDICTIONS,
  INITIAL_MARKET_PRICES,
  INITIAL_NOTIFICATIONS,
} from './data/mockData';
import {
  initializeAndSeedSupabase,
  getFarmsFromDb,
  saveFarmToDb,
  getReportsFromDb,
  addReportToDb,
  updateReportInDb,
  getRecommendationsFromDb,
  updateRecommendationStatusInDb,
  saveRecommendationsToDb,
  getDiseasePredictionsFromDb,
  getMarketPricesFromDb,
  getNotificationsFromDb,
  addNotificationToDb,
  getProfilesFromDb,
  saveProfileToDb,
  deleteProfileFromDb,
} from './lib/dbService';

// UI Components
import { Navbar } from './components/Navbar';
import { ErrorBoundary } from './components/ErrorPage';
import { OfflinePage } from './components/OfflinePage';
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
import { AuthModal } from './components/AuthModal';
import { LiveBackgroundTelemetry } from './components/LiveBackgroundTelemetry';
import { NewFarmModal } from './components/NewFarmModal';
import { LivestockManagerModal } from './components/LivestockManagerModal';
import { SettingsModal, ThemeMode } from './components/SettingsModal';
import { LandingPage } from './components/LandingPage';

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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    const saved = localStorage.getItem('agrishield_session_user');
    return !!saved;
  });
  const [authInitialMode, setAuthInitialMode] = useState<'login' | 'signup'>('login');

  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('agrishield_session_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email) return parsed;
      } catch {
        // Fallback
      }
    }
    return INITIAL_USER;
  });
  const [usersList, setUsersList] = useState<UserProfile[]>(INITIAL_USERS);
  const [farms, setFarms] = useState<Farm[]>(() => {
    const saved = localStorage.getItem('agrishield_user_farms');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        // Fallback
      }
    }
    return [];
  });
  const [activeFarm, setActiveFarm] = useState<Farm | null>(() => {
    const saved = localStorage.getItem('agrishield_user_farms');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed[0];
      } catch {
        // Fallback
      }
    }
    return null;
  });

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
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showNewFarmModal, setShowNewFarmModal] = useState(false);
  const [showLivestockModal, setShowLivestockModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('agrishield_theme');
    return (saved as ThemeMode) || 'system';
  });
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);

  // Apply Theme Effect
  useEffect(() => {
    localStorage.setItem('agrishield_theme', theme);
    const root = document.documentElement;

    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System mode
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [theme]);

  // Initialize and load data from Supabase
  useEffect(() => {
    async function loadSupabaseData() {
      await initializeAndSeedSupabase();

      const [
        dbFarms,
        dbReports,
        dbRecs,
        dbPreds,
        dbMarkets,
        dbNotifs,
        dbUsers,
      ] = await Promise.all([
        getFarmsFromDb(),
        getReportsFromDb(),
        getRecommendationsFromDb(),
        getDiseasePredictionsFromDb(),
        getMarketPricesFromDb(),
        getNotificationsFromDb(),
        getProfilesFromDb(),
      ]);

      if (dbFarms && dbFarms.length > 0) {
        setFarms(dbFarms);
        setActiveFarm(dbFarms[0]);
      }
      if (dbReports && dbReports.length > 0) setReports(dbReports);
      if (dbRecs && dbRecs.length > 0) setRecommendations(dbRecs);
      if (dbPreds && dbPreds.length > 0) setPredictions(dbPreds);
      if (dbMarkets && dbMarkets.length > 0) setMarkets(dbMarkets);
      if (dbNotifs && dbNotifs.length > 0) setNotifications(dbNotifs);
      if (dbUsers && dbUsers.length > 0) setUsersList(dbUsers);
    }

    loadSupabaseData();
  }, []);

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

  // User Management & Authentication Handlers
  const handleLoginSuccess = async (loggedInUser: UserProfile) => {
    setUser(loggedInUser);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    localStorage.setItem('agrishield_session_user', JSON.stringify(loggedInUser));

    // Ensure user is in list
    setUsersList((prev) => {
      const exists = prev.some((u) => u.id === loggedInUser.id || u.email === loggedInUser.email);
      if (!exists) return [loggedInUser, ...prev];
      return prev.map((u) => (u.email === loggedInUser.email ? loggedInUser : u));
    });

    if (loggedInUser.role === 'admin' || loggedInUser.role === 'extension_officer') {
      setActiveTab('admin');
    }

    await saveProfileToDb(loggedInUser);
  };

  const handleAddUser = async (newUser: UserProfile) => {
    setUsersList((prev) => [newUser, ...prev]);
    await saveProfileToDb(newUser);
  };

  const handleUpdateUserRole = async (id: string, newRole: UserRole) => {
    let updatedUser: UserProfile | undefined;
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          updatedUser = { ...u, role: newRole };
          return updatedUser;
        }
        return u;
      })
    );

    if (updatedUser) {
      await saveProfileToDb(updatedUser);
      if (id === user.id) {
        setUser(updatedUser);
      }
    }
  };

  const handleDeleteUser = async (id: string) => {
    setUsersList((prev) => prev.filter((u) => u.id !== id));
    await deleteProfileFromDb(id);
  };

  const handleAddFarm = async (newFarm: Farm) => {
    setFarms((prev) => [newFarm, ...prev]);
    setActiveFarm(newFarm);
    await saveFarmToDb(newFarm);
  };

  const handleSignOut = () => {
    localStorage.removeItem('agrishield_session_user');
    setIsAuthenticated(false);
    setShowAuthModal(false);
  };

  const handleChangeRole = (newRole: UserRole) => {
    setUser({ ...user, role: newRole });
    if (newRole === 'admin' || newRole === 'extension_officer') {
      setActiveTab('admin');
    }
  };

  // Handle adding community report
  const handleAddReport = async (newRep: Partial<CommunityReport>) => {
    const reportData: CommunityReport = {
      id: `rep-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      farmName: activeFarm.name,
      reportType: newRep.reportType || 'pest',
      cropAffected: newRep.cropAffected || activeFarm.cropType,
      severity: newRep.severity || 'high',
      description: newRep.description || 'Observed pest activity in field.',
      photoUrl: newRep.photoUrl,
      lat: activeFarm.lat + (Math.random() * 0.01 - 0.005),
      lng: activeFarm.lng + (Math.random() * 0.01 - 0.005),
      createdAt: new Date().toISOString(),
      verified: true,
      upvotes: 1,
      distanceKm: 0.5,
    };

    setReports((prev) => [reportData, ...prev]);
    await addReportToDb(reportData);
  };

  // Handle upvoting report
  const handleUpvoteReport = async (id: string) => {
    const reportToUpdate = reports.find((r) => r.id === id);
    if (!reportToUpdate) return;
    const newUpvotes = reportToUpdate.upvotes + 1;
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, upvotes: newUpvotes } : r))
    );
    await updateReportInDb(id, { upvotes: newUpvotes });
  };

  // Handle verifying report
  const handleVerifyReport = async (id: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === id ? { ...r, verified: true } : r))
    );
    await updateReportInDb(id, { verified: true });
  };

  // Handle recommendation status change
  const handleRecommendationStatusChange = async (
    id: string,
    newStatus: 'accepted' | 'completed' | 'dismissed'
  ) => {
    setRecommendations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: newStatus } : r))
    );
    await updateRecommendationStatusInDb(id, newStatus);
  };

  // Refresh AI recommendations via Gemini & persist to Firestore
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
        await saveRecommendationsToDb(freshRecs);
      }
    } catch (err) {
      console.error('Failed to generate fresh AI recommendations:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Handle update farm profile
  const handleUpdateFarm = async (updated: Partial<Farm>) => {
    const updatedFarm = { ...activeFarm, ...updated };
    setActiveFarm(updatedFarm);
    setFarms((prev) => prev.map((f) => (f.id === updatedFarm.id ? updatedFarm : f)));
    await saveFarmToDb(updatedFarm);
  };

  // Broadcast Alert from Extension Officer & persist to Firestore
  const handleSendBroadcast = async (title: string, message: string) => {
    const newNotif: AlertNotification = {
      id: `notif-${Date.now()}`,
      title,
      type: 'weather_warning',
      severity: 'critical',
      message,
      timestamp: new Date().toISOString(),
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
    await addNotificationToDb(newNotif);
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

  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        <LandingPage
          onOpenLogin={() => {
            setAuthInitialMode('login');
            setShowAuthModal(true);
          }}
          onOpenSignUp={() => {
            setAuthInitialMode('signup');
            setShowAuthModal(true);
          }}
        />
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
          onLoginSuccess={handleLoginSuccess}
          initialMode={authInitialMode}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-stone-100 text-stone-900 font-sans flex flex-col antialiased selection:bg-emerald-500 selection:text-white relative">
        
        {/* Live Ambient Telemetry Particles & Satellite Radar Sync */}
        <LiveBackgroundTelemetry />

        {/* Offline Banner when network disconnects */}
        <OfflinePage mode="banner" />

        {/* Navbar Header */}
        <Navbar
          user={user}
          activeFarm={activeFarm}
          farms={farms}
          onSelectFarm={(f) => setActiveFarm(f)}
          onChangeRole={handleChangeRole}
          onOpenNewFarmModal={() => setShowNewFarmModal(true)}
          onOpenLivestockModal={() => setShowLivestockModal(true)}
          onOpenSettingsModal={() => setShowSettingsModal(true)}
          onOpenProfileModal={() => setShowProfileModal(true)}
          onOpenAuthModal={() => setShowAuthModal(true)}
          onSignOut={handleSignOut}
          notifications={notifications}
          onOpenAssistant={() => setShowAssistant(true)}
          activeTab={activeTab}
          onSelectTab={(tabId) => setActiveTab(tabId as any)}
          navTabs={navTabs}
        />

        {/* Persona View Perspective Banner */}
        <RoleBanner role={user.role} onChangeRole={handleChangeRole} />

        {/* Desktop Workspace Navigation Tabs Bar */}
        <div className="hidden md:block bg-stone-900 text-stone-200 border-b border-stone-800 shadow-inner">
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
            onOpenNewFarmModal={() => setShowNewFarmModal(true)}
          />
        )}

        {activeTab === 'recommendations' && (
          <SmartRecommendations
            farm={activeFarm}
            recommendations={recommendations.filter((r) => !activeFarm || r.farmId === activeFarm.id)}
            onStatusChange={handleRecommendationStatusChange}
            onRefreshAI={handleRefreshAI}
            isGeneratingAI={isGeneratingAI}
            onOpenNewFarmModal={() => setShowNewFarmModal(true)}
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
            currentUser={user}
            usersList={usersList}
            farms={farms}
            reports={reports}
            onVerifyReport={handleVerifyReport}
            onSendBroadcast={handleSendBroadcast}
            onAddUser={handleAddUser}
            onUpdateUserRole={handleUpdateUserRole}
            onDeleteUser={handleDeleteUser}
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
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
        initialMode={authInitialMode}
      />

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

      <NewFarmModal
        isOpen={showNewFarmModal}
        onClose={() => setShowNewFarmModal(false)}
        onAddFarm={handleAddFarm}
        userCounty={user.county}
      />

      <LivestockManagerModal
        isOpen={showLivestockModal}
        onClose={() => setShowLivestockModal(false)}
        activeFarm={activeFarm}
        onUpdateFarm={handleUpdateFarm}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
        user={user}
        onSignOut={handleSignOut}
        theme={theme}
        onThemeChange={setTheme}
      />

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 py-6 text-xs text-center space-y-1">
        <div className="font-semibold text-stone-300">
          AgriShield AI — Intelligent Climate Risk & Farm Decision Support Platform
        </div>
        <div className="text-[11px] text-stone-400 font-medium">
          Designed & Developed by <span className="text-emerald-400 font-bold">Ian Chirchir</span> • Powered by Gemini AI & Supabase
        </div>
      </footer>

      </div>
    </ErrorBoundary>
  );
}
