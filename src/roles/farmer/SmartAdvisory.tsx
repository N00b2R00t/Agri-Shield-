import React from 'react';
import { Recommendation } from '../../types';
import { Sparkles, CheckCircle2, ShieldCheck, ArrowRight, Activity } from 'lucide-react';

interface SmartAdvisoryProps {
  recommendations: Recommendation[];
  onUpdateStatus?: (id: string, status: 'pending' | 'accepted' | 'dismissed' | 'completed') => void;
}

export const SmartAdvisory: React.FC<SmartAdvisoryProps> = ({
  recommendations,
  onUpdateStatus,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-1">
        <div className="inline-flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>AI Precision Agronomy & Veterinary Advisory</span>
        </div>
        <h2 className="text-xl font-bold text-white">Smart Actionable Recommendations</h2>
        <p className="text-xs text-stone-400">
          Tailored step-by-step guidance based on current soil moisture, rain probability, and livestock thermal index.
        </p>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div
            key={rec.id}
            className={`bg-stone-900 border rounded-3xl p-5 space-y-4 transition-all ${
              rec.priority === 'high'
                ? 'border-emerald-500/50 shadow-lg shadow-emerald-950/20'
                : 'border-stone-800'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-800 pb-3">
              <div className="space-y-0.5">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider border ${
                      rec.priority === 'high'
                        ? 'bg-red-500/20 text-red-300 border-red-500/30'
                        : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {rec.priority} Priority
                  </span>
                  <span className="text-xs text-stone-400 font-bold uppercase">{rec.actionType.replace('_', ' ')}</span>
                </div>
                <h3 className="text-base font-bold text-white mt-1">{rec.title}</h3>
              </div>

              <div className="flex items-center space-x-2 text-xs">
                <span className="text-emerald-400 font-extrabold bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-800">
                  {rec.confidenceScore}% AI Confidence
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-300 leading-relaxed">{rec.summary}</p>

            <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 space-y-1 text-xs">
              <span className="font-bold text-stone-200 block">Suggested Action Steps:</span>
              <ul className="list-disc list-inside space-y-1 text-stone-400">
                {rec.suggestedActionSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="text-xs text-emerald-400 font-bold flex items-center space-x-1">
                <Activity className="w-3.5 h-3.5" />
                <span>Impact: {rec.potentialImpact}</span>
              </div>

              {onUpdateStatus && (
                <div className="flex items-center space-x-2 text-xs">
                  <button
                    onClick={() => onUpdateStatus(rec.id, 'accepted')}
                    className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all"
                  >
                    Accept Action
                  </button>
                  <button
                    onClick={() => onUpdateStatus(rec.id, 'dismissed')}
                    className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold transition-all"
                  >
                    Dismiss
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
