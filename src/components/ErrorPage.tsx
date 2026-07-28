import React, { Component, useState } from 'react';
import { AlertTriangle, RefreshCw, Home, ShieldAlert, ChevronDown, ChevronUp, LifeBuoy } from 'lucide-react';
import { AgriShieldLogoIcon } from './AgriShieldLogo';

interface ErrorPageProps {
  error?: Error | string | null;
  resetError?: () => void;
  title?: string;
  message?: string;
}

export const ErrorPage: React.FC<ErrorPageProps> = ({
  error,
  resetError,
  title = 'Application Alert Encountered',
  message = 'AgriShield AI encountered an unexpected error while processing microclimate data or database operations.',
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const errorMessage =
    typeof error === 'string'
      ? error
      : error?.message || 'Unknown application exception occurred.';

  const errorStack = typeof error === 'object' && error?.stack ? error.stack : null;

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center p-4 sm:p-6">
      <div className="max-w-xl w-full bg-stone-850 border border-stone-750 rounded-2xl shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden">
        
        {/* Subtle Background Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Brand Logo & Error Badge */}
        <div className="flex justify-center mb-6 relative">
          <div className="relative">
            <AgriShieldLogoIcon size={64} className="mx-auto" />
            <div className="absolute -bottom-2 -right-2 bg-amber-500 text-stone-950 p-1.5 rounded-full border-2 border-stone-850 shadow-lg">
              <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
            </div>
          </div>
        </div>

        {/* Heading & Subtitle */}
        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-50 tracking-tight mb-2">
          {title}
        </h1>
        <p className="text-stone-300 text-sm sm:text-base mb-6 max-w-md mx-auto leading-relaxed">
          {message}
        </p>

        {/* Error Details Box */}
        <div className="bg-stone-900/90 border border-stone-750 rounded-xl p-4 text-left mb-6">
          <div className="flex items-center justify-between text-xs font-semibold text-stone-400 mb-1">
            <span className="flex items-center space-x-1.5 text-amber-400">
              <ShieldAlert className="w-4 h-4" />
              <span>Diagnostic Exception Info</span>
            </span>
            {errorStack && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="text-stone-400 hover:text-stone-200 flex items-center space-x-1"
              >
                <span>{showDetails ? 'Hide Stack' : 'View Stack'}</span>
                {showDetails ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          <div className="font-mono text-xs text-rose-300 bg-stone-950 p-2.5 rounded-lg border border-stone-800 break-words">
            {errorMessage}
          </div>

          {showDetails && errorStack && (
            <pre className="mt-2 text-[10px] font-mono text-stone-400 bg-stone-950 p-2.5 rounded-lg border border-stone-800 overflow-x-auto max-h-40">
              {errorStack}
            </pre>
          )}
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              if (resetError) resetError();
              else window.location.reload();
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-sm flex items-center justify-center space-x-2 transition-colors shadow-lg shadow-emerald-950/40"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry Operation</span>
          </button>

          <button
            onClick={() => {
              window.location.href = '/';
            }}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-750 border border-stone-700 text-stone-200 font-semibold text-sm flex items-center justify-center space-x-2 transition-colors"
          >
            <Home className="w-4 h-4 text-stone-400" />
            <span>Reload Dashboard</span>
          </button>
        </div>

        {/* Footer Credit */}
        <div className="mt-8 pt-4 border-t border-stone-800/80 text-[11px] text-stone-500 flex items-center justify-between">
          <span>AgriShield AI Platform</span>
          <span>Developed by <strong className="text-stone-300">Ian Chirchir</strong></span>
        </div>
      </div>
    </div>
  );
};

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * React Error Boundary Class Component wrapper
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
    error: null,
  };

  public declare setState: (
    state: Partial<ErrorBoundaryState> | ((prevState: ErrorBoundaryState) => Partial<ErrorBoundaryState>)
  ) => void;

  public declare props: ErrorBoundaryProps;

  constructor(props: ErrorBoundaryProps) {
    super(props);
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('AgriShield AI ErrorBoundary caught error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          error={this.state.error}
          resetError={this.handleReset}
        />
      );
    }
    return this.props.children;
  }
}
