import React from 'react';
import { UserRole } from '../types';
import { User, Eye, ShieldCheck, Globe, Building2 } from 'lucide-react';

interface RoleBannerProps {
  role: UserRole;
  onChangeRole: (role: UserRole) => void;
}

export const RoleBanner: React.FC<RoleBannerProps> = ({ role, onChangeRole }) => {
  const configs: Record<
    UserRole,
    { title: string; desc: string; icon: React.ReactNode; border: string; badgeText: string }
  > = {
    farmer: {
      title: 'Farmer Decision Mode',
      desc: 'Receiving hyper-local, actionable climate risk recommendations, daily farming advice, and community outbreak alerts for your field.',
      icon: <User className="w-4 h-4 text-emerald-600" />,
      border: 'border-emerald-200 bg-emerald-50 text-emerald-900',
      badgeText: 'Individual Farm Optimization',
    },
    extension_officer: {
      title: 'Agricultural Extension Officer Mode',
      desc: 'Monitoring multiple smallholder farms across Nakuru County, verifying community pest reports, and broadcasting regional warnings.',
      icon: <Eye className="w-4 h-4 text-blue-600" />,
      border: 'border-blue-200 bg-blue-50 text-blue-900',
      badgeText: 'Multi-Farm Guidance & Verification',
    },
    ngo: {
      title: 'NGO / Climate Specialist Mode',
      desc: 'Analyzing regional climate vulnerability trends, yield resilience metrics, and disaster prevention data across smallholder clusters.',
      icon: <Globe className="w-4 h-4 text-purple-600" />,
      border: 'border-purple-200 bg-purple-50 text-purple-900',
      badgeText: 'Regional Analytics & Food Security',
    },
    admin: {
      title: 'Government / System Admin Mode',
      desc: 'Managing regional climate intelligence feeds, disease prediction parameters, user roles, and emergency response dispatching.',
      icon: <Building2 className="w-4 h-4 text-amber-600" />,
      border: 'border-amber-200 bg-amber-50 text-amber-900',
      badgeText: 'System Configuration & Policy',
    },
  };

  const curr = configs[role];

  return (
    <div className={`px-4 py-2.5 border-b text-xs flex flex-wrap items-center justify-between gap-2 ${curr.border}`}>
      <div className="flex items-center space-x-2">
        <div className="p-1 rounded-md bg-white shadow-sm border border-stone-200">{curr.icon}</div>
        <div>
          <span className="font-bold mr-2">{curr.title}:</span>
          <span className="opacity-90">{curr.desc}</span>
        </div>
      </div>
      <div className="flex items-center space-x-2">
        <span className="px-2 py-0.5 rounded-full bg-white/80 font-semibold text-[10px] uppercase tracking-wider border border-current">
          {curr.badgeText}
        </span>
      </div>
    </div>
  );
};
