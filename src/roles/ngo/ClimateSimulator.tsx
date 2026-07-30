import React from 'react';
import { Farm } from '../../types';
import { WhatIfSimulator } from '../../components/WhatIfSimulator';

interface ClimateSimulatorProps {
  activeFarm: Farm | null;
}

export const ClimateSimulator: React.FC<ClimateSimulatorProps> = ({ activeFarm }) => {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-1">
        <h2 className="text-xl font-bold text-white">NGO Multi-Scenario Climate Impact Engine</h2>
        <p className="text-xs text-stone-400">Model yield loss percentages, water consumption, and carbon footprint reduction.</p>
      </div>

      <WhatIfSimulator activeFarm={activeFarm} />
    </div>
  );
};
