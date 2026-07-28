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
} from 'lucide-react';
import { UserProfile, UserRole } from '../types';

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

  // New User Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('farmer'); // Default signup/create role is farmer
  const [county, setCounty] = useState('Uasin Gishu');
  const [organization, setOrganization] = useState('');
  const [successNotice, setSuccessNotice] = useState('');

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) return;

    const newUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name,
      email,
      phone: phone || '0143791311',
      role,
      country: 'Kenya',
      county,
      organization,
    };

    onAddUser(newUser);
    setSuccessNotice(`Successfully created ${role.toUpperCase().replace('_', ' ')}: ${name}`);
    setTimeout(() => setSuccessNotice(''), 4000);

    // Reset Form
    setName('');
    setEmail('');
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

      {/* CREATE NEW USER FORM (ADMIN DIRECT INSERT) */}
      {showAddForm && (
        <form onSubmit={handleCreateUserSubmit} className="bg-stone-50 p-4 rounded-2xl border border-stone-250 space-y-4 text-xs font-medium">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <h4 className="font-extrabold text-stone-900 flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Admin User Registration Form</span>
            </h4>
            <span className="text-[11px] text-stone-500">Adds user directly into database profiles</span>
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
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-stone-900"
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
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-stone-900"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">Phone / WhatsApp Number</label>
              <input
                type="tel"
                placeholder="0143791311 or +254..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-stone-900"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-stone-700 font-bold mb-1">Assigned User Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 font-bold"
              >
                <option value="farmer">Farmer (Default)</option>
                <option value="extension_officer">Extension Officer</option>
                <option value="ngo">Researcher / NGO</option>
                <option value="admin">Administrator</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">County / Region</label>
              <input
                type="text"
                placeholder="e.g. Uasin Gishu"
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-stone-900"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">Organization / Department</label>
              <input
                type="text"
                placeholder="e.g. County Agricultural Office"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-white text-stone-900"
              />
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 rounded-xl bg-stone-200 text-stone-700 font-bold text-xs hover:bg-stone-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs shadow-md"
            >
              Confirm & Save User to Database
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
