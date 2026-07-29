import React, { useState } from 'react';
import {
  FileText,
  X,
  BookOpen,
  ShieldCheck,
  Cpu,
  Database,
  Terminal,
  User,
  Thermometer,
  Layers,
  Sparkles,
  Download,
  ExternalLink,
} from 'lucide-react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeDocTab, setActiveDocTab] = useState<'overview' | 'features' | 'architecture' | 'schema' | 'guide'>('overview');

  if (!isOpen) return null;

  const downloadDocAsMarkdown = () => {
    const docContent = `# AgriShield AI Documentation
Developed by Ian Chirchir

## 1. System Overview
AgriShield AI is an end-to-end Climate Tech & AgriTech innovation built to strengthen resilience for smallholder farmers, pastoralists, and extension officers in Sub-Saharan Africa.

## 2. Key Modules
- Hyper-local Microclimate & THI Index Engine
- Predictive Disease & Pest Vector Modeling
- Interactive GIS Geofencing & Boundary Plotting
- Agribusiness Enterprise What-If Simulator
- Server-side Gemini AI Agronomist Proxy
- Crowdsourced Early Warning & Commodity Market Prices

## 3. Tech Stack
- Frontend: React 18, TypeScript, Tailwind CSS, Leaflet GIS
- Backend: Express Node.js Server
- AI Engine: Google Gemini API (@google/genai SDK)
- Database: Supabase PostgreSQL & RLS Policies
`;
    const blob = new Blob([docContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AGRISHIELD_AI_DOCUMENTATION.md';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base font-bold text-stone-100">AgriShield AI Documentation</h2>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-500/30">
                  v2.5 Release
                </span>
              </div>
              <p className="text-xs text-stone-400">System Architecture, Features & Operational Guide • Developer: Ian Chirchir</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={downloadDocAsMarkdown}
              className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center space-x-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export .MD</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-stone-100 border-b border-stone-200 px-6 py-2 flex items-center space-x-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveDocTab('overview')}
            className={`px-3 py-2 rounded-xl flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
              activeDocTab === 'overview'
                ? 'bg-white text-emerald-700 shadow-sm font-bold border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Executive Overview</span>
          </button>

          <button
            onClick={() => setActiveDocTab('features')}
            className={`px-3 py-2 rounded-xl flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
              activeDocTab === 'features'
                ? 'bg-white text-emerald-700 shadow-sm font-bold border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>2. Key Capabilities</span>
          </button>

          <button
            onClick={() => setActiveDocTab('architecture')}
            className={`px-3 py-2 rounded-xl flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
              activeDocTab === 'architecture'
                ? 'bg-white text-emerald-700 shadow-sm font-bold border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3. Tech Architecture</span>
          </button>

          <button
            onClick={() => setActiveDocTab('schema')}
            className={`px-3 py-2 rounded-xl flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
              activeDocTab === 'schema'
                ? 'bg-white text-emerald-700 shadow-sm font-bold border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>4. Database & API</span>
          </button>

          <button
            onClick={() => setActiveDocTab('guide')}
            className={`px-3 py-2 rounded-xl flex items-center space-x-1.5 whitespace-nowrap transition-colors ${
              activeDocTab === 'guide'
                ? 'bg-white text-emerald-700 shadow-sm font-bold border border-stone-200'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>5. Quick User Guide</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-stone-700 text-xs sm:text-sm leading-relaxed">
          {activeDocTab === 'overview' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4">
                <h3 className="text-base font-bold text-emerald-900 flex items-center space-x-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  <span>Platform Vision & Mission</span>
                </h3>
                <p className="text-xs text-emerald-800 mt-1">
                  AgriShield AI is designed to protect rural farming livelihoods against extreme weather anomalies, disease vector surges, and market volatility through data-driven microclimate intelligence and AI-powered decision support.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
                  <div className="font-bold text-stone-900 text-sm flex items-center space-x-1.5">
                    <Thermometer className="w-4 h-4 text-amber-600" />
                    <span>Climate Micro-Monitoring</span>
                  </div>
                  <p className="text-xs text-stone-600">
                    Calculates localized Temperature-Humidity Index (THI) for dairy cattle, sheep, and goats while tracking rain radar, soil moisture, and humidity levels.
                  </p>
                </div>

                <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 space-y-2">
                  <div className="font-bold text-stone-900 text-sm flex items-center space-x-1.5">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Gemini AI Agronomist</span>
                  </div>
                  <p className="text-xs text-stone-600">
                    Provides hyper-contextualized farming guidance in plain English and local context regarding fertilization, pest spray windows, and harvesting dates.
                  </p>
                </div>
              </div>

              <div className="bg-stone-900 text-stone-300 rounded-2xl p-4 space-y-2">
                <div className="text-white font-bold text-sm flex items-center space-x-2">
                  <User className="w-4 h-4 text-emerald-400" />
                  <span>Developer & Lead Architect</span>
                </div>
                <p className="text-xs text-stone-400">
                  AgriShield AI was created and engineered by <strong className="text-emerald-400">Ian Chirchir</strong> for African agricultural resilience and smart farming innovation.
                </p>
              </div>
            </div>
          )}

          {activeDocTab === 'features' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900">Core Feature Breakdown</h3>

              <div className="space-y-3">
                <div className="border border-stone-200 rounded-2xl p-4 bg-white shadow-sm space-y-1">
                  <span className="font-bold text-stone-900 text-xs uppercase tracking-wider text-emerald-600">Module 1</span>
                  <h4 className="font-bold text-stone-900 text-sm">Hyper-Local Microclimate & Livestock Heat Stress Engine</h4>
                  <p className="text-xs text-stone-600">
                    Computes daily THI risk values. Alerts farmers when cattle face moderate to severe heat stress (THI ≥ 79) and recommends water supplementation and shade management.
                  </p>
                </div>

                <div className="border border-stone-200 rounded-2xl p-4 bg-white shadow-sm space-y-1">
                  <span className="font-bold text-stone-900 text-xs uppercase tracking-wider text-emerald-600">Module 2</span>
                  <h4 className="font-bold text-stone-900 text-sm">Vector & Pest Outbreak Predictive Intelligence</h4>
                  <p className="text-xs text-stone-600">
                    Predicts vector disease risks like East Coast Fever (brown ear tick activity) and Rift Valley Fever, as well as crop pest invasions like Fall Armyworm and Locusts.
                  </p>
                </div>

                <div className="border border-stone-200 rounded-2xl p-4 bg-white shadow-sm space-y-1">
                  <span className="font-bold text-stone-900 text-xs uppercase tracking-wider text-emerald-600">Module 3</span>
                  <h4 className="font-bold text-stone-900 text-sm">Agribusiness "What-If" Enterprise Simulator</h4>
                  <p className="text-xs text-stone-600">
                    Allows testing scenarios (drought intensity, fertilizer cost spikes, planting offset) to project yield outcomes (Tons/Ha) and net revenue projections before investing capital.
                  </p>
                </div>

                <div className="border border-stone-200 rounded-2xl p-4 bg-white shadow-sm space-y-1">
                  <span className="font-bold text-stone-900 text-xs uppercase tracking-wider text-emerald-600">Module 4</span>
                  <h4 className="font-bold text-stone-900 text-sm">Interactive GIS Polygon Mapping</h4>
                  <p className="text-xs text-stone-600">
                    High-precision Leaflet map enabling farmers to plot polygon boundary markers, view county overlays (Kenya 47 Counties), and track community pest report pins.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeDocTab === 'architecture' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900">System Architecture & Pipeline</h3>
              <p className="text-xs text-stone-600">
                AgriShield AI runs a full-stack architecture built for high performance, server-side API key protection, and cloud database persistence.
              </p>

              <div className="bg-stone-900 text-emerald-400 font-mono text-xs rounded-2xl p-4 overflow-x-auto space-y-1 border border-stone-800">
                <div>[Client Layer] React 18 + TypeScript + Tailwind CSS</div>
                <div>       ↓ REST API Requests (/api/weather, /api/ai/advise)</div>
                <div>[Server Layer] Node.js + Express (Port 3000)</div>
                <div>       ↓ Server Proxy Calls</div>
                <div>[Gemini AI Engine] Google GenAI SDK (@google/genai)</div>
                <div>       ↓ SQL / RLS Persistence</div>
                <div>[Database Layer] Supabase PostgreSQL + Local Persistence Engine</div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl">
                  <span className="font-bold text-stone-900">Frontend Stack</span>
                  <p className="text-stone-500 mt-0.5">React 18, Vite, Lucide React, Leaflet GIS, Motion Animations</p>
                </div>
                <div className="p-3 bg-stone-50 border border-stone-200 rounded-xl">
                  <span className="font-bold text-stone-900">Backend & AI</span>
                  <p className="text-stone-500 mt-0.5">Express.js, esbuild CJS bundle, @google/genai SDK, Supabase JS</p>
                </div>
              </div>
            </div>
          )}

          {activeDocTab === 'schema' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900">Database Schema & API Specifications</h3>

              <div className="bg-stone-900 text-stone-200 font-mono text-xs p-4 rounded-2xl overflow-x-auto border border-stone-800">
                <div className="text-emerald-400 font-bold mb-2">-- Supabase PostgreSQL Relational Schema Summary --</div>
                <div>TABLE profiles (id UUID, name TEXT, email TEXT, county TEXT, role TEXT);</div>
                <div>TABLE farms (id TEXT, user_id UUID, name TEXT, crop_type TEXT, category TEXT, area_ha NUMERIC);</div>
                <div>TABLE community_reports (id TEXT, title TEXT, category TEXT, lat NUMERIC, lng NUMERIC);</div>
                <div>TABLE disease_predictions (id TEXT, disease_name TEXT, risk_level TEXT, probability NUMERIC);</div>
                <div>TABLE market_prices (id TEXT, commodity TEXT, price_ksh NUMERIC, location TEXT);</div>
              </div>

              <div className="space-y-2">
                <h4 className="font-bold text-stone-900 text-xs">Primary API Routes</h4>
                <ul className="list-disc pl-5 text-xs text-stone-600 space-y-1">
                  <li><code className="bg-stone-100 text-emerald-700 px-1 py-0.5 rounded">GET /api/health</code> - Infrastructure health check</li>
                  <li><code className="bg-stone-100 text-emerald-700 px-1 py-0.5 rounded">GET /api/weather?lat=&lng=</code> - Real-time microclimate parameters</li>
                  <li><code className="bg-stone-100 text-emerald-700 px-1 py-0.5 rounded">POST /api/ai/advise</code> - Gemini AI contextual advisory response</li>
                </ul>
              </div>
            </div>
          )}

          {activeDocTab === 'guide' && (
            <div className="space-y-4">
              <h3 className="text-base font-bold text-stone-900">User Quick Guide & Navigation</h3>
              
              <div className="space-y-3 text-xs text-stone-600">
                <div className="flex items-start space-x-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">1</span>
                  <div>
                    <strong className="text-stone-900">Select or Register Your Farm:</strong> Use the top Navbar farm switcher to switch between farms or create a new custom geofenced farm parcel.
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">2</span>
                  <div>
                    <strong className="text-stone-900">Consult Gemini AI:</strong> Click the floating "AgriShield AI Advisor" button at the bottom right to ask questions about fertilizer, spray timing, or heat stress management.
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                  <span className="w-6 h-6 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">3</span>
                  <div>
                    <strong className="text-stone-900">Run Enterprise Simulations:</strong> Navigate to the "What-If Simulator" tab to simulate crop yield and financial return under varying weather scenarios.
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-stone-100 px-6 py-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <div>
            AgriShield AI • <span className="font-semibold text-stone-700">Developed by Ian Chirchir</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-900 text-white font-bold rounded-xl hover:bg-stone-800 transition-colors"
          >
            Close Documentation
          </button>
        </div>
      </div>
    </div>
  );
};
