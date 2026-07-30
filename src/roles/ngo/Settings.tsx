import React from 'react';
import { UserProfile } from '../../types';
import { Globe } from 'lucide-react';

interface NGOSettingsProps {
  user: UserProfile;
  onOpenSettingsModal: () => void;
}

export const NGOSettings: React.FC<NGOSettingsProps> = ({ user, onOpenSettingsModal }) => {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-1">
        <div className="inline-flex items-center space-x-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
          <Globe className="w-4 h-4" />
          <span>Institutional NGO Profile</span>
        </div>
        <h2 className="text-xl font-bold text-white">NGO / Climate Specialist Settings</h2>
        <p className="text-xs text-stone-400">Institutional registration, focus sector, and security credentials.</p>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 space-y-1">
            <span className="text-stone-400 font-bold block">Specialist Name</span>
            <span className="text-white font-extrabold text-sm block">{user.name}</span>
          </div>
          <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 space-y-1">
            <span className="text-stone-400 font-bold block">Organization</span>
            <span className="text-blue-400 font-extrabold text-sm block">{user.organization || 'Global Climate Tech'}</span>
          </div>
        </div>

        <button
          onClick={onOpenSettingsModal}
          className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md"
        >
          Manage NGO Profile
        </button>
      </div>
    </div>
  );
};
