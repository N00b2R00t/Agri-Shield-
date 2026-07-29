import React from 'react';
import { MarketPrice } from '../types';
import { Store, TrendingUp, TrendingDown, Minus, Clock, MapPin, Sparkles, Trash2 } from 'lucide-react';

interface MarketIntelligenceProps {
  markets: MarketPrice[];
  onDeleteMarketPrice?: (id: string) => void;
}

export const MarketIntelligence: React.FC<MarketIntelligenceProps> = ({ markets, onDeleteMarketPrice }) => {
  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-5">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Store className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-lg font-bold text-stone-900 tracking-tight">
              Hyper-Local Agricultural Market Intelligence
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time wholesale prices, regional buyer demand, and post-harvest timing advice.
          </p>
        </div>

        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          Updated 30 mins ago
        </span>
      </div>

      {/* Market Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {markets.map((mkt) => {
          const isUp = mkt.trend === 'up';
          const isDown = mkt.trend === 'down';

          return (
            <div
              key={mkt.id}
              className="p-4 rounded-2xl border border-stone-200 hover:border-emerald-300 shadow-sm transition-all space-y-3 bg-white"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-900 bg-stone-100 px-2.5 py-0.5 rounded-full">
                  {mkt.itemName || mkt.cropName}
                </span>
                <div
                  className={`flex items-center space-x-1 text-xs font-bold px-2 py-0.5 rounded-full ${
                    isUp
                      ? 'bg-emerald-100 text-emerald-800'
                      : isDown
                      ? 'bg-red-100 text-red-800'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {isUp && <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />}
                  {isDown && <TrendingDown className="w-3.5 h-3.5 text-red-600" />}
                  {!isUp && !isDown && <Minus className="w-3.5 h-3.5 text-stone-500" />}
                  <span>
                    {mkt.priceChangePercent > 0 ? '+' : ''}
                    {mkt.priceChangePercent}%
                  </span>
                </div>
              </div>

              <div>
                <div className="text-2xl font-black text-stone-900">
                  ${mkt.pricePerUnit || mkt.pricePerKg}{' '}
                  <span className="text-xs font-normal text-stone-500">
                    / {mkt.unit || 'kg'}
                  </span>
                </div>
                <div className="text-xs font-bold text-stone-700 mt-0.5 flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  <span>{mkt.marketName}</span>
                  <span className="text-stone-400 font-normal">({mkt.distanceKm} km)</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-150 text-[11px] text-stone-700 leading-relaxed font-medium">
                <strong className="text-emerald-800 font-bold block mb-0.5">Market Action Advice:</strong>
                {mkt.advice}
              </div>

              <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-stone-100">
                <div className="flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{mkt.lastUpdated}</span>
                </div>
                {onDeleteMarketPrice && (
                  <button
                    onClick={() => onDeleteMarketPrice(mkt.id)}
                    className="text-stone-400 hover:text-red-600 p-1 rounded transition-colors"
                    title="Delete Market Price Record"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {markets.length === 0 && (
        <div className="text-center py-10 bg-stone-50 rounded-2xl border border-dashed border-stone-200 space-y-3">
          <Store className="w-8 h-8 text-emerald-500 mx-auto opacity-60" />
          <h3 className="text-sm font-bold text-stone-800">No Market Price Intelligence Records</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Wholesale pricing records will appear here as regional commodity boards and buyers update prices.
          </p>
        </div>
      )}

    </div>
  );
};
