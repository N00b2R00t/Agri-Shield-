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

// Helper to create Gemini Client safely when API key is available
function getAiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || !apiKey.trim()) return null;
  return new GoogleGenAI({
    apiKey: apiKey.trim(),
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

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

  // Role Access & Authorization Check Endpoint
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

  // Role Broadcast Endpoint
  app.post('/api/roles/broadcast', (req, res) => {
    const { senderRole, title, message, severity, targetCounty } = req.body;

    if (senderRole !== 'extension_officer' && senderRole !== 'admin') {
      return res.status(403).json({ error: 'Only Extension Officers and Admins can issue broadcasts' });
    }

    const newNotification = {
      id: `notif-${Date.now()}`,
      title: title || 'Emergency Broadcast Alert',
      type: 'weather_warning',
      severity: severity || 'warning',
      message: message || 'Please take precautions for current field conditions.',
      timestamp: 'Just now',
      read: false,
    };

    res.status(201).json({
      success: true,
      notification: newNotification,
      broadcastTarget: targetCounty || 'All Registered Farmers',
    });
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
      // Helper function to format chat history for Gemini (ensures alternating user/model roles starting with user)
      const formatGeminiContents = (history: any[], currentQuestion: string) => {
        const contents: Array<{ role: 'user' | 'model'; parts: Array<{ text: string }> }> = [];

        if (Array.isArray(history)) {
          for (const msg of history) {
            if (!msg || !msg.text) continue;
            const role = msg.sender === 'user' ? 'user' : 'model';
            if (contents.length > 0 && contents[contents.length - 1].role === role) {
              contents[contents.length - 1].parts[0].text += `\n${msg.text}`;
            } else {
              contents.push({ role, parts: [{ text: msg.text }] });
            }
          }
        }

        // Gemini contents MUST start with 'user'
        while (contents.length > 0 && contents[0].role === 'model') {
          contents.shift();
        }

        if (contents.length > 0 && contents[contents.length - 1].role === 'user') {
          contents[contents.length - 1].parts[0].text += `\nQuestion from farmer: "${currentQuestion}"`;
        } else {
          contents.push({ role: 'user', parts: [{ text: `Question from farmer: "${currentQuestion}"` }] });
        }

        return contents;
      };

      const geminiContents = formatGeminiContents(chatHistory, question);

      // Try multiple model aliases in order of preference
      const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.5-pro'];
      let geminiResponse: any = null;
      let lastError: any = null;

      const aiClient = getAiClient();
      if (aiClient) {
        for (const mName of modelsToTry) {
          try {
            geminiResponse = await aiClient.models.generateContent({
              model: mName,
              contents: geminiContents,
              config: {
                systemInstruction,
                temperature: 0.7,
              },
            });
            if (geminiResponse && geminiResponse.text) {
              break;
            }
          } catch (mErr: any) {
            lastError = mErr;
            console.warn(`Gemini model ${mName} attempt failed:`, mErr?.message || mErr);
          }
        }
      }

      if (geminiResponse && geminiResponse.text) {
        const quickActions = [
          `Should I irrigate my ${farm?.cropType || 'crops'} today?`,
          `How to prevent Fall Armyworm infestations?`,
          `When to top-dress fertilizer given upcoming rain?`,
        ];
        return res.json({ reply: geminiResponse.text, quickActions });
      } else {
        if (lastError) console.error('Gemini Assistant API Error after retries:', lastError);
      }
    } catch (err) {
      console.error('Gemini Assistant unexpected handler error:', err);
    }

    // Smart contextual fallback generator if API key is missing, invalid, or API call failed
    const queryLower = (question || '').toLowerCase();
    const crop = farm?.cropType || 'Maize';
    const livestock = farm?.livestockType || 'Dairy Cattle';
    const rain = weather?.rainfallMm || 14.2;
    const moisture = weather?.soilMoisturePercent || 62;
    const temp = weather?.currentTemp || 25.4;

    let replyText = '';
    let fallbackQuickActions = [
      `Should I irrigate my ${crop} today?`,
      `How do I protect ${crop} from Fall Armyworm?`,
      `When to top-dress fertilizer given ${rain}mm rain?`,
    ];

    if (queryLower.includes('hi') || queryLower.includes('hello') || queryLower.includes('jambo') || queryLower.includes('hey')) {
      replyText = `Jambo! I am your AgriShield AI Agronomist. I'm actively monitoring your farm in ${farm?.locationName || 'Kenya'} (${crop}, ${farm?.growthStage || 'Active Season'}).\n\nToday's micro-climate summary: **${temp}°C**, **${rain}mm expected rain**, and soil moisture at **${moisture}%**.\n\nHow can I help you optimize your crop yields or protect your livestock today?`;
      fallbackQuickActions = [
        `Should I harvest early before the heavy rain?`,
        `How do I prevent pest infestations?`,
        `What is my farm's heat stress index?`,
      ];
    } else if (queryLower.includes('armyworm') || queryLower.includes('pest') || queryLower.includes('insect') || queryLower.includes('worm') || queryLower.includes('disease')) {
      replyText = `### 🐛 Fall Armyworm & Pest Risk Advisory for ${crop}\n\nWith humidity at **${weather?.humidity || 76}%** and nearby pest reports within 2.1 km, here is your immediate field protection plan:\n\n1. **Early Scouting**: Inspect leaf whorls of 20 consecutive plants in 5 different field sections. Look for window-pane feeding damage or fresh frass.\n2. **Biological & Chemical Control**: Apply neem oil extract or recommended IPM bio-pesticide (e.g. *Bacillus thuringiensis* or Emamectin Benzoate) early morning or late evening when larvae actively feed.\n3. **Rain Impact**: Since **${rain}mm of rain** is forecast, apply a rain-fast sticker/spreader to prevent pesticide wash-off.\n\n• **Action Items**: Clear weed harbors on field borders and avoid applying pesticide during active rainfall.`;
      fallbackQuickActions = [
        `What pesticide dosage is safe for ${crop}?`,
        `How to report a new pest outbreak to extension officers?`,
        `Is it safe to spray before rainfall?`,
      ];
    } else if (queryLower.includes('harvest') || queryLower.includes('cut') || queryLower.includes('pick') || queryLower.includes('downpour')) {
      replyText = `### 🌾 Harvest & Downpour Protection Plan for ${crop}\n\nWith **${rain}mm of rainfall** anticipated today (moisture level **${moisture}%**):\n\n1. **Early Harvest Readiness**: If your crop has reached physiological maturity (black layer visible on maize kernels), commence hand harvesting mature ears immediately to avoid grain molding and cob rot.\n2. **Post-Harvest Drying**: Do NOT leave harvested produce directly on open soil. Use raised drying tarpaulins or ventilated cribs elevated off the ground.\n3. **Field Drainage**: Dig perimeter interceptor ditches around low-lying field patches to redirect surface runoff away from standing crops.`;
      fallbackQuickActions = [
        `How to construct low-cost raised drying cribs?`,
        `What are current market prices for early harvest ${crop}?`,
        `How to prevent aflatoxin during wet harvests?`,
      ];
    } else if (queryLower.includes('fertilizer') || queryLower.includes('nitrogen') || queryLower.includes('top-dress') || queryLower.includes('topdress') || queryLower.includes('can') || queryLower.includes('dap')) {
      replyText = `### 🧪 Fertilizer & Top-Dressing Guidance for ${crop}\n\nGiven current soil moisture (**${moisture}%**) and expected rain (**${rain}mm**):\n\n1. **Timing Advisory**: Delay CAN/Urea top-dressing by 24–48 hours until heavy downpours subside. Applying fertilizer right before heavy rain causes severe nitrogen leaching into deeper subsoil.\n2. **Application Technique**: Band fertilizer 5–7 cm away from plant stems and lightly cover with soil to minimize volatilization.\n3. **Soil Conditions**: Ensure soil is moist but not waterlogged before top-dressing.`;
      fallbackQuickActions = [
        `How many kg of CAN fertilizer per acre for ${crop}?`,
        `Should I mix fertilizer with organic manure?`,
        `Signs of nitrogen deficiency in ${crop}?`,
      ];
    } else if (queryLower.includes('irrigate') || queryLower.includes('water') || queryLower.includes('dry') || queryLower.includes('drought')) {
      replyText = `### 💧 Irrigation & Water Management Strategy\n\nWith current soil moisture at **${moisture}%** and **${rain}mm of expected rainfall**:\n\n1. **Irrigation Schedule**: Hold off on artificial irrigation for the next 3 days. Soil moisture is currently adequate.\n2. **Rainwater Harvesting**: Direct farm runoff into farm ponds or underground water pans to store water for upcoming dry spells.\n3. **Mulching**: Apply crop residue mulch between rows to conserve soil moisture when sunny conditions return.`;
      fallbackQuickActions = [
        `When should I resume irrigation for ${crop}?`,
        `How to build a drip irrigation system on a small budget?`,
        `How to check soil moisture without sensors?`,
      ];
    } else if (queryLower.includes('livestock') || queryLower.includes('cow') || queryLower.includes('cattle') || queryLower.includes('milk') || queryLower.includes('thi') || queryLower.includes('heat')) {
      replyText = `### 🐄 Livestock Health & Heat Stress Advisory for ${livestock}\n\n1. **Heat Stress Control**: Maintain shaded loafing areas and provide cool, clean drinking water mixed with mineral salts.\n2. **Tick & Vector Prevention**: Inspect animals weekly for ticks around ears and udder. Spray with recommended acaricides.\n3. **Fodder Preservation**: Chop mature Napier grass and store in plastic silage bags or trench pits before heavy rain.`;
      fallbackQuickActions = [
        `How to make silage in plastic bags?`,
        `Symptoms of East Coast Fever in dairy cattle?`,
        `How to increase milk yield in warm weather?`,
      ];
    } else {
      replyText = `Based on your farm profile (${crop}, ${livestock}, ${farm?.growthStage || 'Active Season'}) and current micro-climate conditions (**${temp}°C**, **${rain}mm rain**, **${moisture}% soil moisture**):\n\n1. **Field Inspection**: Check field drainage channels to handle expected rain runoff.\n2. **Pest Monitoring**: Inspect crop foliage for early signs of Fall Armyworm or fungal leaf spots caused by high humidity (${weather?.humidity || 76}%).\n3. **Climate Action**: Hold off on fertilizer top-dressing until heavy rainfall eases to protect nutrient investments.`;
    }

    res.json({ reply: replyText, quickActions: fallbackQuickActions });
  });

  // AI Smart Recommendation Engine Endpoint
  app.post('/api/gemini/recommendations', async (req, res) => {
    const { farm, weather, nearbyReports } = req.body;

    const systemInstruction = `You are AgriShield AI's Decision Recommendation Generator for Climate-Smart Agriculture & Livestock Keeping (EldoHub Hackathon 2026).
Analyze farm data, weather forecast, and community pest/livestock reports.
Return 3 personalized, actionable climate risk recommendations in valid JSON array format.
Cover BOTH crops AND livestock where applicable (e.g., THI shade management, silage making, tick control, planting delays).`;

    const promptText = `Farm: ${JSON.stringify(farm || {})}\nWeather: ${JSON.stringify(weather || {})}\nReports: ${JSON.stringify(nearbyReports || [])}`;

    const aiClient = getAiClient();
    if (aiClient) {
      const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.5-pro'];
      for (const mName of modelsToTry) {
        try {
          const response = await aiClient.models.generateContent({
            model: mName,
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

          if (response && response.text) {
            const parsed = JSON.parse(response.text.trim());
            return res.json(parsed);
          }
        } catch (err) {
          console.warn(`Gemini Recommendations model ${mName} error:`, err);
        }
      }
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

    const aiClient = getAiClient();
    if (aiClient) {
      const modelsToTry = ['gemini-2.5-flash', 'gemini-1.5-flash', 'gemini-2.5-pro'];
      for (const mName of modelsToTry) {
        try {
          const response = await aiClient.models.generateContent({
            model: mName,
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

          if (response && response.text) {
            const parsed = JSON.parse(response.text.trim());
            return res.json(parsed);
          }
        } catch (err) {
          console.warn(`Gemini What-If model ${mName} error:`, err);
        }
      }
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
