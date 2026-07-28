import React, { useEffect, useState } from 'react';
import { Radio, Activity, ShieldCheck, Wifi, CloudRain, Satellite } from 'lucide-react';

export const LiveBackgroundTelemetry: React.FC = () => {
  const [pulseIndex, setPulseIndex] = useState(0);
  const [satelliteAngle, setSatelliteAngle] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseIndex((prev) => (prev + 1) % 4);
      setSatelliteAngle((prev) => (prev + 1.5) % 360);
    }, 3000);
    return () => clearInterval(timer);
  }, []);

  const telemetryNodes = [
    { label: 'Uasin Gishu Station', temp: '22.4°C', rain: '12mm', status: 'Optimal' },
    { label: 'Eldoret Radar Sync', temp: '21.8°C', rain: '8mm', status: 'Live' },
    { label: 'Nakuru Basin Telemetry', temp: '24.1°C', rain: '18mm', status: 'Monitoring' },
    { label: 'Trans Nzoia Grid', temp: '20.9°C', rain: '5mm', status: 'Active' },
  ];

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 select-none">
      {/* Background Soft Atmospheric Mesh Gradient */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute -bottom-40 left-1/4 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-3xl" />

      {/* Satellite Telemetry Ray Line */}
      <div className="absolute top-12 right-12 flex items-center space-x-2 bg-stone-900/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-stone-800 text-[10px] text-stone-400">
        <Satellite
          className="w-3.5 h-3.5 text-emerald-400 transition-transform duration-1000"
          style={{ transform: `rotate(${satelliteAngle}deg)` }}
        />
        <span>METEOSAT-3 Agro-Radar Sync:</span>
        <span className="font-mono text-emerald-400 font-bold">2.4 GHz • LIVE</span>
      </div>

      {/* Floating Microclimate Nodes */}
      <div className="hidden lg:block absolute bottom-8 left-8 space-y-2">
        <div className="bg-stone-900/80 backdrop-blur-md p-3 rounded-2xl border border-stone-800/80 text-[11px] text-stone-300 shadow-xl max-w-xs space-y-1.5">
          <div className="flex items-center justify-between font-bold border-b border-stone-800/60 pb-1 text-emerald-400">
            <div className="flex items-center space-x-1.5">
              <Radio className="w-3.5 h-3.5 animate-ping text-emerald-400" />
              <span>{telemetryNodes[pulseIndex].label}</span>
            </div>
            <span className="text-[9px] px-1.5 py-0.2 bg-emerald-500/20 text-emerald-300 rounded font-mono">
              {telemetryNodes[pulseIndex].status}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-[10px]">
            <div>
              <span className="text-stone-500 block">Temperature</span>
              <span className="font-mono font-bold text-stone-200">{telemetryNodes[pulseIndex].temp}</span>
            </div>
            <div>
              <span className="text-stone-500 block">24h Precip</span>
              <span className="font-mono font-bold text-teal-300">{telemetryNodes[pulseIndex].rain}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
