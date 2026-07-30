import React from 'react';
import { MarketPrice } from '../../types';
import { MarketIntelligence } from '../../components/MarketIntelligence';

interface MarketAdminProps {
  markets: MarketPrice[];
}

export const MarketAdmin: React.FC<MarketAdminProps> = ({ markets }) => {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-1">
        <h2 className="text-xl font-bold text-white">Global Market Price Feed Control</h2>
        <p className="text-xs text-stone-400">Manage commodity price trends across regional centers in Kenya.</p>
      </div>

      <MarketIntelligence markets={markets} />
    </div>
  );
};
