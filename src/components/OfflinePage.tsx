import React, { useState, useEffect } from 'react';
import { WifiOff, Wifi, RefreshCw, HardDrive, CheckCircle2, CloudOff, AlertCircle } from 'lucide-react';
import { AgriShieldLogoIcon } from './AgriShieldLogo';

interface OfflinePageProps {
  mode?: 'full' | 'banner';
  onRetryConnection?: () => void;
}

export const OfflinePage: React.FC<OfflinePageProps> = ({
  mode = 'full',
  onRetryConnection,
}) => {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [isChecking, setIsChecking] = useState(false);
  const [cachedItemsCount, setCachedItemsCount] = useState<number>(14);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleCheckConnection = async () => {
    setIsChecking(true);
    try {
      // Ping check
      const res = await fetch('/api/health', { method: 'HEAD', cache: 'no-store' }).catch(() => null);
      if (res && res.ok) {
        setIsOnline(true);
        if (onRetryConnection) onRetryConnection();
      } else {
        setIsOnline(navigator.onLine);
      }
    } catch {
      setIsOnline(false);
    } finally {
      setTimeout(() => setIsChecking(false), 600);
    }
  };

  if (mode === 'banner') {
    if (isOnline) return null;

    return (
      <div className="bg-amber-500 text-stone-950 px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md animate-pulse">
        <div className="flex items-center space-x-2">
          <WifiOff className="w-4 h-4 stroke-[2.5]" />
          <span>
            Offline Mode Active — Operating on cached local AgriShield telemetry & farm datasets.
          </span>
        </div>
        <button
          onClick={handleCheckConnection}
          disabled={isChecking}
          className="px-2.5 py-1 rounded bg-stone-950 text-amber-400 hover:bg-stone-900 text-[11px] font-extrabold flex items-center space-x-1 transition-colors"
        >
          <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
          <span>{isChecking ? 'Rechecking...' : 'Retry Connection'}</span>
        </button>
      </div>
    );
  }

  // Full Page Mode
  if (isOnline) return null;

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-xl w-full bg-stone-850 border border-stone-750 rounded-2xl shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden">
        
        {/* Ambient Amber Offline Glow */}
        <div className="absolute -top-20 -right-20 w-48 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Logo & Offline Badge */}
        <div className="flex justify-center mb-6 relative">
          <div className="relative">
            <AgriShieldLogoIcon size={64} className="mx-auto grayscale opacity-80" />
            <div className="absolute -bottom-2 -right-2 bg-stone-900 text-amber-400 p-1.5 rounded-full border-2 border-amber-500/40 shadow-lg">
              <WifiOff className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* Title */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-50 tracking-tight mb-2">
          You are Currently Offline
        </h1>
        <p className="text-stone-300 text-sm sm:text-base mb-6 max-w-md mx-auto leading-relaxed">
          AgriShield AI has switched to offline protection mode. Your registered farm boundaries, risk models, and community reports remain locally accessible.
        </p>

        {/* Offline Storage Status Box */}
        <div className="bg-stone-900/90 border border-stone-750 rounded-xl p-4 text-left mb-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-amber-400">
            <span className="flex items-center space-x-1.5">
              <HardDrive className="w-4 h-4 text-emerald-400" />
              <span>Offline Database Engine Status</span>
            </span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded text-[10px]">
              Ready
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-stone-950 p-2.5 rounded-lg border border-stone-800 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="font-bold text-stone-200">Local Farms & Records</div>
                <div className="text-[10px] text-stone-400">Cached in local memory</div>
              </div>
            </div>

            <div className="bg-stone-950 p-2.5 rounded-lg border border-stone-800 flex items-center space-x-2">
              <CloudOff className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="font-bold text-stone-200">Supabase Sync</div>
                <div className="text-[10px] text-amber-400">Queued until online</div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleCheckConnection}
            disabled={isChecking}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-extrabold text-sm flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-amber-950/40"
          >
            <RefreshCw className={`w-4 h-4 ${isChecking ? 'animate-spin' : ''}`} />
            <span>{isChecking ? 'Checking Internet Connection...' : 'Check Connection'}</span>
          </button>
        </div>

        {/* Footer Credit */}
        <div className="mt-8 pt-4 border-t border-stone-800 text-[11px] text-stone-500 flex items-center justify-between">
          <span>AgriShield AI • Offline Resilience</span>
          <span>Developed by <strong className="text-stone-300">Ian Chirchir</strong></span>
        </div>
      </div>
    </div>
  );
};
