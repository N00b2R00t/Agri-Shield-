import React, { useState } from 'react';
import { UserReportItem, UserProfile } from '../types';
import { AlertTriangle, Send, X, ShieldAlert, Flag } from 'lucide-react';

interface ReportFakeModalProps {
  currentUser: UserProfile;
  targetUserId: string;
  targetUserName: string;
  targetItemType: 'user' | 'outbreak' | 'community_report' | 'farm' | 'market_price';
  targetItemId?: string;
  targetItemTitle?: string;
  onClose: () => void;
  onSubmitReport: (report: UserReportItem) => void;
}

export const ReportFakeModal: React.FC<ReportFakeModalProps> = ({
  currentUser,
  targetUserId,
  targetUserName,
  targetItemType,
  targetItemId,
  targetItemTitle,
  onClose,
  onSubmitReport,
}) => {
  const [reason, setReason] = useState<
    'fake_outbreak' | 'fake_incident' | 'false_prices' | 'fake_farm' | 'misleading_advice' | 'misconduct'
  >(
    targetItemType === 'outbreak'
      ? 'fake_outbreak'
      : targetItemType === 'farm'
      ? 'fake_farm'
      : targetItemType === 'market_price'
      ? 'false_prices'
      : 'fake_incident'
  );
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!details.trim()) return;

    const newReport: UserReportItem = {
      id: `rep-usr-${Date.now()}`,
      reportedByUserId: currentUser.id,
      reportedByUserName: currentUser.name,
      targetUserId: targetUserId || 'usr-unknown',
      targetUserName: targetUserName || 'Anonymous User',
      targetItemType,
      targetItemId,
      targetItemTitle: targetItemTitle || `${targetItemType.toUpperCase()} Record`,
      reason,
      details,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };

    onSubmitReport(newReport);
    setSubmitted(true);
    setTimeout(() => {
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-md w-full p-6 text-stone-100 space-y-4 shadow-2xl relative">
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center space-x-2 text-red-400 font-bold text-sm">
            <Flag className="w-4 h-4 text-red-500" />
            <span>Report Fake Information or User Misconduct</span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-stone-800 text-stone-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {submitted ? (
          <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold space-y-2 text-center">
            <ShieldAlert className="w-8 h-8 text-emerald-400 mx-auto" />
            <p>Thank you! Your report has been dispatched to County Extension Directors & Platform System Admins for immediate review.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 space-y-1">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">Report Subject</span>
              <p className="font-bold text-white text-xs">{targetUserName}</p>
              {targetItemTitle && (
                <p className="text-[11px] text-amber-300 italic">Item: {targetItemTitle}</p>
              )}
            </div>

            <div>
              <label className="block text-stone-300 font-bold mb-1">Reason for Report</label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value as any)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 font-bold focus:ring-2 focus:ring-red-500"
              >
                <option value="fake_outbreak">Fake Disease / Outbreak Warning</option>
                <option value="fake_incident">Fake Field Incident / Pest Swarm</option>
                <option value="false_prices">False / Manipulated Market Prices</option>
                <option value="fake_farm">Non-Existent / Fake Farm Registration</option>
                <option value="misleading_advice">Dangerous / Misleading Agronomy Advice</option>
                <option value="misconduct">Harassment / User Profile Misconduct</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-300 font-bold mb-1">Detailed Explanation & Evidence *</label>
              <textarea
                rows={4}
                required
                placeholder="Explain why this information or outbreak notice is fake or inaccurate so extension officers can verify..."
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 focus:ring-2 focus:ring-red-500"
              />
            </div>

            <p className="text-[10px] text-stone-400 leading-normal">
              Reports are reviewed by County Agriculture Directors. Submitting false flags repeatedly may affect your trust score.
            </p>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black flex items-center justify-center space-x-2 shadow-md transition-transform active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span>Submit Report to System Admin</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
