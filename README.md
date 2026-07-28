# AgriShield AI 🛡️🌾
> **Next-Generation Climate Risk Intelligence & Agribusiness Decision-Support Platform**  
> *Developed by **Ian Chirchir***

---

## 📌 Executive Summary

**AgriShield AI** is an end-to-end Climate Tech & AgriTech innovation designed to build climate resilience for smallholder farmers, pastoralists, extension officers, and agricultural researchers in Sub-Saharan Africa. 

By combining real-time hyper-local microclimate data, satellite vegetation indexes, vector prediction models, and Gemini AI intelligence, AgriShield AI transforms complex environmental data into actionable, plain-language decision support for both **crop farming** and **livestock management**.

---

## 🌟 Key Features

### 1. 🌡️ Hyper-Local Microclimate & Temperature-Humidity Index (THI)
- Real-time weather parameters: ambient temperature, humidity, wind velocity, soil moisture, and rainfall radar.
- **Livestock Heat Stress Engine**: Calculates livestock **Temperature-Humidity Index (THI)** and daily water requirements for dairy cattle, sheep, and goats to prevent milk drop and heat strain.

### 2. 🦟 AI Climate & Vector Outbreak Predictions
- Predictive models for crop pests (*Fall Armyworm, Locusts, Blight*) and livestock vector diseases (*East Coast Fever brown ear ticks, Rift Valley Fever mosquito vectors, Mastitis*).
- 7-day outbreak probability scores with localized geographic radius alerts.

### 3. 🗺️ Interactive GIS & Farm Geofencing Map
- High-precision farm mapping with interactive polygon boundary drawing and area calculation (hectares/acres).
- GeoJSON spatial overlays for flood zones, drought vulnerability heatmaps, and community disease reports.

### 4. 🔮 "What-If" Agribusiness Enterprise Simulator
- Interactive simulation tool allowing farmers to project yield, water deficit, financial risk, and net revenue when switching crops (*Maize, Sorghum, Coffee, Napier Grass*) or scaling livestock (*Dairy Cattle, Goats, Poultry*).
- Adjust climate parameters like drought duration, fertilizer cost spikes, or heatwave intensity to see instant financial projections.

### 5. 💡 Smart AI Climate Recommendations Engine
- Gemini 2.5/3 Flash powered personalized climate adaptation strategies.
- Generates step-by-step action plans for irrigation timing, fodder preservation (silage/hay), acaricide application schedules, and drought preparation.

### 6. 📢 Crowdsourced Community Intel & Early Warnings
- Peer-to-peer early warning network for farmers to report local pest sightings, livestock illnesses, flash floods, or pasture depletion.
- Community verification and upvoting system to validate local outbreak threats.

### 7. 📊 Market Price & Commodity Intelligence
- Live commodity market price tracker across regional depots (e.g., Eldoret, Nakuru, Nairobi).
- Covers dry white maize, fresh raw milk, live goats, and eggs with price trend indicators and seller advice.

### 8. 📊 Extension Officer & Regional Admin Dashboard
- Centralized administrative dashboard for agricultural officers to monitor district-wide risk scores, outbreak clusters, and farm health indexes.

---

## 🏗️ Architecture & Database Design

### Supabase PostgreSQL Database & Auth
AgriShield AI utilizes **Supabase PostgreSQL** with Row-Level Security (RLS) policies for secure, scalable data storage.

- **`schema.sql`**: Contains complete DDL scripts for tables (`profiles`, `farms`, `community_reports`, `recommendations`, `disease_predictions`, `market_prices`, `alert_notifications`), custom PostgreSQL triggers for auth synchronization, updated-at timestamps, and fine-grained RLS security rules.

### Environment Configuration
Configure environment variables in `.env`:

```env
# Supabase Configuration
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_ANON_KEY=your-supabase-anon-key

# Gemini AI Key (Server-Side)
GEMINI_API_KEY=your-gemini-api-key
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React Icons
- **Backend Service**: Node.js / Express server with bundled esbuild CommonJS compilation
- **Database & Auth**: Supabase (@supabase/supabase-js) & PostgreSQL
- **AI Model**: Google Gemini API (@google/genai SDK)
- **Mapping**: Leaflet / React-Leaflet GIS engine

---

## 👤 Developer & Credits

Designed and developed by **Ian Chirchir**  
*Built for Climate Resilience & Smart Agriculture Innovation.*
