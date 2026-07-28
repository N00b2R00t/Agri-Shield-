import React from 'react';

interface LogoProps {
  className?: string;
  size?: number;
  showText?: boolean;
  variant?: 'dark' | 'light' | 'emerald';
}

/**
 * AgriShield AI Vector SVG Logo Icon
 * Designed by Ian Chirchir - Features precision Shield contour, Sprouting Climate Leaf, and Neural AI Node vectors
 */
export const AgriShieldLogoIcon: React.FC<{ className?: string; size?: number }> = ({
  className = 'w-10 h-10',
  size = 40,
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} transition-transform duration-300 hover:scale-105`}
      aria-label="AgriShield AI Logo"
    >
      <defs>
        {/* Shield Gradient */}
        <linearGradient id="shieldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#059669" />
          <stop offset="50%" stopColor="#0d9488" />
          <stop offset="100%" stopColor="#0f766e" />
        </linearGradient>

        {/* Leaf Core Gradient */}
        <linearGradient id="leafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#84cc16" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>

        {/* Climate Sun/Satellite Radar Arc Gradient */}
        <linearGradient id="radarGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>

        {/* Glow Filter */}
        <filter id="agriGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* 1. Shield Background Container */}
      <path
        d="M50 8 L85 22 C85 55 72 78 50 92 C28 78 15 55 15 22 Z"
        fill="url(#shieldGrad)"
        stroke="#047857"
        strokeWidth="2.5"
        filter="url(#agriGlow)"
      />

      {/* 2. Inner Shield Contour Inset */}
      <path
        d="M50 14 L79 26 C79 53 68 73 50 85 C32 73 21 53 21 26 Z"
        fill="none"
        stroke="#34d399"
        strokeWidth="1.5"
        strokeOpacity="0.4"
        strokeDasharray="4 2"
      />

      {/* 3. Climate Radar Energy Arcs */}
      <path
        d="M32 42 A 22 22 0 0 1 68 42"
        fill="none"
        stroke="url(#radarGrad)"
        strokeWidth="3"
        strokeLinecap="round"
        strokeOpacity="0.85"
      />
      <path
        d="M37 36 A 16 16 0 0 1 63 36"
        fill="none"
        stroke="#fbbf24"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeOpacity="0.9"
      />

      {/* 4. Central Sprouting Agribusiness Leaf (Precision Vector Path) */}
      <path
        d="M50 30 C36 40 34 58 50 72 C66 58 64 40 50 30 Z"
        fill="url(#leafGrad)"
        stroke="#ecfdf5"
        strokeWidth="1.2"
      />

      {/* 5. Central Leaf Vein & Growth Node Line */}
      <path
        d="M50 72 Q50 50 50 32 M50 54 Q43 47 38 45 M50 60 Q57 53 62 51"
        fill="none"
        stroke="#065f46"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* 6. AI Neural Network Nodes & Telemetry Dots */}
      <circle cx="50" cy="22" r="3.5" fill="#fbbf24" />
      <circle cx="30" cy="32" r="2.5" fill="#34d399" />
      <circle cx="70" cy="32" r="2.5" fill="#34d399" />
      <circle cx="50" cy="72" r="2.5" fill="#34d399" />

      {/* Connecting AI Sensor Filaments */}
      <line x1="50" y1="22" x2="50" y2="30" stroke="#fef3c7" strokeWidth="1.5" strokeDasharray="2 1" />
      <line x1="30" y1="32" x2="36" y2="38" stroke="#a7f3d0" strokeWidth="1" />
      <line x1="70" y1="32" x2="64" y2="38" stroke="#a7f3d0" strokeWidth="1" />
    </svg>
  );
};

export const AgriShieldLogoFull: React.FC<LogoProps> = ({
  className = '',
  size = 40,
  variant = 'dark',
}) => {
  const textColor =
    variant === 'light'
      ? 'text-stone-900'
      : variant === 'emerald'
      ? 'text-emerald-950'
      : 'text-stone-50';

  const subTextColor =
    variant === 'light'
      ? 'text-stone-500'
      : variant === 'emerald'
      ? 'text-emerald-700'
      : 'text-stone-400';

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <AgriShieldLogoIcon size={size} />
      <div>
        <div className="flex items-center space-x-1.5">
          <span className={`text-xl font-extrabold tracking-tight ${textColor}`}>
            Agri<span className="text-emerald-500">Shield</span>
          </span>
          <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            AI
          </span>
        </div>
        <p className={`text-[10px] font-semibold tracking-wide ${subTextColor} uppercase`}>
          Climate Risk Intelligence
        </p>
      </div>
    </div>
  );
};
