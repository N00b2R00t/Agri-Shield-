import React from 'react';
import { Farm, CommunityReport, UserProfile } from '../../types';
import { InteractiveMap } from '../../components/InteractiveMap';

interface ClimateGISMapProps {
  farms: Farm[];
  reports: CommunityReport[];
  user: UserProfile;
}

export const ClimateGISMap: React.FC<ClimateGISMapProps> = ({ farms, reports, user }) => {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-1">
        <h2 className="text-xl font-bold text-white">GIS Spatial Vulnerability Map Layer</h2>
        <p className="text-xs text-stone-400">High-resolution spatial hazards mapping across county catchments.</p>
      </div>

      <InteractiveMap
        farms={farms}
        reports={reports}
        activeFarm={farms[0] || null}
        onSelectFarm={() => {}}
      />
    </div>
  );
};
