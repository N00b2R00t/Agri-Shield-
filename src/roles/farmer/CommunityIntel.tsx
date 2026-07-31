import React from 'react';
import { CommunityReport, UserProfile } from '../../types';
import { Users, ThumbsUp, MapPin, AlertCircle, CheckCircle2, ShieldCheck } from 'lucide-react';

interface CommunityIntelProps {
  reports: CommunityReport[];
  user: UserProfile;
  onUpvoteReport?: (id: string) => void;
  onAddReportModal?: () => void;
}

export const CommunityIntel: React.FC<CommunityIntelProps> = ({
  reports,
  user,
  onUpvoteReport,
  onAddReportModal,
}) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900 border border-stone-800 p-5 rounded-3xl">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <Users className="w-4 h-4" />
            <span>Community Field Intelligence</span>
          </div>
          <h2 className="text-xl font-bold text-white">Neighboring Farmer Incident Reports</h2>
          <p className="text-xs text-stone-400">Crowdsourced pest outbreaks, livestock disease alerts, and flood risks in {user.county}.</p>
        </div>

        {onAddReportModal && (
          <button
            onClick={onAddReportModal}
            className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md"
          >
            <span>+ Report Incident</span>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {reports.map((rep) => (
          <div key={rep.id} className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 rounded-2xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold text-xs">
                  {rep.userName.charAt(0)}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{rep.userName} ({rep.farmName})</h4>
                  <div className="flex items-center space-x-2 text-[11px] text-stone-400">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    <span>{rep.cropAffected} • {rep.distanceKm || 1.2} km away</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                {rep.verified && (
                  <span className="px-2.5 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-bold uppercase flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3" />
                    <span>Verified</span>
                  </span>
                )}
                <span className="px-2.5 py-0.5 rounded-md bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-bold uppercase">
                  {rep.severity}
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">{rep.description}</p>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[11px] text-stone-500 font-mono">Logged: {(rep.createdAt || new Date().toISOString()).split('T')[0]}</span>
              {onUpvoteReport && (
                <button
                  onClick={() => onUpvoteReport(rep.id)}
                  className="px-3 py-1.5 rounded-xl bg-stone-950 hover:bg-stone-800 border border-stone-800 text-stone-200 font-bold flex items-center space-x-1.5 text-xs transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Confirm / Upvote ({rep.upvotes})</span>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
