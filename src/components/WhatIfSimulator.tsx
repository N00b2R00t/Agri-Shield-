import React, { useState } from 'react';
import { Farm, CropType, WhatIfInput, WhatIfOutput } from '../types';
import {
  Zap,
  Sparkles,
  TrendingUp,
  Droplets,
  DollarSign,
  CloudRain,
  Flame,
  Sprout,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  RotateCcw,
} from 'lucide-react';

interface WhatIfSimulatorProps {
  farm: Farm;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({ farm }) => {
  const [input, setInput] = useState<WhatIfInput>({
    cropType: farm.cropType,
    plantingDateOffsetDays: 4, // default delay 4 days as recommended
    irrigationLevelPercent: 80,
    fertilizerKgPerHa: 50,
    expectedWeatherScenario: 'heavy_flooding',
  });

  const [simulation, setSimulation] = useState<WhatIfOutput>({
    expectedYieldTonsPerHa: 4.2,
    yieldChangePercent: +18.5,
    diseaseRiskPercent: 28,
    profitEstimateUSD: 1470,
    profitChangeUSD: +320,
    waterUsageLiters: 380000,
    carbonFootprintKgCo2: 140,
    aiExplanation:
      'Delaying planting by 4 days bypasses the peak surface runoff from Wednesday downpours. Maintaining 80% drip irrigation prevents root waterlogging while conserving fuel.',
    keyRecommendations: [
      'Delay seed bed preparation until Saturday morning.',
      'Clear perimeter drainage ditches prior to Wednesday heavy rainfall.',
      'Apply 50kg/ha CAN top-dressing during 2nd week vegetative stage.',
    ],
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleRunSimulation = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/gemini/whatif', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ farm, input }),
      });
      if (res.ok) {
        const data = await res.json();
        setSimulation(data);
      }
    } catch (err) {
      console.error('What-If simulation error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <Zap className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-lg font-bold text-stone-900 tracking-tight">
              Interactive "What-If" Climate & Yield Risk Simulator
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Test hypothetical management decisions and climate shocks to estimate yield, profit, and risk trade-offs.
          </p>
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={isLoading}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center space-x-2 shadow-md disabled:opacity-50 transition-transform active:scale-95"
        >
          <Sparkles className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Running Model...' : 'Recalculate Scenario'}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Input Parameters Controls (5 cols) */}
        <div className="lg:col-span-5 bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-4 text-xs font-medium">
          <div className="font-bold text-stone-900 uppercase text-[10px] tracking-wider pb-2 border-b border-stone-200 flex items-center justify-between">
            <span>Scenario Variables</span>
            <button
              onClick={() => {
                setInput({
                  cropType: farm.cropType,
                  plantingDateOffsetDays: 0,
                  irrigationLevelPercent: 100,
                  fertilizerKgPerHa: 50,
                  expectedWeatherScenario: 'normal',
                });
              }}
              className="text-[10px] text-stone-500 hover:text-stone-800 flex items-center space-x-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Variable 1: Crop Selection */}
          <div>
            <label className="block text-stone-700 font-bold mb-1">Target Crop Selection</label>
            <select
              value={input.cropType}
              onChange={(e) => setInput({ ...input, cropType: e.target.value as CropType })}
              className="w-full p-2.5 rounded-xl border border-stone-300 bg-white font-semibold text-stone-900"
            >
              <option value="Maize">Maize (Hybrid HB6210)</option>
              <option value="Sorghum">Sorghum (Drought Resistant)</option>
              <option value="Tomatoes">Tomatoes (F1 Variety)</option>
              <option value="Beans">Beans (Rosecoco)</option>
              <option value="Coffee">Coffee (Arabica)</option>
            </select>
          </div>

          {/* Variable 2: Planting Date Offset */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-stone-700 font-bold">Planting Date Shift</label>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded text-[11px]">
                {input.plantingDateOffsetDays === 0
                  ? 'On Schedule'
                  : input.plantingDateOffsetDays > 0
                  ? `+${input.plantingDateOffsetDays} Days Delay`
                  : `${input.plantingDateOffsetDays} Days Early`}
              </span>
            </div>
            <input
              type="range"
              min={-14}
              max={14}
              step={1}
              value={input.plantingDateOffsetDays}
              onChange={(e) => setInput({ ...input, plantingDateOffsetDays: parseInt(e.target.value) })}
              className="w-full accent-emerald-600"
            />
            <div className="flex justify-between text-[10px] text-stone-400 mt-0.5">
              <span>-14d Early</span>
              <span>On Time</span>
              <span>+14d Delay</span>
            </div>
          </div>

          {/* Variable 3: Irrigation Adjustment */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-stone-700 font-bold">Irrigation Application</label>
              <span className="font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded text-[11px]">
                {input.irrigationLevelPercent}% Water Rate
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={200}
              step={10}
              value={input.irrigationLevelPercent}
              onChange={(e) => setInput({ ...input, irrigationLevelPercent: parseInt(e.target.value) })}
              className="w-full accent-blue-600"
            />
          </div>

          {/* Variable 4: Fertilizer Rate */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-stone-700 font-bold">Fertilizer Top-Dressing</label>
              <span className="font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded text-[11px]">
                {input.fertilizerKgPerHa} kg/ha
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={150}
              step={10}
              value={input.fertilizerKgPerHa}
              onChange={(e) => setInput({ ...input, fertilizerKgPerHa: parseInt(e.target.value) })}
              className="w-full accent-amber-600"
            />
          </div>

          {/* Variable 5: Climate Scenario */}
          <div>
            <label className="block text-stone-700 font-bold mb-1">Exogenous Climate Shock</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'normal', label: 'Normal Weather', icon: '☀️' },
                { id: 'heavy_flooding', label: 'Heavy Flash Floods', icon: '🌧️' },
                { id: 'moderate_drought', label: 'Moderate Drought', icon: '🌵' },
                { id: 'heatwave', label: 'Heatwave (+3°C)', icon: '🔥' },
              ].map((sc) => (
                <button
                  key={sc.id}
                  type="button"
                  onClick={() => setInput({ ...input, expectedWeatherScenario: sc.id as any })}
                  className={`p-2 rounded-xl text-left border transition-all ${
                    input.expectedWeatherScenario === sc.id
                      ? 'bg-amber-100 border-amber-400 font-bold text-amber-950'
                      : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
                  }`}
                >
                  <span className="mr-1">{sc.icon}</span>
                  <span>{sc.label}</span>
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Simulation Output Metrics Display (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Key Output Metrics Bento */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            
            {/* Expected Yield */}
            <div className="p-4 rounded-2xl bg-stone-900 text-stone-100 border border-stone-800 shadow-sm">
              <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">
                Expected Yield
              </span>
              <div className="text-2xl font-black text-white mt-1">
                {simulation.expectedYieldTonsPerHa} <span className="text-xs font-normal text-stone-400">t/ha</span>
              </div>
              <div
                className={`text-xs font-bold mt-1 flex items-center space-x-0.5 ${
                  simulation.yieldChangePercent >= 0 ? 'text-emerald-400' : 'text-red-400'
                }`}
              >
                {simulation.yieldChangePercent >= 0 ? (
                  <ArrowUpRight className="w-3.5 h-3.5" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5" />
                )}
                <span>
                  {simulation.yieldChangePercent > 0 ? '+' : ''}
                  {simulation.yieldChangePercent}% vs baseline
                </span>
              </div>
            </div>

            {/* Estimated Net Profit */}
            <div className="p-4 rounded-2xl bg-stone-900 text-stone-100 border border-stone-800 shadow-sm">
              <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">
                Estimated Net Profit
              </span>
              <div className="text-2xl font-black text-emerald-400 mt-1">
                ${simulation.profitEstimateUSD}
              </div>
              <div className="text-[11px] text-stone-400 mt-1 font-medium">
                ${simulation.profitChangeUSD > 0 ? '+' : ''}{simulation.profitChangeUSD} net gain
              </div>
            </div>

            {/* Disease Risk Exposure */}
            <div className="p-4 rounded-2xl bg-stone-900 text-stone-100 border border-stone-800 shadow-sm">
              <span className="text-[10px] text-stone-400 uppercase font-bold tracking-wider">
                Disease Exposure
              </span>
              <div className="text-2xl font-black text-amber-400 mt-1">
                {simulation.diseaseRiskPercent}%
              </div>
              <div className="text-[11px] text-stone-400 mt-1">
                {simulation.diseaseRiskPercent > 50 ? 'High Risk' : 'Manageable'}
              </div>
            </div>

            {/* Water Footprint */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm">
              <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider">
                Water Requirement
              </span>
              <div className="text-xl font-bold text-blue-700 mt-1">
                {(simulation.waterUsageLiters / 1000).toFixed(0)}k Liters
              </div>
            </div>

            {/* Carbon Footprint */}
            <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-sm">
              <span className="text-[10px] text-stone-500 uppercase font-bold tracking-wider">
                Carbon Footprint
              </span>
              <div className="text-xl font-bold text-stone-800 mt-1">
                {simulation.carbonFootprintKgCo2} kg CO₂e
              </div>
            </div>

            {/* Climate Resilience Rating */}
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 shadow-sm">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                Resilience Index
              </span>
              <div className="text-xl font-extrabold text-emerald-700 mt-1">
                A+ Grade
              </div>
            </div>

          </div>

          {/* AI Explanation Box */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
            <div className="font-bold text-stone-900 flex items-center space-x-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>AI Scenario Rationale Analysis:</span>
            </div>
            <p className="text-stone-700 leading-relaxed font-medium">
              {simulation.aiExplanation}
            </p>
          </div>

          {/* Suggested Optimization Checklist */}
          <div className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2 text-xs">
            <span className="font-bold text-stone-800 uppercase text-[10px] tracking-wider block">
              Optimal Action Steps for Selected Scenario:
            </span>
            <div className="space-y-1.5">
              {simulation.keyRecommendations.map((rec, i) => (
                <div key={i} className="p-2 rounded-xl bg-stone-50 border border-stone-150 text-stone-800 font-medium flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                  <span>{rec}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
