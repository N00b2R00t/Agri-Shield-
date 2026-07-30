import React from 'react';
import { MarketPrice } from '../../types';
import { MarketIntelligence } from '../../components/MarketIntelligence';

interface MarketTrendsProps {
  markets: MarketPrice[];
}

export const MarketTrends: React.FC<MarketTrendsProps> = ({ markets }) => {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-1">
        <h2 className="text-xl font-bold text-white">Food Security & Regional Market Analytics</h2>
        <p className="text-xs text-stone-400">Track regional grain price volatility and food security indicators.</p>
      </div>

      <MarketIntelligence markets={markets} />
    </div>
  );
};
