import React from 'react';
import { ShieldCheck, MessageSquare, ExternalLink, Code } from 'lucide-react';

interface AdminSupportProps {
  onOpenDocModal?: () => void;
}

export const AdminSupport: React.FC<AdminSupportProps> = ({ onOpenDocModal }) => {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-1">
        <div className="inline-flex items-center space-x-2 text-red-400 font-bold text-xs uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Audit Logs & Developer Hotline</span>
        </div>
        <h2 className="text-xl font-bold text-white">Administrator Technical Support</h2>
        <p className="text-xs text-stone-400">Direct lead developer support, database schema specs, and platform audit logs.</p>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-4 text-xs">
        <div className="p-4 bg-stone-950 rounded-2xl border border-stone-800 space-y-2">
          <span className="font-bold text-stone-200 block text-sm">Lead Software Engineer & Platform Architect:</span>
          <div className="text-stone-300 font-bold">Ian Kipkoech Chirchir</div>
          <p className="text-stone-400">For direct developer assistance, custom API routes, or database migration inquiries:</p>
          <a
            href="https://wa.me/254143791311?text=Hello%20Ian%20Chirchir,%20Admin%20System%20Inquiry"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold inline-flex items-center space-x-2"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Architect (+254 143 791 311)</span>
          </a>
        </div>

        {onOpenDocModal && (
          <button
            onClick={onOpenDocModal}
            className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold inline-flex items-center space-x-1.5"
          >
            <span>View Complete Platform Documentation</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
};
