import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import {
  Settings,
  Moon,
  Sun,
  Monitor,
  LogOut,
  X,
  Check,
  ShieldCheck,
  Lock,
  User,
  MessageSquare,
  Sparkles,
} from 'lucide-react';

export type ThemeMode = 'dark' | 'light' | 'system';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSignOut: () => void;
  theme: ThemeMode;
  onThemeChange: (newTheme: ThemeMode) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onSignOut,
  theme,
  onThemeChange,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-stone-100 space-y-5 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-100">AgriShield System & Theme Settings</h3>
              <p className="text-xs text-stone-400">Appearance preference, active account, and security settings</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Theme Settings Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider">
            Theme Appearance Mode
          </label>

          <div className="grid grid-cols-3 gap-2.5 text-xs font-bold">
            <button
              onClick={() => onThemeChange('dark')}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center space-y-2 transition-all ${
                theme === 'dark'
                  ? 'bg-emerald-950 border-emerald-500 text-emerald-300 shadow-md ring-2 ring-emerald-500/20'
                  : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Moon className="w-5 h-5 text-emerald-400" />
              <span>Dark Theme</span>
            </button>

            <button
              onClick={() => onThemeChange('light')}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center space-y-2 transition-all ${
                theme === 'light'
                  ? 'bg-amber-950 border-amber-500 text-amber-300 shadow-md ring-2 ring-amber-500/20'
                  : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Sun className="w-5 h-5 text-amber-400" />
              <span>Light Theme</span>
            </button>

            <button
              onClick={() => onThemeChange('system')}
              className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center space-y-2 transition-all ${
                theme === 'system'
                  ? 'bg-blue-950 border-blue-500 text-blue-300 shadow-md ring-2 ring-blue-500/20'
                  : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              <Monitor className="w-5 h-5 text-blue-400" />
              <span>System Default</span>
            </button>
          </div>
        </div>

        {/* Active Account Overview */}
        <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold text-stone-300">
            <div className="flex items-center space-x-2">
              <User className="w-4 h-4 text-emerald-400" />
              <span>Signed In Account Profile</span>
            </div>
            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-black">
              {user.role.replace('_', ' ')}
            </span>
          </div>

          <div className="space-y-1 pt-1 text-stone-300">
            <div className="font-bold text-stone-100">{user.name}</div>
            <div className="text-stone-400">{user.email}</div>
            <div className="text-stone-400">Phone: {user.phone || '0143791311'} • Region: {user.county}, Kenya</div>
          </div>
        </div>

        {/* Developer Support Banner */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <div className="font-bold text-emerald-300 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Developer Direct Channel</span>
            </div>
            <div className="text-[11px] text-stone-300">Ian Kipkoech Chirchir • 0143791311</div>
          </div>
          <a
            href="https://wa.me/254143791311?text=Hello%20Ian%20Chirchir,%20AgriShield%20Settings%20Inquiry"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl bg-emerald-500 text-stone-950 font-black text-xs flex items-center space-x-1 hover:bg-emerald-400 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp</span>
          </a>
        </div>

        {/* Action Buttons (Sign Out) */}
        <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
          <button
            onClick={() => {
              onSignOut();
              onClose();
            }}
            className="px-4 py-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 font-bold text-xs flex items-center space-x-2 transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Sign Out of Account</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-black text-xs shadow-md"
          >
            Done & Save Settings
          </button>
        </div>

      </div>
    </div>
  );
};
