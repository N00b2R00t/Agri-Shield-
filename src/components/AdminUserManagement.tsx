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
  Phone,
  Mail,
  MapPin,
  MessageSquare,
  Sparkles,
  Eye,
  EyeOff,
  Lock,
  Globe,
  Sprout,
  CheckCircle2,
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';
import { KENYA_COUNTIES, getSubCountiesForCounty } from '../data/kenyaCounties';
import { hashPassword, sanitizeInput, validatePasswordStrength } from '../lib/security';

interface AdminUserManagementProps {
  currentUser: UserProfile;
  usersList: UserProfile[];
  onAddUser: (newUser: UserProfile) => void;
  onUpdateUserRole: (id: string, newRole: UserRole) => void;
  onDeleteUser: (id: string) => void;
}

export const AdminUserManagement: React.FC<AdminUserManagementProps> = ({
  currentUser,
  usersList,
  onAddUser,
  onUpdateUserRole,
  onDeleteUser,
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');

  // Comprehensive New User Form State
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
    };

    onAddUser(newUser);
    setSuccessNotice(`Successfully registered ${role.toUpperCase().replace('_', ' ')} (${name}) with all user details saved to database!`);
    setTimeout(() => setSuccessNotice(''), 5000);

    // Reset Form
    setName('');
    setEmail('');
    setPassword('AgriShield2026!');
    setPhone('');
    setRole('farmer');
    setOrganization('');
    setSubCounty('Moiben');
    setWard('Kimumu');
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

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-6">
      
      {/* Admin Panel Header & Contact Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-stone-150">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-700 border border-amber-500/20">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-stone-900">
                User Management & Administrative Access Controls
              </h3>
              <p className="text-xs text-stone-500">
                Manage registered farmers, extension officers, and system accounts stored in database.
              </p>
            </div>
          </div>
        </div>

        {/* Developer Contact & Create User Trigger */}
        <div className="flex items-center space-x-3">
          <a
            href="https://wa.me/254143791311?text=Hello%20Ian%20Chirchir,%20Admin%20User%20Management%20Support"
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

      {/* CREATE NEW USER FORM (ADMIN DIRECT INSERT WITH ALL USER DETAILS) */}
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

          {/* Section 1: Account Credentials & Security */}
          <div className="space-y-2">
            <p className="text-[11px] font-extrabold text-stone-600 uppercase tracking-wider flex items-center space-x-1">
              <User className="w-3.5 h-3.5 text-stone-500" />
              <span>1. Account Credentials & Security</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Dr. Jane Chebet"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 font-medium focus:ring-2 focus:ring-emerald-500"
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
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 font-medium focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Account Password *</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Set secure account password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-2.5 pr-10 rounded-xl border border-stone-300 bg-white text-stone-900 font-mono focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <p className="text-[10px] text-stone-500 mt-0.5 flex items-center space-x-1">
                  <Lock className="w-3 h-3 text-stone-400" />
                  <span>Strength: {passwordEval.feedback}</span>
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Phone / WhatsApp Number *</label>
                <input
                  type="tel"
                  required
                  placeholder="e.g. 0143791311 or +254712345678"
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
                <label className="block text-stone-700 font-bold mb-1">Organization / Cooperative / Dept *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Moiben Farmers Co-op / Ministry of Agriculture"
                  value={organization}
                  onChange={(e) => setOrganization(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Geographic & Location Boundaries */}
          <div className="space-y-2 pt-1 border-t border-stone-200">
            <p className="text-[11px] font-extrabold text-stone-600 uppercase tracking-wider flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>2. Regional & Location Boundaries</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Country</label>
                <div className="relative">
                  <Globe className="w-4 h-4 text-stone-400 absolute left-2.5 top-3" />
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full pl-9 p-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">County / Region *</label>
                <select
                  value={county}
                  onChange={(e) => {
                    const newCounty = e.target.value;
                    setCounty(newCounty);
                    const subCounties = getSubCountiesForCounty(newCounty);
                    if (subCounties.length > 0) {
                      setSubCounty(subCounties[0]);
                    }
                  }}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 font-bold"
                >
                  {KENYA_COUNTIES.map((c) => (
                    <option key={c.code} value={c.name}>
                      {c.name} ({c.region})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Sub-County / Constituency *</label>
                <select
                  value={subCounty}
                  onChange={(e) => setSubCounty(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 font-bold"
                >
                  {getSubCountiesForCounty(county).map((sub) => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Ward / Local Village *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kimumu, Segero, Ziwa"
                  value={ward}
                  onChange={(e) => setWard(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 font-medium"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Agricultural Focus & Enterprise Details */}
          <div className="space-y-2 pt-1 border-t border-stone-200">
            <p className="text-[11px] font-extrabold text-stone-600 uppercase tracking-wider flex items-center space-x-1">
              <Sprout className="w-3.5 h-3.5 text-stone-500" />
              <span>3. Agricultural Focus & Enterprise Profile</span>
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Agribusiness Focus *</label>
                <select
                  value={primaryFocus}
                  onChange={(e) => setPrimaryFocus(e.target.value as any)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 font-bold"
                >
                  <option value="Crops">Crops Production</option>
                  <option value="Livestock">Livestock & Dairy</option>
                  <option value="Mixed Agribusiness">Mixed Agribusiness</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Primary Crop Enterprise</label>
                <select
                  value={primaryCrop}
                  onChange={(e) => setPrimaryCrop(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 font-medium"
                >
                  <option value="Maize">Maize (Commercial Grain)</option>
                  <option value="Wheat">Wheat</option>
                  <option value="Sorghum">Sorghum</option>
                  <option value="Tomatoes">Tomatoes / Vegetables</option>
                  <option value="Beans">Beans & Legumes</option>
                  <option value="Coffee">Coffee</option>
                  <option value="Rice">Rice</option>
                  <option value="Cassava">Cassava</option>
                  <option value="Napier / Pasture Forage">Napier / Pasture Forage</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Primary Livestock Enterprise</label>
                <select
                  value={primaryLivestock}
                  onChange={(e) => setPrimaryLivestock(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 font-medium"
                >
                  <option value="Dairy Cattle (Friesian/Ayrshire)">Dairy Cattle (Friesian/Ayrshire)</option>
                  <option value="Beef Cattle (Boran/Zebu)">Beef Cattle (Boran/Zebu)</option>
                  <option value="Goats & Sheep (Dorper/Galla)">Goats & Sheep (Dorper/Galla)</option>
                  <option value="Poultry (Kienyeji / Layers)">Poultry (Kienyeji / Layers)</option>
                  <option value="Apiculture (Honeybees)">Apiculture (Honeybees)</option>
                  <option value="Aquaculture (Tilapia/Catfish)">Aquaculture (Tilapia/Catfish)</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-3 border-t border-stone-200">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2.5 rounded-xl bg-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-300 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md transition-transform active:scale-95 flex items-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm & Provision User Profile to Database</span>
            </button>
          </div>
        </form>
      )}

      {/* FILTER & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by name, email, or county..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-stone-900 bg-stone-50"
          />
        </div>

        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
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

      {/* USER LIST TABLE */}
      <div className="overflow-x-auto rounded-xl border border-stone-200">
        <table className="w-full text-left text-xs">
          <thead className="bg-stone-100 text-stone-600 font-bold text-[10px] uppercase tracking-wider border-b border-stone-200">
            <tr>
              <th className="p-3">User Profile</th>
              <th className="p-3">Role & Permissions</th>
              <th className="p-3">Location & Org</th>
              <th className="p-3">Contact info</th>
              <th className="p-3 text-right">Actions</th>
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
                  <div className="flex items-center space-x-1 text-stone-700">
                    <MapPin className="w-3 h-3 text-stone-400" />
                    <span>{u.county}, {u.country}</span>
                  </div>
                  {u.organization && (
                    <div className="text-[10px] text-stone-500 italic">{u.organization}</div>
                  )}
                </td>

                <td className="p-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono text-stone-700">{u.phone || '0143791311'}</span>
                    <a
                      href={`https://wa.me/${(u.phone || '0143791311').replace(/[^0-9]/g, '')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="p-1 rounded bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                      title="Direct WhatsApp chat"
                    >
                      <MessageSquare className="w-3 h-3" />
                    </a>
                  </div>
                </td>

                <td className="p-3 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <select
                      value={u.role}
                      onChange={(e) => onUpdateUserRole(u.id, e.target.value as UserRole)}
                      className="p-1 text-[10px] rounded border border-stone-300 bg-stone-50 font-bold"
                    >
                      <option value="farmer">Farmer</option>
                      <option value="extension_officer">Officer</option>
                      <option value="ngo">Researcher</option>
                      <option value="admin">Admin</option>
                    </select>

                    {u.email !== 'iankipkoechchirchir06@gmail.com' && (
                      <button
                        onClick={() => onDeleteUser(u.id)}
                        className="p-1 rounded bg-red-50 text-red-600 hover:bg-red-100 border border-red-200"
                        title="Delete user"
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
  );
};
