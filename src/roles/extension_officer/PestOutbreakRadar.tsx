import React, { useState } from 'react';
import { DiseaseRiskPrediction, CommunityReport } from '../../types';
import { Bug, AlertTriangle, Plus, Trash2, Send, CheckCircle2, ShieldCheck, X, Flag } from 'lucide-react';

interface PestOutbreakRadarProps {
  predictions: DiseaseRiskPrediction[];
  reports: CommunityReport[];
  onAddPrediction?: (pred: DiseaseRiskPrediction) => void;
  onSendNotification?: (notif: { title: string; message: string; severity: 'info' | 'warning' | 'critical'; type: any }) => void;
  onDeletePrediction?: (id: string) => void;
  onOpenReportModal?: (target: {
    targetUserId: string;
    targetUserName: string;
    targetItemType: 'community_report' | 'outbreak' | 'user';
    targetItemId?: string;
    targetItemTitle?: string;
  }) => void;
}

export const PestOutbreakRadar: React.FC<PestOutbreakRadarProps> = ({
  predictions = [],
  reports = [],
  onAddPrediction,
  onSendNotification,
  onDeletePrediction,
  onOpenReportModal,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [diseaseName, setDiseaseName] = useState('');
  const [cropTarget, setCropTarget] = useState('Maize');
  const [category, setCategory] = useState<'crop' | 'livestock'>('crop');
  const [riskLevel, setRiskLevel] = useState<'Medium' | 'High' | 'Critical'>('High');
  const [spreadVector, setSpreadVector] = useState('Wind Vector & Soil Spore Dispersion');
  const [mitigationStrategy, setMitigationStrategy] = useState('');
  const [predictedArea, setPredictedArea] = useState('Uasin Gishu / Moiben Wards');
  const [outbreakProbability, setOutbreakProbability] = useState(85);
  const [publishedNotice, setPublishedNotice] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diseaseName || !mitigationStrategy) return;

    const riskScore = riskLevel === 'Critical' ? 95 : riskLevel === 'High' ? 80 : 60;
    const newPred: DiseaseRiskPrediction = {
      id: `pred-${Date.now()}`,
      diseaseName,
      pestName: diseaseName,
      cropTarget,
      category,
      riskLevel,
      riskScore,
      spreadVector,
      triggerFactors: ['Relative Humidity >75%', 'Temperature Rise', 'Localized Vector Swarm'],
      mitigationStrategy,
      predictedArea,
      outbreakProbabilityNext7Days: outbreakProbability,
    };

    if (onAddPrediction) {
      onAddPrediction(newPred);
    } else if (onSendNotification) {
      onSendNotification({
        title: diseaseName,
        message: mitigationStrategy,
        severity: riskLevel === 'Critical' ? 'critical' : riskLevel === 'High' ? 'warning' : 'info',
        type: category === 'livestock' ? 'disease' : 'pest',
      });
    }

    setPublishedNotice(true);
    setDiseaseName('');
    setMitigationStrategy('');
    setShowModal(false);
    setTimeout(() => setPublishedNotice(false), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-stone-900 border border-stone-800 p-5 rounded-3xl">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
            <Bug className="w-4 h-4" />
            <span>Vector & Outbreak Surveillance</span>
          </div>
          <h2 className="text-xl font-bold text-white">Sub-County Disease & Pest Outbreak Radar</h2>
          <p className="text-xs text-stone-400">
            Track vector migration, temperature triggers, and publish verified localized outbreak alerts.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="px-4 py-2.5 rounded-xl bg-red-600 hover:bg-red-500 text-white font-extrabold text-xs flex items-center space-x-1.5 shadow-md transition-transform active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Publish Outbreak Alert</span>
        </button>
      </div>

      {publishedNotice && (
        <div className="p-4 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Outbreak alert published and broadcast to all neighboring farmers and regional dashboards!</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {predictions.map((p) => (
          <div key={p.id} className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-3 shadow-md relative group">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <h4 className="text-sm font-bold text-white">{p.diseaseName}</h4>
                <p className="text-[11px] text-stone-400">{p.predictedArea || 'Regional Sub-Counties'}</p>
              </div>

              <div className="flex items-center space-x-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full font-extrabold text-[10px] uppercase border ${
                    p.riskLevel === 'Critical' || (p.riskLevel as any) === 'critical'
                      ? 'bg-red-500/20 text-red-300 border-red-500/30'
                      : p.riskLevel === 'High' || (p.riskLevel as any) === 'high'
                      ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                      : 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30'
                  }`}
                >
                  {p.riskLevel} ({p.riskScore}%)
                </span>

                {onOpenReportModal && (
                  <button
                    onClick={() =>
                      onOpenReportModal({
                        targetUserId: 'publisher-unknown',
                        targetUserName: 'Outbreak Publisher',
                        targetItemType: 'outbreak',
                        targetItemId: p.id,
                        targetItemTitle: `${p.diseaseName} (${p.cropTarget})`,
                      })
                    }
                    className="p-1.5 rounded-lg bg-red-950/80 text-red-300 hover:bg-red-900 border border-red-800 text-[10px] font-bold flex items-center space-x-1"
                    title="Report Fake Outbreak to System Admin"
                  >
                    <Flag className="w-3.5 h-3.5 text-red-400" />
                    <span>Report Fake</span>
                  </button>
                )}

                {onDeletePrediction && (
                  <button
                    onClick={() => onDeletePrediction(p.id)}
                    className="p-1 rounded-lg bg-stone-950 text-stone-500 hover:text-red-400 border border-stone-800"
                    title="Remove Alert"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            <div className="text-xs space-y-1.5 text-stone-300">
              <p>
                <strong>Target Enterprise:</strong> <span className="text-stone-100 font-bold">{p.cropTarget}</span>
              </p>
              <p>
                <strong>Outbreak Probability (Next 7 Days):</strong>{' '}
                <span className="text-red-400 font-bold">{p.outbreakProbabilityNext7Days}%</span>
              </p>
              <p>
                <strong>Spread Vector:</strong> <span className="text-stone-300">{p.spreadVector}</span>
              </p>
              {p.triggerFactors && p.triggerFactors.length > 0 && (
                <p>
                  <strong>Trigger Factors:</strong> {p.triggerFactors.join(', ')}
                </p>
              )}
              <div className="p-3 bg-stone-950 rounded-2xl border border-stone-800 text-[11px] text-stone-300 space-y-1 mt-2">
                <div className="text-amber-400 font-bold flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Extension Field Protocol:</span>
                </div>
                <p className="leading-relaxed">{p.mitigationStrategy}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Publish Outbreak Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div className="flex items-center space-x-2 text-white font-bold text-sm">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>Publish Sub-County Outbreak Alert</span>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg bg-stone-800 text-stone-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 font-bold mb-1">Outbreak / Disease Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Fall Armyworm Infestation Alert"
                  value={diseaseName}
                  onChange={(e) => setDiseaseName(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Target Crop / Livestock</label>
                  <input
                    type="text"
                    required
                    value={cropTarget}
                    onChange={(e) => setCropTarget(e.target.value)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 font-bold"
                  >
                    <option value="crop">Crop / Vegetation</option>
                    <option value="livestock">Livestock / Animal</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-300 font-bold mb-1">Severity / Risk Level</label>
                  <select
                    value={riskLevel}
                    onChange={(e) => setRiskLevel(e.target.value as any)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 font-bold"
                  >
                    <option value="Medium">Medium Warning</option>
                    <option value="High">High Risk</option>
                    <option value="Critical">Critical Outbreak</option>
                  </select>
                </div>
                <div>
                  <label className="block text-stone-300 font-bold mb-1">7-Day Outbreak Prob. (%)</label>
                  <input
                    type="number"
                    min={10}
                    max={100}
                    value={outbreakProbability}
                    onChange={(e) => setOutbreakProbability(parseInt(e.target.value) || 80)}
                    className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">Affected Area / Sub-Counties</label>
                <input
                  type="text"
                  value={predictedArea}
                  onChange={(e) => setPredictedArea(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100 font-bold"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-bold mb-1">Field Control Protocol / Mitigation Action</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Steps for smallholders e.g. Early spray application with Bacillus thuringiensis..."
                  value={mitigationStrategy}
                  onChange={(e) => setMitigationStrategy(e.target.value)}
                  className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-stone-100"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-2xl bg-red-600 hover:bg-red-500 text-white font-black flex items-center justify-center space-x-2 shadow-md transition-transform active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>Publish & Broadcast Outbreak Alert</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
