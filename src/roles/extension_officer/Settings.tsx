import React from 'react';
import { UserProfile } from '../../types';
import { Building2, ShieldCheck, MapPin, Mail, Phone } from 'lucide-react';

interface ExtensionSettingsProps {
  user: UserProfile;
  onOpenSettingsModal: () => void;
}

export const ExtensionSettings: React.FC<ExtensionSettingsProps> = ({ user, onOpenSettingsModal }) => {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-1">
        <div className="inline-flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
          <Building2 className="w-4 h-4" />
          <span>Officer Credential & Duty Station</span>
        </div>
        <h2 className="text-xl font-bold text-white">Extension Officer Credentials</h2>
        <p className="text-xs text-stone-400">Assigned county, ministry registration, and security credentials.</p>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 space-y-1">
            <span className="text-stone-400 font-bold block">Officer Name</span>
            <span className="text-white font-extrabold text-sm block">{user.name}</span>
          </div>
          <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 space-y-1">
            <span className="text-stone-400 font-bold block">Official Email</span>
            <span className="text-white font-extrabold text-sm block">{user.email}</span>
          </div>
          <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 space-y-1">
            <span className="text-stone-400 font-bold block">Assigned Duty County</span>
            <span className="text-cyan-400 font-extrabold text-sm block">{user.county || 'Uasin Gishu'}</span>
          </div>
          <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 space-y-1">
            <span className="text-stone-400 font-bold block">Ministry / Station</span>
            <span className="text-white font-extrabold text-sm block">{user.organization || 'Ministry of Agriculture Extension Unit'}</span>
          </div>
        </div>

        <button
          onClick={onOpenSettingsModal}
          className="px-5 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md"
        >
          Manage Official Credentials
        </button>
      </div>
    </div>
  );
};
