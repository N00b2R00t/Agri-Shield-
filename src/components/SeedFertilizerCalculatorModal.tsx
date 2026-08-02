import React, { useState, useEffect } from 'react';
import { Farm } from '../types';
import { X, Calculator, Sprout, ShieldCheck, Check, Sparkles, Scale, Info, DollarSign } from 'lucide-react';

interface SeedFertilizerCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  farms?: Farm[];
  activeFarm?: Farm | null;
}

interface CropSpec {
  name: string;
  seedPerAcreKg: number;
  plantingFertPerAcreKg: number; // e.g., DAP
  plantingFertType: string;
  topDressFertPerAcreKg: number; // e.g., CAN / Urea
  topDressFertType: string;
  manurePerAcreTons: number;
  seedPricePerKgKES: number;
  plantingFertPrice50kgKES: number;
  topDressFertPrice50kgKES: number;
  spacingGuide: string;
  applicationTips: string[];
}

const CROP_DATABASE: Record<string, CropSpec> = {
  Maize: {
    name: 'Maize / Corn',
    seedPerAcreKg: 10,
    plantingFertPerAcreKg: 50, // 1 bag DAP
    plantingFertType: 'DAP (18:46:0) or NPK 23:23:0',
    topDressFertPerAcreKg: 50, // 1 bag CAN
    topDressFertType: 'CAN (Calcium Ammonium Nitrate) / Urea',
    manurePerAcreTons: 2,
    seedPricePerKgKES: 350, // 2kg ~ 700 KES
    plantingFertPrice50kgKES: 3500,
    topDressFertPrice50kgKES: 2800,
    spacingGuide: '75 cm between rows × 25 cm between plants (1 seed per hole)',
    applicationTips: [
      'Apply DAP/NPK at planting, placing fertilizer 5 cm below and to the side of the seed.',
      'Top-dress with CAN when maize is knee-high (4–6 weeks after germination), preferably into moist soil.',
      'If heavy rainfall is expected within 24 hrs, postpone top-dressing to prevent leaching.',
    ],
  },
  Wheat: {
    name: 'Wheat / Barley',
    seedPerAcreKg: 45,
    plantingFertPerAcreKg: 50,
    plantingFertType: 'DAP or NPK 17:17:17',
    topDressFertPerAcreKg: 35,
    topDressFertType: 'CAN / Ammonium Sulphate',
    manurePerAcreTons: 1.5,
    seedPricePerKgKES: 180,
    plantingFertPrice50kgKES: 3500,
    topDressFertPrice50kgKES: 2800,
    spacingGuide: 'Row planting at 20 cm inter-row spacing',
    applicationTips: [
      'Drill seed together with DAP fertilizer at 2–3 cm depth into fine seedbed.',
      'Apply top-dressing broadcast before first tillering stage.',
    ],
  },
  Beans: {
    name: 'Beans / Pulses',
    seedPerAcreKg: 25,
    plantingFertPerAcreKg: 30,
    plantingFertType: 'DAP / SSP (Single Superphosphate)',
    topDressFertPerAcreKg: 0, // Legumes fix nitrogen
    topDressFertType: 'None (Nitrogen Fixing Crop)',
    manurePerAcreTons: 2,
    seedPricePerKgKES: 220,
    plantingFertPrice50kgKES: 3500,
    topDressFertPrice50kgKES: 0,
    spacingGuide: '50 cm between rows × 10 cm between plants',
    applicationTips: [
      'Avoid high nitrogen top-dressing as beans naturally fix nitrogen via Rhizobia root nodules.',
      'Inoculate seeds with Bio-Fix inoculant for enhanced root nodulation.',
    ],
  },
  Potatoes: {
    name: 'Irish Potatoes',
    seedPerAcreKg: 800, // Seed tubers ~ 800 kg / 16 bags
    plantingFertPerAcreKg: 100, // 2 bags
    plantingFertType: 'NPK 17:17:17 or DAP',
    topDressFertPerAcreKg: 50,
    topDressFertType: 'CAN (during earthing up)',
    manurePerAcreTons: 4,
    seedPricePerKgKES: 60, // ~ 3,000 KES per 50kg bag
    plantingFertPrice50kgKES: 3600,
    topDressFertPrice50kgKES: 2800,
    spacingGuide: '75 cm between ridges × 30 cm between seed tubers',
    applicationTips: [
      'Use certified disease-free seed tubers (e.g. Shangi or Dutch Reka).',
      'Apply CAN and earth up soil around ridges when plants are 20 cm tall.',
    ],
  },
  Sorghum: {
    name: 'Sorghum / Millet',
    seedPerAcreKg: 5,
    plantingFertPerAcreKg: 35,
    plantingFertType: 'DAP or Compound Fertilizer',
    topDressFertPerAcreKg: 25,
    topDressFertType: 'CAN / Urea',
    manurePerAcreTons: 1.5,
    seedPricePerKgKES: 300,
    plantingFertPrice50kgKES: 3500,
    topDressFertPrice50kgKES: 2800,
    spacingGuide: '60 cm between rows × 15 cm between plants',
    applicationTips: [
      'Highly drought tolerant. Thin seedlings 2 weeks after emergence to maintain optimal plant population.',
    ],
  },
  Horticulture: {
    name: 'Vegetables / Tomatoes / Cabbage',
    seedPerAcreKg: 0.2, // 200 grams
    plantingFertPerAcreKg: 50,
    plantingFertType: 'DAP / NPK 23:23:0 + Organic Compost',
    topDressFertPerAcreKg: 75,
    topDressFertType: 'CAN / NPK 17:17:17 + Foliar Feed',
    manurePerAcreTons: 5,
    seedPricePerKgKES: 15000, // Hybrid vegetable seeds ~ 3,000 per 200g
    plantingFertPrice50kgKES: 3600,
    topDressFertPrice50kgKES: 2900,
    spacingGuide: '60 cm × 45 cm for cabbages / tomatoes on raised beds',
    applicationTips: [
      'Apply generous well-decomposed manure in planting holes 1 week prior to transplanting.',
      'Apply foliar micro-nutrients every 14 days during flowering and fruit set.',
    ],
  },
};

export const SeedFertilizerCalculatorModal: React.FC<SeedFertilizerCalculatorModalProps> = ({
  isOpen,
  onClose,
  farms = [],
  activeFarm,
}) => {
  const [selectedFarmId, setSelectedFarmId] = useState<string>(activeFarm?.id || 'custom');
  const [areaVal, setAreaVal] = useState<number>(activeFarm ? activeFarm.areaHectares * 2.47105 : 1.5); // Default in acres
  const [unit, setUnit] = useState<'acres' | 'hectares'>('acres');
  const [cropType, setCropType] = useState<string>(activeFarm?.cropType || 'Maize');
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (activeFarm) {
      setSelectedFarmId(activeFarm.id);
      const acres = activeFarm.areaHectares ? activeFarm.areaHectares * 2.47105 : 1.5;
      setAreaVal(Math.round(acres * 10) / 10);
      if (CROP_DATABASE[activeFarm.cropType]) {
        setCropType(activeFarm.cropType);
      }
    }
  }, [activeFarm]);

  if (!isOpen) return null;

  const handleFarmChange = (fId: string) => {
    setSelectedFarmId(fId);
    if (fId !== 'custom') {
      const found = farms.find((f) => f.id === fId);
      if (found) {
        const acres = found.areaHectares * 2.47105;
        setAreaVal(Math.round(acres * 10) / 10);
        if (CROP_DATABASE[found.cropType]) {
          setCropType(found.cropType);
        }
      }
    }
  };

  // Calculations
  const acres = unit === 'acres' ? areaVal : areaVal * 2.47105;
  const spec = CROP_DATABASE[cropType] || CROP_DATABASE['Maize'];

  const totalSeedKg = Math.round(spec.seedPerAcreKg * acres * 10) / 10;
  const totalPlantingFertKg = Math.round(spec.plantingFertPerAcreKg * acres);
  const totalTopDressFertKg = Math.round(spec.topDressFertPerAcreKg * acres);
  const totalManureTons = Math.round(spec.manurePerAcreTons * acres * 10) / 10;

  // Bags (50kg bags for fertilizer)
  const plantingFertBags = Math.ceil(totalPlantingFertKg / 50);
  const topDressFertBags = Math.ceil(totalTopDressFertKg / 50);

  // Financial Estimates in KES
  const estimatedSeedCostKES = Math.round(totalSeedKg * spec.seedPricePerKgKES);
  const estimatedPlantingFertCostKES = plantingFertBags * spec.plantingFertPrice50kgKES;
  const estimatedTopDressFertCostKES = topDressFertBags * spec.topDressFertPrice50kgKES;
  const totalBudgetKES = estimatedSeedCostKES + estimatedPlantingFertCostKES + estimatedTopDressFertCostKES;

  const handleCopySummary = () => {
    const summaryText = `🌾 AGRISHIELD SEED & FERTILIZER PLAN
Plot Area: ${areaVal} ${unit} (${Math.round(acres * 10) / 10} Acres)
Crop Enterprise: ${spec.name}

1. SEED REQUIREMENT:
- Total Seed Needed: ${totalSeedKg} kg
- Estimated Seed Cost: KES ${estimatedSeedCostKES.toLocaleString()}

2. PLANTING / BASAL FERTILIZER:
- Type: ${spec.plantingFertType}
- Total Quantity: ${totalPlantingFertKg} kg (~${plantingFertBags} x 50kg bags)
- Estimated Cost: KES ${estimatedPlantingFertCostKES.toLocaleString()}

3. TOP-DRESSING FERTILIZER:
- Type: ${spec.topDressFertType}
- Total Quantity: ${totalTopDressFertKg} kg (~${topDressFertBags} x 50kg bags)
- Estimated Cost: KES ${estimatedTopDressFertCostKES.toLocaleString()}

4. ORGANIC MANURE:
- Recommended Compost/Manure: ${totalManureTons} Tonnes

TOTAL INPUT BUDGET ESTIMATE: KES ${totalBudgetKES.toLocaleString()}

SPACING GUIDE: ${spec.spacingGuide}`;

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-black text-white">Seed & Fertilizer Estimator</h2>
              <p className="text-xs text-stone-400">Calculate exact input quantities & financial budget for your plot.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Inputs Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {farms.length > 0 && (
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">Select Farm Plot</label>
              <select
                value={selectedFarmId}
                onChange={(e) => handleFarmChange(e.target.value)}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 font-bold focus:border-emerald-500"
              >
                <option value="custom">-- Custom Plot Size --</option>
                {farms.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name} ({f.areaHectares} ha / {Math.round(f.areaHectares * 2.471 * 10) / 10} ac)
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1">Crop Type</label>
            <select
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 font-bold focus:border-emerald-500"
            >
              {Object.keys(CROP_DATABASE).map((ck) => (
                <option key={ck} value={ck}>
                  {CROP_DATABASE[ck].name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1">Plot Area</label>
            <div className="flex items-center space-x-1">
              <input
                type="number"
                min="0.1"
                step="0.1"
                value={areaVal}
                onChange={(e) => setAreaVal(Math.max(0.1, parseFloat(e.target.value) || 0.1))}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 font-bold focus:border-emerald-500"
              />
              <select
                value={unit}
                onChange={(e) => setUnit(e.target.value as any)}
                className="bg-stone-950 border border-stone-800 rounded-xl px-2 py-2 text-xs text-emerald-400 font-black focus:border-emerald-500"
              >
                <option value="acres">Acres</option>
                <option value="hectares">Hectares</option>
              </select>
            </div>
          </div>
        </div>

        {/* Estimation Results Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-stone-300">
              Input Requirements for <span className="text-emerald-400 font-black">{areaVal} {unit}</span> of <span className="text-emerald-400 font-black">{spec.name}</span>
            </span>
            <span className="text-stone-400 text-[11px] font-mono">1 Hectare = 2.471 Acres</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Seed Requirement */}
            <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-400 font-bold flex items-center space-x-1.5">
                  <Sprout className="w-4 h-4 text-emerald-400" />
                  <span>Seed Requirement</span>
                </span>
                <span className="text-emerald-400 font-black">KES {estimatedSeedCostKES.toLocaleString()}</span>
              </div>
              <div className="text-xl font-black text-white">
                {totalSeedKg} <span className="text-sm text-stone-400 font-normal">kg total</span>
              </div>
              <p className="text-[11px] text-stone-400">Rate: {spec.seedPerAcreKg} kg / acre</p>
            </div>

            {/* Planting Fertilizer */}
            <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-400 font-bold flex items-center space-x-1.5">
                  <Scale className="w-4 h-4 text-amber-400" />
                  <span>Planting / Basal Fertilizer</span>
                </span>
                <span className="text-amber-400 font-black">KES {estimatedPlantingFertCostKES.toLocaleString()}</span>
              </div>
              <div className="text-xl font-black text-white">
                {totalPlantingFertKg} <span className="text-sm text-stone-400 font-normal">kg ({plantingFertBags} x 50kg bags)</span>
              </div>
              <p className="text-[11px] text-stone-400">{spec.plantingFertType}</p>
            </div>

            {/* Top-Dressing Fertilizer */}
            <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-400 font-bold flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-blue-400" />
                  <span>Top-Dressing Fertilizer</span>
                </span>
                <span className="text-blue-400 font-black">
                  {estimatedTopDressFertCostKES > 0 ? `KES ${estimatedTopDressFertCostKES.toLocaleString()}` : 'N/A'}
                </span>
              </div>
              <div className="text-xl font-black text-white">
                {totalTopDressFertKg} <span className="text-sm text-stone-400 font-normal">kg ({topDressFertBags} x 50kg bags)</span>
              </div>
              <p className="text-[11px] text-stone-400">{spec.topDressFertType}</p>
            </div>

            {/* Organic Compost / Manure */}
            <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-stone-400 font-bold flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>Organic Compost / Manure</span>
                </span>
                <span className="text-teal-400 font-black">Soil Health</span>
              </div>
              <div className="text-xl font-black text-white">
                {totalManureTons} <span className="text-sm text-stone-400 font-normal">Tonnes</span>
              </div>
              <p className="text-[11px] text-stone-400">Well-decomposed farmyard manure</p>
            </div>
          </div>

          {/* Budget Total Highlight Banner */}
          <div className="bg-gradient-to-r from-emerald-950 via-stone-950 to-stone-950 border border-emerald-500/40 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-xs text-stone-400 uppercase font-bold tracking-wider">Estimated Total Input Cost</span>
              <div className="text-2xl font-black text-emerald-400">
                KES {totalBudgetKES.toLocaleString()}
              </div>
              <p className="text-[11px] text-stone-400">Based on standard Kenyan market retail prices for certified seed & fertilizer.</p>
            </div>

            <button
              onClick={handleCopySummary}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center justify-center space-x-2 shadow-md transition-transform active:scale-95"
            >
              {copied ? <Check className="w-4 h-4" /> : <Calculator className="w-4 h-4" />}
              <span>{copied ? 'Copied Plan!' : 'Copy Summary Plan'}</span>
            </button>
          </div>

          {/* Spacing & Application Tips */}
          <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 space-y-3 text-xs">
            <div className="flex items-center space-x-2 text-stone-200 font-bold">
              <Info className="w-4 h-4 text-amber-400" />
              <span>Recommended Spacing & Agronomic Guidelines</span>
            </div>
            <p className="text-stone-300 font-mono text-[11px] bg-stone-900 p-2 rounded-xl border border-stone-800">
              {spec.spacingGuide}
            </p>
            <ul className="space-y-1 text-[11px] text-stone-400 list-disc list-inside">
              {spec.applicationTips.map((tip, idx) => (
                <li key={idx}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
