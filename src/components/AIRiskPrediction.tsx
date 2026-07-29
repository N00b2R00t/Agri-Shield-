import React from 'react';
import { DiseaseRiskPrediction } from '../types';
import { Bug, Wind, Thermometer, ShieldAlert, AlertTriangle, ArrowRight, Zap, Trash2 } from 'lucide-react';

interface AIRiskPredictionProps {
  predictions: DiseaseRiskPrediction[];
  onDeletePrediction?: (id: string) => void;
}

export const AIRiskPrediction: React.FC<AIRiskPredictionProps> = ({ predictions, onDeletePrediction }) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-red-100 text-red-800">
              <Bug className="w-5 h-5 text-red-600" />
            </div>
            <h2 className="text-lg font-bold text-stone-900 tracking-tight">
              AI Pest & Disease Vector Prediction Model
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Predicts pest migration and fungal sporulation combining humidity, wind vectors, and neighboring outbreaks.
          </p>
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-red-50 text-red-800 font-bold border border-red-200">
          Biosecurity Warning Active
        </span>
      </div>

      {/* Grid of Predictions */}
      <div className="space-y-4">
        {predictions.map((p) => {
          let riskBg = 'bg-stone-50 border-stone-200';
          let badgeBg = 'bg-amber-100 text-amber-800';
          if (p.riskLevel === 'Critical') {
            riskBg = 'bg-gradient-to-r from-white to-red-50/60 border-red-300';
            badgeBg = 'bg-red-600 text-white animate-pulse';
          } else if (p.riskLevel === 'High') {
            riskBg = 'bg-gradient-to-r from-white to-amber-50/60 border-amber-300';
            badgeBg = 'bg-amber-500 text-white';
          }

          return (
            <div
              key={p.id}
              className={`p-5 rounded-2xl border shadow-sm transition-all duration-200 space-y-3 ${riskBg}`}
            >
              
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-150 pb-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${badgeBg}`}>
                      {p.riskLevel} Threat Level ({p.riskScore}/100)
                    </span>
                    <span className="text-xs font-semibold text-stone-500">
                      Target: <strong className="text-stone-800">{p.cropTarget}</strong>
                    </span>
                  </div>
                  <h3 className="text-base font-extrabold text-stone-900 mt-1">
                    {p.diseaseName}
                  </h3>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-2xl font-black text-red-600">
                      {p.outbreakProbabilityNext7Days}%
                    </div>
                    <div className="text-[10px] text-stone-500 font-bold uppercase">
                      7-Day Outbreak Probability
                    </div>
                  </div>
                  {onDeletePrediction && (
                    <button
                      onClick={() => onDeletePrediction(p.id)}
                      className="p-2 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      title="Dismiss/Delete Risk Alert"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Environmental Vector Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                
                {/* Vector Drift */}
                <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-1">
                  <div className="font-bold text-stone-800 flex items-center space-x-1.5">
                    <Wind className="w-4 h-4 text-teal-600" />
                    <span>Spread Vector Trajectory:</span>
                  </div>
                  <p className="text-stone-600 font-medium">{p.spreadVector}</p>
                </div>

                {/* Regional Spread */}
                <div className="p-3 rounded-xl bg-white border border-stone-200 space-y-1">
                  <div className="font-bold text-stone-800 flex items-center space-x-1.5">
                    <ShieldAlert className="w-4 h-4 text-red-600" />
                    <span>Predicted Hazard Zone:</span>
                  </div>
                  <p className="text-stone-600 font-medium">{p.predictedArea}</p>
                </div>

              </div>

              {/* Trigger Factors */}
              <div className="space-y-1 text-xs">
                <span className="font-bold text-stone-800 uppercase text-[10px] tracking-wider">
                  Environmental Trigger Thresholds Met:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {p.triggerFactors.map((tf, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 font-semibold border border-stone-200"
                    >
                      • {tf}
                    </span>
                  ))}
                </div>
              </div>

              {/* Preventive Mitigation */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900 flex items-start space-x-2">
                <Zap className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-emerald-950">Recommended Preventive Defense:</span>
                  <p className="text-emerald-800 font-medium">{p.mitigationStrategy}</p>
                </div>
              </div>

            </div>
          );
        })}

        {predictions.length === 0 && (
          <div className="text-center py-10 bg-stone-50 rounded-2xl border border-dashed border-stone-200 space-y-3">
            <Bug className="w-8 h-8 text-emerald-500 mx-auto opacity-60" />
            <h3 className="text-sm font-bold text-stone-800">No Active Pathogen or Vector Outbreak Threats</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Your registered sector is currently free from biosecurity threats. The AI model monitors micro-climate data 24/7.
            </p>
          </div>
        )}
      </div>

    </div>
  );
};
