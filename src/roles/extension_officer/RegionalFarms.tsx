import React from 'react';
import { Farm, UserProfile } from '../../types';
import { Users, MapPin, Sprout, ShieldAlert } from 'lucide-react';

interface RegionalFarmsProps {
  farms: Farm[];
  usersList: UserProfile[];
}

export const RegionalFarms: React.FC<RegionalFarmsProps> = ({ farms, usersList }) => {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-1">
        <div className="inline-flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
          <Users className="w-4 h-4" />
          <span>County Smallholder Directory</span>
        </div>
        <h2 className="text-xl font-bold text-white">Registered Farmers & Plots</h2>
        <p className="text-xs text-stone-400">Inspect registered crop stages, livestock herds, and location coordinates across the county.</p>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-stone-800 bg-stone-900">
        <table className="w-full text-left text-xs text-stone-300">
          <thead className="bg-stone-950 text-stone-400 uppercase text-[10px] tracking-wider border-b border-stone-800">
            <tr>
              <th className="p-3.5">Plot Name & Owner</th>
              <th className="p-3.5">Location</th>
              <th className="p-3.5">Crop / Enterprise</th>
              <th className="p-3.5">Acreage</th>
              <th className="p-3.5">Growth Stage</th>
              <th className="p-3.5 text-right">Health Score</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800">
            {farms.map((farm) => {
              const owner = usersList.find((u) => u.id === farm.userId);
              return (
                <tr key={farm.id} className="hover:bg-stone-800/50 transition-colors">
                  <td className="p-3.5 font-bold text-white">
                    <div>{farm.name}</div>
                    <div className="text-[10px] text-stone-400 font-normal">{owner ? owner.name : 'Registered Farmer'}</div>
                  </td>
                  <td className="p-3.5">
                    <span className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                      <span>{farm.locationName}, {farm.county}</span>
                    </span>
                  </td>
                  <td className="p-3.5">
                    <span className="font-bold text-emerald-400">{farm.cropType}</span>
                    {farm.livestockType && <div className="text-[10px] text-amber-400">{farm.livestockType}</div>}
                  </td>
                  <td className="p-3.5">{farm.areaHectares} Ha</td>
                  <td className="p-3.5">{farm.growthStage}</td>
                  <td className="p-3.5 text-right">
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-extrabold text-[10px]">
                      {farm.cropHealthScore}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
