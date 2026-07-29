import React, { useState } from 'react';
import { Recommendation, RecommendationType, PriorityLevel, Farm } from '../types';
import {
  Sparkles,
  CheckCircle,
  AlertTriangle,
  Clock,
  ChevronDown,
  ChevronUp,
  Droplets,
  Sprout,
  Scissors,
  Bug,
  TestTube,
  Repeat,
  Zap,
  ArrowRight,
  ShieldCheck,
  Check,
  X,
  Sprout as FarmIcon,
} from 'lucide-react';

interface SmartRecommendationsProps {
  farm?: Farm | null;
  recommendations: Recommendation[];
  onStatusChange: (id: string, newStatus: 'accepted' | 'completed' | 'dismissed') => void;
  onRefreshAI: () => void;
  isGeneratingAI: boolean;
  onOpenNewFarmModal?: () => void;
}

export const SmartRecommendations: React.FC<SmartRecommendationsProps> = ({
  farm,
  recommendations,
  onStatusChange,
  onRefreshAI,
  isGeneratingAI,
  onOpenNewFarmModal,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(recommendations[0]?.id || null);

  const getActionTypeIcon = (type: RecommendationType) => {
    switch (type) {
      case 'irrigation': return <Droplets className="w-4 h-4 text-blue-500" />;
      case 'planting': return <Sprout className="w-4 h-4 text-emerald-500" />;
      case 'harvest': return <Scissors className="w-4 h-4 text-purple-500" />;
      case 'pest_control': return <Bug className="w-4 h-4 text-red-500" />;
      case 'fertilizer': return <TestTube className="w-4 h-4 text-amber-500" />;
      case 'crop_switch': return <Repeat className="w-4 h-4 text-teal-500" />;
      case 'livestock_shelter': return <Zap className="w-4 h-4 text-amber-600" />;
      case 'fodder_preservation': return <Sprout className="w-4 h-4 text-emerald-600" />;
      case 'vaccination': return <TestTube className="w-4 h-4 text-red-600" />;
      case 'pasture_rotation': return <Repeat className="w-4 h-4 text-blue-600" />;
      case 'water_management': return <Droplets className="w-4 h-4 text-teal-600" />;
      default: return <Zap className="w-4 h-4 text-emerald-500" />;
    }
  };

  const getPriorityBadge = (priority: PriorityLevel) => {
    switch (priority) {
      case 'high':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-red-100 text-red-800 border border-red-300">High Priority</span>;
      case 'medium':
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-800 border border-amber-300">Medium</span>;
      default:
        return <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800 border border-blue-300">Low</span>;
    }
  };

  const filtered = recommendations.filter((r) => {
    if (filterType === 'all') return true;
    if (filterType === 'pending') return r.status === 'pending';
    if (filterType === 'completed') return r.status === 'completed' || r.status === 'accepted';
    return r.actionType === filterType;
  });

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-800">
              <Sparkles className="w-5 h-5 text-emerald-600 animate-pulse" />
            </div>
            <h2 className="text-lg font-bold text-stone-900 tracking-tight">
              Smart Decision Recommendation Engine
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            AI-synthesized actionable recommendations combining climate models, soil moisture, and pest vectors.
          </p>
        </div>

        <button
          onClick={onRefreshAI}
          disabled={isGeneratingAI}
          className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-500 hover:to-teal-600 text-white font-bold text-xs flex items-center space-x-2 shadow-md disabled:opacity-50 transition-transform active:scale-95"
        >
          <Sparkles className={`w-4 h-4 ${isGeneratingAI ? 'animate-spin' : ''}`} />
          <span>{isGeneratingAI ? 'Synthesizing Data...' : 'Refresh AI Analysis'}</span>
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-xs font-semibold">
        {['all', 'pending', 'completed', 'planting', 'pest_control', 'livestock_shelter', 'fodder_preservation', 'vaccination', 'irrigation', 'harvest'].map((t) => (
          <button
            key={t}
            onClick={() => setFilterType(t)}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap capitalize transition-colors ${
              filterType === t
                ? 'bg-stone-900 text-white shadow-sm'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {t.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Recommendations Cards List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="p-8 text-center bg-stone-50 rounded-2xl border border-dashed border-stone-300">
            <ShieldCheck className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
            <p className="text-sm font-bold text-stone-800">No active recommendations in this category</p>
            <p className="text-xs text-stone-500">Your farm operational plan is currently up to date.</p>
          </div>
        ) : (
          filtered.map((rec) => {
            const isExpanded = expandedId === rec.id;

            return (
              <div
                key={rec.id}
                className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                  rec.status === 'completed'
                    ? 'bg-stone-50/80 border-stone-200 opacity-75'
                    : rec.priority === 'high'
                    ? 'bg-gradient-to-r from-white to-red-50/30 border-red-200 shadow-sm hover:border-red-300'
                    : 'bg-white border-stone-200 shadow-sm hover:border-stone-300'
                }`}
              >
                
                {/* Card Top Row */}
                <div
                  onClick={() => setExpandedId(isExpanded ? null : rec.id)}
                  className="p-4 sm:p-5 cursor-pointer flex items-start justify-between gap-4"
                >
                  <div className="flex items-start space-x-3">
                    <div className="p-2.5 rounded-xl bg-stone-100 border border-stone-200 shrink-0">
                      {getActionTypeIcon(rec.actionType)}
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {getPriorityBadge(rec.priority)}
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                          {rec.confidenceScore}% AI Confidence
                        </span>
                        {rec.status === 'completed' && (
                          <span className="text-xs font-bold text-emerald-800 bg-emerald-100 border border-emerald-300 px-2 py-0.5 rounded-full flex items-center space-x-1">
                            <Check className="w-3 h-3" />
                            <span>Action Completed</span>
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-stone-900 tracking-tight">
                        {rec.title}
                      </h3>
                      <p className="text-xs text-stone-600 leading-relaxed font-medium">
                        {rec.summary}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 shrink-0">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-stone-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-stone-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Details Body */}
                {isExpanded && (
                  <div className="px-5 pb-5 pt-2 border-t border-stone-100 space-y-4 text-xs bg-stone-50/50">
                    
                    {/* Rationale & Agronomic Reason */}
                    <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-1">
                      <div className="font-bold text-stone-900 flex items-center space-x-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                        <span>Agronomic & Climate Rationale:</span>
                      </div>
                      <p className="text-stone-700 leading-relaxed">{rec.reason}</p>
                    </div>

                    {/* Supporting Weather Data Points */}
                    <div className="space-y-1.5">
                      <span className="font-bold text-stone-800 uppercase text-[10px] tracking-wider">
                        Supporting Weather & Soil Datasets:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {rec.supportingData.map((sd, i) => (
                          <div key={i} className="p-2 rounded-lg bg-white border border-stone-200 text-stone-700 font-medium flex items-center space-x-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span>{sd}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Estimated Impact */}
                    <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                        <div>
                          <span className="font-bold block">Estimated Climate Resilience Impact</span>
                          <span className="text-emerald-800 font-medium">{rec.potentialImpact}</span>
                        </div>
                      </div>
                    </div>

                    {/* Step-by-Step Suggested Actions Checklist */}
                    <div className="space-y-1.5">
                      <span className="font-bold text-stone-800 uppercase text-[10px] tracking-wider">
                        Suggested Action Step Checklist:
                      </span>
                      <div className="space-y-1.5">
                        {rec.suggestedActionSteps.map((step, idx) => (
                          <div key={idx} className="p-2.5 rounded-xl bg-white border border-stone-200 flex items-start space-x-2 text-stone-800 font-medium">
                            <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                              {idx + 1}
                            </span>
                            <span className="leading-tight mt-0.5">{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Bar */}
                    <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-200">
                      {rec.status !== 'completed' ? (
                        <>
                          <button
                            onClick={() => onStatusChange(rec.id, 'dismissed')}
                            className="px-3 py-1.5 rounded-xl text-stone-500 hover:text-stone-700 hover:bg-stone-200 font-semibold transition-colors flex items-center space-x-1"
                          >
                            <X className="w-3.5 h-3.5" />
                            <span>Dismiss</span>
                          </button>
                          <button
                            onClick={() => onStatusChange(rec.id, 'completed')}
                            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-transform active:scale-95 flex items-center space-x-1.5 shadow-sm"
                          >
                            <Check className="w-4 h-4" />
                            <span>Mark as Completed</span>
                          </button>
                        </>
                      ) : (
                        <span className="text-xs text-stone-500 font-semibold italic">
                          Action completed for this farm cycle
                        </span>
                      )}
                    </div>

                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
