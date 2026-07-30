import React from 'react';
import { UserProfile, UserRole } from '../../types';
import { ShieldCheck, ArrowRight } from 'lucide-react';

interface RoleRouterProps {
  user: UserProfile;
  activeRoleTab: string;
  onChangeRoleTab: (tab: string) => void;
}

export const RoleRouter: React.FC<RoleRouterProps> = ({ user, activeRoleTab, onChangeRoleTab }) => {
  const getRoleBadgeColor = (role: UserRole) => {
    switch (role) {
      case 'farmer':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'extension_officer':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'ngo':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'admin':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-stone-800 text-stone-300 border-stone-700';
    }
  };

  return (
    <div className="bg-stone-900 border border-stone-800 rounded-2xl p-2.5 flex items-center justify-between text-xs">
      <div className="flex items-center space-x-2">
        <span className="text-stone-400 font-bold hidden sm:inline">Active Role View:</span>
        <span className={`px-2.5 py-0.5 rounded-full font-black uppercase text-[10px] border ${getRoleBadgeColor(user.role)}`}>
          {user.role.replace('_', ' ')}
        </span>
      </div>

      <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar">
        {['overview', 'farms', 'advisory', 'community', 'markets', 'support'].map((tab) => (
          <button
            key={tab}
            onClick={() => onChangeRoleTab(tab)}
            className={`px-3 py-1 rounded-xl text-[11px] font-bold capitalize transition-all whitespace-nowrap ${
              activeRoleTab === tab
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
};
