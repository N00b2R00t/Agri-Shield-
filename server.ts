import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI, Type } from '@google/genai';
import {
  INITIAL_FARMS,
  INITIAL_WEATHER,
  INITIAL_RECOMMENDATIONS,
  INITIAL_REPORTS,
  INITIAL_DISEASE_PREDICTIONS,
  INITIAL_MARKET_PRICES,
  INITIAL_NOTIFICATIONS,
} from './src/data/mockData';
import { CommunityReport, Farm, Recommendation } from './src/types';

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// In-memory data store for stateful operations
let farmsStore: Farm[] = [...INITIAL_FARMS];
let reportsStore: CommunityReport[] = [...INITIAL_REPORTS];
let recommendationsStore: Recommendation[] = [...INITIAL_RECOMMENDATIONS];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', service: 'AgriShield AI Engine', time: new Date().toISOString() });
  });

  // Weather Endpoint with Open-Meteo Integration
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
          const uv = Math.round(data.daily?.uv_index_max?.[idx] ?? 8);
          
          let condition = 'Partly Cloudy';
          let iconName = 'cloud-sun';
          if (precMm > 25) { condition = 'Heavy Downpour'; iconName = 'cloud-rain'; }
          else if (precMm > 5) { condition = 'Scattered Showers'; iconName = 'cloud-drizzle'; }
          else if (precProb < 20) { condition = 'Sunny & Clear'; iconName = 'sun'; }

          return {
            date: dStr,
            dayName,
            tempMax,
            tempMin,
            precipitationMm: precMm,
            precipitationProb: precProb,
            humidity: Math.min(98, Math.max(40, humidity + (idx % 2 === 0 ? 5 : -5))),
            windSpeedKmH: Math.round(windSpeed + (idx * 0.8)),
            uvIndex: uv,
            condition,
            iconName,
          };
        });

        const todayProb = forecast[0]?.precipitationProb || 85;
        const todayMm = forecast[0]?.precipitationMm || 38.4;

        return res.json({
          currentTemp,
          tempMin: forecast[0]?.tempMin || 15.2,
          tempMax: forecast[0]?.tempMax || 28.8,
          humidity,
          rainfallMm: todayMm,
          rainfallProb: todayProb,
          windSpeedKmH: windSpeed,
          uvIndex: data.daily?.uv_index_max?.[0] || 8,
          soilMoisturePercent: Math.min(95, Math.round(50 + (todayMm * 0.8))),
          rainRiskLevel: todayMm > 25 ? 'High' : todayMm > 10 ? 'Medium' : 'Low',
          heatStressLevel: currentTemp > 32 ? 'High' : currentTemp > 28 ? 'Moderate' : 'Low',
          droughtProbability: todayProb < 20 ? 65 : 18,
          floodProbability: todayMm > 30 ? 72 : 25,
          frostRiskLevel: 'None',
          forecast,
        });
      }
    } catch (err) {
      console.log('Open-Meteo API fallback activated:', err);
    }

    // Fallback if Open-Meteo times out or fails
    res.json(INITIAL_WEATHER);
  });

  // Farms CRUD
  app.get('/api/farms', (req, res) => {
    res.json(farmsStore);
  });

  app.post('/api/farms', (req, res) => {
    const newFarm: Farm = {
      id: `farm-${Date.now()}`,
      userId: req.body.userId || 'usr-001',
      name: req.body.name || 'My New Farm',
      locationName: req.body.locationName || 'Nakuru District',
      country: req.body.country || 'Kenya',
      county: req.body.county || 'Nakuru',
      lat: req.body.lat || -0.1732,
      lng: req.body.lng || 35.8643,
      areaHectares: req.body.areaHectares || 1.5,
      cropType: req.body.cropType || 'Maize',
      plantingDate: req.body.plantingDate || new Date().toISOString().split('T')[0],
      growthStage: req.body.growthStage || 'Vegetative / Early Growth',
      irrigationMethod: req.body.irrigationMethod || 'Rainfed',
      soilType: req.body.soilType || 'Loam',
      boundaryCoordinates: req.body.boundaryCoordinates || [
        [req.body.lat - 0.001, req.body.lng - 0.001],
        [req.body.lat - 0.001, req.body.lng + 0.001],
        [req.body.lat + 0.001, req.body.lng + 0.001],
        [req.body.lat + 0.001, req.body.lng - 0.001],
      ],
      riskScore: Math.floor(Math.random() * 40) + 30,
      cropHealthScore: Math.floor(Math.random() * 20) + 75,
    };
    farmsStore.push(newFarm);
    res.status(201).json(newFarm);
  });

  app.put('/api/farms/:id', (req, res) => {
    const idx = farmsStore.findIndex((f) => f.id === req.params.id);
    if (idx !== -1) {
      farmsStore[idx] = { ...farmsStore[idx], ...req.body };
      return res.json(farmsStore[idx]);
    }
    res.status(404).json({ error: 'Farm not found' });
  });

  // Community Reports CRUD
  app.get('/api/reports', (req, res) => {
    res.json(reportsStore);
  });

  app.post('/api/reports', (req, res) => {
    const newReport: CommunityReport = {
      id: `rep-${Date.now()}`,
      userId: req.body.userId || 'usr-001',
      userName: req.body.userName || 'Samuel Kiprop',
      farmName: req.body.farmName || 'Green Valley Farm',
      reportType: req.body.reportType || 'pest',
      cropAffected: req.body.cropAffected || 'Maize',
      severity: req.body.severity || 'high',
      description: req.body.description || 'Observed signs of pest damage on foliage.',
      photoUrl: req.body.photoUrl,
      lat: req.body.lat || -0.1732,
      lng: req.body.lng || 35.8643,
      createdAt: new Date().toISOString(),
      verified: true,
      upvotes: 1,
      distanceKm: 0.8,
    };
    reportsStore.unshift(newReport);
    res.status(201).json(newReport);
  });

  app.post('/api/reports/:id/upvote', (req, res) => {
    const r = reportsStore.find((rep) => rep.id === req.params.id);
    if (r) {
      r.upvotes += 1;
      return res.json(r);
    }
    res.status(404).json({ error: 'Report not found' });
  });

  app.post('/api/reports/:id/verify', (req, res) => {
    const r = reportsStore.find((rep) => rep.id === req.params.id);
    if (r) {
      r.verified = true;
      return res.json(r);
    }
    res.status(404).json({ error: 'Report not found' });
  });

  // Disease Predictions & Markets
  app.get('/api/disease-predictions', (req, res) => {
    res.json(INITIAL_DISEASE_PREDICTIONS);
  });

  app.get('/api/markets', (req, res) => {
    res.json(INITIAL_MARKET_PRICES);
  });

  app.get('/api/notifications', (req, res) => {
    res.json(INITIAL_NOTIFICATIONS);
  });

  // Recommendations
  app.get('/api/recommendations', (req, res) => {
    res.json(recommendationsStore);
  });

  // AI Assistant Chatbot Endpoint
  app.post('/api/gemini/assistant', async (req, res) => {
    const { farm, question, weather, recentReports, chatHistory } = req.body;

    const farmContext = farm
      ? `Farm Name: ${farm.name}, Location: ${farm.locationName}, Crop: ${farm.cropType}, Growth Stage: ${farm.growthStage}, Soil: ${farm.soilType}, Irrigation: ${farm.irrigationMethod}, Size: ${farm.areaHectares} ha.`
      : 'Default Smallholder Maize Farm in Nakuru, Kenya (2.5 ha).';

    const weatherContext = weather
      ? `Current Temp: ${weather.currentTemp}°C, Humidity: ${weather.humidity}%, Rainfall: ${weather.rainfallMm}mm (${weather.rainfallProb}% chance today), Soil Moisture: ${weather.soilMoisturePercent}%.`
      : 'Heavy rain expected tomorrow (38mm, 85% prob), humidity 76%.';

    const reportsContext = recentReports && recentReports.length > 0
      ? recentReports.slice(0, 3).map((r: CommunityReport) => `- ${r.reportType} report on ${r.cropAffected} (${r.severity} severity, ${r.distanceKm}km away): ${r.description}`).join('\n')
      : 'Nearby reports: Fall Armyworm larvae reported 2.1km away on Maize.';

    const systemInstruction = `You are AgriShield AI, a world-class tropical agronomist, climate resilience scientist, and extension advisor for smallholder farmers.
You provide clear, practical, empathetic, and scientifically grounded advice tailored specifically to the farmer's location, crop stage, weather forecast, and nearby pest/disease reports.

RULES:
- Address the farmer respectfully and concisely.
- Use simple agricultural terms (explain technical terms clearly).
- Give exact step-by-step guidance on timing (e.g. "Wait 3 days", "Spray before 8:00 AM", "Apply 50kg/ha top-dressing").
- Always explain the *why* (e.g., link heavy rainfall to seed washout or fungal spore germination).
- Highlight safety and sustainability (organic neem, biological controls, proper drainage).
- Provide 2-3 short, actionable bullet points at the end.

CURRENT FARM CONTEXT:
${farmContext}

WEATHER CONTEXT:
${weatherContext}

COMMUNITY REPORTS CONTEXT:
${reportsContext}`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: [
          { role: 'user', parts: [{ text: `Question from farmer: "${question}"` }] },
        ],
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const replyText = response.text || "I'm reviewing your farm conditions. Based on expected rain, delay planting and clear drainage paths to protect your topsoil.";

      const quickActions = [
        `Should I irrigate my ${farm?.cropType || 'crops'} today?`,
        `How do I protect against Fall Armyworm?`,
        `When is the best market day to sell?`,
      ];

      res.json({ reply: replyText, quickActions });
    } catch (err) {
      console.error('Gemini Assistant API Error:', err);
      res.json({
        reply: `Hello! Based on your farm profile (${farm?.cropType || 'Maize'}, ${farm?.growthStage || 'Vegetative stage'}) and today's weather forecast (${weather?.rainfallMm || 38.4}mm rain, ${weather?.humidity || 76}% humidity):\n\n1. **Delay Planting/Irrigation**: High soil moisture and upcoming heavy downpours increase seed washout risk.\n2. **Inspect Foliage**: High humidity favors fungal spores. Check lower leaves for spots.\n3. **Prepare Drainage**: Ensure farm perimeter trenches are clear to handle surface runoff.`,
        quickActions: ['Should I irrigate today?', 'Pest outbreak advice', 'Market price recommendations'],
      });
    }
  });

  // AI Smart Recommendation Engine Endpoint
  app.post('/api/gemini/recommendations', async (req, res) => {
    const { farm, weather, nearbyReports } = req.body;

    const systemInstruction = `You are AgriShield AI's Decision Recommendation Generator. Analyze the provided farm data, weather forecast, and nearby community pest reports. Return 3 personalized, highly actionable climate risk recommendations in valid JSON array format. Each object must strictly match the schema specified.`;

    const promptText = `Farm: ${JSON.stringify(farm || {})}\nWeather: ${JSON.stringify(weather || {})}\nReports: ${JSON.stringify(nearbyReports || [])}`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: promptText,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                farmId: { type: Type.STRING },
                title: { type: Type.STRING },
                actionType: { type: Type.STRING, description: "One of: 'irrigation', 'planting', 'harvest', 'pest_control', 'fertilizer', 'crop_switch'" },
                priority: { type: Type.STRING, description: "One of: 'high', 'medium', 'low'" },
                summary: { type: Type.STRING },
                reason: { type: Type.STRING },
                confidenceScore: { type: Type.INTEGER },
                supportingData: { type: Type.ARRAY, items: { type: Type.STRING } },
                potentialImpact: { type: Type.STRING },
                suggestedActionSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
                status: { type: Type.STRING, description: "'pending'" },
                createdAt: { type: Type.STRING },
              },
              required: ['title', 'actionType', 'priority', 'summary', 'reason', 'confidenceScore', 'supportingData', 'potentialImpact', 'suggestedActionSteps'],
            },
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json(parsed);
      }
    } catch (err) {
      console.error('Gemini Recommendations Error:', err);
    }

    res.json(recommendationsStore);
  });

  // What-If Scenario Simulator Endpoint
  app.post('/api/gemini/whatif', async (req, res) => {
    const { farm, input } = req.body;

    const promptText = `Farm Context: ${farm?.name || 'Green Valley Farm'}, Crop: ${input?.cropType || farm?.cropType || 'Maize'}, Area: ${farm?.areaHectares || 2.5} ha, Soil: ${farm?.soilType || 'Loam'}, Irrigation: ${farm?.irrigationMethod || 'Rainfed'}.
Simulation Variables:
- Planting Date Shift: ${input?.plantingDateOffsetDays || 0} days
- Irrigation Adjustment: ${input?.irrigationLevelPercent || 100}%
- Fertilizer Rate: ${input?.fertilizerKgPerHa || 50} kg/ha
- Weather Scenario: ${input?.expectedWeatherScenario || 'normal'}`;

    const systemInstruction = `You are AgriShield AI's What-If Agricultural Risk Simulator. Estimate agricultural outcomes under hypothetical management shifts and climate scenarios. Return a valid JSON object matching the requested schema.`;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: promptText,
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              expectedYieldTonsPerHa: { type: Type.NUMBER },
              yieldChangePercent: { type: Type.NUMBER },
              diseaseRiskPercent: { type: Type.NUMBER },
              profitEstimateUSD: { type: Type.NUMBER },
              profitChangeUSD: { type: Type.NUMBER },
              waterUsageLiters: { type: Type.NUMBER },
              carbonFootprintKgCo2: { type: Type.NUMBER },
              aiExplanation: { type: Type.STRING },
              keyRecommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: [
              'expectedYieldTonsPerHa',
              'yieldChangePercent',
              'diseaseRiskPercent',
              'profitEstimateUSD',
              'profitChangeUSD',
              'waterUsageLiters',
              'carbonFootprintKgCo2',
              'aiExplanation',
              'keyRecommendations',
            ],
          },
        },
      });

      if (response.text) {
        const parsed = JSON.parse(response.text.trim());
        return res.json(parsed);
      }
    } catch (err) {
      console.error('Gemini What-If Simulation Error:', err);
    }

    // Fallback analytical calculation
    const offset = input?.plantingDateOffsetDays || 0;
    const fert = input?.fertilizerKgPerHa || 50;
    const scenario = input?.expectedWeatherScenario || 'normal';

    let baseYield = 3.8;
    let yieldMod = 0;
    let diseaseRisk = 35;
    let waterUsage = 420000;

    if (scenario === 'severe_drought') {
      yieldMod -= 40;
      diseaseRisk -= 15;
      waterUsage -= 120000;
    } else if (scenario === 'heavy_flooding') {
      yieldMod -= 25;
      diseaseRisk += 35;
      waterUsage += 200000;
    } else if (scenario === 'heatwave') {
      yieldMod -= 20;
      diseaseRisk += 10;
    }

    if (offset > 0 && offset <= 5) yieldMod += 15; // Optimal delay avoids rain washout
    if (offset < 0) yieldMod -= 10;

    if (fert > 60) yieldMod += 8;

    const finalYield = Math.max(0.5, Math.round((baseYield * (1 + yieldMod / 100)) * 10) / 10);
    const profitEst = Math.round(finalYield * 350 * (farm?.areaHectares || 2.5));

    res.json({
      expectedYieldTonsPerHa: finalYield,
      yieldChangePercent: yieldMod,
      diseaseRiskPercent: Math.min(95, Math.max(10, diseaseRisk)),
      profitEstimateUSD: profitEst,
      profitChangeUSD: Math.round(profitEst * (yieldMod / 100)),
      waterUsageLiters: waterUsage,
      carbonFootprintKgCo2: Math.round(fert * 2.8 * (farm?.areaHectares || 2.5)),
      aiExplanation: `Shifting planting by ${offset} days under a ${scenario.replace('_', ' ')} scenario modifies crop exposure during sensitive germination phases. Higher fertilizer increases biomass yield but requires adequate soil moisture to avoid nutrient burn.`,
      keyRecommendations: [
        `Ensure soil moisture is above 50% prior to fertilizer top-dressing.`,
        `Monitor for fungal leaf spots under high moisture conditions.`,
        `Consider mulching to conserve water during dry spells.`,
      ],
    });
  });

  // Vite Dev Middleware or Static Production Serving
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🌾 AgriShield AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
