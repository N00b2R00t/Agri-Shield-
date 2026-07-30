import React from 'react';
import { UserProfile } from '../../types';
import { User, ShieldCheck, MapPin, Building2, Phone, Mail } from 'lucide-react';

interface FarmerSettingsProps {
  user: UserProfile;
  onOpenSettingsModal: () => void;
}

export const FarmerSettings: React.FC<FarmerSettingsProps> = ({ user, onOpenSettingsModal }) => {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-1">
        <div className="inline-flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
          <User className="w-4 h-4" />
          <span>Farmer Profile & Account Settings</span>
        </div>
        <h2 className="text-xl font-bold text-white">Smallholder Account & Cooperative Info</h2>
        <p className="text-xs text-stone-400">View registered personal contact details, county region, and system permissions.</p>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 space-y-1">
            <span className="text-stone-400 flex items-center space-x-1.5 font-bold">
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Full Name</span>
            </span>
            <span className="font-extrabold text-sm text-white block">{user.name}</span>
          </div>

          <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 space-y-1">
            <span className="text-stone-400 flex items-center space-x-1.5 font-bold">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>Registered Email</span>
            </span>
            <span className="font-extrabold text-sm text-white block">{user.email}</span>
          </div>

          <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 space-y-1">
            <span className="text-stone-400 flex items-center space-x-1.5 font-bold">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Phone Number</span>
            </span>
            <span className="font-extrabold text-sm text-white block">{user.phone || '0143791311'}</span>
          </div>

          <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 space-y-1">
            <span className="text-stone-400 flex items-center space-x-1.5 font-bold">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>County Region</span>
            </span>
            <span className="font-extrabold text-sm text-white block">{user.county || 'Uasin Gishu'}</span>
          </div>

          <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 space-y-1 sm:col-span-2">
            <span className="text-stone-400 flex items-center space-x-1.5 font-bold">
              <Building2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>Organization / Cooperative</span>
            </span>
            <span className="font-extrabold text-sm text-white block">{user.organization || 'AgriShield Cooperative'}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-stone-800 flex justify-end">
          <button
            onClick={onOpenSettingsModal}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all"
          >
            Open Full Settings & Change Password
          </button>
        </div>
      </div>
    </div>
  );
};
