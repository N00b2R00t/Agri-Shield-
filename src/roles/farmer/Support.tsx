import React from 'react';
import { UserProfile } from '../../types';
import { MessageSquare, PhoneCall, Sparkles, BookOpen, ShieldCheck, ExternalLink } from 'lucide-react';

interface FarmerSupportProps {
  user: UserProfile;
  onOpenDocModal?: () => void;
}

export const FarmerSupport: React.FC<FarmerSupportProps> = ({ user, onOpenDocModal }) => {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-1">
        <div className="inline-flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
          <MessageSquare className="w-4 h-4" />
          <span>Extension Agent & Technical Support</span>
        </div>
        <h2 className="text-xl font-bold text-white">Farmer Assistance & Knowledge Center</h2>
        <p className="text-xs text-stone-400">Direct WhatsApp support, agronomist advice line, and climate resilience manuals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Direct Developer WhatsApp Support */}
        <div className="bg-gradient-to-br from-emerald-950 via-stone-900 to-stone-900 border border-emerald-800/60 rounded-3xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Direct Extension & Support Channel</span>
          </div>
          <p className="text-xs text-stone-300 leading-relaxed">
            Need immediate help with Fall Armyworm control, livestock disease diagnosis, or weather alert interpretation?
          </p>
          <div className="text-xs text-stone-400 font-bold">
            Lead Developer / Support Contact: <span className="text-white">Ian Kipkoech Chirchir</span>
          </div>
          <a
            href="https://wa.me/254143791311?text=Hello%20Ian%20Chirchir,%20I%20am%20a%20farmer%20seeking%20AgriShield%20Support"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs inline-flex items-center space-x-2 shadow-lg transition-all"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Connect on WhatsApp (+254 143 791 311)</span>
          </a>
        </div>

        {/* Documentation & Manuals */}
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-stone-100 font-bold text-sm">
            <BookOpen className="w-4 h-4 text-emerald-400" />
            <span>AgriShield Platform User Guide</span>
          </div>
          <p className="text-xs text-stone-400 leading-relaxed">
            Learn how to record farm boundaries, use What-If climate simulators, and read soil moisture sensors.
          </p>
          {onOpenDocModal && (
            <button
              onClick={onOpenDocModal}
              className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-100 font-bold text-xs inline-flex items-center space-x-2 border border-stone-700"
            >
              <span>Open System Manual & API Guide</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
