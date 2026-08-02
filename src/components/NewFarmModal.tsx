import React, { useState } from 'react';
import { Farm, CropType, SoilType, IrrigationMethod, GrowthStage } from '../types';
import { Sprout, MapPin, X, Check, ShieldCheck, Plus } from 'lucide-react';
import { KENYA_COUNTIES, getSubCountiesForCounty } from '../data/kenyaCounties';

interface NewFarmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddFarm: (newFarm: Farm) => void;
  userCounty?: string;
}

export const NewFarmModal: React.FC<NewFarmModalProps> = ({
  isOpen,
  onClose,
  onAddFarm,
  userCounty = 'Uasin Gishu',
}) => {
  const [name, setName] = useState('');
  const [locationName, setLocationName] = useState('Eldoret South');
  const [county, setCounty] = useState(userCounty);
  const [category, setCategory] = useState<'crop' | 'livestock' | 'mixed'>('mixed');
  const [cropType, setCropType] = useState<CropType>('Maize');
  const [livestockType, setLivestockType] = useState<string>('Dairy Cattle');
  const [headCount, setHeadCount] = useState<number>(10);
  const [growthStage, setGrowthStage] = useState<GrowthStage>('Vegetative / Early Growth');
  const [areaHectares, setAreaHectares] = useState<number>(2.5);
  const [soilType, setSoilType] = useState<SoilType>('Loam');
  const [irrigationMethod, setIrrigationMethod] = useState<IrrigationMethod>('Rainfed');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const selectedCountyObj = KENYA_COUNTIES.find((c) => c.name === county) || KENYA_COUNTIES[26];

    const farmId = `farm-${Date.now()}`;
    const newFarm: Farm = {
      id: farmId,
      userId: 'usr-current',
      name: name.trim(),
      locationName: locationName.trim(),
      county,
      country: 'Kenya',
      lat: selectedCountyObj.lat,
      lng: selectedCountyObj.lng,
      category,
      cropType,
      livestockType: category === 'crop' ? undefined : (livestockType as any),
      headCount: category === 'crop' ? undefined : headCount,
      growthStage,
      plantingDate: new Date().toISOString().split('T')[0],
      areaHectares,
      soilType,
      irrigationMethod,
      boundaryCoordinates: [
        [selectedCountyObj.lat + 0.001, selectedCountyObj.lng - 0.001],
        [selectedCountyObj.lat + 0.002, selectedCountyObj.lng + 0.002],
        [selectedCountyObj.lat - 0.001, selectedCountyObj.lng + 0.002],
        [selectedCountyObj.lat - 0.002, selectedCountyObj.lng - 0.001],
      ],
      riskScore: 35,
      cropHealthScore: 88,
    };

    onAddFarm(newFarm);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl text-stone-100 space-y-4 my-8">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Plus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-100">Register New Farm Parcel</h3>
              <p className="text-xs text-stone-400">Select any of Kenya's 47 counties, crop type, and livestock</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs font-medium">
          <div>
            <label className="block text-stone-300 font-bold mb-1">Farm / Block Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Kipchirchir Pioneer Maize & Dairy Farm"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 placeholder-stone-600 focus:outline-none focus:border-emerald-500 font-bold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-300 font-bold mb-1">Kenya County (47 Counties) *</label>
              <select
                value={county}
                onChange={(e) => {
                  const newCounty = e.target.value;
                  setCounty(newCounty);
                  const subList = getSubCountiesForCounty(newCounty);
                  if (subList.length > 0) {
                    setLocationName(subList[0]);
                  }
                }}
                className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:border-emerald-500 font-bold"
              >
                {KENYA_COUNTIES.map((c) => (
                  <option key={c.code} value={c.name}>
                    {c.code} - {c.name} ({c.region})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-stone-300 font-bold mb-1">Sub-County / Constituency *</label>
              <select
                value={locationName}
                onChange={(e) => setLocationName(e.target.value)}
                className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 focus:border-emerald-500 font-bold"
              >
                {getSubCountiesForCounty(county).map((sub) => (
                  <option key={sub} value={sub}>
                    {sub}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-stone-300 font-bold mb-1">Farming Enterprise Type</label>
            <div className="grid grid-cols-3 gap-2 text-[11px]">
              <button
                type="button"
                onClick={() => setCategory('mixed')}
                className={`p-2 rounded-xl border text-center font-bold ${
                  category === 'mixed'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-stone-950 border-stone-800 text-stone-400'
                }`}
              >
                Mixed Enterprise
              </button>
              <button
                type="button"
                onClick={() => setCategory('crop')}
                className={`p-2 rounded-xl border text-center font-bold ${
                  category === 'crop'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-stone-950 border-stone-800 text-stone-400'
                }`}
              >
                Crops Only
              </button>
              <button
                type="button"
                onClick={() => setCategory('livestock')}
                className={`p-2 rounded-xl border text-center font-bold ${
                  category === 'livestock'
                    ? 'bg-emerald-950 border-emerald-500 text-emerald-300'
                    : 'bg-stone-950 border-stone-800 text-stone-400'
                }`}
              >
                Livestock Only
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-300 font-bold mb-1">Primary Crop</label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value as CropType)}
                className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
              >
                <option value="Maize">Maize (Hybrid HB6210)</option>
                <option value="Sorghum">Sorghum</option>
                <option value="Tomatoes">Tomatoes</option>
                <option value="Beans">Beans</option>
                <option value="Coffee">Coffee</option>
                <option value="Wheat">Wheat</option>
                <option value="Rice">Rice</option>
                <option value="Cassava">Cassava</option>
                <option value="Napier / Pasture Forage">Napier Grass / Pasture Forage</option>
              </select>
            </div>

            {category !== 'crop' && (
              <div>
                <label className="block text-stone-300 font-bold mb-1">Livestock Type</label>
                <select
                  value={livestockType}
                  onChange={(e) => setLivestockType(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
                >
                  <option value="Dairy Cattle (Friesian/Ayrshire)">Dairy Cattle (Friesian/Ayrshire)</option>
                  <option value="Beef Cattle (Boran/Zebu)">Beef Cattle (Boran/Zebu)</option>
                  <option value="Goats & Sheep (Dorper/Galla)">Goats & Sheep (Dorper/Galla)</option>
                  <option value="Poultry (Kienyeji / Layers)">Poultry (Kienyeji / Layers)</option>
                  <option value="Apiculture (Honeybees)">Apiculture (Honeybees)</option>
                  <option value="Aquaculture (Tilapia/Catfish)">Aquaculture (Tilapia/Catfish)</option>
                </select>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-stone-300 font-bold mb-1">Area (Hectares)</label>
              <input
                type="number"
                step="0.1"
                min="0.1"
                value={areaHectares}
                onChange={(e) => setAreaHectares(parseFloat(e.target.value) || 1)}
                className="w-full p-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
              />
            </div>

            <div>
              <label className="block text-stone-300 font-bold mb-1">Soil Type</label>
              <select
                value={soilType}
                onChange={(e) => setSoilType(e.target.value as SoilType)}
                className="w-full p-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
              >
                <option value="Loam">Loam</option>
                <option value="Clay">Clay</option>
                <option value="Sandy">Sandy</option>
                <option value="Volcanic">Volcanic</option>
                <option value="Pasture Rangeland">Pasture Rangeland</option>
              </select>
            </div>

            <div>
              <label className="block text-stone-300 font-bold mb-1">Irrigation</label>
              <select
                value={irrigationMethod}
                onChange={(e) => setIrrigationMethod(e.target.value as IrrigationMethod)}
                className="w-full p-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-100"
              >
                <option value="Rainfed">Rainfed</option>
                <option value="Drip Irrigation">Drip Irrigation</option>
                <option value="Furrow / Flood">Furrow / Flood</option>
                <option value="Sprinkler">Sprinkler</option>
                <option value="Borehole / Livestock Trough">Borehole / Livestock Trough</option>
              </select>
            </div>
          </div>

          <div className="pt-3 border-t border-stone-800 flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-800 text-stone-300 font-bold hover:bg-stone-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-black text-sm shadow-lg shadow-emerald-950/40"
            >
              Register & Set Active Farm
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
