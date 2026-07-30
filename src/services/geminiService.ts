import { GoogleGenAI } from '@google/genai';
import { Farm, WeatherSummary, CommunityReport, ChatMessage } from '../types';

// Helper to get client-side Gemini AI instance if API key is provided
function getClientAiInstance() {
  try {
    const apiKey =
      (typeof localStorage !== 'undefined' && localStorage.getItem('agrishield_gemini_api_key')) ||
      (typeof import.meta !== 'undefined' && import.meta.env && (import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.GEMINI_API_KEY)) ||
      (typeof process !== 'undefined' && process.env && (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY)) ||
      '';

    if (!apiKey || !apiKey.trim()) return null;

    return new GoogleGenAI({
      apiKey: apiKey.trim(),
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.warn('Could not initialize Gemini client:', err);
    return null;
  }
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
      const systemInstruction = `You are AgriShield AI Advisor, an expert climate resilience agronomist and web platform assistant for African smallholder farmers, extension officers, NGOs, and system admins.
You provide two main types of assistance:
1. AGRICULTURAL ADVISORY: Crop management (${crop}), Livestock keeping (${farm?.livestockType || 'Dairy Cattle'}), weather risks, pest control, fertilizer timing, harvest planning, and market prices.
2. AGRISHIELD PLATFORM GUIDANCE: Clear step-by-step instructions on using AgriShield (e.g. what AgriShield does, how to register a farm, how to add a plot, how to submit community outbreak reports, how role-switching works for extension officers & NGOs, how the What-If climate simulator works, and how to use market intelligence).

Context:
- Active Farm: ${farmName} (${crop}, Location: ${location})
- Weather: Temp ${temp}°C, Rain ${rain}mm, Humidity ${humidity}%, Soil Moisture ${moisture}%
- Recent Outbreak Reports: ${recentReports?.slice(0, 2).map((r) => r.description).join('; ') || 'None'}

Be encouraging, practical, clear, and structured with bold headers and bullet points.`;

      const modelsToTry = ['gemini-3.6-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

      for (const mName of modelsToTry) {
        try {
          const response = await ai.models.generateContent({
            model: mName,
            contents: `User Query: "${question}"`,
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
                `What does AgriShield do?`,
                `How do I register a farm?`,
                `How to report a pest outbreak?`,
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
  const qLower = question.toLowerCase().trim();

  let replyText = '';
  let quickActions = [
    `Should I irrigate my ${crop} today?`,
    `What does AgriShield do?`,
    `How do I register a farm?`,
    `When to top-dress fertilizer given ${rain}mm rain?`,
  ];

  // Platform & Web Support queries
  if (
    qLower.includes('agrishield') ||
    qLower.includes('agri-shield') ||
    qLower.includes('what is agrishield') ||
    qLower.includes('what does agrishield do') ||
    qLower.includes('about agrishield') ||
    qLower.includes('who built') ||
    qLower.includes('who created') ||
    qLower.includes('developer')
  ) {
    replyText = `### 🌾 About AgriShield AI Platform\n\n**AgriShield** is an intelligent, hyper-local climate resilience, early-warning, and decision-support system built for African smallholder farmers, extension officers, NGOs, and agricultural policy makers.\n\n**Key Features & Capabilities**:\n1. **AI Farm Advisory & Analysis**: Custom agronomic advice for crops (${crop}) and livestock based on live Open-Meteo weather models and soil moisture.\n2. **Multi-Farm Registration**: Register multiple plots across all 47 Kenyan counties with custom crop types, growth stages, soil composition, and livestock count.\n3. **Community Outbreak Intel**: Crowdsourced pest and disease radar (e.g., Fall Armyworm, Locusts, Maize Lethal Necrosis) with instant distance alerts.\n4. **What-If Climate Simulator**: Stress-test your plots against severe rainfall (+100mm deluge), drought (-80mm dry spell), or temperature surges.\n5. **Market Intelligence**: Real-time wholesale crop prices across major Kenyan market hubs and post-harvest storage guidance.\n6. **Multi-Role Dashboards**: Tailored views for Smallholder Farmers, Extension Officers, NGO Analysts, and System Admins.\n\nDeveloped by **Ian Chirchir** to empower farmers with actionable climate intelligence!`;
    quickActions = [
      `How do I register a new farm?`,
      `How to submit a pest outbreak report?`,
      `How to switch user roles?`,
    ];
  } else if (
    qLower.includes('register farm') ||
    qLower.includes('add farm') ||
    qLower.includes('how to register') ||
    qLower.includes('how to add farm') ||
    qLower.includes('register a farm') ||
    qLower.includes('new farm') ||
    qLower.includes('create farm')
  ) {
    replyText = `### 🚜 How to Register & Manage Farms on AgriShield\n\nRegistering a farm plot allows AgriShield to deliver hyper-local weather alerts and AI-driven crop & livestock advisory:\n\n1. **Step 1**: Click the **"+ Add New Farm"** or **"+ Register New Farm Location"** button in the top navigation bar, the farm switcher dropdown, or the **My Farms** tab.\n2. **Step 2**: Enter your **Farm Name** (e.g. *Eldoret Pioneer Maize & Dairy Farm*).\n3. **Step 3**: Select your **County** (all 47 Kenya counties supported) and enter your sub-county/village.\n4. **Step 4**: Choose your **Farming Enterprise Type** (*Mixed Enterprise, Crops Only, or Livestock Only*).\n5. **Step 5**: Specify primary **Crop Type** (e.g., *Maize, Beans, Tea, Coffee, Wheat, Vegetables*), growth stage, soil type, irrigation method, and acreage.\n6. **Step 6**: If keeping animals, enter your **Livestock Type** (*Dairy Cattle, Goats, Poultry, Sheep*) and head count.\n7. **Step 7**: Click **"Save Farm Location"**. Your new farm will immediately be monitored by AI and real-time weather models!\n\n*Tip*: You can register multiple farms and run AI analysis on each of them!`;
    quickActions = [
      `How do I run an AI analysis on my farm?`,
      `How to submit a pest outbreak report?`,
      `What does AgriShield do?`,
    ];
  } else if (
    qLower.includes('report outbreak') ||
    qLower.includes('submit report') ||
    qLower.includes('community report') ||
    qLower.includes('outbreak radar') ||
    qLower.includes('pest report')
  ) {
    replyText = `### 🐛 How to Submit a Community Outbreak Report\n\n1. **Step 1**: Click **"Report Outbreak"** in the top navigation bar or switch to the **Community Intel** tab.\n2. **Step 2**: Select the observed pest or disease type (*Fall Armyworm, Locusts, Maize Lethal Necrosis, Coffee Rust, Anthracnose, etc.*).\n3. **Step 3**: Select the affected crop and threat severity level (*Low, Medium, High, Critical*).\n4. **Step 4**: Provide field notes, description, and optional photo attachment.\n5. **Step 5**: Click **"Submit Community Outbreak Alert"**. Neighboring farmers and extension officers within a 25km radius will receive instant alerts on their pest radar!`;
    quickActions = [
      `How to protect crops from Fall Armyworm?`,
      `How do extension officers verify reports?`,
      `How to register a farm?`,
    ];
  } else if (
    qLower.includes('role') ||
    qLower.includes('extension officer') ||
    qLower.includes('ngo') ||
    qLower.includes('switch role') ||
    qLower.includes('admin')
  ) {
    replyText = `### 👥 Multi-Role Support in AgriShield\n\nAgriShield offers 4 customized role perspectives:\n\n1. **Smallholder Farmer**: Farm plot management, AI agronomy, fertilizer schedules, and market prices.\n2. **Extension Officer**: Regional farmer directory, field dispatch, pest outbreak verification, and farm visit logs.\n3. **NGO / Climate Specialist**: Regional GIS climate vulnerability analytics, drought indicator mapping, and community support tools.\n4. **Gov / System Admin**: User account management, database synchronization, system broadcast alerts, and market price updates.\n\n*To Switch Roles*: Click your active role badge in the top right header bar or visit **Settings** -> **User Profile**.`;
    quickActions = [
      `What does AgriShield do?`,
      `How to register a new farm?`,
      `How does the What-If simulator work?`,
    ];
  } else if (
    qLower.includes('what-if') ||
    qLower.includes('simulator') ||
    qLower.includes('simulate')
  ) {
    replyText = `### ⚡ What-If Climate & Risk Simulator\n\nThe **What-If Simulator** lets you test your farm against severe weather events before they occur:\n\n1. Click **"What-If Simulator"** in your dashboard or top navigation bar.\n2. Adjust environmental sliders for **Rainfall Anomaly** (+100mm flood deluge or -80mm severe drought), **Temperature Surge**, and **Pest Infestation Pressure**.\n3. View instant predictive models showing **Expected Yield Loss %**, **Soil Nitrogen Leaching Risk**, and **Actionable Mitigation Steps**.`;
    quickActions = [
      `How to prepare for heavy rainfall?`,
      `How to register a farm?`,
      `What does AgriShield do?`,
    ];
  } else {
    // Comprehensive list of Swahili & English greetings
    const greetingKeywords = [
      'hi', 'hello', 'hey', 'jambo', 'habari', 'mambo', 'sasa', 'vipi', 'salama',
      'niaje', 'my man', 'bro', 'dude', 'good morning', 'good afternoon', 'good evening',
      'how are you', 'sup', 'what\'s up', 'whats up', 'howdy', 'greetings', 'asante', 'shukran'
    ];

    const isGreeting = greetingKeywords.some((kw) => qLower.includes(kw)) || qLower.length < 10;

    if (isGreeting) {
      replyText = `Jambo / Habari yako! I am your AgriShield AI Advisor. I am actively monitoring ${farmName} in ${location} (${crop}, ${farm?.livestockType || 'Livestock'}).\n\nToday's micro-climate summary:\n• **Temperature**: ${temp}°C\n• **Expected Rainfall**: ${rain}mm (${weather?.rainfallProb || 70}% probability)\n• **Soil Moisture**: ${moisture}%\n\nHow can I help you optimize your crop yields, protect your livestock, or assist with AgriShield features today?`;
      quickActions = [
        `What does AgriShield do?`,
        `How do I register a new farm?`,
        `Should I harvest early before heavy rain?`,
      ];
    } else if (
      qLower.includes('armyworm') ||
      qLower.includes('pest') ||
      qLower.includes('worm') ||
      qLower.includes('disease') ||
      qLower.includes('bug') ||
      qLower.includes('insect') ||
      qLower.includes('rust')
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
      qLower.includes('rain') ||
      qLower.includes('flood')
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
      qLower.includes('topdress') ||
      qLower.includes('dap') ||
      qLower.includes('can') ||
      qLower.includes('manure') ||
      qLower.includes('compost')
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
      qLower.includes('dry') ||
      qLower.includes('sun')
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
      qLower.includes('animal') ||
      qLower.includes('goat') ||
      qLower.includes('poultry') ||
      qLower.includes('chicken')
    ) {
      replyText = `### 🐄 Livestock Health & Fodder Advisory\n\n1. **Heat & Shelter**: Ensure shaded loafing sheds with clean drinking water supplemented with mineral salts.\n2. **Tick Prevention**: Perform weekly tick checks on ears and dewlap. Spray acaricides as recommended.\n3. **Fodder Security**: Harvest excess Napier grass or fodder crops before heavy rain and store in silage bags or pits.`;
      quickActions = [
        `How to prepare Napier silage in bags?`,
        `Preventing East Coast Fever in cattle?`,
        `Boosting milk yield during weather changes?`,
      ];
    } else if (
      qLower.includes('price') ||
      qLower.includes('market') ||
      qLower.includes('sell') ||
      qLower.includes('cost') ||
      qLower.includes('shilling') ||
      qLower.includes('kes')
    ) {
      replyText = `### 📈 Market & Pricing Advisory for ${crop}\n\n1. **Market Trends**: Current regional wholesale market price for dry ${crop} ranges between KES 3,200 – KES 3,800 per 90kg bag.\n2. **Post-Harvest Timing**: Avoid distress selling immediately at harvest if prices drop; store in hermetic bags (e.g., PICS bags) to sell when prices peak.\n3. **Group Marketing**: Pool produce with neighboring smallholders in your cooperative for higher bargaining leverage with buyers.`;
      quickActions = [
        `Where can I buy hermetic storage bags?`,
        `How to find wholesale crop buyers in Kenya?`,
        `Current market prices in nearest town?`,
      ];
    } else {
      replyText = `Thank you for asking about **"${question}"**!\n\nHere is your tailored agricultural guidance for ${farmName} (${crop}):\n\n1. **Field Status**: Current micro-climate forecast is **${temp}°C** with **${rain}mm expected rain** and soil moisture at **${moisture}%**.\n2. **Field Management**: Inspect drainage channels around your fields and monitor leaf whorls for early signs of pests or fungal leaf spots.\n3. **Seasonal Strategy**: Plan high-value farm inputs (spraying, top-dressing, harvesting) according to rain frequency over the next 48 hours.\n\nHow else can I assist with your ${crop} crops or livestock?`;
    }
  }

  return { reply: replyText, quickActions };
}
