import React, { useState } from 'react';
import { UserProfile, Farm, CropType, GrowthStage, SoilType, IrrigationMethod } from '../types';
import { User, Sprout, MapPin, X, Check } from 'lucide-react';
import { KENYA_COUNTIES } from '../data/kenyaCounties';

interface FarmerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile;
  activeFarm: Farm;
  onUpdateFarm: (updated: Partial<Farm>) => void;
}

export const FarmerProfileModal: React.FC<FarmerProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  activeFarm,
  onUpdateFarm,
}) => {
  const [farmName, setFarmName] = useState(activeFarm.name);
  const [county, setCounty] = useState(activeFarm.county || 'Uasin Gishu');
  const [category, setCategory] = useState<'crop' | 'livestock' | 'mixed'>(activeFarm.category || 'mixed');
  const [cropType, setCropType] = useState<CropType>(activeFarm.cropType);
  const [livestockType, setLivestockType] = useState<string>(activeFarm.livestockType || 'Dairy Cattle');
  const [headCount, setHeadCount] = useState<number>(activeFarm.headCount || 12);
  const [growthStage, setGrowthStage] = useState<GrowthStage>(activeFarm.growthStage);
  const [areaHectares, setAreaHectares] = useState(activeFarm.areaHectares);
  const [soilType, setSoilType] = useState<SoilType>(activeFarm.soilType);
  const [irrigationMethod, setIrrigationMethod] = useState<IrrigationMethod>(activeFarm.irrigationMethod);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const countyObj = KENYA_COUNTIES.find((c) => c.name === county);
    onUpdateFarm({
      name: farmName,
      county,
      lat: countyObj ? countyObj.lat : activeFarm.lat,
      lng: countyObj ? countyObj.lng : activeFarm.lng,
      category,
      cropType,
      livestockType,
      headCount,
      growthStage,
      areaHectares,
      soilType,
      irrigationMethod,
    });
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <User className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900">{user.name}'s Profile</h3>
              <p className="text-xs text-stone-500">{user.email} • {user.organization}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-stone-400 hover:text-stone-600 font-bold">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Farm Metadata Edit Form */}
        <form onSubmit={handleSubmit} className="space-y-3 text-xs font-medium">
          <div className="font-bold text-stone-800 uppercase text-[10px] tracking-wider pb-1 border-b border-stone-150 flex items-center space-x-1">
            <Sprout className="w-3.5 h-3.5 text-emerald-600" />
            <span>Active Farm Configuration: {activeFarm.id}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-stone-700 font-bold mb-1">Farm Name</label>
              <input
                type="text"
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-stone-700 font-bold mb-1">County (47 Counties)</label>
              <select
                value={county}
                onChange={(e) => setCounty(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 font-bold"
              >
                {KENYA_COUNTIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.code} - {c.name} ({c.region})
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-stone-700 font-bold mb-1">Enterprise Type</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 font-semibold"
              >
                <option value="mixed">Mixed Crops & Livestock</option>
                <option value="crop">Crop Agriculture Only</option>
                <option value="livestock">Animal Keeping Only</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-bold mb-1">Primary Crop</label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value as CropType)}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900"
              >
                <option value="Maize">Maize (Hybrid HB6210)</option>
                <option value="Sorghum">Sorghum</option>
                <option value="Tomatoes">Tomatoes</option>
                <option value="Beans">Beans</option>
                <option value="Coffee">Coffee</option>
                <option value="Napier Grass">Napier Grass (Fodder)</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">Livestock Keeping</label>
              <select
                value={livestockType}
                onChange={(e) => setLivestockType(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900"
              >
                <option value="Dairy Cattle">Dairy Cattle</option>
                <option value="Dairy Goats / Sheep">Dairy Goats / Sheep</option>
                <option value="Poultry Layers / Kienyeji">Poultry Layers / Kienyeji</option>
                <option value="Apiculture / Bees">Apiculture / Bees</option>
                <option value="None">None</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-700 font-bold mb-1">Livestock Head Count</label>
              <input
                type="number"
                value={headCount}
                onChange={(e) => setHeadCount(parseInt(e.target.value) || 0)}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 font-bold"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">Growth / Production Stage</label>
              <select
                value={growthStage}
                onChange={(e) => setGrowthStage(e.target.value as GrowthStage)}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900"
              >
                <option value="Land Prep">Land Prep</option>
                <option value="Vegetative / Early Growth">Vegetative / Early Growth</option>
                <option value="Flowering / Tasseling">Flowering / Tasseling</option>
                <option value="Lactation / Production Cycle">Lactation / Production Cycle</option>
                <option value="Ready to Harvest">Ready to Harvest</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-stone-700 font-bold mb-1">Area (Hectares)</label>
              <input
                type="number"
                step="0.1"
                value={areaHectares}
                onChange={(e) => setAreaHectares(parseFloat(e.target.value) || 1)}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900"
              />
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">Soil Type</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value as SoilType)}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900"
              >
                <option value="Loam">Loam</option>
                <option value="Clay">Clay</option>
                <option value="Sandy">Sandy</option>
                <option value="Volcanic">Volcanic</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-700 font-bold mb-1">Irrigation Method</label>
              <select
                value={irrigationMethod}
                onChange={(e) => setIrrigationMethod(e.target.value as IrrigationMethod)}
                className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900"
              >
                <option value="Rainfed">Rainfed</option>
                <option value="Drip Irrigation">Drip Irrigation</option>
                <option value="Furrow / Flood">Furrow / Flood</option>
                <option value="Sprinkler">Sprinkler</option>
              </select>
            </div>
          </div>

          {saved && (
            <div className="p-2.5 rounded-xl bg-emerald-100 text-emerald-900 font-bold flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Farm profile updated! AI recommendation engine re-calibrated.</span>
            </div>
          )}

          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-600 font-bold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md"
            >
              Save Farm Details
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
