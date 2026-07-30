import express from 'express';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_FARMS,
  INITIAL_WEATHER,
  INITIAL_RECOMMENDATIONS,
  INITIAL_REPORTS,
  INITIAL_DISEASE_PREDICTIONS,
  INITIAL_MARKET_PRICES,
  INITIAL_NOTIFICATIONS,
} from '../src/data/mockData';
import { CommunityReport, Farm, Recommendation } from '../src/types';

const app = express();
app.use(express.json({ limit: '10mb' }));

// Helper to create Gemini Client safely when API key is available
function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) return null;
  return new GoogleGenAI({
    apiKey: apiKey.trim(),
  });
}

// In-memory data stores
let farmsStore: Farm[] = [...INITIAL_FARMS];
let reportsStore: CommunityReport[] = [...INITIAL_REPORTS];
let recommendationsStore: Recommendation[] = [...INITIAL_RECOMMENDATIONS];

// Health endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'AgriShield Vercel API', time: new Date().toISOString() });
});

// Role Access Check
app.post('/api/roles/access-check', (req, res) => {
  const { role, userEmail } = req.body;
  const allowedRoles = ['farmer', 'extension_officer', 'ngo', 'admin'];

  if (!role || !allowedRoles.includes(role)) {
    return res.status(403).json({ allowed: false, message: 'Invalid or missing user role' });
  }

  const permissions: Record<string, string[]> = {
    farmer: ['read:farms', 'write:farms', 'read:weather', 'read:advisory', 'read:markets'],
    extension_officer: ['read:farms', 'write:broadcast', 'write:advisory', 'read:reports', 'write:reports'],
    ngo: ['read:gis', 'read:vulnerability', 'read:reports', 'read:simulations', 'export:impact'],
    admin: ['read:all', 'write:all', 'manage:users', 'manage:system', 'manage:database'],
  };

  res.json({
    allowed: true,
    role,
    userEmail,
    grantedPermissions: permissions[role] || [],
    timestamp: new Date().toISOString(),
  });
});

// Weather Endpoint
app.get('/api/weather', async (req, res) => {
  const lat = parseFloat(req.query.lat as string) || -0.1732;
  const lng = parseFloat(req.query.lng as string) || 35.8643;

  try {
    const openMeteoUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max&timezone=auto`;
    const response = await fetch(openMeteoUrl, { signal: AbortSignal.timeout(4000) });

    if (response.ok) {
      const data = await response.json();
      const currentTemp = Math.round((data.current?.temperature_2m ?? 24.5) * 10) / 10;
      const humidity = Math.round(data.current?.relative_humidity_2m ?? 76);
      const rainCurrent = Math.round((data.current?.precipitation ?? 12) * 10) / 10;
      const windSpeed = Math.round((data.current?.wind_speed_10m ?? 18) * 10) / 10;

      const dailyDays = data.daily?.time || [];
      const forecast = dailyDays.slice(0, 7).map((dStr: string, idx: number) => {
        const dObj = new Date(dStr);
        const dayName = idx === 0 ? 'Today' : dObj.toLocaleDateString('en-US', { weekday: 'short' });
        const tempMax = Math.round(data.daily?.temperature_2m_max?.[idx] ?? 26);
        const tempMin = Math.round(data.daily?.temperature_2m_min?.[idx] ?? 15);
        const precMm = Math.round((data.daily?.precipitation_sum?.[idx] ?? 5) * 10) / 10;
        const precProb = Math.round(data.daily?.precipitation_probability_max?.[idx] ?? 40);

        return {
          date: dStr,
          dayName,
          tempMax,
          tempMin,
          precipitationMm: precMm,
          precipitationProb: precProb,
          humidity: Math.min(98, Math.max(40, humidity + (idx % 2 === 0 ? 5 : -5))),
          windSpeedKmH: Math.round(windSpeed + idx * 0.8),
          uvIndex: Math.round(data.daily?.uv_index_max?.[idx] ?? 8),
          condition: precMm > 25 ? 'Heavy Downpour' : precMm > 5 ? 'Scattered Showers' : 'Sunny & Clear',
          iconName: precMm > 25 ? 'cloud-rain' : precMm > 5 ? 'cloud-drizzle' : 'sun',
        };
      });

      return res.json({
        currentTemp,
        tempMin: forecast[0]?.tempMin || 15.2,
        tempMax: forecast[0]?.tempMax || 28.8,
        humidity,
        rainfallMm: forecast[0]?.precipitationMm || 38.4,
        rainfallProb: forecast[0]?.precipitationProb || 85,
        windSpeedKmH: windSpeed,
        uvIndex: data.daily?.uv_index_max?.[0] || 8,
        soilMoisturePercent: Math.min(95, Math.round(50 + ((forecast[0]?.precipitationMm || 12) * 0.8))),
        rainRiskLevel: (forecast[0]?.precipitationMm || 12) > 25 ? 'High' : 'Medium',
        heatStressLevel: currentTemp > 32 ? 'High' : 'Low',
        droughtProbability: (forecast[0]?.precipitationProb || 85) < 20 ? 65 : 18,
        floodProbability: (forecast[0]?.precipitationMm || 12) > 30 ? 72 : 25,
        frostRiskLevel: 'None',
        forecast,
      });
    }
  } catch (err) {
    console.log('OpenMeteo fallback:', err);
  }

  res.json(INITIAL_WEATHER);
});

// AI Assistant Route
app.post('/api/gemini/assistant', async (req, res) => {
  const { farm, question, weather, recentReports, chatHistory } = req.body;

  const farmContext = farm
    ? `Farm Name: ${farm.name}, Location: ${farm.locationName}, Crop: ${farm.cropType}, Livestock: ${farm.livestockType || 'None'}, Stage: ${farm.growthStage}.`
    : 'Default Shamba in Kenya.';

  const weatherContext = weather
    ? `Temp: ${weather.currentTemp}°C, Humidity: ${weather.humidity}%, Rainfall: ${weather.rainfallMm}mm (${weather.rainfallProb}% chance), Soil Moisture: ${weather.soilMoisturePercent}%.`
    : 'Heavy rain expected tomorrow.';

  const systemInstruction = `You are AgriShield AI Advisor, an expert climate resilience agronomist and livestock extension officer.
Provide practical advice to smallholder farmers covering crops and livestock.
Context:
${farmContext}
${weatherContext}`;

  const aiClient = getAiClient();
  if (aiClient) {
    const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.5-pro'];
    for (const mName of modelsToTry) {
      try {
        const response = await aiClient.models.generateContent({
          model: mName,
          contents: `Question: "${question}"`,
          config: { systemInstruction, temperature: 0.7 },
        });

        if (response && response.text) {
          return res.json({
            reply: response.text,
            quickActions: [
              `Should I irrigate my ${farm?.cropType || 'crops'} today?`,
              `How to prevent Fall Armyworm?`,
              `When to top-dress fertilizer given upcoming rain?`,
            ],
          });
        }
      } catch (err) {
        console.warn(`Gemini Vercel model ${mName} error:`, err);
      }
    }
  }

  // Fallback if AI key not provided on Vercel environment
  const crop = farm?.cropType || 'Maize';
  const rain = weather?.rainfallMm || 12;
  const temp = weather?.currentTemp || 25;

  res.json({
    reply: `### 🌾 AgriShield AI Advisory for ${crop}\n\n• **Forecast**: ${temp}°C with ${rain}mm expected rain.\n• **Pest Advisory**: High humidity increases Fall Armyworm risk. Scout whorls early morning.\n• **Fertilizer**: Delay CAN top-dressing until heavy rain subsides to avoid nutrient leaching.\n• **Drainage**: Ensure field runoff channels are clear.`,
    quickActions: [
      `Should I harvest early before rain?`,
      `How to protect ${crop} from armyworms?`,
      `Best top-dressing timing for ${crop}?`,
    ],
  });
});

// Standard REST endpoints for Vercel
app.get('/api/farms', (req, res) => res.json(farmsStore));
app.get('/api/reports', (req, res) => res.json(reportsStore));
app.get('/api/recommendations', (req, res) => res.json(recommendationsStore));
app.get('/api/disease-predictions', (req, res) => res.json(INITIAL_DISEASE_PREDICTIONS));
app.get('/api/markets', (req, res) => res.json(INITIAL_MARKET_PRICES));

export default app;
