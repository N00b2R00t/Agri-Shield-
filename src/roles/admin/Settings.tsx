import React from 'react';
import { UserProfile } from '../../types';
import { Lock } from 'lucide-react';

interface AdminSettingsProps {
  user: UserProfile;
  onOpenSettingsModal: () => void;
}

export const AdminSettings: React.FC<AdminSettingsProps> = ({ user, onOpenSettingsModal }) => {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-1">
        <div className="inline-flex items-center space-x-2 text-red-400 font-bold text-xs uppercase tracking-wider">
          <Lock className="w-4 h-4" />
          <span>Security Policies & Master Settings</span>
        </div>
        <h2 className="text-xl font-bold text-white">Administrator Credentials & Policies</h2>
        <p className="text-xs text-stone-400">Master account email, password authentication, and database keys.</p>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 space-y-1">
            <span className="text-stone-400 font-bold block">Master Admin</span>
            <span className="text-white font-extrabold text-sm block">{user.name}</span>
          </div>
          <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 space-y-1">
            <span className="text-stone-400 font-bold block">Email Credentials</span>
            <span className="text-red-400 font-extrabold text-sm block">{user.email}</span>
          </div>
        </div>

        <button
          onClick={onOpenSettingsModal}
          className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md"
        >
          Open Security & Admin Controls
        </button>
      </div>
    </div>
  );
};
