import React, { useState } from 'react';
import { CommunityReport, ReportSeverity, ReportType } from '../types';
import {
  Users,
  AlertOctagon,
  ThumbsUp,
  ShieldCheck,
  Plus,
  MapPin,
  Clock,
  Filter,
  Camera,
  CheckCircle,
} from 'lucide-react';

interface CommunityIntelProps {
  reports: CommunityReport[];
  onAddReport: (newReport: Partial<CommunityReport>) => void;
  onUpvoteReport: (id: string) => void;
  onVerifyReport: (id: string) => void;
  isExtensionOfficer: boolean;
  onRequestOpenMapWithReport: (report: CommunityReport) => void;
}

export const CommunityIntel: React.FC<CommunityIntelProps> = ({
  reports,
  onAddReport,
  onUpvoteReport,
  onVerifyReport,
  isExtensionOfficer,
  onRequestOpenMapWithReport,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterSeverity, setFilterSeverity] = useState<string>('all');

  // New report form state
  const [reportType, setReportType] = useState<ReportType>('pest');
  const [cropAffected, setCropAffected] = useState<string>('Maize');
  const [severity, setSeverity] = useState<ReportSeverity>('high');
  const [description, setDescription] = useState<string>('');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    onAddReport({
      reportType,
      cropAffected,
      severity,
      description,
      photoUrl: 'https://images.unsplash.com/photo-1592417817098-8f3d6ef23a28?auto=format&fit=crop&w=600&q=80',
    });

    setDescription('');
    setShowModal(false);
  };

  const getSeverityBadge = (sev: ReportSeverity) => {
    switch (sev) {
      case 'critical':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase bg-red-600 text-white animate-pulse">Critical</span>;
      case 'high':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-500 text-white">High Severity</span>;
      case 'medium':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-yellow-100 text-yellow-800 border border-yellow-300">Medium</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold uppercase bg-blue-100 text-blue-800 border border-blue-300">Low</span>;
    }
  };

  const filtered = reports.filter((r) => {
    if (filterType !== 'all' && r.reportType !== filterType) return false;
    if (filterSeverity !== 'all' && r.severity !== filterSeverity) return false;
    return true;
  });

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 space-y-5">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
        <div>
          <div className="flex items-center space-x-2">
            <div className="p-1.5 rounded-lg bg-amber-100 text-amber-800">
              <Users className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-lg font-bold text-stone-900 tracking-tight">
              Community Crowd-Sourced Intelligence
            </h2>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time peer reports of pest swarms, plant diseases, water shortages, and floods nearby.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center space-x-2 shadow-md transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Report Outbreak / Issue</span>
        </button>
      </div>

      {/* Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-2">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          <span className="font-semibold text-stone-600">Filter Type:</span>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-stone-300 bg-stone-50 font-medium text-stone-800 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Outbreak Types</option>
            <option value="pest">Crop Pests (Armyworm, Locusts)</option>
            <option value="disease">Plant Disease (Blight, Rust)</option>
            <option value="livestock_disease">Livestock Vectors & Diseases (Ticks, Mastitis, ECF)</option>
            <option value="flood">Flood & Erosion</option>
            <option value="drought">Drought & Water Shortage</option>
          </select>
        </div>

        <div className="flex items-center space-x-2">
          <span className="font-semibold text-stone-600">Severity:</span>
          <select
            value={filterSeverity}
            onChange={(e) => setFilterSeverity(e.target.value)}
            className="px-2.5 py-1 rounded-lg border border-stone-300 bg-stone-50 font-medium text-stone-800 focus:ring-1 focus:ring-emerald-500"
          >
            <option value="all">All Severities</option>
            <option value="critical">Critical Only</option>
            <option value="high">High Severity</option>
            <option value="medium">Medium & Low</option>
          </select>
        </div>
      </div>

      {/* Feed List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((rep) => (
          <div
            key={rep.id}
            className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 ${
              rep.severity === 'critical'
                ? 'bg-red-50/40 border-red-200 shadow-sm'
                : 'bg-white border-stone-200 hover:border-stone-300 shadow-sm'
            }`}
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getSeverityBadge(rep.severity)}
                  <span className="text-xs font-bold text-stone-800 capitalize">
                    {rep.reportType} Outbreak
                  </span>
                </div>
                {rep.verified ? (
                  <span className="text-[10px] text-emerald-700 bg-emerald-100 font-bold px-2 py-0.5 rounded-md flex items-center space-x-1">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Officer Verified</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-stone-500 bg-stone-100 font-medium px-2 py-0.5 rounded-md">
                    Unverified
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs font-bold text-stone-900 pt-1">
                <span>
                  {rep.cropAffected} • <span className="text-stone-600 font-medium">{rep.farmName}</span>
                </span>
                <span className="text-stone-500 text-[11px] font-normal flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  <span>{rep.distanceKm ? `${rep.distanceKm} km away` : 'Nearby'}</span>
                </span>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-150">
                "{rep.description}"
              </p>

              {rep.photoUrl && (
                <div className="relative rounded-xl overflow-hidden h-32 w-full border border-stone-200">
                  <img src={rep.photoUrl} alt="Report Attachment" className="w-full h-full object-cover" />
                  <div className="absolute bottom-1 right-1 bg-stone-900/80 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                    Photo Evidence
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-xs">
              <div className="flex items-center space-x-3 text-stone-500 text-[11px]">
                <span>By {rep.userName}</span>
                <span>•</span>
                <span>{new Date(rep.createdAt).toLocaleDateString()}</span>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onUpvoteReport(rep.id)}
                  className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center space-x-1 transition-colors"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{rep.upvotes} Confirmations</span>
                </button>

                {isExtensionOfficer && !rep.verified && (
                  <button
                    onClick={() => onVerifyReport(rep.id)}
                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center space-x-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Verify</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        ))}
      </div>

      {/* New Report Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900 flex items-center space-x-2">
                <AlertOctagon className="w-5 h-5 text-red-500" />
                <span>Submit Local Outbreak / Climate Report</span>
              </h3>
              <button onClick={() => setShowModal(false)} className="text-stone-400 hover:text-stone-600 font-bold">
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-stone-700 font-bold mb-1">Issue Category</label>
                <select
                  value={reportType}
                  onChange={(e) => setReportType(e.target.value as ReportType)}
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 font-semibold"
                >
                  <option value="pest">Crop Pest Outbreak (Fall Armyworm, Locusts)</option>
                  <option value="disease">Plant Disease (Late Blight, Maize Streak Virus)</option>
                  <option value="livestock_disease">Livestock Vector / Disease (Ticks, East Coast Fever, Mastitis, Foot & Mouth)</option>
                  <option value="flood">Flash Flood / Soil Erosion</option>
                  <option value="drought">Severe Drought / Water Crisis</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Affected Crop</label>
                  <input
                    type="text"
                    value={cropAffected}
                    onChange={(e) => setCropAffected(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900"
                    placeholder="e.g. Maize, Tomatoes"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-bold mb-1">Severity Level</label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as ReportSeverity)}
                    className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 font-bold"
                  >
                    <option value="critical">CRITICAL (Immediate spread risk)</option>
                    <option value="high">HIGH (Severe damage observed)</option>
                    <option value="medium">MEDIUM (Moderate spread)</option>
                    <option value="low">LOW (Early observation)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-bold mb-1">Description & Field Evidence</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe observed symptoms, crop area affected, and spread direction..."
                  className="w-full p-2.5 rounded-xl border border-stone-300 bg-stone-50 text-stone-900"
                  required
                />
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between text-stone-600">
                <div className="flex items-center space-x-2">
                  <Camera className="w-4 h-4 text-emerald-600" />
                  <span>GPS Location auto-tagged from farm coordinates</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  GPS Active
                </span>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold shadow-md"
                >
                  Publish Report to Community Feed
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
