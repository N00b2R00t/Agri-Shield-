import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  ShieldCheck,
  Building,
  User,
  KeyRound,
  Trash2,
  Edit2,
  Check,
  X,
  Mail,
  MapPin,
  MessageSquare,
  Sparkles,
  Eye,
  EyeOff,
  Lock,
  CheckCircle2,
  Ban,
  ShieldAlert,
  AlertTriangle,
  Flag,
  Sprout,
  Bug,
  Database,
  Filter,
} from 'lucide-react';
import {
  UserProfile,
  UserRole,
  Farm,
  CommunityReport,
  DiseaseRiskPrediction,
  UserReportItem,
} from '../types';
import { hashPassword, sanitizeInput, validatePasswordStrength } from '../lib/security';

interface AdminUserManagementProps {
  currentUser: UserProfile;
  usersList: UserProfile[];
  farms?: Farm[];
  reports?: CommunityReport[];
  predictions?: DiseaseRiskPrediction[];
  userReports?: UserReportItem[];
  onAddUser: (newUser: UserProfile) => void;
  onUpdateUserRole: (id: string, newRole: UserRole) => void;
  onToggleUserSuspend?: (id: string) => void;
  onDeleteUser: (id: string) => void;
  onDeleteFarm?: (id: string) => void;
  onUpdateFarm?: (farm: Farm) => void;
  onDeleteReport?: (id: string) => void;
  onDeletePrediction?: (id: string) => void;
  onVerifyReport?: (id: string) => void;
  onResolveUserReport?: (id: string, status: 'actioned' | 'dismissed') => void;
}

export const AdminUserManagement: React.FC<AdminUserManagementProps> = ({
  currentUser,
  usersList = [],
  farms = [],
  reports = [],
  predictions = [],
  userReports = [],
  onAddUser,
  onUpdateUserRole,
  onToggleUserSuspend,
  onDeleteUser,
  onDeleteFarm,
  onUpdateFarm,
  onDeleteReport,
  onDeletePrediction,
  onVerifyReport,
  onResolveUserReport,
}) => {
  const [activeTab, setActiveTab] = useState<'users' | 'fake_reports' | 'farms' | 'outbreaks'>('users');
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [editingFarm, setEditingFarm] = useState<Farm | null>(null);

  // New User Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('AgriShield2026!');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('farmer');
  const [country, setCountry] = useState('Kenya');
  const [county, setCounty] = useState('Uasin Gishu');
  const [subCounty, setSubCounty] = useState('Moiben');
  const [ward, setWard] = useState('Kimumu');
  const [primaryFocus, setPrimaryFocus] = useState<'Crops' | 'Livestock' | 'Mixed Agribusiness'>('Crops');
  const [primaryCrop, setPrimaryCrop] = useState('Maize');
  const [primaryLivestock, setPrimaryLivestock] = useState('Dairy Cattle (Friesian/Ayrshire)');
  const [organization, setOrganization] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  const passwordEval = validatePasswordStrength(password);

  const handleCreateUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    const hashedPassword = await hashPassword(password);

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: sanitizeInput(name),
      email: sanitizeInput(email.toLowerCase()),
      password: hashedPassword,
      phone: sanitizeInput(phone) || '0143791311',
      role,
      country: country || 'Kenya',
      county,
      subCounty: sanitizeInput(subCounty) || 'Moiben Sub-County',
      ward: sanitizeInput(ward) || 'Central Ward',
      organization: sanitizeInput(organization) || 'AgriShield Cooperative',
      primaryFocus,
      primaryCrop,
      primaryLivestock,
      status: 'active',
    };

    onAddUser(newUser);
    setSuccessNotice(`Successfully created ${role.toUpperCase().replace('_', ' ')} (${name}) in database!`);
    setTimeout(() => setSuccessNotice(''), 5000);

    // Reset Form
    setName('');
    setEmail('');
    setPassword('AgriShield2026!');
    setPhone('');
    setRole('farmer');
    setOrganization('');
    setShowAddForm(false);
  };

  const filteredUsers = usersList.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.county.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = selectedRoleFilter === 'all' || u.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const filteredFarms = farms.filter((f) =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.county.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.cropType.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (f.livestockType && f.livestockType.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case 'admin':
        return (
          <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[10px] flex items-center space-x-1 w-fit">
            <KeyRound className="w-3 h-3 text-amber-700" />
            <span>Administrator</span>
          </span>
        );
      case 'extension_officer':
        return (
          <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 border border-blue-300 font-bold text-[10px] flex items-center space-x-1 w-fit">
            <Building className="w-3 h-3 text-blue-700" />
            <span>Extension Officer</span>
          </span>
        );
      case 'ngo':
        return (
          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-900 border border-purple-300 font-bold text-[10px] flex items-center space-x-1 w-fit">
            <User className="w-3 h-3 text-purple-700" />
            <span>Researcher / NGO</span>
          </span>
        );
      case 'farmer':
      default:
        return (
          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[10px] flex items-center space-x-1 w-fit">
            <ShieldCheck className="w-3 h-3 text-emerald-700" />
            <span>Farmer</span>
          </span>
        );
    }
  };

  const pendingComplaintsCount = userReports.filter((r) => r.status === 'pending').length;

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-6">
      
      {/* Header & Section Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-150">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">
                Admin Master Moderation & Access Control Station
              </h3>
              <p className="text-xs text-stone-500">
                Manage accounts, suspend fake posters, edit farms & livestock, and resolve fake outbreak reports.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="https://wa.me/254143791311?text=Hello%20Ian%20Chirchir,%20Admin%20System%20Support"
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold flex items-center space-x-1.5 transition-colors"
          >
            <MessageSquare className="w-4 h-4 text-emerald-600" />
            <span>WhatsApp Admin: 0143791311</span>
          </a>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 shadow-md transition-transform active:scale-95"
          >
            <UserPlus className="w-4 h-4" />
            <span>{showAddForm ? 'Cancel Form' : 'Directly Add New User'}</span>
          </button>
        </div>
      </div>

      {successNotice && (
        <div className="p-3 rounded-xl bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-xs flex items-center space-x-2">
          <Check className="w-4 h-4 text-emerald-700" />
          <span>{successNotice}</span>
        </div>
      )}

      {/* ADMIN WORKSTATION TABS */}
      <div className="flex items-center space-x-2 border-b border-stone-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center space-x-2 shrink-0 transition-colors ${
            activeTab === 'users'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Profiles ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('fake_reports')}
          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center space-x-2 shrink-0 transition-colors relative ${
            activeTab === 'fake_reports'
              ? 'bg-red-600 text-white shadow-sm'
              : 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100'
          }`}
        >
          <Flag className="w-4 h-4" />
          <span>Fake Info & Misconduct ({userReports.length})</span>
          {pendingComplaintsCount > 0 && (
            <span className="bg-red-500 text-white text-[9px] px-1.5 py-0.2 rounded-full font-black animate-pulse">
              {pendingComplaintsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('farms')}
          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center space-x-2 shrink-0 transition-colors ${
            activeTab === 'farms'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Sprout className="w-4 h-4" />
          <span>Registered Farms & Livestock ({farms.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('outbreaks')}
          className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center space-x-2 shrink-0 transition-colors ${
            activeTab === 'outbreaks'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
          }`}
        >
          <Bug className="w-4 h-4" />
          <span>Outbreaks & Field Incidents ({predictions.length + reports.length})</span>
        </button>
      </div>

      {/* CREATE NEW USER FORM */}
      {showAddForm && (
        <form onSubmit={handleCreateUserSubmit} className="bg-stone-50 p-5 rounded-2xl border border-stone-250 space-y-4 text-xs font-medium shadow-inner">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2.5">
            <h4 className="font-extrabold text-stone-900 flex items-center space-x-2 text-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Admin Comprehensive User Registration Form</span>
            </h4>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              Direct Database Account Provisioning
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-stone-700 font-bold mb-1">Full Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Dr. Jane Chebet"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="jane.chebet@agri.go.ke"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">Account Password *</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2.5 pr-10 rounded-xl border border-stone-300 bg-white text-stone-900 font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-stone-700 font-bold mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="e.g. 0143791311"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 font-medium"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">Assigned System Role *</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 font-bold"
              >
                <option value="farmer">Farmer (Default)</option>
                <option value="extension_officer">Extension Officer</option>
                <option value="ngo">Researcher / NGO Specialist</option>
                <option value="admin">Administrator / County Director</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">County Location *</label>
              <input
                type="text"
                required
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 font-medium"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl bg-stone-200 text-stone-700 font-bold hover:bg-stone-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black shadow-md flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Register User</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 1: USERS DIRECTORY */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search user by name, email, county..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-stone-900 bg-stone-50"
              />
            </div>

            <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto">
              <span className="text-stone-500 font-semibold shrink-0">Filter Role:</span>
              {['all', 'farmer', 'extension_officer', 'ngo', 'admin'].map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRoleFilter(r)}
                  className={`px-3 py-1 rounded-xl font-bold uppercase text-[10px] shrink-0 border transition-colors ${
                    selectedRoleFilter === r
                      ? 'bg-stone-900 text-stone-100 border-stone-900'
                      : 'bg-stone-100 text-stone-600 border-stone-200 hover:bg-stone-200'
                  }`}
                >
                  {r.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-600 font-bold text-[10px] uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="p-3">User Profile</th>
                  <th className="p-3">Role & Permissions</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Location & Org</th>
                  <th className="p-3">Contact</th>
                  <th className="p-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-150 font-medium text-stone-800">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-stone-900 flex items-center space-x-2">
                        <span>{u.name}</span>
                        {u.email === 'iankipkoechchirchir06@gmail.com' && (
                          <span className="text-[9px] px-1.5 py-0.2 bg-amber-200 text-amber-900 rounded font-black border border-amber-300">
                            SUPER ADMIN
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-stone-500 flex items-center space-x-1">
                        <Mail className="w-3 h-3 text-stone-400" />
                        <span>{u.email}</span>
                      </div>
                    </td>

                    <td className="p-3">{getRoleBadge(u.role)}</td>

                    <td className="p-3">
                      {u.status === 'suspended' ? (
                        <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 border border-red-300 font-extrabold text-[10px] uppercase flex items-center space-x-1 w-fit">
                          <Ban className="w-3 h-3 text-red-600" />
                          <span>SUSPENDED</span>
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 font-bold text-[10px] flex items-center space-x-1 w-fit">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>ACTIVE</span>
                        </span>
                      )}
                    </td>

                    <td className="p-3">
                      <div className="flex items-center space-x-1 text-stone-700">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>{u.county}, {u.country}</span>
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="font-mono text-stone-700">{u.phone || '0143791311'}</span>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        {/* Change Role Selector */}
                        <select
                          value={u.role}
                          onChange={(e) => onUpdateUserRole(u.id, e.target.value as UserRole)}
                          className="p-1 text-[10px] rounded border border-stone-300 bg-stone-50 font-bold"
                          title="Reassign System Role"
                        >
                          <option value="farmer">Farmer</option>
                          <option value="extension_officer">Officer</option>
                          <option value="ngo">Researcher</option>
                          <option value="admin">Admin</option>
                        </select>

                        {/* Suspend / Unsuspend Button */}
                        {onToggleUserSuspend && u.email !== 'iankipkoechchirchir06@gmail.com' && (
                          <button
                            onClick={() => onToggleUserSuspend(u.id)}
                            className={`px-2 py-1 rounded text-[10px] font-bold flex items-center space-x-1 border ${
                              u.status === 'suspended'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                                : 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                            }`}
                            title={u.status === 'suspended' ? 'Reactivate User Account' : 'Suspend User Account'}
                          >
                            <Ban className="w-3 h-3" />
                            <span>{u.status === 'suspended' ? 'Unsuspend' : 'Suspend'}</span>
                          </button>
                        )}

                        {/* Delete User */}
                        {u.email !== 'iankipkoechchirchir06@gmail.com' && (
                          <button
                            onClick={() => onDeleteUser(u.id)}
                            className="p-1 rounded bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                            title="Delete user account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: FAKE INFO & MISCONDUCT COMPLAINTS QUEUE */}
      {activeTab === 'fake_reports' && (
        <div className="space-y-4">
          <div className="p-4 bg-red-950/20 border border-red-800/40 rounded-2xl space-y-1 text-xs">
            <div className="flex items-center space-x-2 text-red-400 font-bold text-sm">
              <ShieldAlert className="w-4 h-4 text-red-500" />
              <span>Reported Fake Outbreak & Misconduct Complaints Queue</span>
            </div>
            <p className="text-stone-300">
              Peer reports filed by farmers and extension officers flagging fake disease warnings, false commodity prices, or non-existent farms.
            </p>
          </div>

          {userReports.length === 0 ? (
            <div className="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200 text-stone-500 text-xs font-semibold">
              <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
              <p>No complaints reported! Platform reports and outbreaks are clean and verified.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {userReports.map((rep) => (
                <div
                  key={rep.id}
                  className={`p-4 rounded-2xl border space-y-3 ${
                    rep.status === 'pending'
                      ? 'bg-red-50/50 border-red-200'
                      : 'bg-stone-50 border-stone-200 opacity-75'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200 pb-2">
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded bg-red-600 text-white font-extrabold text-[10px] uppercase">
                          {rep.reason.replace('_', ' ')}
                        </span>
                        <span className="text-xs font-bold text-stone-900">
                          Target User: <span className="text-red-700">{rep.targetUserName}</span>
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5">
                        Reported by <strong>{rep.reportedByUserName}</strong> on {new Date(rep.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase w-fit ${
                        rep.status === 'pending'
                          ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
                          : rep.status === 'actioned'
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {rep.status}
                    </span>
                  </div>

                  <div className="bg-white p-3 rounded-xl border border-stone-200 text-xs space-y-1">
                    <p className="font-bold text-stone-800">
                      Subject Item: <span className="text-amber-800">{rep.targetItemTitle}</span> ({rep.targetItemType})
                    </p>
                    <p className="text-stone-700 italic">"{rep.details}"</p>
                  </div>

                  {/* Admin Resolution Action Buttons */}
                  <div className="flex flex-wrap items-center justify-end gap-2 text-xs pt-1">
                    {onToggleUserSuspend && (
                      <button
                        onClick={() => {
                          onToggleUserSuspend(rep.targetUserId);
                          if (onResolveUserReport) onResolveUserReport(rep.id, 'actioned');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold flex items-center space-x-1 text-[11px]"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>Suspend Offending User</span>
                      </button>
                    )}

                    {onDeletePrediction && rep.targetItemType === 'outbreak' && rep.targetItemId && (
                      <button
                        onClick={() => {
                          onDeletePrediction(rep.targetItemId!);
                          if (onResolveUserReport) onResolveUserReport(rep.id, 'actioned');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-stone-900 text-white font-bold flex items-center space-x-1 text-[11px]"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        <span>Delete Fake Outbreak</span>
                      </button>
                    )}

                    {onDeleteReport && rep.targetItemType === 'community_report' && rep.targetItemId && (
                      <button
                        onClick={() => {
                          onDeleteReport(rep.targetItemId!);
                          if (onResolveUserReport) onResolveUserReport(rep.id, 'actioned');
                        }}
                        className="px-3 py-1.5 rounded-xl bg-stone-900 text-white font-bold flex items-center space-x-1 text-[11px]"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-red-400" />
                        <span>Delete Fake Incident Report</span>
                      </button>
                    )}

                    {onResolveUserReport && rep.status === 'pending' && (
                      <button
                        onClick={() => onResolveUserReport(rep.id, 'dismissed')}
                        className="px-3 py-1.5 rounded-xl bg-stone-200 text-stone-700 hover:bg-stone-300 font-bold text-[11px]"
                      >
                        Dismiss Flag
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: REGISTERED FARMS & LIVESTOCK DIRECTORY */}
      {activeTab === 'farms' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search farm, crop, or livestock type..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-stone-900 bg-stone-50"
              />
            </div>

            <p className="text-xs text-stone-500 font-semibold">
              Total Managed Agribusiness Assets: <strong>{farms.length} Plots/Herds</strong>
            </p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100 text-stone-600 font-bold text-[10px] uppercase tracking-wider border-b border-stone-200">
                <tr>
                  <th className="p-3">Farm Name & Location</th>
                  <th className="p-3">Enterprise Type</th>
                  <th className="p-3">Scale & Headcount</th>
                  <th className="p-3">Health Score</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-150 font-medium text-stone-800">
                {filteredFarms.map((f) => (
                  <tr key={f.id} className="hover:bg-stone-50 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-stone-900">{f.name}</div>
                      <div className="text-[11px] text-stone-500 flex items-center space-x-1">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>{f.county}, {f.country} ({f.locationName})</span>
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-[10px]">
                        {f.cropType} {f.livestockType ? `/ ${f.livestockType}` : ''}
                      </span>
                    </td>

                    <td className="p-3">
                      <div>{f.areaHectares} Ha</div>
                      {f.headCount && <div className="text-[11px] text-blue-700 font-bold">{f.headCount} Head Count</div>}
                    </td>

                    <td className="p-3">
                      <div className="font-bold text-emerald-700">{f.cropHealthScore}% Health</div>
                    </td>

                    <td className="p-3 text-right">
                      {onDeleteFarm && (
                        <button
                          onClick={() => onDeleteFarm(f.id)}
                          className="p-1 rounded bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                          title="Delete Farm Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: OUTBREAKS & INCIDENTS MODERATION */}
      {activeTab === 'outbreaks' && (
        <div className="space-y-4">
          <h4 className="font-extrabold text-stone-900 text-sm">Published Outbreak Predictions & Peer Incident Posts</h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {predictions.map((p) => (
              <div key={p.id} className="p-4 bg-stone-900 border border-stone-800 rounded-2xl text-stone-100 space-y-2 relative">
                <div className="flex items-center justify-between border-b border-stone-800 pb-2">
                  <h5 className="font-bold text-xs text-white">{p.diseaseName}</h5>
                  <span className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-300 font-extrabold text-[10px] border border-red-500/30">
                    {p.riskLevel} ({p.riskScore}%)
                  </span>
                </div>
                <p className="text-[11px] text-stone-300">{p.mitigationStrategy}</p>
                <div className="flex items-center justify-between pt-2 border-t border-stone-800 text-[10px]">
                  <span className="text-stone-400">Predicted Area: {p.predictedArea}</span>
                  {onDeletePrediction && (
                    <button
                      onClick={() => onDeletePrediction(p.id)}
                      className="px-2 py-0.5 rounded bg-red-600 text-white font-bold flex items-center space-x-1"
                    >
                      <Trash2 className="w-3 h-3" />
                      <span>Delete Outbreak</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
