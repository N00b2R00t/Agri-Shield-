import React, { useState } from 'react';
import { AgriShieldLogoFull } from './AgriShieldLogo';
import {
  MapPin,
  Bell,
  User,
  Plus,
  Sprout,
  Sparkles,
  ChevronDown,
  Settings,
  CheckCircle,
  AlertTriangle,
  Menu,
  X,
  ShieldCheck,
  Building2,
  HelpCircle,
  MessageSquare,
  LogOut,
  ChevronRight,
  Sun,
  Moon,
} from 'lucide-react';
import { Farm, UserRole, UserProfile, AlertNotification } from '../types';
import { KENYA_COUNTIES, getCountyByName } from '../data/kenyaCounties';

export interface NavTabItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

interface NavbarProps {
  user: UserProfile;
  activeFarm: Farm;
  farms: Farm[];
  onSelectFarm: (farm: Farm) => void;
  onChangeRole: (role: UserRole) => void;
  onOpenNewFarmModal: () => void;
  onOpenProfileModal: () => void;
  onOpenAuthModal: () => void;
  onOpenLivestockModal?: () => void;
  onOpenSettingsModal?: () => void;
  onSignOut?: () => void;
  notifications: AlertNotification[];
  onOpenAssistant: () => void;
  activeTab: string;
  onSelectTab: (tabId: any) => void;
  navTabs: NavTabItem[];
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeFarm,
  farms,
  onSelectFarm,
  onChangeRole,
  onOpenNewFarmModal,
  onOpenProfileModal,
  onOpenAuthModal,
  onOpenLivestockModal,
  onOpenSettingsModal,
  onSignOut,
  notifications,
  onOpenAssistant,
  activeTab,
  onSelectTab,
  navTabs,
}) => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFarmDropdown, setShowFarmDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const userCountyObj = getCountyByName(user.county || activeFarm.county);

  const roleLabels: Record<UserRole, { label: string; bg: string; text: string }> = {
    farmer: { label: 'Smallholder Farmer', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', text: 'text-emerald-700' },
    extension_officer: { label: 'Extension Officer', bg: 'bg-blue-100 text-blue-800 border-blue-300', text: 'text-blue-700' },
    ngo: { label: 'NGO / Climate Specialist', bg: 'bg-purple-100 text-purple-800 border-purple-300', text: 'text-purple-700' },
    admin: { label: 'Gov / System Admin', bg: 'bg-amber-100 text-amber-800 border-amber-300', text: 'text-amber-700' },
  };

  const handleTabClick = (tabId: string) => {
    onSelectTab(tabId);
    setShowMobileMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-md">
      <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8">
        
        {/* Main Header Bar: Reduced height on mobile (h-13/h-14) & h-16 on desktop */}
        <div className="flex items-center justify-between h-13 sm:h-16">
          
          {/* Left: Brand Logo & Compact County Badge */}
          <div className="flex items-center space-x-2 shrink-0">
            <AgriShieldLogoFull size={32} variant="dark" />
            
            {userCountyObj && (
              <span className="hidden xl:inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-stone-800 border border-stone-700 text-[10px] font-bold text-stone-300">
                <MapPin className="w-3 h-3 text-emerald-400" />
                <span>{userCountyObj.name} ({userCountyObj.code})</span>
              </span>
            )}
          </div>

          {/* Center: Desktop Farm Switcher */}
          <div className="hidden md:block relative">
            <button
              onClick={() => {
                setShowFarmDropdown(!showFarmDropdown);
                setShowRoleDropdown(false);
                setShowNotifications(false);
              }}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-200 text-xs font-medium transition-colors"
            >
              <Sprout className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="text-left max-w-[150px] lg:max-w-[210px] truncate">
                <div className="truncate font-bold text-stone-100">{activeFarm.name}</div>
                <div className="text-[10px] text-stone-400 truncate">
                  {activeFarm.cropType} • {activeFarm.county} County
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 shrink-0" />
            </button>

            {showFarmDropdown && (
              <div className="absolute left-0 mt-2 w-72 bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl py-2 z-50">
                <div className="px-3.5 py-1.5 text-[11px] font-bold text-stone-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Registered Farms</span>
                  <span className="text-[10px] text-emerald-400 font-mono">{farms.length} Active</span>
                </div>
                {farms.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      onSelectFarm(f);
                      setShowFarmDropdown(false);
                    }}
                    className={`w-full text-left px-3.5 py-2 flex items-center justify-between hover:bg-stone-800 transition-colors ${
                      f.id === activeFarm.id ? 'bg-emerald-950/60 border-l-3 border-emerald-400' : ''
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="text-xs font-bold text-stone-200 truncate">{f.name}</div>
                      <div className="text-[11px] text-stone-400 truncate">
                        {f.cropType} • {f.county} ({f.areaHectares} ha)
                      </div>
                    </div>
                    {f.id === activeFarm.id && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-black shrink-0">
                        Active
                      </span>
                    )}
                  </button>
                ))}

                <div className="border-t border-stone-800 mt-1 pt-1.5 px-2.5 space-y-1">
                  <button
                    onClick={() => {
                      setShowFarmDropdown(false);
                      onOpenNewFarmModal();
                    }}
                    className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-bold text-emerald-400 hover:bg-emerald-950/50 flex items-center space-x-2 transition-colors"
                  >
                    <Plus className="w-4 h-4 text-emerald-400" />
                    <span>Register New Farm Location</span>
                  </button>

                  {onOpenLivestockModal && (
                    <button
                      onClick={() => {
                        setShowFarmDropdown(false);
                        onOpenLivestockModal();
                      }}
                      className="w-full text-left px-2.5 py-2 rounded-xl text-xs font-bold text-amber-400 hover:bg-amber-950/50 flex items-center space-x-2 transition-colors"
                    >
                      <Plus className="w-4 h-4 text-amber-400" />
                      <span>Manage Livestock Herd</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Controls: Desktop vs Mobile */}
          <div className="flex items-center space-x-1.5 sm:space-x-3">
            
            {/* Desktop Ask AI Advisor Button */}
            <button
              onClick={onOpenAssistant}
              className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-md shadow-emerald-950/50 transition-all active:scale-95"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
              <span>Ask AI Advisor</span>
            </button>

            {/* Desktop Role Switcher Pill */}
            <div className="hidden sm:block relative">
              <button
                onClick={() => {
                  setShowRoleDropdown(!showRoleDropdown);
                  setShowFarmDropdown(false);
                  setShowNotifications(false);
                }}
                className={`px-2.5 py-1 rounded-xl text-xs font-bold border flex items-center space-x-1.5 transition-colors ${
                  roleLabels[user.role].bg
                }`}
              >
                <span>{roleLabels[user.role].label}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-60 bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl py-2 z-50">
                  <div className="px-3.5 py-1.5 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    Select User Perspective
                  </div>
                  {(['farmer', 'extension_officer', 'ngo', 'admin'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        onChangeRole(r);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-bold hover:bg-stone-800 transition-colors flex items-center justify-between ${
                        user.role === r ? 'text-emerald-400 bg-stone-800/80' : 'text-stone-300'
                      }`}
                    >
                      <span>{roleLabels[r].label}</span>
                      {user.role === r && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell (Both Mobile & Desktop) */}
            <div className="relative">
              <button
                onClick={() => {
                  setShowNotifications(!showNotifications);
                  setShowFarmDropdown(false);
                  setShowRoleDropdown(false);
                }}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 relative transition-colors border border-stone-700"
                title="Live Climate Warnings"
              >
                <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-black flex items-center justify-center animate-bounce shadow-md">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-72 sm:w-96 bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl p-3.5 sm:p-4 z-50">
                  <div className="flex items-center justify-between pb-2.5 border-b border-stone-800">
                    <h4 className="text-xs sm:text-sm font-bold text-stone-100 flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Live Climate & Vector Alerts</span>
                    </h4>
                    <span className="text-[10px] font-mono text-stone-400">{notifications.length} Total</span>
                  </div>
                  <div className="max-h-72 overflow-y-auto space-y-2 mt-2.5 pr-1">
                    {notifications.map((n) => (
                      <div
                        key={n.id}
                        className={`p-2.5 rounded-xl border text-xs ${
                          n.severity === 'critical'
                            ? 'bg-red-950/40 border-red-800/60 text-red-200'
                            : n.severity === 'warning'
                            ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                            : 'bg-stone-800/60 border-stone-700 text-stone-300'
                        }`}
                      >
                        <div className="font-bold flex items-center justify-between mb-1">
                          <span className="truncate pr-1">{n.title}</span>
                          <span className="text-[9px] text-stone-400 font-normal shrink-0">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="text-[11px] leading-relaxed text-stone-300">{n.message}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Desktop Profile Avatar */}
            <div className="hidden sm:flex items-center space-x-1.5">
              <button
                onClick={onOpenAuthModal}
                className="px-2.5 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold border border-stone-700 flex items-center space-x-1.5 transition-colors"
                title="Account / Sign In"
              >
                <User className="w-4 h-4 text-emerald-400" />
                <span className="hidden lg:inline max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
              </button>

              <button
                onClick={onOpenSettingsModal || onOpenProfileModal}
                className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors border border-stone-700"
                title="Settings & Themes"
              >
                <Settings className="w-4 h-4 text-stone-400" />
              </button>
            </div>

            {/* Mobile Menu Drawer Toggle Button */}
            <button
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="md:hidden p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold transition-all shadow-md active:scale-95 flex items-center justify-center"
              aria-label="Toggle Navigation Menu"
            >
              {showMobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

          </div>

        </div>
      </div>

      {/* MOBILE COMPACT SLIDE-OUT MENU DRAWER */}
      {showMobileMenu && (
        <div className="md:hidden fixed inset-0 z-50 bg-stone-950/85 backdrop-blur-lg flex flex-col animate-in fade-in duration-200">
          
          {/* Mobile Menu Header */}
          <div className="bg-stone-900 border-b border-stone-800 px-4 py-3 flex items-center justify-between">
            <AgriShieldLogoFull size={30} variant="dark" />
            
            <div className="flex items-center space-x-2">
              <button
                onClick={onOpenAssistant}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Ask AI</span>
              </button>

              <button
                onClick={() => setShowMobileMenu(false)}
                className="p-2 rounded-xl bg-stone-800 text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Mobile Menu Content Scrollable Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-5 text-stone-100">
            
            {/* User Profile & Active County Banner */}
            <div className="bg-stone-850 border border-stone-750 rounded-2xl p-3.5 flex items-center justify-between">
              <div className="flex items-center space-x-3 truncate">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-black text-sm shrink-0">
                  {user.name.charAt(0)}
                </div>
                <div className="truncate">
                  <div className="text-xs font-extrabold text-stone-100 truncate">{user.name}</div>
                  <div className="text-[11px] text-emerald-400 font-semibold flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{user.county || activeFarm.county} County</span>
                    {userCountyObj && <span className="text-[10px] text-stone-400">({userCountyObj.code})</span>}
                  </div>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  onOpenAuthModal();
                }}
                className="px-2.5 py-1.5 rounded-xl bg-stone-800 text-stone-200 border border-stone-700 text-xs font-bold hover:bg-stone-700"
              >
                Account
              </button>
            </div>

            {/* Navigation Tabs List */}
            <div>
              <div className="text-[10px] font-black uppercase text-stone-400 tracking-wider mb-2 px-1">
                Workspace Sections
              </div>
              <div className="grid grid-cols-1 gap-1.5">
                {navTabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleTabClick(tab.id)}
                      className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-emerald-500 text-stone-950 font-extrabold shadow-lg'
                          : 'bg-stone-850 hover:bg-stone-800 text-stone-200 border border-stone-800'
                      }`}
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className={isActive ? 'text-stone-950' : 'text-emerald-400'}>{tab.icon}</span>
                        <span>{tab.label}</span>
                      </div>
                      
                      <div className="flex items-center space-x-1.5">
                        {tab.badge !== undefined && tab.badge > 0 && (
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                              isActive ? 'bg-stone-950 text-emerald-300' : 'bg-emerald-500/20 text-emerald-300'
                            }`}
                          >
                            {tab.badge}
                          </span>
                        )}
                        <ChevronRight className={`w-4 h-4 ${isActive ? 'text-stone-950' : 'text-stone-500'}`} />
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Active Farm Switcher Section */}
            <div className="bg-stone-850 border border-stone-800 rounded-2xl p-3.5 space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-xs font-bold text-stone-300 flex items-center space-x-1.5">
                  <Sprout className="w-4 h-4 text-emerald-400" />
                  <span>Active Farm Parcel</span>
                </div>
                <span className="text-[10px] text-emerald-400 font-mono">{farms.length} Registered</span>
              </div>

              <div className="space-y-1.5">
                {farms.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      onSelectFarm(f);
                      setShowMobileMenu(false);
                    }}
                    className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between ${
                      f.id === activeFarm.id
                        ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-200 font-bold'
                        : 'bg-stone-900 border-stone-800 text-stone-300'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <div className="truncate font-semibold">{f.name}</div>
                      <div className="text-[10px] text-stone-400 truncate">
                        {f.cropType} • {f.county} ({f.areaHectares} ha)
                      </div>
                    </div>
                    {f.id === activeFarm.id && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded font-black shrink-0">
                        Active
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="pt-2 border-t border-stone-750 flex gap-2">
                <button
                  onClick={() => {
                    setShowMobileMenu(false);
                    onOpenNewFarmModal();
                  }}
                  className="flex-1 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-xs flex items-center justify-center space-x-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Farm</span>
                </button>

                {onOpenLivestockModal && (
                  <button
                    onClick={() => {
                      setShowMobileMenu(false);
                      onOpenLivestockModal();
                    }}
                    className="flex-1 py-2 px-3 rounded-xl bg-stone-800 border border-stone-700 text-amber-400 font-bold text-xs flex items-center justify-center space-x-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Livestock</span>
                  </button>
                )}
              </div>
            </div>

            {/* Role Perspective Selector */}
            <div className="bg-stone-850 border border-stone-800 rounded-2xl p-3.5 space-y-2">
              <div className="text-[10px] font-bold uppercase text-stone-400">Switch User Role View</div>
              <div className="grid grid-cols-2 gap-2">
                {(['farmer', 'extension_officer', 'ngo', 'admin'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onChangeRole(r);
                      setShowMobileMenu(false);
                    }}
                    className={`p-2 rounded-xl text-xs font-bold border text-left transition-colors ${
                      user.role === r
                        ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                        : 'bg-stone-900 border-stone-800 text-stone-400'
                    }`}
                  >
                    {roleLabels[r].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Actions Footer */}
            <div className="pt-2 pb-6 space-y-2">
              <button
                onClick={() => {
                  setShowMobileMenu(false);
                  if (onOpenSettingsModal) onOpenSettingsModal();
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-stone-850 border border-stone-800 text-stone-300 font-bold text-xs flex items-center justify-center space-x-2"
              >
                <Settings className="w-4 h-4 text-stone-400" />
                <span>System Settings & Color Theme</span>
              </button>

              <a
                href="https://wa.me/254143791311?text=Hello%20Ian%20Chirchir,%20I%20need%20AgriShield%20AI%20Mobile%20Support"
                target="_blank"
                rel="noreferrer"
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-950/70 border border-emerald-800 text-emerald-300 font-bold text-xs flex items-center justify-center space-x-2"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400" />
                <span>Official WhatsApp Live Support</span>
              </a>
            </div>

          </div>

        </div>
      )}

    </header>
  );
};
