import React from 'react';
import { DiseaseRiskPrediction, CommunityReport } from '../../types';
import { Bug, AlertTriangle, ShieldCheck, MapPin } from 'lucide-react';

interface PestOutbreakRadarProps {
  predictions: DiseaseRiskPrediction[];
  reports: CommunityReport[];
}

export const PestOutbreakRadar: React.FC<PestOutbreakRadarProps> = ({ predictions, reports }) => {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-1">
        <div className="inline-flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
          <Bug className="w-4 h-4" />
          <span>Vector & Outbreak Surveillance</span>
        </div>
        <h2 className="text-xl font-bold text-white">Sub-County Disease & Pest Outbreak Radar</h2>
        <p className="text-xs text-stone-400">Track vector migration, temperature triggers, and verified farmer field reports.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {predictions.map((p) => (
          <div key={p.id} className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <h4 className="text-sm font-bold text-white">{p.diseaseName}</h4>
              <span className="px-2.5 py-0.5 rounded-full bg-red-500/20 text-red-300 font-extrabold text-[10px] uppercase border border-red-500/30">
                {p.riskLevel} ({p.riskScore}%)
              </span>
            </div>
            <div className="text-xs space-y-1.5 text-stone-300">
              <p><strong>Target:</strong> {p.cropTarget}</p>
              <p><strong>Outbreak Probability Next 7 Days:</strong> <span className="text-red-400 font-bold">{p.outbreakProbabilityNext7Days}%</span></p>
              <p><strong>Trigger Factors:</strong> {p.triggerFactors.join(', ')}</p>
              <p className="p-2.5 bg-stone-950 rounded-xl border border-stone-800 text-[11px] text-stone-400">
                <strong>Field Protocol:</strong> {p.mitigationStrategy}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
