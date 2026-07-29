import React, { useState, useRef, useEffect } from 'react';
import { Farm, WeatherSummary, ChatMessage, CommunityReport } from '../types';
import {
  Sparkles,
  Send,
  X,
  Bot,
  User,
  Sprout,
  HelpCircle,
  AlertTriangle,
  Zap,
} from 'lucide-react';

interface AIAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  farm?: Farm | null;
  weather: WeatherSummary;
  reports: CommunityReport[];
}

export const AIAssistantModal: React.FC<AIAssistantModalProps> = ({
  isOpen,
  onClose,
  farm,
  weather,
  reports,
}) => {
  const farmName = farm?.name || 'Your Farm Sector';
  const cropType = farm?.cropType || 'Crops & Livestock';
  const growthStage = farm?.growthStage || 'Active Season';
  const locationName = farm?.locationName || 'Kenya';

  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'msg-0',
      sender: 'ai',
      text: `Jambo Farmer! I am your AgriShield AI Agronomist. I have reviewed ${farmName} (${cropType}, ${growthStage}) in ${locationName}.\n\nWith today's forecast showing **${weather.rainfallMm}mm rain (${weather.rainfallProb}% chance)** and humidity at **${weather.humidity}%**, how can I assist your farming decisions today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      quickActions: [
        `Should I irrigate my ${cropType} today?`,
        `When should I top-dress nitrogen fertilizer?`,
        `Nearby Armyworm reported: how do I protect my field?`,
        `Should I harvest early before the heavy downpour?`,
      ],
    },
  ]);

  const [inputQuestion, setInputQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (textToSend?: string) => {
    const q = textToSend || inputQuestion;
    if (!q.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: q,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputQuestion('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          farm,
          question: q,
          weather,
          recentReports: reports,
          chatHistory: messages,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          sender: 'ai',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          quickActions: data.quickActions,
        };
        setMessages((prev) => [...prev, aiMsg]);
      } else {
        throw new Error('API server error');
      }
    } catch (err) {
      console.error('Chat error:', err);
      const fallbackMsg: ChatMessage = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `Based on current soil moisture (${weather.soilMoisturePercent}%) and upcoming rain (${weather.rainfallMm}mm):\n\n• **Irrigation**: Hold off on artificial watering until Saturday.\n• **Fertilizer**: Delay top-dressing to prevent nutrient leaching into groundwater.\n• **Drainage**: Clear field ditches to prevent root rot.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
      <div className="bg-stone-900 text-stone-100 rounded-2xl max-w-2xl w-full h-[600px] flex flex-col shadow-2xl border border-stone-800 overflow-hidden">
        
        {/* Header */}
        <div className="p-4 bg-stone-850 border-b border-stone-800 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center text-white shadow-md">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-bold text-sm text-stone-100">AgriShield AI Farming Assistant</h3>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30">
                  Gemini 3.6
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Aware of {farmName} • {cropType} • {weather.currentTemp}°C Rain: {weather.rainfallMm}mm
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-white hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Chat History Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex items-start space-x-2.5 ${
                m.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {m.sender === 'ai' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-xs shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-[85%] p-3.5 rounded-2xl space-y-2 leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-emerald-600 text-white rounded-tr-none'
                    : 'bg-stone-800 text-stone-100 border border-stone-700 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-wrap">{m.text}</div>
                <div className="text-[10px] opacity-70 text-right">{m.timestamp}</div>

                {/* Quick Action Suggested Chips */}
                {m.quickActions && m.quickActions.length > 0 && (
                  <div className="pt-2 border-t border-stone-700 space-y-1.5 mt-2">
                    <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                      Quick Questions:
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {m.quickActions.map((qa, i) => (
                        <button
                          key={i}
                          onClick={() => handleSendMessage(qa)}
                          className="px-2.5 py-1 rounded-lg bg-stone-700 hover:bg-stone-650 text-emerald-300 font-medium text-[11px] border border-stone-600 transition-colors text-left"
                        >
                          • {qa}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {m.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-stone-700 text-stone-200 flex items-center justify-center text-xs shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-2 text-stone-400 text-xs italic">
              <Sparkles className="w-4 h-4 text-emerald-400 animate-spin" />
              <span>Analyzing climate models and soil moisture for {cropType}...</span>
            </div>
          )}

          <div ref={chatBottomRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 bg-stone-850 border-t border-stone-800 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={inputQuestion}
              onChange={(e) => setInputQuestion(e.target.value)}
              placeholder={`Ask Gemini about ${cropType}, rainfall, fertilizer, or armyworm protection...`}
              className="flex-1 bg-stone-900 border border-stone-700 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-emerald-500"
            />
            <button
              type="submit"
              disabled={isLoading || !inputQuestion.trim()}
              className="px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold text-xs flex items-center space-x-1 disabled:opacity-50 transition-transform active:scale-95"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
