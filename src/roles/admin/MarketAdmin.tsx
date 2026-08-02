import React, { useState } from 'react';
import { MarketPrice } from '../../types';
import { MarketIntelligence } from '../../components/MarketIntelligence';
import { Plus, Store, Check, X } from 'lucide-react';

interface MarketAdminProps {
  markets: MarketPrice[];
  onDeleteMarketPrice?: (id: string) => void;
  onAddMarketPrice?: (mkt: MarketPrice) => void;
}

export const MarketAdmin: React.FC<MarketAdminProps> = ({
  markets,
  onDeleteMarketPrice,
  onAddMarketPrice,
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [itemName, setItemName] = useState('Dry Maize (90kg bag)');
  const [marketName, setMarketName] = useState('Eldoret Grain Hub');
  const [region, setRegion] = useState('Uasin Gishu');
  const [pricePerUnit, setPricePerUnit] = useState(3200);
  const [unit, setUnit] = useState('Bag (90kg)');
  const [trend, setTrend] = useState<'up' | 'down' | 'stable'>('up');
  const [priceChangePercent, setPriceChangePercent] = useState(4.5);
  const [advice, setAdvice] = useState('Strong local processor demand. Recommend holding dry grain for optimal price margins.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onAddMarketPrice) return;

    const newMkt: MarketPrice = {
      id: `mkt-${Date.now()}`,
      itemCategory: 'crop',
      itemName,
      cropName: itemName,
      marketName,
      distanceKm: 5.2,
      pricePerUnit: Number(pricePerUnit),
      unit,
      pricePerKg: Math.round((Number(pricePerUnit) / 90) * 10) / 10,
      currency: 'KES',
      priceChangePercent: Number(priceChangePercent),
      trend,
      advice,
      region,
      lastUpdated: 'Just now',
    };

    onAddMarketPrice(newMkt);
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white">Global Market Price Feed Control</h2>
          <p className="text-xs text-stone-400">Manage commodity price trends and market advice across Kenya.</p>
        </div>

        {onAddMarketPrice && (
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-2 shadow-md transition-transform active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Commodity Price Feed</span>
          </button>
        )}
      </div>

      <MarketIntelligence markets={markets} onDeleteMarketPrice={onDeleteMarketPrice} />

      {/* Add Commodity Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center space-x-2 text-white font-bold text-sm">
                <Store className="w-4 h-4 text-emerald-400" />
                <span>Add Commodity Market Price</span>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg bg-stone-800 text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 font-bold mb-1">Commodity / Crop Name</label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Market Center</label>
                  <input
                    type="text"
                    required
                    value={marketName}
                    onChange={(e) => setMarketName(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Region / County</label>
                  <input
                    type="text"
                    required
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Price per Unit (KES)</label>
                  <input
                    type="number"
                    required
                    value={pricePerUnit}
                    onChange={(e) => setPricePerUnit(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Unit</label>
                  <input
                    type="text"
                    required
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Trend</label>
                  <select
                    value={trend}
                    onChange={(e) => setTrend(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 font-bold"
                  >
                    <option value="up">Upward (+)</option>
                    <option value="down">Downward (-)</option>
                    <option value="stable">Stable (=)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Price Change %</label>
                  <input
                    type="number"
                    step="0.1"
                    value={priceChangePercent}
                    onChange={(e) => setPriceChangePercent(Number(e.target.value))}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">Market Action Advice</label>
                <textarea
                  rows={2}
                  required
                  value={advice}
                  onChange={(e) => setAdvice(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black flex items-center justify-center space-x-2 shadow-md"
              >
                <Check className="w-4 h-4" />
                <span>Save Commodity Price</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
