import React from 'react';
import { Globe, BookOpen, ExternalLink, Download } from 'lucide-react';

interface NGOSupportProps {
  onOpenDocModal?: () => void;
}

export const NGOSupport: React.FC<NGOSupportProps> = ({ onOpenDocModal }) => {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-1">
        <div className="inline-flex items-center space-x-2 text-blue-400 font-bold text-xs uppercase tracking-wider">
          <Globe className="w-4 h-4" />
          <span>Resilience Knowledge Hub</span>
        </div>
        <h2 className="text-xl font-bold text-white">NGO Partner Support & Data Exporter</h2>
        <p className="text-xs text-stone-400">Download climate vulnerability reports and access technical documentation.</p>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-4 text-xs">
        <h4 className="font-bold text-sm text-white">Export Regional Impact Metrics</h4>
        <p className="text-stone-300">Export spatial GIS data layers and smallholder vulnerability metrics for donor reporting.</p>
        <div className="flex items-center space-x-3">
          {onOpenDocModal && (
            <button
              onClick={onOpenDocModal}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold inline-flex items-center space-x-1.5"
            >
              <span>View System Manual</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
