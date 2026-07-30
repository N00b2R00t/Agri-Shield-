import React from 'react';
import { Recommendation } from '../../types';
import { Sparkles, CheckCircle2, FileText } from 'lucide-react';

interface FieldAdvisoryProps {
  recommendations: Recommendation[];
}

export const FieldAdvisory: React.FC<FieldAdvisoryProps> = ({ recommendations }) => {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-1">
        <div className="inline-flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
          <Sparkles className="w-4 h-4" />
          <span>Agronomist Field Guidelines</span>
        </div>
        <h2 className="text-xl font-bold text-white">Extension Technical Advisory Database</h2>
        <p className="text-xs text-stone-400">Review, validate, and issue official Ministry of Agriculture field protocols to county smallholders.</p>
      </div>

      <div className="space-y-4">
        {recommendations.map((rec) => (
          <div key={rec.id} className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
              <span className="font-bold text-sm text-white">{rec.title}</span>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase border border-cyan-500/30">
                {rec.actionType}
              </span>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">{rec.summary}</p>
            <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 text-xs text-stone-400">
              <span className="font-bold text-stone-200 block mb-1">Standard Operating Protocol:</span>
              <ul className="list-disc list-inside space-y-1">
                {rec.suggestedActionSteps.map((step, idx) => (
                  <li key={idx}>{step}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
