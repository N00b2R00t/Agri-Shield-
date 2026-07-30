import React from 'react';
import { Building2, MessageSquare, BookOpen, ExternalLink } from 'lucide-react';

interface ExtensionSupportProps {
  onOpenDocModal?: () => void;
}

export const ExtensionSupport: React.FC<ExtensionSupportProps> = ({ onOpenDocModal }) => {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-1">
        <div className="inline-flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
          <Building2 className="w-4 h-4" />
          <span>Ministry Hotline & Field Officer Support</span>
        </div>
        <h2 className="text-xl font-bold text-white">Extension Officer Helpdesk</h2>
        <p className="text-xs text-stone-400">Technical support line, platform administration, and agronomist handbook.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-3">
          <h4 className="font-bold text-sm text-white flex items-center space-x-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>Developer Support Dispatch</span>
          </h4>
          <p className="text-stone-300">Contact platform administrator for database synchronization or system broadcast assistance.</p>
          <a
            href="https://wa.me/254143791311?text=Hello%20Ian%20Chirchir,%20Extension%20Officer%20Support%20Request"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold inline-flex items-center space-x-2"
          >
            <span>WhatsApp Admin (+254 143 791 311)</span>
          </a>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-3">
          <h4 className="font-bold text-sm text-white flex items-center space-x-2">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span>Extension Field Manual</span>
          </h4>
          <p className="text-stone-300">Access standard operating procedures for Fall Armyworm & East Coast Fever field audits.</p>
          {onOpenDocModal && (
            <button
              onClick={onOpenDocModal}
              className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold inline-flex items-center space-x-1.5"
            >
              <span>View System Documentation</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
