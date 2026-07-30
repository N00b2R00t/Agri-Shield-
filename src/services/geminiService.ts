import { GoogleGenAI } from '@google/genai';
import { Farm, WeatherSummary, CommunityReport, ChatMessage } from '../types';

// Helper to get client-side Gemini AI instance if API key is provided
function getClientAiInstance() {
  const apiKey =
    (import.meta.env && import.meta.env.VITE_GEMINI_API_KEY) ||
    (typeof process !== 'undefined' && process.env && process.env.GEMINI_API_KEY) ||
    (typeof process !== 'undefined' && process.env && process.env.VITE_GEMINI_API_KEY);

  if (!apiKey || !apiKey.trim()) return null;

  return new GoogleGenAI({ apiKey: apiKey.trim() });
}

export async function askGeminiAssistant({
  farm,
  question,
  weather,
  recentReports,
  chatHistory,
}: {
  farm?: Farm | null;
  question: string;
  weather: WeatherSummary;
  recentReports: CommunityReport[];
  chatHistory: ChatMessage[];
}): Promise<{ reply: string; quickActions?: string[] }> {
  const ai = getClientAiInstance();

  const farmName = farm?.name || 'Your Farm Sector';
  const crop = farm?.cropType || 'Crops & Livestock';
  const location = farm?.locationName || 'Kenya';
  const temp = weather?.currentTemp || 24;
  const rain = weather?.rainfallMm || 12;
  const humidity = weather?.humidity || 75;
  const moisture = weather?.soilMoisturePercent || 65;

  if (ai) {
    try {
      const systemInstruction = `You are AgriShield AI Advisor, an expert climate resilience agronomist for African smallholder farmers.
Advice covers BOTH Crop Agriculture (${crop}) and Livestock Keeping (${farm?.livestockType || 'Dairy Cattle'}).
Be encouraging, practical, and highly detailed. Provide clear steps and bullet points.
Context:
- Farm: ${farmName} (${crop}, Location: ${location})
- Weather: Temp ${temp}°C, Rain ${rain}mm, Humidity ${humidity}%, Soil Moisture ${moisture}%
- Recent Reports: ${recentReports?.slice(0, 2).map((r) => r.description).join('; ') || 'None'}`;

      const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.5-pro'];

      for (const mName of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model: mName,
            contents: `Farmer Question: "${question}"`,
            config: {
              systemInstruction,
              temperature: 0.7,
            },
          });

          if (response && response.text) {
            return {
              reply: response.text,
              quickActions: [
                `Should I irrigate my ${crop} today?`,
                `How to protect ${crop} from pest damage?`,
                `Best fertilizer timing for ${rain}mm rain forecast?`,
              ],
            };
          }
        } catch (mErr) {
          console.warn(`Client Gemini model ${mName} error:`, mErr);
        }
      }
    } catch (err) {
      console.error('Client Gemini SDK failed, falling back to smart AI response engine:', err);
    }
  }

  // Smart contextual AI fallback response generator for Vercel deployments when API key is missing or offline
  const qLower = question.toLowerCase();

  let replyText = '';
  let quickActions = [
    `Should I irrigate my ${crop} today?`,
    `How do I protect ${crop} from Fall Armyworm?`,
    `When to top-dress fertilizer given ${rain}mm rain?`,
  ];

  if (
    qLower.includes('hi') ||
    qLower.includes('hello') ||
    qLower.includes('jambo') ||
    qLower.includes('hey')
  ) {
    replyText = `Jambo! I am your AgriShield AI Advisor. I am actively monitoring ${farmName} in ${location} (${crop}).\n\nToday's micro-climate summary:\n• **Temperature**: ${temp}°C\n• **Rainfall**: ${rain}mm expected (${weather?.rainfallProb || 70}% probability)\n• **Soil Moisture**: ${moisture}%\n\nHow can I help you optimize your crop yields or protect your livestock today?`;
    quickActions = [
      `Should I harvest early before heavy rain?`,
      `How do I prevent pest infestations?`,
      `What is my farm's heat stress risk?`,
    ];
  } else if (
    qLower.includes('armyworm') ||
    qLower.includes('pest') ||
    qLower.includes('worm') ||
    qLower.includes('disease') ||
    qLower.includes('bug')
  ) {
    replyText = `### 🐛 Pest & Disease Risk Advisory for ${crop}\n\nWith humidity at **${humidity}%** and ambient temperature at **${temp}°C**, field conditions favor pest activity.\n\n1. **Field Scouting**: Inspect leaf whorls of 20 consecutive plants across 5 different field sections. Look for pinhole damage or frass.\n2. **Targeted Treatment**: Apply bio-pesticides or Neem oil extract in the early morning or late evening.\n3. **Rain Safeguard**: Since **${rain}mm of rainfall** is forecast, mix a spreader-sticker to ensure treatment adheres to leaves.`;
    quickActions = [
      `Recommended pesticide dosage for ${crop}?`,
      `How to report an outbreak to extension officers?`,
      `Safe organic pest control methods?`,
    ];
  } else if (
    qLower.includes('harvest') ||
    qLower.includes('cut') ||
    qLower.includes('pick') ||
    qLower.includes('downpour') ||
    qLower.includes('rain')
  ) {
    replyText = `### 🌾 Harvest & Moisture Protection Strategy for ${crop}\n\nForecast indicates **${rain}mm of rainfall** with soil moisture at **${moisture}%**:\n\n1. **Mature Crop Harvest**: If crops have reached maturity, harvest mature ears/produce immediately to prevent cob rot and mold.\n2. **Post-Harvest Handling**: Elevate harvested produce on raised plastic tarps off wet soil.\n3. **Field Drainage**: Clear perimeter trenches around plot borders to channel away excess runoff.`;
    quickActions = [
      `How to build elevated drying tarps?`,
      `Current market prices for ${crop}?`,
      `Preventing mold in harvested crops?`,
    ];
  } else if (
    qLower.includes('fertilizer') ||
    qLower.includes('nitrogen') ||
    qLower.includes('top-dress') ||
    qLower.includes('dap') ||
    qLower.includes('can')
  ) {
    replyText = `### 🧪 Fertilizer Application Timing for ${crop}\n\n1. **Rain Delay**: Delay CAN/Urea top-dressing until heavy rainfall subsides. Applying fertilizer during heavy rain (${rain}mm forecast) causes nutrient leaching.\n2. **Soil Conditions**: Apply when soil is damp but not waterlogged, placement 5–7 cm from plant base.\n3. **Nutrient Management**: Incorporate organic compost or manure to improve soil moisture retention.`;
    quickActions = [
      `Fertilizer quantity needed per acre?`,
      `Combining manure with CAN fertilizer?`,
      `Identifying nitrogen deficiency signs?`,
    ];
  } else if (
    qLower.includes('irrigate') ||
    qLower.includes('water') ||
    qLower.includes('drought') ||
    qLower.includes('dry')
  ) {
    replyText = `### 💧 Irrigation & Water Management for ${crop}\n\n1. **Current Status**: Soil moisture is at **${moisture}%** with **${rain}mm rain** expected. Artificial irrigation is not needed for the next 48 hours.\n2. **Rainwater Harvesting**: Route field runoff into farm ponds or water pans for upcoming dry spells.\n3. **Mulching**: Apply crop residue mulch around roots to retain soil moisture during sunny periods.`;
    quickActions = [
      `When should I resume watering?`,
      `Low-cost drip irrigation setups?`,
      `Soil moisture test without equipment?`,
    ];
  } else if (
    qLower.includes('cow') ||
    qLower.includes('cattle') ||
    qLower.includes('livestock') ||
    qLower.includes('milk') ||
    qLower.includes('animal')
  ) {
    replyText = `### 🐄 Livestock Health & Fodder Advisory\n\n1. **Heat & Shelter**: Ensure shaded loafing sheds with clean drinking water supplemented with mineral salts.\n2. **Tick Prevention**: Perform weekly tick checks on ears and dewlap. Spray acaricides as recommended.\n3. **Fodder Security**: Harvest excess Napier grass or fodder crops before heavy rain and store in silage bags or pits.`;
    quickActions = [
      `How to prepare Napier silage in bags?`,
      `Preventing East Coast Fever in cattle?`,
      `Boosting milk yield during weather changes?`,
    ];
  } else {
    replyText = `Based on your farm profile (${farmName}, ${crop}) and micro-climate forecast (${temp}°C, ${rain}mm rain, ${moisture}% soil moisture):\n\n1. **Field Routine**: Check drainage channels around the field to prevent waterlogging.\n2. **Pest Scouting**: Inspect leaf undersides for early signs of fungal rust or insect feeding.\n3. **Nutrient Protection**: Postpone top-dressing until rainfall stabilizes.`;
  }

  return { reply: replyText, quickActions };
}
