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
  Layers,
  Settings,
  CheckCircle,
  AlertTriangle,
} from 'lucide-react';
import { Farm, UserRole, UserProfile, AlertNotification } from '../types';

interface NavbarProps {
  user: UserProfile;
  activeFarm: Farm;
  farms: Farm[];
  onSelectFarm: (farm: Farm) => void;
  onChangeRole: (role: UserRole) => void;
  onOpenNewFarmModal: () => void;
  onOpenProfileModal: () => void;
  notifications: AlertNotification[];
  onOpenAssistant: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  user,
  activeFarm,
  farms,
  onSelectFarm,
  onChangeRole,
  onOpenNewFarmModal,
  onOpenProfileModal,
  notifications,
  onOpenAssistant,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showFarmDropdown, setShowFarmDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const roleLabels: Record<UserRole, { label: string; bg: string; text: string }> = {
    farmer: { label: 'Smallholder Farmer', bg: 'bg-emerald-100 text-emerald-800 border-emerald-300', text: 'text-emerald-700' },
    extension_officer: { label: 'Extension Officer', bg: 'bg-blue-100 text-blue-800 border-blue-300', text: 'text-blue-700' },
    ngo: { label: 'NGO / Climate Specialist', bg: 'bg-purple-100 text-purple-800 border-purple-300', text: 'text-purple-700' },
    admin: { label: 'Gov / System Admin', bg: 'bg-amber-100 text-amber-800 border-amber-300', text: 'text-amber-700' },
  };

  return (
    <header className="sticky top-0 z-40 bg-stone-900 text-stone-100 border-b border-stone-800 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo */}
          <AgriShieldLogoFull size={38} variant="dark" />

          {/* Farm Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowFarmDropdown(!showFarmDropdown)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-200 text-sm font-medium transition-colors"
            >
              <Sprout className="w-4 h-4 text-emerald-400" />
              <div className="text-left max-w-[140px] sm:max-w-[200px] truncate">
                <div className="truncate font-semibold text-stone-100">{activeFarm.name}</div>
                <div className="text-[10px] text-stone-400 truncate">
                  {activeFarm.cropType} • {activeFarm.locationName}
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-stone-400" />
            </button>

            {showFarmDropdown && (
              <div className="absolute left-0 mt-2 w-64 bg-stone-900 border border-stone-700 rounded-xl shadow-2xl py-2 z-50">
                <div className="px-3 py-1.5 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                  Select Active Farm
                </div>
                {farms.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => {
                      onSelectFarm(f);
                      setShowFarmDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-stone-800 transition-colors ${
                      f.id === activeFarm.id ? 'bg-emerald-950/50 border-l-2 border-emerald-400' : ''
                    }`}
                  >
                    <div>
                      <div className="text-sm font-medium text-stone-200">{f.name}</div>
                      <div className="text-xs text-stone-400">
                        {f.cropType} • {f.areaHectares} ha
                      </div>
                    </div>
                    {f.id === activeFarm.id && (
                      <span className="text-xs text-emerald-400 font-semibold">Active</span>
                    )}
                  </button>
                ))}
                <div className="border-t border-stone-800 mt-1 pt-1 px-2">
                  <button
                    onClick={() => {
                      setShowFarmDropdown(false);
                      onOpenNewFarmModal();
                    }}
                    className="w-full text-left px-2 py-1.5 rounded-lg text-xs font-semibold text-emerald-400 hover:bg-emerald-950/40 flex items-center space-x-1.5 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Register New Farm Location</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Controls Right */}
          <div className="flex items-center space-x-3">
            
            {/* AI Assistant Quick Trigger Button */}
            <button
              onClick={onOpenAssistant}
              className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-medium text-xs shadow-md shadow-emerald-900/30 transition-all hover:scale-105"
            >
              <Sparkles className="w-3.5 h-3.5 animate-pulse text-amber-300" />
              <span>Ask AI Advisor</span>
            </button>

            {/* Role Switcher Pill */}
            <div className="relative">
              <button
                onClick={() => setShowRoleDropdown(!showRoleDropdown)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold border flex items-center space-x-1.5 transition-colors ${
                  roleLabels[user.role].bg
                }`}
              >
                <span>{roleLabels[user.role].label}</span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showRoleDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-stone-900 border border-stone-700 rounded-xl shadow-2xl py-2 z-50">
                  <div className="px-3 py-1.5 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                    Switch User Role View
                  </div>
                  {(['farmer', 'extension_officer', 'ngo', 'admin'] as UserRole[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        onChangeRole(r);
                        setShowRoleDropdown(false);
                      }}
                      className={`w-full text-left px-3 py-2 text-xs font-medium hover:bg-stone-800 transition-colors flex items-center justify-between ${
                        user.role === r ? 'text-emerald-400 font-bold bg-stone-800/80' : 'text-stone-300'
                      }`}
                    >
                      <span>{roleLabels[r].label}</span>
                      {user.role === r && <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 relative transition-colors"
                title="Climate Alerts"
              >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-stone-900 border border-stone-700 rounded-2xl shadow-2xl p-4 z-50">
                  <div className="flex items-center justify-between pb-3 border-b border-stone-800">
                    <h4 className="text-sm font-bold text-stone-100 flex items-center space-x-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      <span>Live Climate & Pest Warnings</span>
                    </h4>
                    <span className="text-xs text-stone-400">{notifications.length} alerts</span>
                  </div>
                  <div className="max-h-80 overflow-y-auto space-y-2 mt-3 pr-1">
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
                          <span>{n.title}</span>
                          <span className="text-[10px] text-stone-400 font-normal">
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

            {/* Profile Avatar */}
            <button
              onClick={onOpenProfileModal}
              className="p-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors border border-stone-700"
              title="Farmer Profile"
            >
              <User className="w-5 h-5 text-emerald-400" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
