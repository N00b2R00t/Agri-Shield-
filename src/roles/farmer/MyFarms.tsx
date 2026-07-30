import React from 'react';
import { Farm, UserProfile } from '../../types';
import { Sprout, Plus, MapPin, Layers, Droplets, Calendar, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface MyFarmsProps {
  user: UserProfile;
  farms: Farm[];
  activeFarm?: Farm | null;
  onSelectFarm?: (farm: Farm) => void;
  onOpenNewFarm: () => void;
  onOpenLivestockModal?: () => void;
  onOpenAssistantWithQuestion?: (question?: string, farm?: Farm) => void;
}

export const MyFarms: React.FC<MyFarmsProps> = ({
  user,
  farms,
  activeFarm,
  onSelectFarm,
  onOpenNewFarm,
  onOpenLivestockModal,
  onOpenAssistantWithQuestion,
}) => {
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

        <div className="flex flex-wrap items-center gap-2">
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
          {farms.map((farm) => {
            const isActive = activeFarm?.id === farm.id;
            return (
              <div
                key={farm.id}
                className={`bg-stone-900 border rounded-3xl p-5 space-y-4 shadow-md transition-all ${
                  isActive ? 'border-emerald-500/80 bg-stone-900/90 ring-1 ring-emerald-500/50' : 'border-stone-800 hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-base font-bold text-white">{farm.name}</h3>
                      {isActive && (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 text-[10px] font-black border border-emerald-500/40">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Active Plot</span>
                        </span>
                      )}
                    </div>
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

                {/* AI Farm Analysis & Advice Trigger Bar */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-2 border-t border-stone-800/80">
                  {!isActive && onSelectFarm && (
                    <button
                      onClick={() => onSelectFarm(farm)}
                      className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-750 text-stone-300 font-bold text-xs border border-stone-700 transition-colors"
                    >
                      Select as Active
                    </button>
                  )}

                  <button
                    onClick={() => {
                      if (onSelectFarm) onSelectFarm(farm);
                      if (onOpenAssistantWithQuestion) {
                        onOpenAssistantWithQuestion(
                          `Please perform a comprehensive AI Farm Analysis and provide advice for my farm "${farm.name}" in ${farm.county} growing ${farm.cropType} (${farm.growthStage}).`,
                          farm
                        );
                      }
                    }}
                    className="flex-1 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-stone-950 font-black text-xs flex items-center justify-center space-x-1.5 shadow-md transition-transform active:scale-95"
                  >
                    <Sparkles className="w-4 h-4 text-stone-950" />
                    <span>AI Farm Analysis & Advice</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

