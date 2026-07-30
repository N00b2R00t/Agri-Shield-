import React, { useState } from 'react';
import { Radio, Send, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface BroadcastDispatcherProps {
  onSendNotification?: (notif: { title: string; message: string; severity: 'info' | 'warning' | 'critical'; type: any }) => void;
}

export const BroadcastDispatcher: React.FC<BroadcastDispatcherProps> = ({ onSendNotification }) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [severity, setSeverity] = useState<'info' | 'warning' | 'critical'>('warning');
  const [alertType, setAlertType] = useState<'flood' | 'heatwave' | 'pest' | 'disease' | 'weather_warning'>('pest');
  const [sentSuccess, setSentSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !message) return;

    if (onSendNotification) {
      onSendNotification({
        title,
        message,
        severity,
        type: alertType,
      });
    }

    setSentSuccess(true);
    setTitle('');
    setMessage('');
    setTimeout(() => setSentSuccess(false), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-1">
        <div className="inline-flex items-center space-x-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
          <Radio className="w-4 h-4" />
          <span>Extension SMS & Mobile Broadcast Dispatcher</span>
        </div>
        <h2 className="text-xl font-bold text-white">Issue County-Wide Emergency Alerts</h2>
        <p className="text-xs text-stone-400">Dispatch instant SMS and push notifications to all registered smallholders in your county.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
        {sentSuccess && (
          <div className="p-3.5 rounded-2xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Emergency alert broadcast successfully sent to registered smallholders!</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1">Alert Category</label>
            <select
              value={alertType}
              onChange={(e) => setAlertType(e.target.value as any)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="pest">🐛 Pest Outbreak (Fall Armyworm, Desert Locust)</option>
              <option value="disease">🦠 Livestock / Crop Disease (ECF, Blight)</option>
              <option value="flood">🌧️ Flash Flood Warning</option>
              <option value="heatwave">☀️ Severe Heatwave & THI Stress</option>
              <option value="weather_warning">⚡ Severe Weather Advisory</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1">Severity Level</label>
            <select
              value={severity}
              onChange={(e) => setSeverity(e.target.value as any)}
              className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-white"
            >
              <option value="info">ℹ️ Information / Advisory</option>
              <option value="warning">⚠️ High Warning</option>
              <option value="critical">🚨 Critical Emergency Action</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-300 mb-1">Broadcast Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Uasin Gishu Fall Armyworm Outbreak Alert"
            className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3.5 py-2 text-xs text-white"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-stone-300 mb-1">Emergency Message Body</label>
          <textarea
            rows={4}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Provide clear step-by-step instructions for farmers..."
            className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3.5 text-xs text-white"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full py-3 rounded-2xl bg-cyan-600 hover:bg-cyan-500 text-white font-extrabold text-xs shadow-lg flex items-center justify-center space-x-2 transition-all"
        >
          <Send className="w-4 h-4" />
          <span>Transmit Broadcast Notification</span>
        </button>
      </form>
    </div>
  );
};
