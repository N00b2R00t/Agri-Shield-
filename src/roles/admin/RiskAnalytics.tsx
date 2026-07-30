import React from 'react';
import { DiseaseRiskPrediction } from '../../types';
import { AIRiskPrediction } from '../../components/AIRiskPrediction';

interface RiskAnalyticsProps {
  predictions: DiseaseRiskPrediction[];
}

export const RiskAnalytics: React.FC<RiskAnalyticsProps> = ({ predictions }) => {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-1">
        <h2 className="text-xl font-bold text-white">System Risk Prediction Engines</h2>
        <p className="text-xs text-stone-400">Manage vector models, climate risk scoring, and outbreak forecasts.</p>
      </div>

      <AIRiskPrediction predictions={predictions} />
    </div>
  );
};
