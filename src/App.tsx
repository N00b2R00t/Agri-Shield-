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
  deleteFarmFromDb,
  deleteReportFromDb,
  deleteRecommendationFromDb,
  deletePredictionFromDb,
  deleteMarketPriceFromDb,
  createExpressSession,
  getCurrentDeviceId,
} from './lib/dbService';

// Role Views Import
import {
  FarmerDashboard,
  MyFarms,
  RiskAlerts,
  SmartAdvisory,
  MarketPrices,
  FarmerSettings,
  FarmerSupport,
  ExtensionDashboard,
  RegionalFarms,
  BroadcastDispatcher,
  FieldAdvisory,
  PestOutbreakRadar,
  ExtensionSimulations,
  ExtensionSettings,
  ExtensionSupport,
  NGODashboard,
  ClimateGISMap,
  VulnerabilityAnalytics,
  ClimateSimulator,
  NGOCommunityReports,
  MarketTrends,
  NGOSettings,
  NGOSupport,
  AdminDashboard,
  UserManagement,
  SystemBroadcast,
  RiskAnalytics,
  DatabaseMonitor,
  MarketAdmin,
  AdminSettings,
  AdminSupport,
} from './roles';

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
import { DocumentationModal } from './components/DocumentationModal';
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
  Sprout,
  MessageSquare,
  Settings,
  Radio,
  Globe,
  BarChart3,
  Lock,
  Database,
  ShieldCheck,
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
  const [assistantInitialQuestion, setAssistantInitialQuestion] = useState<string | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showNewFarmModal, setShowNewFarmModal] = useState(false);
  const [showLivestockModal, setShowLivestockModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showDocModal, setShowDocModal] = useState(false);
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('agrishield_theme');
    return (saved as ThemeMode) || 'system';
  });
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [sessionNotice, setSessionNotice] = useState<string>('');

  // 1-Day Express Session Expiry (24 Hrs = 86400s) & Device Password Revocation Sync
  useEffect(() => {
    function verifySessionAndRevocation() {
      const savedSession = localStorage.getItem('agrishield_session_user');
      if (savedSession) {
        try {
          const parsed = JSON.parse(savedSession);

          // 1. Check 1-Day Express Session Expiry
          if (parsed.sessionExpiresAt && Date.now() > parsed.sessionExpiresAt) {
            localStorage.removeItem('agrishield_session_user');
            setIsAuthenticated(false);
            setSessionNotice('Your 1-Day Express Session has expired. Please sign in again.');
            return;
          }

          // 2. Check Password Change Revocation for Other Registered Devices
          const revocationStr = localStorage.getItem('agrishield_password_revocation');
          if (revocationStr && parsed.email) {
            const revocation = JSON.parse(revocationStr);
            if (revocation.email && revocation.email.toLowerCase() === parsed.email.toLowerCase()) {
              const currentDevId = getCurrentDeviceId();
              if (revocation.validDeviceId && revocation.validDeviceId !== currentDevId) {
                localStorage.removeItem('agrishield_session_user');
                setIsAuthenticated(false);
                setSessionNotice(
                  'Your account password was updated from another device. All other active sessions were logged out for security.'
                );
              }
            }
          }
        } catch (e) {
          console.warn('Session verification exception:', e);
        }
      }
    }

    verifySessionAndRevocation();
    const interval = setInterval(verifySessionAndRevocation, 3000);
    window.addEventListener('storage', verifySessionAndRevocation);

    return () => {
      clearInterval(interval);
      window.removeEventListener('storage', verifySessionAndRevocation);
    };
  }, []);

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
      if (dbUsers && dbUsers.length > 0) {
        setUsersList(dbUsers);
        // Sync active user session role with database profile
        const activeEmail = user.email ? user.email.toLowerCase() : '';
        const dbUser = dbUsers.find((u) => u.email.toLowerCase() === activeEmail || u.id === user.id);
        if (dbUser) {
          if (dbUser.role !== user.role || dbUser.name !== user.name || dbUser.county !== user.county) {
            setUser(dbUser);
            localStorage.setItem('agrishield_session_user', JSON.stringify(dbUser));
            setActiveTab('dashboard');
          }
        }
      }
    }

    loadSupabaseData();
  }, []);

  // Live sync user profile & role updates from Database (every 10s or when window gains focus)
  useEffect(() => {
    async function syncUserProfileFromDb() {
      if (!user || !user.email) return;
      const dbUsers = await getProfilesFromDb();
      if (dbUsers && dbUsers.length > 0) {
        setUsersList(dbUsers);
        const activeEmail = user.email.toLowerCase();
        const dbUser = dbUsers.find((u) => u.email.toLowerCase() === activeEmail || u.id === user.id);
        if (dbUser && (dbUser.role !== user.role || dbUser.name !== user.name || dbUser.county !== user.county)) {
          setUser(dbUser);
          localStorage.setItem('agrishield_session_user', JSON.stringify(dbUser));
          setActiveTab('dashboard');
        }
      }
    }

    window.addEventListener('focus', syncUserProfileFromDb);
    const interval = setInterval(syncUserProfileFromDb, 10000);

    return () => {
      window.removeEventListener('focus', syncUserProfileFromDb);
      clearInterval(interval);
    };
  }, [user.email, user.role, user.id]);

  // Load weather when active farm changes
  useEffect(() => {
    async function loadWeather() {
      if (!activeFarm) return;
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
    const sessionUser = createExpressSession(loggedInUser);
    setUser(sessionUser);
    setIsAuthenticated(true);
    setShowAuthModal(false);
    setSessionNotice('');

    // Ensure user is in list
    setUsersList((prev) => {
      const exists = prev.some((u) => u.id === sessionUser.id || u.email === sessionUser.email);
      if (!exists) return [sessionUser, ...prev];
      return prev.map((u) => (u.email === sessionUser.email ? sessionUser : u));
    });

    setActiveTab('dashboard');

    await saveProfileToDb(sessionUser);
  };

  const handleAddUser = async (newUser: UserProfile) => {
    setUsersList((prev) => [newUser, ...prev]);
    await saveProfileToDb(newUser);
  };

  const handleUpdateUserRole = async (id: string, newRole: UserRole) => {
    let updatedUser: UserProfile | undefined;
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.id === id || (u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase())) {
          updatedUser = { ...u, role: newRole };
          return updatedUser;
        }
        return u;
      })
    );

    if (updatedUser) {
      await saveProfileToDb(updatedUser);
      if (id === user.id || (updatedUser.email && user.email && updatedUser.email.toLowerCase() === user.email.toLowerCase())) {
        setUser(updatedUser);
        localStorage.setItem('agrishield_session_user', JSON.stringify(updatedUser));
        setActiveTab('dashboard');
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

  const handleDeleteFarm = async (farmId: string) => {
    setFarms((prev) => {
      const updated = prev.filter((f) => f.id !== farmId);
      if (activeFarm?.id === farmId) {
        setActiveFarm(updated.length > 0 ? updated[0] : null);
      }
      return updated;
    });
    await deleteFarmFromDb(farmId);
  };

  const handleDeleteReport = async (id: string) => {
    setReports((prev) => prev.filter((r) => r.id !== id));
    await deleteReportFromDb(id);
  };

  const handleDeleteRecommendation = async (id: string) => {
    setRecommendations((prev) => prev.filter((r) => r.id !== id));
    await deleteRecommendationFromDb(id);
  };

  const handleDeletePrediction = async (id: string) => {
    setPredictions((prev) => prev.filter((p) => p.id !== id));
    await deletePredictionFromDb(id);
  };

  const handleDeleteMarketPrice = async (id: string) => {
    setMarkets((prev) => prev.filter((m) => m.id !== id));
    await deleteMarketPriceFromDb(id);
  };

  const handleSignOut = () => {
    localStorage.removeItem('agrishield_session_user');
    setIsAuthenticated(false);
    setShowAuthModal(false);
  };

  const handleChangeRole = (newRole: UserRole) => {
    const updatedUser = { ...user, role: newRole };
    setUser(updatedUser);
    localStorage.setItem('agrishield_session_user', JSON.stringify(updatedUser));
    setUsersList((prev) => prev.map((u) => (u.id === user.id || u.email === user.email ? updatedUser : u)));
    saveProfileToDb(updatedUser);

    setActiveTab('dashboard');
  };

  // Handle adding community report
  const handleAddReport = async (newRep: Partial<CommunityReport>) => {
    const reportData: CommunityReport = {
      id: `rep-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      farmName: activeFarm ? activeFarm.name : 'General Sector',
      reportType: newRep.reportType || 'pest',
      cropAffected: newRep.cropAffected || (activeFarm ? activeFarm.cropType : 'Crops'),
      severity: newRep.severity || 'high',
      description: newRep.description || 'Observed pest activity in field.',
      photoUrl: newRep.photoUrl,
      lat: (activeFarm ? activeFarm.lat : -0.5) + (Math.random() * 0.01 - 0.005),
      lng: (activeFarm ? activeFarm.lng : 35.2) + (Math.random() * 0.01 - 0.005),
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
    if (!activeFarm) return;
    const updatedFarm = { ...activeFarm, ...updated };
    setActiveFarm(updatedFarm);
    setFarms((prev) => prev.map((f) => (f.id === updatedFarm.id ? updatedFarm : f)));
    await saveFarmToDb(updatedFarm);
  };

  // Handle update user profile
  const handleUpdateUser = (updatedProps: Partial<UserProfile>) => {
    const updated = { ...user, ...updatedProps };
    setUser(updated);
    localStorage.setItem('agrishield_session_user', JSON.stringify(updated));
    setUsersList((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
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

  const getNavTabsForRole = (role: UserRole) => {
    switch (role) {
      case 'farmer':
        return [
          { id: 'dashboard', label: 'Farm Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
          { id: 'my_farms', label: 'My Plots & Herd', icon: <Sprout className="w-4 h-4 text-emerald-400" /> },
          { id: 'advisory', label: 'Smart Advisory', icon: <Sparkles className="w-4 h-4 text-amber-400" />, badge: recommendations.filter(r => r.status === 'pending').length },
          { id: 'risk_alerts', label: 'Risk Radar', icon: <AlertTriangle className="w-4 h-4 text-red-400" /> },
          { id: 'community', label: 'Community Intel', icon: <Users className="w-4 h-4" />, badge: reports.length },
          { id: 'markets', label: 'Market Prices', icon: <Store className="w-4 h-4" /> },
          { id: 'settings', label: 'Farmer Settings', icon: <Settings className="w-4 h-4" /> },
          { id: 'support', label: 'Support / Messages', icon: <MessageSquare className="w-4 h-4 text-cyan-400" /> },
        ];
      case 'extension_officer':
        return [
          { id: 'dashboard', label: 'Officer Dashboard', icon: <Building2 className="w-4 h-4 text-blue-400" /> },
          { id: 'regional_farms', label: 'Regional Smallholders', icon: <Sprout className="w-4 h-4 text-emerald-400" /> },
          { id: 'broadcast', label: 'Emergency Broadcast', icon: <Radio className="w-4 h-4 text-red-400" /> },
          { id: 'field_advisory', label: 'Field Advisory', icon: <Sparkles className="w-4 h-4 text-amber-400" /> },
          { id: 'outbreak_radar', label: 'Outbreak Radar', icon: <Bug className="w-4 h-4 text-red-400" /> },
          { id: 'simulations', label: 'Yield Simulator', icon: <Zap className="w-4 h-4 text-amber-400" /> },
          { id: 'settings', label: 'Officer Credentials', icon: <Settings className="w-4 h-4" /> },
          { id: 'support', label: 'Messages & Support', icon: <MessageSquare className="w-4 h-4 text-cyan-400" /> },
        ];
      case 'ngo':
        return [
          { id: 'dashboard', label: 'NGO Desk', icon: <Globe className="w-4 h-4 text-purple-400" /> },
          { id: 'gis_map', label: 'Climate GIS Map', icon: <MapPin className="w-4 h-4 text-blue-400" /> },
          { id: 'vulnerability', label: 'Vulnerability Matrix', icon: <BarChart3 className="w-4 h-4 text-amber-400" /> },
          { id: 'simulator', label: 'Climate Simulator', icon: <Zap className="w-4 h-4 text-emerald-400" /> },
          { id: 'reports', label: 'Field Incident Audit', icon: <Users className="w-4 h-4" />, badge: reports.length },
          { id: 'markets', label: 'Food Security Trends', icon: <Store className="w-4 h-4" /> },
          { id: 'settings', label: 'NGO Profile', icon: <Settings className="w-4 h-4" /> },
          { id: 'support', label: 'Impact Support', icon: <MessageSquare className="w-4 h-4 text-cyan-400" /> },
        ];
      case 'admin':
        return [
          { id: 'dashboard', label: 'Director Control', icon: <Lock className="w-4 h-4 text-red-400" /> },
          { id: 'users', label: 'User & Role Manager', icon: <Users className="w-4 h-4 text-emerald-400" />, badge: usersList.length },
          { id: 'broadcast', label: 'Global Broadcast', icon: <Radio className="w-4 h-4 text-red-400" /> },
          { id: 'risk', label: 'Disease Risk Engines', icon: <Bug className="w-4 h-4 text-amber-400" /> },
          { id: 'db_monitor', label: 'Database & API Telemetry', icon: <Database className="w-4 h-4 text-cyan-400" /> },
          { id: 'market_admin', label: 'Commodity Feed Editor', icon: <Store className="w-4 h-4" /> },
          { id: 'settings', label: 'Security Policies', icon: <Settings className="w-4 h-4" /> },
          { id: 'support', label: 'Messages & Audit Logs', icon: <MessageSquare className="w-4 h-4 text-cyan-400" /> },
        ];
    }
  };

  const navTabs = getNavTabsForRole(user.role);

  // Auto fallback if active tab is disallowed for current role
  useEffect(() => {
    const isAllowed = navTabs.some((t) => t.id === activeTab);
    if (!isAllowed && navTabs.length > 0) {
      setActiveTab(navTabs[0].id as any);
    }
  }, [user.role, activeTab]);

  if (!isAuthenticated) {
    return (
      <ErrorBoundary>
        {sessionNotice && (
          <div className="max-w-md mx-auto my-3 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 text-xs font-bold flex items-center justify-between shadow-sm">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{sessionNotice}</span>
            </div>
            <button
              onClick={() => setSessionNotice('')}
              className="text-amber-700 hover:text-amber-950 p-1 font-black"
            >
              ✕
            </button>
          </div>
        )}
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
          onDeleteFarm={handleDeleteFarm}
          onChangeRole={handleChangeRole}
          onOpenNewFarmModal={() => setShowNewFarmModal(true)}
          onOpenLivestockModal={() => setShowLivestockModal(true)}
          onOpenSettingsModal={() => setShowSettingsModal(true)}
          onOpenDocModal={() => setShowDocModal(true)}
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
        
        {/* FARMER ROLE VIEWS */}
        {user.role === 'farmer' && (
          <>
            {activeTab === 'dashboard' && (
              <FarmerDashboard
                user={user}
                farm={activeFarm}
                weather={weather}
                recommendations={recommendations}
                reports={reports}
                onNavigate={(tab) => setActiveTab(tab as any)}
                onOpenAssistant={() => setShowAssistant(true)}
                onOpenNewFarmModal={() => setShowNewFarmModal(true)}
              />
            )}
            {activeTab === 'my_farms' && (
              <MyFarms
                user={user}
                activeFarm={activeFarm}
                farms={farms}
                onSelectFarm={setActiveFarm}
                onOpenNewFarm={() => setShowNewFarmModal(true)}
                onOpenLivestockModal={() => setShowLivestockModal(true)}
                onOpenAssistantWithQuestion={(question, farm) => {
                  if (farm) setActiveFarm(farm);
                  setAssistantInitialQuestion(question || null);
                  setShowAssistant(true);
                }}
              />
            )}
            {activeTab === 'advisory' && (
              <SmartAdvisory
                activeFarm={activeFarm}
                recommendations={recommendations}
                onStatusChange={handleRecommendationStatusChange}
                onRefreshAI={handleRefreshAI}
                isGeneratingAI={isGeneratingAI}
                onOpenNewFarmModal={() => setShowNewFarmModal(true)}
                onDeleteRecommendation={handleDeleteRecommendation}
              />
            )}
            {activeTab === 'risk_alerts' && (
              <RiskAlerts
                predictions={predictions}
                reports={reports}
                onDeletePrediction={handleDeletePrediction}
              />
            )}
            {activeTab === 'community' && (
              <CommunityIntel
                reports={reports}
                user={user}
                onAddReport={handleAddReport}
                onUpvoteReport={handleUpvoteReport}
                onVerifyReport={handleVerifyReport}
                onDeleteReport={handleDeleteReport}
              />
            )}
            {activeTab === 'markets' && (
              <MarketPrices markets={markets} />
            )}
            {activeTab === 'settings' && (
              <FarmerSettings
                user={user}
                onOpenSettingsModal={() => setShowSettingsModal(true)}
              />
            )}
            {activeTab === 'support' && (
              <FarmerSupport
                onOpenDocModal={() => setShowDocModal(true)}
              />
            )}
          </>
        )}

        {/* EXTENSION OFFICER ROLE VIEWS */}
        {user.role === 'extension_officer' && (
          <>
            {activeTab === 'dashboard' && (
              <ExtensionDashboard
                user={user}
                farms={farms}
                reports={reports}
                predictions={predictions}
                onNavigate={(tab) => setActiveTab(tab as any)}
                onSendNotification={(notif) => handleSendBroadcast(notif.title, notif.message)}
              />
            )}
            {activeTab === 'regional_farms' && (
              <RegionalFarms farms={farms} user={user} />
            )}
            {activeTab === 'broadcast' && (
              <BroadcastDispatcher
                onSendNotification={(notif) => handleSendBroadcast(notif.title, notif.message)}
              />
            )}
            {activeTab === 'field_advisory' && (
              <FieldAdvisory
                activeFarm={activeFarm}
                recommendations={recommendations}
                onStatusChange={handleRecommendationStatusChange}
                onRefreshAI={handleRefreshAI}
                isGeneratingAI={isGeneratingAI}
              />
            )}
            {activeTab === 'outbreak_radar' && (
              <PestOutbreakRadar predictions={predictions} reports={reports} />
            )}
            {activeTab === 'simulations' && (
              <ExtensionSimulations activeFarm={activeFarm} />
            )}
            {activeTab === 'settings' && (
              <ExtensionSettings
                user={user}
                onOpenSettingsModal={() => setShowSettingsModal(true)}
              />
            )}
            {activeTab === 'support' && (
              <ExtensionSupport
                onOpenDocModal={() => setShowDocModal(true)}
              />
            )}
          </>
        )}

        {/* NGO ROLE VIEWS */}
        {user.role === 'ngo' && (
          <>
            {activeTab === 'dashboard' && (
              <NGODashboard
                user={user}
                farms={farms}
                weather={weather}
                reports={reports}
                onNavigate={(tab) => setActiveTab(tab as any)}
              />
            )}
            {activeTab === 'gis_map' && (
              <ClimateGISMap farms={farms} reports={reports} user={user} />
            )}
            {activeTab === 'vulnerability' && (
              <VulnerabilityAnalytics weather={weather} farms={farms} />
            )}
            {activeTab === 'simulator' && (
              <ClimateSimulator activeFarm={activeFarm} />
            )}
            {activeTab === 'reports' && (
              <NGOCommunityReports reports={reports} user={user} />
            )}
            {activeTab === 'markets' && (
              <MarketTrends markets={markets} />
            )}
            {activeTab === 'settings' && (
              <NGOSettings
                user={user}
                onOpenSettingsModal={() => setShowSettingsModal(true)}
              />
            )}
            {activeTab === 'support' && (
              <NGOSupport
                onOpenDocModal={() => setShowDocModal(true)}
              />
            )}
          </>
        )}

        {/* ADMIN ROLE VIEWS */}
        {user.role === 'admin' && (
          <>
            {activeTab === 'dashboard' && (
              <AdminDashboard
                user={user}
                usersList={usersList}
                farms={farms}
                reports={reports}
                predictions={predictions}
                onNavigate={(tab) => setActiveTab(tab as any)}
              />
            )}
            {activeTab === 'users' && (
              <UserManagement
                user={user}
                usersList={usersList}
                onUpdateRole={handleUpdateUserRole}
                onDeleteProfile={handleDeleteUser}
              />
            )}
            {activeTab === 'broadcast' && (
              <SystemBroadcast
                onSendNotification={(notif) => handleSendBroadcast(notif.title, notif.message)}
              />
            )}
            {activeTab === 'risk' && (
              <RiskAnalytics predictions={predictions} />
            )}
            {activeTab === 'db_monitor' && (
              <DatabaseMonitor />
            )}
            {activeTab === 'market_admin' && (
              <MarketAdmin markets={markets} />
            )}
            {activeTab === 'settings' && (
              <AdminSettings
                user={user}
                onOpenSettingsModal={() => setShowSettingsModal(true)}
              />
            )}
            {activeTab === 'support' && (
              <AdminSupport
                onOpenDocModal={() => setShowDocModal(true)}
              />
            )}
          </>
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
        onClose={() => {
          setShowAssistant(false);
          setAssistantInitialQuestion(null);
        }}
        farm={activeFarm}
        weather={weather}
        reports={reports}
        initialQuestion={assistantInitialQuestion}
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
        onUpdateUser={handleUpdateUser}
        usersList={usersList}
        onUpdateUsersList={setUsersList}
        onSendSystemBroadcast={(title, message) => handleSendBroadcast(title, message)}
      />

      <DocumentationModal
        isOpen={showDocModal}
        onClose={() => setShowDocModal(false)}
      />

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 border-t border-stone-800 py-6 text-xs text-center space-y-2">
        <div className="font-semibold text-stone-300 flex items-center justify-center space-x-2">
          <span>AgriShield AI — Intelligent Climate Risk & Farm Decision Support Platform</span>
          <button
            onClick={() => setShowDocModal(true)}
            className="text-emerald-400 hover:text-emerald-300 font-bold underline text-xs transition-colors"
          >
            System Documentation
          </button>
        </div>
        <div className="text-[11px] text-stone-400 font-medium">
          Designed & Developed by <span className="text-emerald-400 font-bold">Ian Chirchir</span> • Powered by Gemini AI & Supabase
        </div>
      </footer>

      </div>
    </ErrorBoundary>
  );
}
