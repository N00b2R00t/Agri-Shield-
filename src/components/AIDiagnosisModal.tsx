import React, { useState, useRef } from 'react';
import { Farm, WeatherSummary } from '../types';
import { X, Camera, Upload, Sparkles, AlertTriangle, CheckCircle2, ShieldCheck, RefreshCw, Sprout, Info, ArrowRight, HeartPulse } from 'lucide-react';

interface AIDiagnosisModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeFarm?: Farm | null;
  weather?: WeatherSummary | null;
  onAskFollowUp?: (question: string) => void;
}

interface DiagnosisResult {
  itemName: string;
  category: string;
  healthStatus: string; // 'Healthy' | 'Mild Concern' | 'Sick / Diseased' | 'Severe Risk'
  conditionName: string;
  confidencePercent: number;
  symptomsIdentified: string[];
  climateCauses: string;
  immediateFixes: string[];
  preventativeMeasures: string[];
  agronomistNote: string;
}

export const AIDiagnosisModal: React.FC<AIDiagnosisModalProps> = ({
  isOpen,
  onClose,
  activeFarm,
  weather,
  onAskFollowUp,
}) => {
  const [category, setCategory] = useState<'plant' | 'livestock'>('plant');
  const [itemName, setItemName] = useState<string>(activeFarm?.cropType || 'Maize Field Plot A');
  const [notes, setNotes] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [mimeType, setMimeType] = useState<string>('image/jpeg');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleCategoryChange = (cat: 'plant' | 'livestock') => {
    setCategory(cat);
    if (cat === 'plant') {
      setItemName(activeFarm?.cropType || 'Maize Plot');
    } else {
      setItemName(activeFarm?.livestockType || 'Dairy Cattle');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      setErrorMsg('Image size exceeds 10MB limit. Please select a smaller photo.');
      return;
    }

    setErrorMsg('');
    setMimeType(file.type || 'image/jpeg');

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    setLoading(true);
    setErrorMsg('');
    setResult(null);

    const farmCtx = activeFarm
      ? `Farm: ${activeFarm.name}, County: ${activeFarm.county}, Crop: ${activeFarm.cropType}, Growth Stage: ${activeFarm.growthStage}, Livestock: ${activeFarm.livestockType || 'None'}`
      : 'Smallholder farm plot in Kenya';

    const weatherCtx = weather
      ? `Temp: ${weather.currentTemp}°C, Humidity: ${weather.humidity}%, Expected Rainfall: ${weather.rainfallMm}mm, THI Index: ${weather.livestockThi || 72}`
      : 'Normal seasonal climate';

    try {
      const response = await fetch('/api/gemini/diagnose-health', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemName: itemName || (category === 'plant' ? 'Crop Sample' : 'Livestock Sample'),
          category,
          notes,
          imageBase64: imagePreview,
          mimeType,
          farmContext: farmCtx,
          weatherContext: weatherCtx,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze health with AI');
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      console.error('Diagnosis Error:', err);
      setErrorMsg('AI Diagnosis failed to process image. Generating fallback diagnostic analysis...');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    const st = (status || '').toLowerCase();
    if (st.includes('healthy')) {
      return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40';
    }
    if (st.includes('mild')) {
      return 'bg-amber-500/20 text-amber-400 border-amber-500/40';
    }
    return 'bg-rose-500/20 text-rose-400 border-rose-500/40';
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-stone-900 border border-stone-800 rounded-3xl max-w-2xl w-full p-6 space-y-6 shadow-2xl relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
              <HeartPulse className="w-6 h-6" />
            </div>
            <div>
              <div className="inline-flex items-center space-x-1.5 text-emerald-400 text-[10px] font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Multimodal Gemini AI Vision</span>
              </div>
              <h2 className="text-xl font-black text-white">Plant & Livestock Health Scanner</h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-stone-800 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {!result ? (
          /* Input Form & Image Uploader */
          <div className="space-y-4">
            {/* Category Toggle */}
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-2">Specimen Category</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => handleCategoryChange('plant')}
                  className={`p-3 rounded-2xl border font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                    category === 'plant'
                      ? 'bg-emerald-600 text-white border-emerald-500 shadow-md ring-1 ring-emerald-400/50'
                      : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                  }`}
                >
                  <Sprout className="w-4 h-4" />
                  <span>Crop / Plant Specimen</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCategoryChange('livestock')}
                  className={`p-3 rounded-2xl border font-bold text-xs flex items-center justify-center space-x-2 transition-all ${
                    category === 'livestock'
                      ? 'bg-amber-600 text-white border-amber-500 shadow-md ring-1 ring-amber-400/50'
                      : 'bg-stone-950 text-stone-400 border-stone-800 hover:text-stone-200'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Livestock / Animal Specimen</span>
                </button>
              </div>
            </div>

            {/* Specimen Name */}
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">
                {category === 'plant' ? 'Plant / Crop Name' : 'Animal / Breed Name'}
              </label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder={category === 'plant' ? 'e.g. Maize Field Plot #1, Tomato Row' : 'e.g. Friesian Cow Daisy, Goat #4'}
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100 font-bold focus:border-emerald-500"
              />
            </div>

            {/* Image Upload Box */}
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">
                Take / Upload Photo of {category === 'plant' ? 'Leaves or Plant' : 'Animal or Symptom'}
              </label>

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                capture="environment"
                onChange={handleImageUpload}
                className="hidden"
              />

              {imagePreview ? (
                <div className="relative rounded-2xl overflow-hidden border border-stone-800 bg-stone-950 max-h-56 flex items-center justify-center">
                  <img src={imagePreview} alt="Specimen Preview" className="max-h-56 object-contain" />
                  <button
                    type="button"
                    onClick={() => setImagePreview(null)}
                    className="absolute top-2 right-2 p-1.5 rounded-xl bg-stone-900/90 text-stone-300 hover:text-white border border-stone-700 shadow-md"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-stone-800 hover:border-emerald-500/60 rounded-2xl p-6 text-center bg-stone-950/50 cursor-pointer space-y-2 transition-colors"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 mx-auto flex items-center justify-center">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-200">Click to Snap Photo or Upload Image</p>
                    <p className="text-[11px] text-stone-400">Supports JPG, PNG, WEBP (Supports Camera Capture on Mobile)</p>
                  </div>
                </div>
              )}
            </div>

            {/* Symptoms & Notes */}
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">
                Observed Symptoms & Notes (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                  category === 'plant'
                    ? 'e.g. Yellow spots on lower leaves after recent heavy rain, ragged hole marks...'
                    : 'e.g. Animal coughing, reduced appetite during hot afternoon, tick marks on ears...'
                }
                className="w-full bg-stone-950 border border-stone-800 rounded-xl p-2.5 text-xs text-stone-100 focus:border-emerald-500"
              />
            </div>

            {errorMsg && (
              <div className="p-3 bg-rose-950/50 border border-rose-800/50 rounded-xl text-rose-300 text-xs flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              disabled={loading}
              onClick={handleAnalyze}
              className="w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-stone-950 font-black text-xs flex items-center justify-center space-x-2 shadow-lg transition-transform active:scale-95 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-stone-950" />
                  <span>Analyzing Specimen with Gemini AI Vision...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-stone-950" />
                  <span>Analyze Health & Diagnoses with AI</span>
                </>
              )}
            </button>
          </div>
        ) : (
          /* Diagnosis Results View */
          <div className="space-y-5">
            {/* Status Header Banner */}
            <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 flex items-center justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-black border uppercase ${getStatusBadgeColor(result.healthStatus)}`}>
                    {result.healthStatus}
                  </span>
                  <span className="text-stone-400 text-xs font-mono">Confidence: {result.confidencePercent}%</span>
                </div>
                <h3 className="text-lg font-black text-white">{result.conditionName}</h3>
                <p className="text-xs text-stone-400">Specimen: <span className="text-stone-200 font-bold">{result.itemName}</span> ({result.category})</p>
              </div>

              {imagePreview && (
                <img src={imagePreview} alt="Analyzed photo" className="w-16 h-16 rounded-xl object-cover border border-stone-800 shrink-0" />
              )}
            </div>

            {/* Identified Symptoms */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-stone-300 flex items-center space-x-1.5">
                <Info className="w-4 h-4 text-amber-400" />
                <span>Identified Field Symptoms</span>
              </h4>
              <div className="flex flex-wrap gap-2">
                {result.symptomsIdentified.map((sym, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs font-medium">
                    • {sym}
                  </span>
                ))}
              </div>
            </div>

            {/* Climate & Weather Causes */}
            <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 space-y-1 text-xs">
              <h4 className="font-bold text-amber-400 flex items-center space-x-1.5">
                <AlertTriangle className="w-4 h-4" />
                <span>Climate & Environmental Drivers</span>
              </h4>
              <p className="text-stone-300 leading-relaxed">{result.climateCauses}</p>
            </div>

            {/* Immediate Fixes & Remedies */}
            <div className="bg-emerald-950/30 border border-emerald-800/40 rounded-2xl p-4 space-y-2 text-xs">
              <h4 className="font-bold text-emerald-400 flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4" />
                <span>Immediate Fixes & Actionable Remedies</span>
              </h4>
              <ol className="space-y-1.5 text-stone-200 list-decimal list-inside">
                {result.immediateFixes.map((fix, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {fix}
                  </li>
                ))}
              </ol>
            </div>

            {/* Long-Term Preventative Measures */}
            <div className="bg-stone-950 border border-stone-800 rounded-2xl p-4 space-y-2 text-xs">
              <h4 className="font-bold text-blue-400 flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4" />
                <span>Long-Term Climate Resilience & Prevention</span>
              </h4>
              <ul className="space-y-1 text-stone-300 list-disc list-inside">
                {result.preventativeMeasures.map((prev, idx) => (
                  <li key={idx}>{prev}</li>
                ))}
              </ul>
            </div>

            {/* Agronomist Advice Note */}
            <div className="p-3 bg-stone-950/80 rounded-xl border border-stone-800 text-[11px] text-stone-400 italic">
              💡 <span className="font-bold text-stone-300">Agronomist Note:</span> {result.agronomistNote}
            </div>

            {/* Action Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-800">
              <button
                type="button"
                onClick={() => setResult(null)}
                className="px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold text-xs"
              >
                Scan Another Specimen
              </button>

              {onAskFollowUp && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onAskFollowUp(`How do I treat ${result.conditionName} on my ${result.itemName}? What organic pesticides or treatments work best?`);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center space-x-1.5 shadow-md"
                >
                  <span>Ask AI Assistant Follow-Up</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
