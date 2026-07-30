import React from 'react';
import { DiseaseRiskPrediction, AlertNotification } from '../../types';
import { AlertTriangle, ShieldAlert, Bug, CloudRain, Bell, CheckCircle2 } from 'lucide-react';

interface RiskAlertsProps {
  predictions: DiseaseRiskPrediction[];
  notifications: AlertNotification[];
  onMarkNotificationRead?: (id: string) => void;
}

export const RiskAlerts: React.FC<RiskAlertsProps> = ({
  predictions,
  notifications,
  onMarkNotificationRead,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-1">
        <div className="inline-flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
          <ShieldAlert className="w-4 h-4" />
          <span>Early Warning & Risk Telemetry</span>
        </div>
        <h2 className="text-xl font-bold text-white">Localized Disease, Pest & Climate Risk Alerts</h2>
        <p className="text-xs text-stone-400">
          Real-time AI predictions monitoring Fall Armyworm, East Coast Fever, flood risks, and thermal stress.
        </p>
      </div>

      {/* Notifications Section */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-stone-200 flex items-center space-x-2">
          <Bell className="w-4 h-4 text-emerald-400" />
          <span>System Alerts & Direct Broadcast Messages</span>
        </h3>

        <div className="space-y-3">
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                notif.severity === 'critical'
                  ? 'bg-red-950/40 border-red-800/60 text-red-200'
                  : notif.severity === 'warning'
                  ? 'bg-amber-950/40 border-amber-800/60 text-amber-200'
                  : 'bg-stone-950 border-stone-800 text-stone-200'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-xs uppercase tracking-wider">{notif.title}</span>
                  <span className="text-[10px] opacity-75 font-mono">{notif.timestamp}</span>
                </div>
                <p className="text-xs leading-relaxed">{notif.message}</p>
              </div>

              {!notif.read && onMarkNotificationRead && (
                <button
                  onClick={() => onMarkNotificationRead(notif.id)}
                  className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold shrink-0 self-start sm:self-auto"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Risk Predictions Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-stone-200 flex items-center space-x-2">
          <Bug className="w-4 h-4 text-cyan-400" />
          <span>Predicted Vector Outbreaks Next 7 Days</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {predictions.map((pred) => (
            <div key={pred.id} className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-stone-800 pb-3">
                <div>
                  <h4 className="text-base font-bold text-white">{pred.diseaseName}</h4>
                  <span className="text-xs text-stone-400">Target: {pred.cropTarget}</span>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-extrabold border uppercase ${
                    pred.riskLevel === 'Critical' || pred.riskLevel === 'High'
                      ? 'bg-red-500/20 text-red-300 border-red-500/30'
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}
                >
                  {pred.riskLevel} ({pred.riskScore}%)
                </span>
              </div>

              <div className="text-xs space-y-2">
                <p className="text-stone-300">
                  <strong className="text-stone-100">Spread Vector:</strong> {pred.spreadVector}
                </p>
                <p className="text-stone-300">
                  <strong className="text-stone-100">Mitigation:</strong> {pred.mitigationStrategy}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
