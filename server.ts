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
      category: req.body.category || 'mixed',
      locationName: req.body.locationName || 'Nakuru District',
      country: req.body.country || 'Kenya',
      county: req.body.county || 'Nakuru',
      lat: req.body.lat || -0.1732,
      lng: req.body.lng || 35.8643,
      areaHectares: req.body.areaHectares || 1.5,
      cropType: req.body.cropType || 'Maize',
      livestockType: req.body.livestockType || 'Dairy Cattle',
      headCount: req.body.headCount || 8,
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
      livestockHealthScore: 88,
      thiIndex: 72,
      waterRequirementLitersPerDay: 180,
      forageAvailabilityPercent: 85,
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
      ? `Farm Name: ${farm.name}, Location: ${farm.locationName}, Category: ${farm.category || 'mixed'}, Crop: ${farm.cropType}, Livestock: ${farm.livestockType || 'None'} (Head Count: ${farm.headCount || 'N/A'}), Growth/Production Stage: ${farm.growthStage}, Soil/Pasture: ${farm.soilType}, Irrigation/Water: ${farm.irrigationMethod}, Size: ${farm.areaHectares} ha, THI Index: ${farm.thiIndex || 'Normal'}.`
      : 'Default Mixed Agricultural & Livestock Shamba in Uasin Gishu / Nakuru, Kenya.';

    const weatherContext = weather
      ? `Current Temp: ${weather.currentTemp}°C, Humidity: ${weather.humidity}%, Rainfall: ${weather.rainfallMm}mm (${weather.rainfallProb}% chance today), Soil Moisture: ${weather.soilMoisturePercent}%, Livestock THI: ${weather.livestockThi || 72}.`
      : 'Heavy rain expected tomorrow (38mm, 85% prob), humidity 78%, THI 74.5.';

    const reportsContext = recentReports && recentReports.length > 0
      ? recentReports.slice(0, 3).map((r: CommunityReport) => `- ${r.reportType} report on ${r.cropAffected} (${r.severity} severity, ${r.distanceKm}km away): ${r.description}`).join('\n')
      : 'Nearby reports: East Coast Fever ticks reported 1.8km away; Fall Armyworm larvae reported 1.2km away.';

    const systemInstruction = `You are AgriShield AI, an expert climate resilience agronomist and veterinary extension officer for the Climate Tech for Resilient Communities Hackathon 2026 (EldoHub & Tech for Good).
You advise smallholder farmers on BOTH Crop Agriculture (Maize, Sorghum, Horticulture, Napier grass) AND Animal Livestock Keeping (Dairy Cattle, Goats, Poultry, Apiculture).

KEY ADVISORY CAPABILITIES:
- Crop agronomy (planting timing, pest/disease mitigation, irrigation, rain harvest).
- Livestock keeping & animal health (Heat Stress THI management, shade structures, electrolyte water, tick/vector-borne diseases like East Coast Fever, Rift Valley Fever, Mastitis, vaccination schedules).
- Climate-smart pasture & fodder management (Napier silage pit making, hay storage, water trough hygiene).

RULES:
- Address the farmer respectfully and concisely.
- Provide step-by-step guidance on timing, dosages, and climate adaptation.
- Always explain the *why* (e.g. linking high humidity + high temp to THI heat stress or fungal spore/tick proliferation).
- Provide 2-3 actionable bullet points at the end.

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

      const replyText = response.text || "I'm reviewing your farm and livestock conditions. Deploy shade covers for dairy cows and inspect leaf whorls for pests before upcoming heavy rain.";

      const quickActions = [
        `How do I protect my ${farm?.livestockType ? 'livestock herd' : 'crops'} during heatwaves?`,
        `How do I preserve Napier grass into silage before flooding?`,
        `What are current milk & grain market prices?`,
      ];

      res.json({ reply: replyText, quickActions });
    } catch (err) {
      console.error('Gemini Assistant API Error:', err);
      res.json({
        reply: `Hello! Based on your farm profile (${farm?.cropType || 'Maize'}, ${farm?.livestockType || 'Dairy Cattle'}, ${farm?.growthStage || 'Lactation / Growth stage'}) and today's weather forecast (${weather?.rainfallMm || 38.4}mm rain, THI ${weather?.livestockThi || 74.5}):\n\n1. **Livestock Heat Stress & Water**: THI exceeds 72. Provide shaded loafing sheds and clean electrolyte water for dairy cows.\n2. **Fodder Preservation**: Chop and pit ensile mature Napier grass before expected 38mm downpours.\n3. **Pest & Vector Checks**: Spray cattle against East Coast Fever ticks and check crop leaves for armyworm.`,
        quickActions: ['How to mitigate THI heat stress?', 'Fodder silage preservation', 'Milk & Market price updates'],
      });
    }
  });

  // AI Smart Recommendation Engine Endpoint
  app.post('/api/gemini/recommendations', async (req, res) => {
    const { farm, weather, nearbyReports } = req.body;

    const systemInstruction = `You are AgriShield AI's Decision Recommendation Generator for Climate-Smart Agriculture & Livestock Keeping (EldoHub Hackathon 2026).
Analyze farm data, weather forecast, and community pest/livestock reports.
Return 3 personalized, actionable climate risk recommendations in valid JSON array format.
Cover BOTH crops AND livestock where applicable (e.g., THI shade management, silage making, tick control, planting delays).`;

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
                actionType: { type: Type.STRING, description: "One of: 'irrigation', 'planting', 'harvest', 'pest_control', 'fertilizer', 'crop_switch', 'livestock_shelter', 'fodder_preservation', 'vaccination', 'pasture_rotation', 'water_management'" },
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
