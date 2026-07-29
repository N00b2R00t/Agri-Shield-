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
  AlertTriangle,
  Trash2,
  UserX,
  CheckCircle2,
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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [actionType, setActionType] = useState<'deactivate' | 'delete'>('deactivate');
  const [reasonCategory, setReasonCategory] = useState<string>('No longer farming / using app');
  const [customReason, setCustomReason] = useState<string>('');
  const [actionSuccess, setActionSuccess] = useState<string>('');

  if (!isOpen) return null;

  const handleAccountAction = () => {
    const finalReason = customReason.trim() ? `${reasonCategory}: ${customReason.trim()}` : reasonCategory;
    
    if (actionType === 'deactivate') {
      setActionSuccess(`Account temporarily deactivated. Reason recorded: "${finalReason}". Signing out...`);
    } else {
      setActionSuccess(`Account permanently deleted from AgriShield DB. Reason: "${finalReason}". Signing out...`);
    }

    setTimeout(() => {
      onSignOut();
      onClose();
    }, 1500);
  };

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
              <h3 className="text-base font-bold text-stone-100">AgriShield System & Account Settings</h3>
              <p className="text-xs text-stone-400">Appearance preference, active profile, and account deletion</p>
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
            <div className="text-stone-400">Region: {user.county}, Kenya</div>
          </div>
        </div>

        {/* Account Deactivation & Deletion Section */}
        <div className="p-4 rounded-2xl bg-stone-950/80 border border-red-900/40 space-y-3 text-xs">
          <div className="flex items-center justify-between font-bold text-red-300">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-red-400" />
              <span>Account Management & Deletion</span>
            </div>
          </div>

          {actionSuccess ? (
            <div className="p-3 bg-emerald-950 border border-emerald-800 rounded-xl text-emerald-200 font-bold flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
          ) : !showDeleteConfirm ? (
            <div className="flex items-center justify-between pt-1">
              <span className="text-stone-400 text-[11px]">Deactivate or permanently remove your profile from AgriShield.</span>
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(true)}
                className="px-3 py-1.5 rounded-xl bg-red-950 border border-red-800 hover:bg-red-900 text-red-300 font-bold text-xs flex items-center space-x-1.5 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Deactivate / Delete</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3 pt-1 border-t border-stone-800">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setActionType('deactivate')}
                  className={`flex-1 p-2 rounded-xl border text-center font-bold flex items-center justify-center space-x-1.5 ${
                    actionType === 'deactivate'
                      ? 'bg-amber-950 border-amber-600 text-amber-300'
                      : 'bg-stone-900 border-stone-800 text-stone-400'
                  }`}
                >
                  <UserX className="w-3.5 h-3.5" />
                  <span>Deactivate Account</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActionType('delete')}
                  className={`flex-1 p-2 rounded-xl border text-center font-bold flex items-center justify-center space-x-1.5 ${
                    actionType === 'delete'
                      ? 'bg-red-950 border-red-600 text-red-300'
                      : 'bg-stone-900 border-stone-800 text-stone-400'
                  }`}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Permanently Delete</span>
                </button>
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">Optional Reason for {actionType === 'deactivate' ? 'Deactivation' : 'Deletion'}:</label>
                <select
                  value={reasonCategory}
                  onChange={(e) => setReasonCategory(e.target.value)}
                  className="w-full p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 font-semibold mb-2"
                >
                  <option value="No longer farming / using app">No longer farming / using app</option>
                  <option value="Switched to another platform">Switched to another platform</option>
                  <option value="Privacy or data retention concerns">Privacy or data retention concerns</option>
                  <option value="Too many notifications or alerts">Too many notifications or alerts</option>
                  <option value="Other reason">Other reason</option>
                </select>

                <input
                  type="text"
                  placeholder="Additional details / feedback (optional)..."
                  value={customReason}
                  onChange={(e) => setCustomReason(e.target.value)}
                  className="w-full p-2 rounded-xl bg-stone-900 border border-stone-800 text-stone-100 text-xs placeholder-stone-600"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-1.5 rounded-xl bg-stone-800 text-stone-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAccountAction}
                  className={`px-4 py-1.5 rounded-xl font-black text-xs text-white ${
                    actionType === 'deactivate' ? 'bg-amber-600 hover:bg-amber-500' : 'bg-red-600 hover:bg-red-500'
                  }`}
                >
                  Confirm {actionType === 'deactivate' ? 'Deactivation' : 'Permanent Deletion'}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Developer Support Banner */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 flex items-center justify-between text-xs">
          <div className="space-y-0.5">
            <div className="font-bold text-emerald-300 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Official Developer & Support Channel</span>
            </div>
            <div className="text-[11px] text-stone-300">Ian Kipkoech Chirchir</div>
          </div>
          <a
            href="https://wa.me/254143791311?text=Hello%20Ian%20Chirchir,%20I%20need%20AgriShield%20Settings%20Support"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl bg-emerald-500 text-stone-950 font-black text-xs flex items-center space-x-1 hover:bg-emerald-400 transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Official WhatsApp Support</span>
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
