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

  // Express Session & Multi-Device Control (1 Day Expiry = 24 * 60 * 60 * 1000 ms = 86400s)
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  const userDeviceSessions = new Map<string, { validDeviceId: string; sessions: Map<string, number> }>();

  app.post('/api/auth/session/create', (req, res) => {
    const { email, deviceId } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email required for session' });
    }

    const currentDevId = deviceId || `dev_${Math.random().toString(36).substring(2, 10)}_${Date.now()}`;
    const expiresAt = Date.now() + ONE_DAY_MS;

    let userStore = userDeviceSessions.get(email.toLowerCase());
    if (!userStore) {
      userStore = { validDeviceId: currentDevId, sessions: new Map() };
      userDeviceSessions.set(email.toLowerCase(), userStore);
    } else {
      userStore.validDeviceId = currentDevId;
    }

    userStore.sessions.set(currentDevId, expiresAt);

    res.json({
      success: true,
      sessionId: currentDevId,
      expiresAt,
      maxAgeSeconds: 86400,
      message: 'Express session created with 1 day duration (86400s)',
    });
  });

  app.post('/api/auth/change-password', (req, res) => {
    const { email, newPassword, currentDeviceId } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ error: 'Email and new password are required' });
    }

    const activeDevId = currentDeviceId || `dev_active_${Date.now()}`;
    const expiresAt = Date.now() + ONE_DAY_MS;

    const userStore = {
      validDeviceId: activeDevId,
      sessions: new Map<string, number>([[activeDevId, expiresAt]]),
    };
    userDeviceSessions.set(email.toLowerCase(), userStore);

    res.json({
      success: true,
      currentDeviceId: activeDevId,
      expiresAt,
      message: 'Password changed successfully. All other registered devices logged out.',
    });
  });

  app.post('/api/auth/session/validate', (req, res) => {
    const { email, deviceId, sessionExpiresAt } = req.body;
    if (!email) {
      return res.status(400).json({ valid: false, reason: 'Missing email' });
    }

    if (sessionExpiresAt && Date.now() > sessionExpiresAt) {
      return res.json({ valid: false, reason: 'Session expired after 1 day (24 hrs)' });
    }

    const userStore = userDeviceSessions.get(email.toLowerCase());
    if (userStore && deviceId) {
      if (userStore.validDeviceId && userStore.validDeviceId !== deviceId) {
        return res.json({
          valid: false,
          reason: 'Password changed on another device. This device was logged out for security.',
        });
      }
    }

    res.json({ valid: true, expiresAt: sessionExpiresAt || (Date.now() + ONE_DAY_MS) });
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
      const modelsToTry = ['gemini-3.6-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
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

    // Comprehensive list of Swahili & English greetings
    const greetingKeywords = [
      'hi', 'hello', 'hey', 'jambo', 'habari', 'mambo', 'sasa', 'vipi', 'salama',
      'niaje', 'my man', 'bro', 'dude', 'good morning', 'good afternoon', 'good evening',
      'how are you', 'sup', 'what\'s up', 'whats up', 'howdy', 'greetings', 'asante', 'shukran'
    ];

    const isGreeting = greetingKeywords.some((kw) => queryLower.includes(kw)) || queryLower.length < 10;

    if (
      queryLower.includes('agrishield') ||
      queryLower.includes('agri-shield') ||
      queryLower.includes('what is agrishield') ||
      queryLower.includes('what does agrishield do') ||
      queryLower.includes('about agrishield') ||
      queryLower.includes('who built') ||
      queryLower.includes('who created') ||
      queryLower.includes('developer')
    ) {
      replyText = `### 🌾 About AgriShield AI Platform\n\n**AgriShield** is an intelligent climate resilience, early-warning, and decision-support platform designed for African smallholder farmers, extension officers, NGOs, and system admins.\n\n**Key Capabilities**:\n1. **AI Farm Advisory**: Personalized crop and livestock advice powered by Gemini AI and real-time Open-Meteo climate models.\n2. **Multi-Farm Plot Management**: Register multiple farm plots across all 47 Kenyan counties with custom crop types, growth stages, soil composition, and livestock count.\n3. **Community Outbreak Radar**: Crowdsourced pest and disease reports (e.g. Fall Armyworm, Locusts) with instant radius alerts.\n4. **What-If Climate Simulator**: Stress-test your plots against severe weather events (floods, heatwaves, droughts).\n5. **Market Intelligence**: Real-time wholesale crop prices across major Kenyan market hubs and post-harvest storage guidance.\n6. **Multi-Role Perspectives**: Tailored dashboards for Farmers, Field Extension Officers, NGO Specialists, and System Admins.\n\nDeveloped by **Ian Chirchir** to safeguard food security and empower smallholders against climate vulnerability!`;
      fallbackQuickActions = [
        `How do I register a new farm?`,
        `How to submit a pest outbreak report?`,
        `How to switch user roles?`,
      ];
    } else if (
      queryLower.includes('register farm') ||
      queryLower.includes('add farm') ||
      queryLower.includes('how to register') ||
      queryLower.includes('how to add farm') ||
      queryLower.includes('register a farm') ||
      queryLower.includes('new farm') ||
      queryLower.includes('create farm')
    ) {
      replyText = `### 🚜 How to Register & Manage Farms on AgriShield\n\nRegistering a farm plot unlocks hyper-local micro-climate monitoring and AI-driven crop & livestock advisory:\n\n1. **Step 1**: Click the **"+ Add New Farm"** button in the top navigation bar, the farm switcher dropdown, or the **My Farms** tab.\n2. **Step 2**: Enter your **Farm Name** (e.g. *Eldoret Pioneer Maize & Dairy Farm*).\n3. **Step 3**: Select your **County** (all 47 Kenya counties supported) and enter your sub-county/village.\n4. **Step 4**: Choose your **Farming Enterprise Type** (*Mixed Enterprise, Crops Only, or Livestock Only*).\n5. **Step 5**: Select your primary **Crop Type** (e.g., *Maize, Beans, Tea, Coffee, Wheat, Vegetables*), growth stage, soil type, irrigation method, and acreage.\n6. **Step 6**: If keeping animals, enter your **Livestock Type** (*Dairy Cattle, Goats, Poultry, Sheep*) and head count.\n7. **Step 7**: Click **"Save Farm Location"**. Your farm is immediately saved and actively analyzed by Gemini AI!\n\n*Tip*: You can register multiple farms and run AI analysis on each of them!`;
      fallbackQuickActions = [
        `How do I analyze my farm with AI?`,
        `How to report a pest outbreak on my farm?`,
        `What does AgriShield do?`,
      ];
    } else if (
      queryLower.includes('report outbreak') ||
      queryLower.includes('submit report') ||
      queryLower.includes('community report') ||
      queryLower.includes('outbreak radar') ||
      queryLower.includes('pest report')
    ) {
      replyText = `### 🐛 How to Submit a Community Outbreak Report\n\n1. **Step 1**: Click **"Report Outbreak"** in the top navigation bar or switch to the **Community Intel** tab.\n2. **Step 2**: Select the observed pest or disease type (*Fall Armyworm, Locusts, Maize Lethal Necrosis, Coffee Rust, Anthracnose, etc.*).\n3. **Step 3**: Select the affected crop and threat severity level (*Low, Medium, High, Critical*).\n4. **Step 4**: Provide field notes, description, and optional photo attachment.\n5. **Step 5**: Click **"Submit Community Outbreak Alert"**. Neighboring farmers and extension officers within a 25km radius will receive instant alerts on their pest radar!`;
      fallbackQuickActions = [
        `How to protect crops from Fall Armyworm?`,
        `How do extension officers verify reports?`,
        `How to register a farm?`,
      ];
    } else if (
      queryLower.includes('role') ||
      queryLower.includes('extension officer') ||
      queryLower.includes('ngo') ||
      queryLower.includes('switch role') ||
      queryLower.includes('change role') ||
      queryLower.includes('admin')
    ) {
      replyText = `### 🔒 AgriShield User Roles & Access Policy\n\nAgriShield offers 4 specialized role perspectives:\n\n1. **Smallholder Farmer**: Farm plot management, AI agronomy advice, fertilizer schedules, and market prices.\n2. **Extension Officer**: Regional farmer directory, field dispatch, pest outbreak verification, and farm visit logs.\n3. **NGO / Climate Specialist**: Regional GIS climate vulnerability analytics, drought indicator mapping, and community support tools.\n4. **Gov / System Admin**: User account management, database synchronization, system broadcast alerts, and market price updates.\n\n⚠️ **Role Change Policy**:\n- **Non-Admin Users**: Standard users cannot change their role directly.\n- **How to Request a Role Change**: To request a role upgrade or change, please contact System Admin (**Ian Kipkoech Chirchir**) directly via **WhatsApp Support (+254 143 791 311)** or through the in-app **Support** tab.\n- **System Admins**: Only authorized Admins can modify account role permissions.`;
      fallbackQuickActions = [
        `How to contact WhatsApp Support for role change?`,
        `How to register a new farm?`,
        `What does AgriShield do?`,
      ];
    } else if (isGreeting) {
      replyText = `Jambo / Habari yako! I am your AgriShield AI Agronomist. I'm actively monitoring your farm in ${farm?.locationName || 'Kenya'} (${crop}, ${livestock}).\n\nToday's micro-climate summary: **${temp}°C**, **${rain}mm expected rain**, and soil moisture at **${moisture}%**.\n\nHow can I help you optimize your crop yields, protect your livestock, or assist with AgriShield features today?`;
      fallbackQuickActions = [
        `What does AgriShield do?`,
        `How to register a new farm?`,
        `Should I harvest early before heavy rain?`,
      ];
    } else if (queryLower.includes('armyworm') || queryLower.includes('pest') || queryLower.includes('insect') || queryLower.includes('worm') || queryLower.includes('disease') || queryLower.includes('rust')) {
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
    } else if (queryLower.includes('fertilizer') || queryLower.includes('nitrogen') || queryLower.includes('top-dress') || queryLower.includes('topdress') || queryLower.includes('can') || queryLower.includes('dap') || queryLower.includes('manure')) {
      replyText = `### 🧪 Fertilizer & Top-Dressing Guidance for ${crop}\n\nGiven current soil moisture (**${moisture}%**) and expected rain (**${rain}mm**):\n\n1. **Timing Advisory**: Delay CAN/Urea top-dressing by 24–48 hours until heavy downpours subside. Applying fertilizer right before heavy rain causes severe nitrogen leaching into deeper subsoil.\n2. **Application Technique**: Band fertilizer 5–7 cm away from plant stems and lightly cover with soil to minimize volatilization.\n3. **Soil Conditions**: Ensure soil is moist but not waterlogged before top-dressing.`;
      fallbackQuickActions = [
        `How many kg of CAN fertilizer per acre for ${crop}?`,
        `Should I mix fertilizer with organic manure?`,
        `Signs of nitrogen deficiency in ${crop}?`,
      ];
    } else if (queryLower.includes('irrigate') || queryLower.includes('water') || queryLower.includes('dry') || queryLower.includes('drought') || queryLower.includes('sun')) {
      replyText = `### 💧 Irrigation & Water Management Strategy\n\nWith current soil moisture at **${moisture}%** and **${rain}mm of expected rainfall**:\n\n1. **Irrigation Schedule**: Hold off on artificial irrigation for the next 3 days. Soil moisture is currently adequate.\n2. **Rainwater Harvesting**: Direct farm runoff into farm ponds or underground water pans to store water for upcoming dry spells.\n3. **Mulching**: Apply crop residue mulch between rows to conserve soil moisture when sunny conditions return.`;
      fallbackQuickActions = [
        `When should I resume irrigation for ${crop}?`,
        `How to build a drip irrigation system on a small budget?`,
        `How to check soil moisture without sensors?`,
      ];
    } else if (queryLower.includes('livestock') || queryLower.includes('cow') || queryLower.includes('cattle') || queryLower.includes('milk') || queryLower.includes('thi') || queryLower.includes('heat') || queryLower.includes('goat')) {
      replyText = `### 🐄 Livestock Health & Heat Stress Advisory for ${livestock}\n\n1. **Heat Stress Control**: Maintain shaded loafing areas and provide cool, clean drinking water mixed with mineral salts.\n2. **Tick & Vector Prevention**: Inspect animals weekly for ticks around ears and udder. Spray with recommended acaricides.\n3. **Fodder Preservation**: Chop mature Napier grass and store in plastic silage bags or trench pits before heavy rain.`;
      fallbackQuickActions = [
        `How to make silage in plastic bags?`,
        `Symptoms of East Coast Fever in dairy cattle?`,
        `How to increase milk yield in warm weather?`,
      ];
    } else if (queryLower.includes('price') || queryLower.includes('market') || queryLower.includes('sell') || queryLower.includes('cost') || queryLower.includes('shilling') || queryLower.includes('kes')) {
      replyText = `### 📈 Market & Pricing Advisory for ${crop}\n\n1. **Market Price**: Current regional market price for ${crop} is KES 3,200 – 3,800 per 90kg bag.\n2. **Storage**: Use hermetic storage bags (e.g. PICS bags) to avoid selling at lower prices immediately after harvest.\n3. **Cooperatives**: Join local farmer groups to bulk sell produce for higher profits.`;
      fallbackQuickActions = [
        `Where to buy hermetic bags?`,
        `How to join local farming cooperatives?`,
        `Current market prices in nearest town?`,
      ];
    } else {
      replyText = `Thank you for asking about **"${question}"**!\n\nHere is your tailored agricultural advice for ${farm?.name || 'your farm'} (${crop}):\n\n1. **Micro-Climate Status**: Current conditions show **${temp}°C**, **${rain}mm expected rain**, and soil moisture at **${moisture}%**.\n2. **Field Recommendations**: Maintain proper plot drainage and inspect plants for early pest or disease symptoms.\n3. **Seasonal Planning**: Schedule major farm operations (spraying, harvesting, top-dressing) around upcoming rain windows.\n\nHow else can I assist with your ${crop} crops or livestock?`;
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
      const modelsToTry = ['gemini-3.6-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
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
      const modelsToTry = ['gemini-3.6-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
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

  // AI Plant & Livestock Photo Health Diagnosis Endpoint
  app.post('/api/gemini/diagnose-health', async (req, res) => {
    const { itemName, category, notes, imageBase64, mimeType, farmContext, weatherContext } = req.body;

    const isPlant = category === 'plant' || category === 'crop';
    const nameStr = itemName || (isPlant ? 'Crop Field Specimen' : 'Livestock Specimen');

    const systemInstruction = `You are AgriShield AI's Master Agricultural Diagnostic & Animal Health Specialist (EldoHub Hackathon 2026).
Your task is to analyze images and text notes of crops/plants or livestock/animals.
Evaluate for:
1. Health status (Healthy, Mild Concern, Sick / Diseased, Severe Risk).
2. Exact condition name or infestation/disease type (e.g. Fall Armyworm, Maize Lethal Necrosis, Fungal Blight, Nitrogen Deficiency, East Coast Fever, Mastitis, Heat Stress THI, Foot Rot).
3. Underlying climate and environmental causes (e.g., high humidity after heavy downpour accelerating fungal spores, or high THI heat stress causing dehydration and reduced immunity).
4. Step-by-step immediate treatment fixes, remedies, or organic interventions.
5. Long-term climate-smart preventative measures.

Return a valid JSON object strictly matching the specified responseSchema.`;

    const promptText = `Specimen Name: ${nameStr}
Category: ${isPlant ? 'Plant / Crop' : 'Livestock / Animal'}
Observed Symptoms/Notes: ${notes || 'None provided by farmer'}
Farm Context: ${farmContext || 'Smallholder farm plot in Kenya'}
Weather/Climate Context: ${weatherContext || 'Current temperature and moisture variations'}`;

    const parts: any[] = [];
    if (imageBase64 && typeof imageBase64 === 'string' && imageBase64.length > 50) {
      const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');
      parts.push({
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType || 'image/jpeg',
        },
      });
    }
    parts.push({ text: promptText });

    const aiClient = getAiClient();
    if (aiClient) {
      const modelsToTry = ['gemini-3.6-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];
      for (const mName of modelsToTry) {
        try {
          const response = await aiClient.models.generateContent({
            model: mName,
            contents: { parts },
            config: {
              systemInstruction,
              responseMimeType: 'application/json',
              responseSchema: {
                type: Type.OBJECT,
                properties: {
                  itemName: { type: Type.STRING },
                  category: { type: Type.STRING },
                  healthStatus: { type: Type.STRING, description: "'Healthy' | 'Mild Concern' | 'Sick / Diseased' | 'Severe Risk'" },
                  conditionName: { type: Type.STRING },
                  confidencePercent: { type: Type.INTEGER },
                  symptomsIdentified: { type: Type.ARRAY, items: { type: Type.STRING } },
                  climateCauses: { type: Type.STRING },
                  immediateFixes: { type: Type.ARRAY, items: { type: Type.STRING } },
                  preventativeMeasures: { type: Type.ARRAY, items: { type: Type.STRING } },
                  agronomistNote: { type: Type.STRING },
                },
                required: [
                  'itemName',
                  'category',
                  'healthStatus',
                  'conditionName',
                  'confidencePercent',
                  'symptomsIdentified',
                  'climateCauses',
                  'immediateFixes',
                  'preventativeMeasures',
                  'agronomistNote',
                ],
              },
            },
          });

          if (response && response.text) {
            const parsed = JSON.parse(response.text.trim());
            return res.json(parsed);
          }
        } catch (err) {
          console.warn(`Gemini Health Diagnosis model ${mName} error:`, err);
        }
      }
    }

    // Smart diagnostic fallback when API key is offline or image processing falls back
    const notesLower = (notes || '').toLowerCase();
    let healthStatus = 'Mild Concern';
    let conditionName = isPlant ? 'Early Foliar Leaf Blight / Moisture Stress' : 'Heat Stress & Vector Exposure';
    let symptoms = isPlant
      ? ['Chlorotic yellow spotting on lower leaf blades', 'Slight leaf margin curling', 'Moisture retention on leaf whorls']
      : ['Reduced feed intake during afternoon peak', 'Elevated respiration rate', 'Slight udder warmth'];

    if (notesLower.includes('healthy') || notesLower.includes('good') || notesLower.includes('normal')) {
      healthStatus = 'Healthy';
      conditionName = isPlant ? 'Optimal Crop Development' : 'Vigorous Animal Health';
      symptoms = isPlant
        ? ['Vibrant green leaf canopy', 'Sturdy stalk alignment', 'No visible pest frass']
        : ['Bright eye alertness', 'Steady rumination', 'Smooth coat texture'];
    } else if (notesLower.includes('worm') || notesLower.includes('pest') || notesLower.includes('hole') || notesLower.includes('bug')) {
      healthStatus = 'Sick / Diseased';
      conditionName = isPlant ? 'Fall Armyworm Whorl Infestation' : 'External Parasite / Tick Load';
      symptoms = isPlant
        ? ['Ragged hole puncturing on young leaves', 'Fresh brownish frass in leaf whorls', 'Stunted central shoot extension']
        : ['Tick clusters around ears and udder', 'Restlessness and tail flicking', 'Skin irritation marks'];
    }

    const fallbackResponse = {
      itemName: nameStr,
      category: isPlant ? 'Plant / Crop' : 'Livestock / Animal',
      healthStatus,
      conditionName,
      confidencePercent: 91,
      symptomsIdentified: symptoms,
      climateCauses: isPlant
        ? 'High relative humidity combined with recent rainfall creates micro-climates conducive to fungal spore germination and pest egg hatching.'
        : 'Elevated Temperature Humidity Index (THI > 74) creates thermal discomfort, suppressing appetite and lowering natural immunity against vector-borne pathogens.',
      immediateFixes: isPlant
        ? [
            'Apply neem oil extract (30ml per 20L sprayer) or recommended bio-pesticide directly into leaf whorls early in the morning.',
            'Ensure adequate field perimeter drainage to prevent waterlogging around root zones.',
            'Avoid overhead spraying immediately before anticipated downpours.',
          ]
        : [
            'Provide well-ventilated shade structures and continuously accessible cool drinking water mixed with essential electrolytes.',
            'Spray acaricide spray or pour-on solution around ears, brisket, and underbelly to eliminate tick vectors.',
            'Feed high-fiber forage early morning and late evening when ambient temperature drops.',
          ],
      preventativeMeasures: isPlant
        ? [
            'Practice crop rotation with legumes (e.g. beans, cowpeas) to break pest life cycles.',
            'Utilize push-pull technology (intercropping with Desmodium and planting Napier grass borders).',
          ]
        : [
            'Construct zero-grazing shade units with insulated roofing material.',
            'Maintain strict vaccination protocols against East Coast Fever and Foot & Mouth Disease.',
          ],
      agronomistNote: isPlant
        ? `Re-examine ${nameStr} after 3 days. Early intervention prevents yield loss across adjacent rows!`
        : `Monitor milk yield and body temperature of ${nameStr}. Prompt hydration and shade restoration accelerate recovery.`,
    };

    res.json(fallbackResponse);
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
