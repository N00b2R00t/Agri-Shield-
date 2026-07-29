# AgriShield AI 🛡️🌾
## Complete System Architecture & User Documentation
*Developed by **Ian Chirchir***

---

## 📌 1. System Overview & Vision

**AgriShield AI** is an intelligent, end-to-end Agribusiness & Climate Risk Management Platform. It bridges the gap between complex meteorological data, satellite vegetation indexes, epidemiological vector models, and day-to-day farming decisions in Sub-Saharan Africa.

The platform provides smallholder crop farmers, pastoralists, livestock keepers, agricultural extension officers, and regional administrators with real-time predictive intelligence, microclimate analysis, and generative AI guidance powered by Google Gemini.

### Primary Objectives
- **Climate Resilience**: Reduce climate-induced crop loss and livestock heat stress through hyper-local microclimate monitoring.
- **Disease & Pest Vector Early Warning**: Predict outbreaks of Fall Armyworm, Locusts, East Coast Fever, and Rift Valley Fever before severe transmission occurs.
- **Financial Risk Simulation**: Empower agribusinesses with "What-If" scenario planning for crops, livestock scaling, and market price fluctuations.
- **Regional Extension Coordination**: Provide extension officers with district-wide risk heatmaps and community reporting verification tools.

---

## 🏗️ 2. Architectural Design & Tech Stack

```
┌─────────────────────────────────────────────────────────────────────────┐
│                           Client Layer (Browser)                        │
│   React 18 + TypeScript + Tailwind CSS + Lucide Icons + Leaflet GIS    │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        Node.js / Express Server                         │
│   - Port 3000 Container Proxy                                          │
│   - Microclimate Engine & Weather Proxy Routes                         │
│   - Gemini AI Agronomist Proxy (@google/genai)                         │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                      Database & Authentication Layer                     │
│   - Supabase PostgreSQL Database with Row-Level Security (RLS)          │
│   - Local Storage Fallback Engine for Offline Resilience               │
└─────────────────────────────────────────────────────────────────────────┘
```

### Technology Breakdown
- **Frontend Framework**: React 18 with TypeScript & Vite
- **Styling & UI**: Tailwind CSS with custom theme design system
- **Mapping & Spatial GIS**: Leaflet & OpenStreetMap GIS layer
- **Generative AI Integration**: Google Gemini API (`@google/genai` SDK) running via secure server-side proxy
- **Backend Infrastructure**: Express.js server bundled with `esbuild` to CommonJS (`dist/server.cjs`)
- **Database Architecture**: PostgreSQL (Supabase schema with custom triggers, functions, and RLS policies)

---

## ⚙️ 3. Core System Modules

### 3.1 🌡️ Microclimate & Livestock Heat Stress Engine (THI)
- **Parameters Tracked**: Temperature (°C), Humidity (%), Rainfall (mm), Wind Speed (km/h), Soil Moisture (%), Solar Radiation (W/m²).
- **Temperature-Humidity Index (THI)**: Calculates THI for dairy cattle, sheep, and goats using the standard formula:
  $$\text{THI} = (1.8 \times T + 32) - (0.55 - 0.55 \times \frac{RH}{100}) \times (1.8 \times T - 26)$$
- **Heat Stress Thresholds**:
  - `THI < 72`: Normal (Safe environment)
  - `72 ≤ THI < 79`: Mild Heat Stress (Milk yield drop ~10%)
  - `79 ≤ THI < 89`: Moderate to Severe Heat Stress (Rumen dysbiosis risk)
  - `THI ≥ 89`: Emergency / Danger (High mortality risk)
- **Water Consumption Estimator**: Calculates daily water requirements based on ambient temperature, THI, and body mass.

### 3.2 🦟 Vector & Pest Outbreak Predictive Analytics
- **Crop Pests**: Fall Armyworm, Desert Locusts, Maize Lethal Necrosis Disease (MLND), Potato Late Blight.
- **Livestock Vectors**: Brown Ear Ticks (*Rhipicephalus appendiculatus* causing East Coast Fever), Mosquito vectors (*Aedes & Culex* transmitting Rift Valley Fever), Tsetse flies (*Trypanosomiasis*).
- **Risk Score Algorithm**: Dynamically scores disease risk based on relative humidity, 7-day cumulative rainfall, temperature windows, and recent community outbreak submissions.

### 3.3 🗺️ Interactive GIS & Farm Geofencing
- **Polygon Geofencing**: Allows farmers to plot precise boundary points for their acreage.
- **Hectare/Acres Auto-Calculation**: Calculates land surface area dynamically using geodesic polygon calculations.
- **Spatial Overlays**: Displays active regional risk buffers, nearby community report pins, market depots, and county boundaries (Kenya 47 Counties).

### 3.4 🔮 Agribusiness "What-If" Enterprise Simulator
- Allows farmers and investors to test agricultural strategies prior to capital allocation.
- **Inputs**: Crop choice, planting date offset (days), irrigation percentage, fertilizer quantity (kg/ha), pest management tier, climate scenario (Normal, Moderate Drought, Severe Drought, Excessive Downpour).
- **Outputs**: Expected Yield (Tons/Ha), Water Deficit Index, Projected Risk Score, Estimated Net Financial Revenue (KSh).

### 3.5 🤖 Gemini AI Agronomist & Decision Support
- Server-side integration with Gemini AI using the `@google/genai` SDK.
- Context-aware prompting incorporates active farm details (crop type, growth stage, soil type, county) and live weather data.
- Provides actionable recommendations for fertilizer schedules, irrigation timing, and biological vector control.

### 3.6 📊 Regional Extension & Admin Dashboard
- Central hub for county agricultural officers.
- Real-time district risk status, verified vs unverified community reports, and active outbreak clusters.
- Enables broadcasting emergency SMS/Push alerts to registered farmers within targeted geographic radii.

---

## 🗄️ 4. Database Schema (PostgreSQL / Supabase)

The system relies on a relational PostgreSQL schema defined in `schema.sql`:

- **`profiles`**: User details, phone numbers, county, role (`farmer`, `extension_officer`, `admin`).
- **`farms`**: Geofenced farm parcels, crop/livestock details, soil types, boundary coordinates (JSONB).
- **`community_reports`**: Crowdsourced threat alerts with category, location coordinates, severity, and verification counts.
- **`recommendations`**: AI-generated and extension-broadcasted advisory actions.
- **`disease_predictions`**: Daily model outputs for vector and pest risks.
- **`market_prices`**: Regional market depot prices for key produce (white maize, raw milk, live goats, etc.).
- **`alert_notifications`**: High-priority safety and outbreak broadcasts sent to farmers.

---

## 🔌 5. API Reference

### Health Check
- `GET /api/health`
- **Response**: `{ "status": "ok" }`

### Weather & Microclimate API
- `GET /api/weather?lat={latitude}&lng={longitude}`
- **Response**: Microclimate JSON object with current parameters, 7-day forecast, and risk index.

### Gemini AI Advisory Proxy
- `POST /api/ai/advise`
- **Payload**:
  ```json
  {
    "farm": { "name": "Eldoret North Maize Farm", "cropType": "Maize", "county": "Uasin Gishu" },
    "weather": { "currentTemp": 24.5, "humidity": 68, "rainfallMm": 12 },
    "question": "Should I top-dress nitrogen fertilizer this week?"
  }
  ```
- **Response**: `{ "reply": "Based on 12mm rainfall..." }`

---

## 🚀 6. Installation & Deployment

### Prerequisites
- Node.js 18+ & npm
- Gemini API Key (`GEMINI_API_KEY`)

### Environment Variables (.env)
```env
GEMINI_API_KEY=your_gemini_api_key_here
PORT=3000
NODE_ENV=production
```

### Local Development
```bash
npm install
npm run dev
```

### Production Build & Launch
```bash
npm run build
npm start
```

---

## 👤 Author & Support

**AgriShield AI Platform**  
Designed & Developed by **Ian Chirchir**  
*Building Sustainable Climate Resilience for African Agriculture.*
