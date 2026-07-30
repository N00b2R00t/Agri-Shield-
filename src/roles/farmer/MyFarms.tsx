import React from 'react';
import { Farm, UserProfile } from '../../types';
import { Sprout, Plus, MapPin, Layers, Droplets, Calendar, ShieldCheck } from 'lucide-react';

interface MyFarmsProps {
  user: UserProfile;
  farms: Farm[];
  onOpenNewFarm: () => void;
  onOpenLivestockModal?: () => void;
}

export const MyFarms: React.FC<MyFarmsProps> = ({ user, farms, onOpenNewFarm, onOpenLivestockModal }) => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900 border border-stone-800 p-5 rounded-3xl">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
            <Sprout className="w-4 h-4" />
            <span>Farmer Plot & Herd Directory</span>
          </div>
          <h2 className="text-xl font-bold text-white">Registered Plots for {user.name}</h2>
          <p className="text-xs text-stone-400">Manage crop types, soil conditions, irrigation, and livestock herds in {user.county}.</p>
        </div>

        <div className="flex items-center gap-2">
          {onOpenLivestockModal && (
            <button
              onClick={onOpenLivestockModal}
              className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md"
            >
              <span>Manage Livestock Herd</span>
            </button>
          )}
          <button
            onClick={onOpenNewFarm}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Farm</span>
          </button>
        </div>
      </div>

      {farms.length === 0 ? (
        <div className="text-center py-12 bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-3">
          <Sprout className="w-12 h-12 text-stone-600 mx-auto" />
          <h3 className="text-base font-bold text-stone-200">No Farm Plots Registered Yet</h3>
          <p className="text-xs text-stone-400 max-w-md mx-auto">Click below to record your farm size, crop type, and location coordinates.</p>
          <button
            onClick={onOpenNewFarm}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Register Your First Plot</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {farms.map((farm) => (
            <div key={farm.id} className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-4 shadow-md hover:border-emerald-500/40 transition-colors">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div>
                  <h3 className="text-base font-bold text-white">{farm.name}</h3>
                  <div className="flex items-center space-x-1 text-xs text-stone-400 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    <span>{farm.locationName}, {farm.county}</span>
                  </div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[11px] border border-emerald-500/30 uppercase">
                  {farm.category}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800">
                  <span className="text-stone-400 block text-[10px]">Primary Crop</span>
                  <span className="font-bold text-stone-100">{farm.cropType}</span>
                </div>
                <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800">
                  <span className="text-stone-400 block text-[10px]">Acreage / Area</span>
                  <span className="font-bold text-stone-100">{farm.areaHectares} Hectares</span>
                </div>
                <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800">
                  <span className="text-stone-400 block text-[10px]">Growth Stage</span>
                  <span className="font-bold text-stone-100">{farm.growthStage}</span>
                </div>
                <div className="p-2.5 bg-stone-950 rounded-xl border border-stone-800">
                  <span className="text-stone-400 block text-[10px]">Irrigation Method</span>
                  <span className="font-bold text-stone-100">{farm.irrigationMethod}</span>
                </div>
              </div>

              {farm.livestockType && (
                <div className="p-3 bg-amber-950/40 border border-amber-800/40 rounded-2xl flex items-center justify-between text-xs">
                  <div>
                    <span className="text-amber-400 font-bold block">{farm.livestockType}</span>
                    <span className="text-stone-400 text-[11px]">Head Count: {farm.headCount || 0} animals</span>
                  </div>
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
