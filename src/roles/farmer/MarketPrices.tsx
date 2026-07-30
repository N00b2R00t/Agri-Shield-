import React from 'react';
import { MarketPrice } from '../../types';
import { Store, TrendingUp, TrendingDown, Minus, MapPin } from 'lucide-react';

interface MarketPricesProps {
  markets: MarketPrice[];
}

export const MarketPrices: React.FC<MarketPricesProps> = ({ markets }) => {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-1">
        <div className="inline-flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
          <Store className="w-4 h-4" />
          <span>Local Grain, Produce & Livestock Markets</span>
        </div>
        <h2 className="text-xl font-bold text-white">Regional Commodity Price Intelligence</h2>
        <p className="text-xs text-stone-400">
          Compare market rates for Maize, Milk, Goats, Eggs, and Wheat across local regional centers.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {markets.map((m) => (
          <div key={m.id} className="bg-stone-900 border border-stone-800 rounded-3xl p-4 space-y-3 shadow-md">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
              <div>
                <h4 className="text-sm font-bold text-white">{m.itemName}</h4>
                <div className="flex items-center space-x-1 text-[11px] text-stone-400 mt-0.5">
                  <MapPin className="w-3 h-3 text-emerald-400" />
                  <span>{m.marketName} ({m.distanceKm} km)</span>
                </div>
              </div>
              <span
                className={`p-1.5 rounded-xl border ${
                  m.trend === 'up'
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                    : m.trend === 'down'
                    ? 'bg-red-500/20 text-red-300 border-red-500/30'
                    : 'bg-stone-800 text-stone-300 border-stone-700'
                }`}
              >
                {m.trend === 'up' ? <TrendingUp className="w-4 h-4" /> : m.trend === 'down' ? <TrendingDown className="w-4 h-4" /> : <Minus className="w-4 h-4" />}
              </span>
            </div>

            <div className="space-y-1">
              <div className="text-xl font-black text-emerald-400">
                {m.currency} {m.pricePerUnit} <span className="text-xs text-stone-400 font-normal">/ {m.unit}</span>
              </div>
              <p className="text-[11px] text-stone-300 leading-relaxed font-medium">{m.advice}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
