import React, { useState } from 'react';
import { UserProfile, UserRole } from '../types';
import {
  Settings,
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
  Key,
  Eye,
  EyeOff,
  Building,
  Phone,
  Mail,
  MapPin,
  ShieldAlert,
  Radio,
  Cpu,
  Database,
  Users,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Server,
  Activity,
} from 'lucide-react';
import { KENYA_COUNTIES, getSubCountiesForCounty } from '../data/kenyaCounties';
import { updateUserPasswordInDb } from '../lib/dbService';

export type ThemeMode = 'dark' | 'light' | 'system';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  onSignOut: () => void;
  theme?: ThemeMode;
  onThemeChange?: (newTheme: ThemeMode) => void;
  onUpdateUser?: (updated: Partial<UserProfile>) => void;
  usersList?: UserProfile[];
  onUpdateUsersList?: (users: UserProfile[]) => void;
  onSendSystemBroadcast?: (title: string, message: string, severity: 'info' | 'warning' | 'critical') => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  user,
  onSignOut,
  theme = 'system',
  onThemeChange,
  onUpdateUser,
  usersList = [],
  onUpdateUsersList,
  onSendSystemBroadcast,
}) => {
  const [activeTab, setActiveTab] = useState<'profile' | 'admin' | 'security'>('profile');

  // User Profile Form State
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [phone, setPhone] = useState(user.phone || '+254712345678');
  const [organization, setOrganization] = useState(user.organization || 'AgriShield Cooperative');
  const [county, setCounty] = useState(user.county || 'Uasin Gishu');
  const [subCounty, setSubCounty] = useState(
    user.subCounty || (getSubCountiesForCounty(user.county || 'Uasin Gishu')[0] || 'Moiben')
  );
  const [profileSavedMsg, setProfileSavedMsg] = useState('');

  // Password Change Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  // Account Deactivation/Deletion State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [actionType, setActionType] = useState<'deactivate' | 'delete'>('deactivate');
  const [reasonCategory, setReasonCategory] = useState<string>('No longer farming / using app');
  const [customReason, setCustomReason] = useState<string>('');
  const [actionSuccess, setActionSuccess] = useState<string>('');

  // Admin Controls State
  const [isSystemLive, setIsSystemLive] = useState(true);
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [broadcastSeverity, setBroadcastSeverity] = useState<'info' | 'warning' | 'critical'>('warning');
  const [broadcastSuccess, setBroadcastSuccess] = useState('');
  const [aiConfidenceThreshold, setAiConfidenceThreshold] = useState(85);
  const [strictAgronomistRules, setStrictAgronomistRules] = useState(true);
  const [adminActionMsg, setAdminActionMsg] = useState('');

  if (!isOpen) return null;

  // Handle Save Profile
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (onUpdateUser) {
      onUpdateUser({
        name,
        email,
        phone,
        organization,
        county,
        subCounty,
      });
    }
    setProfileSavedMsg('Profile details updated and saved successfully!');
    setTimeout(() => setProfileSavedMsg(''), 3000);
  };

  // Handle Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess('');

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters long.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setIsSavingPassword(true);
    try {
      const res = await updateUserPasswordInDb(newPassword, user);
      setPasswordSuccess(res.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(''), 5000);
    } catch (err: any) {
      setPasswordError(err?.message || 'Failed to update password in database.');
    } finally {
      setIsSavingPassword(false);
    }
  };

  // Handle Account Deactivation / Deletion
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

  // Handle Send System Broadcast
  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle.trim() || !broadcastMessage.trim()) return;

    if (onSendSystemBroadcast) {
      onSendSystemBroadcast(broadcastTitle, broadcastMessage, broadcastSeverity);
    }
    setBroadcastSuccess('System-wide emergency alert broadcasted to registered users!');
    setBroadcastTitle('');
    setBroadcastMessage('');
    setTimeout(() => setBroadcastSuccess(''), 4000);
  };

  // Admin User Role Update
  const handleRoleChange = (userId: string, newRole: UserRole) => {
    if (onUpdateUsersList && usersList.length > 0) {
      const updatedList = usersList.map((u) => (u.id === userId ? { ...u, role: newRole } : u));
      onUpdateUsersList(updatedList);
    }
    if (userId === user.id && onUpdateUser) {
      onUpdateUser({ role: newRole });
    }
    setAdminActionMsg(`User role updated to ${newRole.replace('_', ' ').toUpperCase()}!`);
    setTimeout(() => setAdminActionMsg(''), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md overflow-y-auto p-3 sm:p-6 flex justify-center items-start min-h-screen my-0">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full p-4 sm:p-6 shadow-2xl text-stone-100 space-y-5 my-auto sm:my-8 relative shrink-0">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 shrink-0">
              <Settings className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-bold text-stone-100 truncate">AgriShield Settings & Account Management</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-black px-2 py-0.5 rounded-full border border-emerald-500/30 shrink-0">
                  {user.role.replace('_', ' ')}
                </span>
              </div>
              <p className="text-xs text-stone-400 truncate">Manage profile information, password security, and platform administration</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition-colors shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation - Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 bg-stone-950 p-1.5 rounded-2xl border border-stone-800 text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`w-full py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-all text-center ${
              activeTab === 'profile'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <User className="w-4 h-4 shrink-0" />
            <span className="truncate">Profile & Password</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('admin')}
            className={`w-full py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-all text-center ${
              activeTab === 'admin'
                ? 'bg-emerald-600 text-white shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <ShieldCheck className="w-4 h-4 shrink-0" />
            <span className="truncate">Website & Admin Controls</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('security')}
            className={`w-full py-2 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-all text-center ${
              activeTab === 'security'
                ? 'bg-red-950 border border-red-800 text-red-300 shadow-md'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900'
            }`}
          >
            <Lock className="w-4 h-4 shrink-0" />
            <span className="truncate">Account Security</span>
          </button>
        </div>

        {/* Modal Full Detail Container */}
        <div className="space-y-5">

          {/* TAB 1: PROFILE & PASSWORD */}
          {activeTab === 'profile' && (
            <div className="space-y-5 text-xs">
              
              {/* Profile Details Form */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <div className="font-bold text-stone-200 text-xs uppercase tracking-wider flex items-center space-x-2">
                    <User className="w-4 h-4 text-emerald-400" />
                    <span>Personal & Profile Information</span>
                  </div>
                  <span className="text-[11px] text-stone-400">ID: {user.id}</span>
                </div>

                {profileSavedMsg && (
                  <div className="p-2.5 bg-emerald-950 border border-emerald-800 rounded-xl text-emerald-300 font-bold flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{profileSavedMsg}</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-stone-400 mb-1 font-semibold flex items-center space-x-1">
                        <User className="w-3.5 h-3.5 text-stone-500" />
                        <span>Full Name</span>
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 font-medium focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-400 mb-1 font-semibold flex items-center space-x-1">
                        <Mail className="w-3.5 h-3.5 text-stone-500" />
                        <span>Email Address</span>
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 font-medium focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-400 mb-1 font-semibold flex items-center space-x-1">
                        <Phone className="w-3.5 h-3.5 text-stone-500" />
                        <span>Phone Number</span>
                      </label>
                      <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 font-medium focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-400 mb-1 font-semibold flex items-center space-x-1">
                        <Building className="w-3.5 h-3.5 text-stone-500" />
                        <span>Organization / Cooperative</span>
                      </label>
                      <input
                        type="text"
                        value={organization}
                        onChange={(e) => setOrganization(e.target.value)}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 font-medium focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-400 mb-1 font-semibold flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-500" />
                          <span>County Region</span>
                        </label>
                        <select
                          value={county}
                          onChange={(e) => {
                            const newCounty = e.target.value;
                            setCounty(newCounty);
                            const subList = getSubCountiesForCounty(newCounty);
                            if (subList.length > 0) {
                              setSubCounty(subList[0]);
                            }
                          }}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 font-medium focus:border-emerald-500 focus:outline-none"
                        >
                          {KENYA_COUNTIES.map((c) => (
                            <option key={c.name} value={c.name}>
                              {c.name} ({c.region})
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-stone-400 mb-1 font-semibold flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-stone-500" />
                          <span>Sub-County / Constituency</span>
                        </label>
                        <select
                          value={subCounty}
                          onChange={(e) => setSubCounty(e.target.value)}
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 font-medium focus:border-emerald-500 focus:outline-none"
                        >
                          {getSubCountiesForCounty(county).map((sub) => (
                            <option key={sub} value={sub}>
                              {sub}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-400 mb-1 font-semibold flex items-center justify-between">
                        <span>Assigned System Role</span>
                        <span className="text-[10px] text-stone-500 font-mono">Synced with Database</span>
                      </label>
                      <div className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <div className="text-emerald-400 font-extrabold uppercase tracking-wider text-xs flex items-center space-x-1.5">
                            <span>{user.role === 'admin' ? 'Administrator / System Director' : user.role === 'extension_officer' ? 'Agricultural Extension Officer' : user.role === 'ngo' ? 'NGO / Climate Specialist' : 'Smallholder Farmer'}</span>
                          </div>
                          <p className="text-[10px] text-stone-400 mt-0.5">
                            {user.role === 'admin'
                              ? 'Full System Authority: Access to analytics, broadcast dispatcher, and user management.'
                              : user.role === 'extension_officer'
                              ? 'Extension Command: Access to regional farm monitoring, advisory, and broadcast alerts.'
                              : user.role === 'ngo'
                              ? 'Climate Analytics: Access to GIS maps, vulnerability metrics, and simulators.'
                              : 'Farmer View: Localized risk recommendations, community alerts, and farm tools.'}
                          </p>
                        </div>
                        <ShieldCheck className="w-5 h-5 text-emerald-500 shrink-0 ml-2" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center space-x-1.5"
                    >
                      <Check className="w-4 h-4" />
                      <span>Save Profile Details</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* Password Change Form */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <div className="font-bold text-stone-200 text-xs uppercase tracking-wider flex items-center space-x-2">
                    <Key className="w-4 h-4 text-amber-400" />
                    <span>Change Account Password</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="text-stone-400 hover:text-stone-200 text-[11px] flex items-center space-x-1 font-semibold"
                  >
                    {showPasswords ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showPasswords ? 'Hide Passwords' : 'Show Passwords'}</span>
                  </button>
                </div>

                {passwordError && (
                  <div className="p-2.5 bg-red-950 border border-red-800 rounded-xl text-red-300 font-bold flex items-center space-x-2">
                    <AlertTriangle className="w-4 h-4 text-red-400 shrink-0" />
                    <span>{passwordError}</span>
                  </div>
                )}

                {passwordSuccess && (
                  <div className="p-2.5 bg-emerald-950 border border-emerald-800 rounded-xl text-emerald-300 font-bold flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{passwordSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleChangePassword} className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-stone-400 mb-1 font-semibold">Current Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords ? 'text' : 'password'}
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-3 pr-9 py-2 text-stone-100 font-medium focus:border-amber-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(!showPasswords)}
                          className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-200 transition-colors"
                          title={showPasswords ? 'Hide password' : 'Show password'}
                        >
                          {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-400 mb-1 font-semibold">New Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords ? 'text' : 'password'}
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Min 6 characters"
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-3 pr-9 py-2 text-stone-100 font-medium focus:border-amber-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(!showPasswords)}
                          className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-200 transition-colors"
                          title={showPasswords ? 'Hide password' : 'Show password'}
                        >
                          {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-stone-400 mb-1 font-semibold">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showPasswords ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Repeat new password"
                          className="w-full bg-stone-900 border border-stone-800 rounded-xl pl-3 pr-9 py-2 text-stone-100 font-medium focus:border-amber-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPasswords(!showPasswords)}
                          className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-200 transition-colors"
                          title={showPasswords ? 'Hide password' : 'Show password'}
                        >
                          {showPasswords ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSavingPassword}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-black rounded-xl transition-colors shadow-sm flex items-center space-x-1.5"
                    >
                      {isSavingPassword ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Updating password...</span>
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4" />
                          <span>Update password</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>

            </div>
          )}

          {/* TAB 2: WEBSITE & ADMIN CONTROLS */}
          {activeTab === 'admin' && (
            <div className="space-y-5 text-xs">
              
              {adminActionMsg && (
                <div className="p-3 bg-emerald-950 border border-emerald-800 rounded-2xl text-emerald-300 font-bold flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{adminActionMsg}</span>
                </div>
              )}

              {/* Platform Operational Status */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <div className="font-bold text-stone-200 text-xs uppercase tracking-wider flex items-center space-x-2">
                    <Server className="w-4 h-4 text-emerald-400" />
                    <span>Website & Operational Status</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[11px] text-stone-400">Platform Status:</span>
                    <span className={`px-2 py-0.5 rounded-full font-black text-[10px] uppercase ${
                      isSystemLive ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                    }`}>
                      {isSystemLive ? 'Live & Operational' : 'Maintenance Mode'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="font-bold text-stone-200">Toggle Platform Live Status</div>
                    <div className="text-stone-400 text-[11px]">Control active database connections and client sync APIs.</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setIsSystemLive(!isSystemLive);
                      setAdminActionMsg(isSystemLive ? 'Platform switched to Maintenance Mode.' : 'Platform switched to Live Operational Mode.');
                      setTimeout(() => setAdminActionMsg(''), 3000);
                    }}
                    className="flex items-center space-x-2 text-stone-300 hover:text-white"
                  >
                    {isSystemLive ? (
                      <ToggleRight className="w-8 h-8 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-stone-600" />
                    )}
                  </button>
                </div>
              </div>

              {/* Emergency System Broadcast */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <div className="font-bold text-stone-200 text-xs uppercase tracking-wider flex items-center space-x-2">
                    <Radio className="w-4 h-4 text-emerald-400" />
                    <span>Broadcast System Alert to Registered Farmers</span>
                  </div>
                </div>

                {broadcastSuccess && (
                  <div className="p-2.5 bg-emerald-950 border border-emerald-800 rounded-xl text-emerald-300 font-bold flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{broadcastSuccess}</span>
                  </div>
                )}

                <form onSubmit={handleSendBroadcast} className="space-y-3 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="sm:col-span-2">
                      <label className="block text-stone-400 mb-1 font-semibold">Alert Title / Subject</label>
                      <input
                        type="text"
                        value={broadcastTitle}
                        onChange={(e) => setBroadcastTitle(e.target.value)}
                        placeholder="e.g., Immediate Armyworm Threat Advisory"
                        required
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:border-emerald-500 focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-400 mb-1 font-semibold">Alert Severity</label>
                      <select
                        value={broadcastSeverity}
                        onChange={(e) => setBroadcastSeverity(e.target.value as any)}
                        className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-stone-100 focus:border-emerald-500 focus:outline-none"
                      >
                        <option value="info">Info Notice</option>
                        <option value="warning">Warning Level</option>
                        <option value="critical">Critical Hazard</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-stone-400 mb-1 font-semibold">Broadcast Advisory Message</label>
                    <textarea
                      rows={2}
                      value={broadcastMessage}
                      onChange={(e) => setBroadcastMessage(e.target.value)}
                      placeholder="Enter emergency instructions for farmers and extension staff..."
                      required
                      className="w-full bg-stone-900 border border-stone-800 rounded-xl p-3 text-stone-100 focus:border-emerald-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors shadow-sm flex items-center space-x-1.5"
                    >
                      <Radio className="w-4 h-4" />
                      <span>Send System Broadcast</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* User Roles & Permissions Management */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <div className="font-bold text-stone-200 text-xs uppercase tracking-wider flex items-center space-x-2">
                    <Users className="w-4 h-4 text-emerald-400" />
                    <span>Registered User Accounts & Privileges ({usersList.length || 1})</span>
                  </div>
                </div>

                <div className="space-y-2">
                  {usersList.length > 0 ? (
                    usersList.map((u) => (
                      <div key={u.id} className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between">
                        <div>
                          <div className="font-bold text-stone-200 text-xs">{u.name} {u.id === user.id ? '(You)' : ''}</div>
                          <div className="text-[11px] text-stone-400">{u.email} • {u.county}</div>
                        </div>

                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
                          className="bg-stone-950 border border-stone-700 text-emerald-400 font-bold text-[11px] rounded-lg px-2 py-1 focus:outline-none"
                        >
                          <option value="farmer">Farmer</option>
                          <option value="extension_officer">Extension Officer</option>
                          <option value="ngo">NGO Specialist</option>
                          <option value="admin">Admin</option>
                        </select>
                      </div>
                    ))
                  ) : (
                    <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-stone-200 text-xs">{user.name} (You)</div>
                        <div className="text-[11px] text-stone-400">{user.email} • {user.county}</div>
                      </div>
                      <span className="text-emerald-400 font-bold text-[11px] uppercase bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                        {user.role}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* AI Engine & System Diagnostics */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <div className="font-bold text-stone-200 text-xs uppercase tracking-wider flex items-center space-x-2">
                    <Cpu className="w-4 h-4 text-emerald-400" />
                    <span>Gemini AI Agronomist Sensitivity & Diagnostics</span>
                  </div>
                </div>

                <div className="space-y-3 pt-1">
                  <div>
                    <div className="flex justify-between text-stone-300 font-semibold mb-1">
                      <span>Minimum AI Confidence Threshold:</span>
                      <span className="text-emerald-400 font-bold">{aiConfidenceThreshold}%</span>
                    </div>
                    <input
                      type="range"
                      min="70"
                      max="98"
                      value={aiConfidenceThreshold}
                      onChange={(e) => setAiConfidenceThreshold(Number(e.target.value))}
                      className="w-full accent-emerald-500"
                    />
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <div className="font-bold text-stone-200">Strict Agronomist Guidelines</div>
                      <div className="text-stone-400 text-[11px]">Enforce precise weather-bound agronomist recommendations.</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setStrictAgronomistRules(!strictAgronomistRules)}
                      className="text-emerald-400 font-bold"
                    >
                      {strictAgronomistRules ? (
                        <ToggleRight className="w-7 h-7 text-emerald-500" />
                      ) : (
                        <ToggleLeft className="w-7 h-7 text-stone-600" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 3: ACCOUNT SECURITY & DELETION */}
          {activeTab === 'security' && (
            <div className="space-y-5 text-xs">
              
              {/* Security Status Card */}
              <div className="p-4 rounded-2xl bg-stone-950 border border-stone-800 space-y-2">
                <div className="flex items-center justify-between font-bold text-emerald-400">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Account Security Overview</span>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 uppercase font-bold">
                    Secure Session
                  </span>
                </div>
                <p className="text-stone-400 text-[11px]">
                  Your account is protected by Supabase Row-Level Security (RLS) policies and encrypted server-side proxy routes.
                </p>
              </div>

              {/* Account Deactivation & Deletion Section */}
              <div className="p-4 rounded-2xl bg-stone-950/80 border border-red-900/40 space-y-3">
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

            </div>
          )}

        </div>

        {/* Developer Support Banner */}
        <div className="p-3 rounded-2xl bg-emerald-950/60 border border-emerald-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="space-y-0.5">
            <div className="font-bold text-emerald-300 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>Developer & Support Channel</span>
            </div>
            <div className="text-[11px] text-stone-300">Ian Kipkoech Chirchir</div>
          </div>
          <a
            href="https://wa.me/254143791311?text=Hello%20Ian%20Chirchir,%20I%20need%20AgriShield%20Settings%20Support"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-1.5 rounded-xl bg-emerald-500 text-stone-950 font-black text-xs flex items-center justify-center space-x-1 hover:bg-emerald-400 transition-colors shrink-0"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Support</span>
          </a>
        </div>

        {/* Modal Action Buttons */}
        <div className="pt-2 border-t border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <button
            onClick={() => {
              onSignOut();
              onClose();
            }}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-300 font-bold text-xs flex items-center justify-center space-x-2 transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-400" />
            <span>Sign Out</span>
          </button>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md text-center"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
