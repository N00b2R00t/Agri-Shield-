import React from 'react';
import { Farm } from '../../types';
import { WhatIfSimulator } from '../../components/WhatIfSimulator';

interface SimulationsProps {
  activeFarm: Farm | null;
}

export const ExtensionSimulations: React.FC<SimulationsProps> = ({ activeFarm }) => {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-1">
        <h2 className="text-xl font-bold text-white">Sub-County Yield & Climate Scenario Simulator</h2>
        <p className="text-xs text-stone-400">Simulate drought severity, fertilizer inputs, and planting date shifts for smallholders.</p>
      </div>

      <WhatIfSimulator activeFarm={activeFarm} />
    </div>
  );
};
