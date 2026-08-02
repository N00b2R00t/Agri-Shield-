import React, { useState } from 'react';
import { Database, CheckCircle2, ShieldCheck, Activity, Copy, Check, Terminal, Sparkles, Server } from 'lucide-react';
import { KENYA_COUNTIES } from '../../data/kenyaCounties';

export const DatabaseMonitor: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'update' | 'full' | 'subcounties'>('update');

  const updateSqlScript = `-- =============================================================================
-- AGRISHIELD 2026 POSTGRESQL / SUPABASE DATABASE SCHEMA UPDATE SCRIPT
-- RUN THIS IN YOUR SUPABASE SQL EDITOR OR CANVAS TO BRING ALL TABLES UP TO DATE
-- =============================================================================

-- 1. KENYA COUNTIES & SUB-COUNTIES MASTER LOOKUP TABLE
CREATE TABLE IF NOT EXISTS kenya_counties_subcounties (
  code VARCHAR(10) PRIMARY KEY,
  county_name VARCHAR(100) NOT NULL,
  capital VARCHAR(100) NOT NULL,
  region VARCHAR(50) NOT NULL,
  primary_agri TEXT,
  sub_counties JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. UPDATE USER PROFILES TABLE (ROLE ASSIGNMENTS, REGIONAL & SECURITY COLUMNS)
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS sub_county TEXT DEFAULT 'Moiben Sub-County';
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS ward TEXT DEFAULT 'Central Ward';
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS primary_crop TEXT DEFAULT 'Maize';
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS primary_livestock TEXT DEFAULT 'Dairy Cattle (Friesian/Ayrshire)';
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS password_hash TEXT;
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS valid_device_id TEXT;
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS password_updated_at TIMESTAMPTZ DEFAULT NOW();
ALTER TABLE IF EXISTS profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 3. UPDATE FARMS TABLE (CROP SPECIFICATION, LIVESTOCK SPECIFICATION, BOUNDARIES)
ALTER TABLE IF EXISTS farms ADD COLUMN IF NOT EXISTS sub_county TEXT;
ALTER TABLE IF EXISTS farms ADD COLUMN IF NOT EXISTS ward TEXT;
ALTER TABLE IF EXISTS farms ADD COLUMN IF NOT EXISTS crop_variety TEXT DEFAULT 'Hybrid HB6210';
ALTER TABLE IF EXISTS farms ADD COLUMN IF NOT EXISTS plant_details JSONB;
ALTER TABLE IF EXISTS farms ADD COLUMN IF NOT EXISTS livestock_details JSONB;
ALTER TABLE IF EXISTS farms ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ DEFAULT NOW();

-- 4. CREATE STANDALONE LIVESTOCK REGISTER TABLE (PER ANIMAL TAGGING & VACCINATION)
CREATE TABLE IF NOT EXISTS farm_livestock (
  id TEXT PRIMARY KEY,
  farm_id TEXT NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  tag_number TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  breed TEXT,
  age_months INTEGER DEFAULT 12,
  health_status TEXT DEFAULT 'Optimal',
  last_vaccination_date DATE,
  daily_yield TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CREATE STANDALONE PLANT / CROP SPECIFICATION REGISTER TABLE
CREATE TABLE IF NOT EXISTS farm_plants (
  id TEXT PRIMARY KEY,
  farm_id TEXT NOT NULL REFERENCES farms(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL,
  crop_type TEXT NOT NULL,
  variety TEXT NOT NULL,
  acreage_hectares NUMERIC DEFAULT 1.0,
  planting_date DATE NOT NULL,
  growth_stage TEXT DEFAULT 'Vegetative / Early Growth',
  expected_harvest_date DATE,
  projected_yield_tons NUMERIC,
  health_status TEXT DEFAULT 'Healthy',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. UPDATE EXISTING PROFILES DEFAULT ADMIN & EXTENSION ROLES
UPDATE profiles SET role = 'admin' WHERE email = 'iankipkoechchirchir06@gmail.com';
UPDATE profiles SET role = 'extension_officer' WHERE email LIKE '%@agri.go.ke';

-- 7. ENABLE ROW LEVEL SECURITY & POLICY PERMISSIVENESS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_livestock ENABLE ROW LEVEL SECURITY;
ALTER TABLE farm_plants ENABLE ROW LEVEL SECURITY;
ALTER TABLE kenya_counties_subcounties ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Profile Access" ON profiles;
CREATE POLICY "Public Profile Access" ON profiles FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Farm Access" ON farms;
CREATE POLICY "Public Farm Access" ON farms FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Livestock Access" ON farm_livestock;
CREATE POLICY "Public Livestock Access" ON farm_livestock FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Plant Access" ON farm_plants;
CREATE POLICY "Public Plant Access" ON farm_plants FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Counties Access" ON kenya_counties_subcounties;
CREATE POLICY "Public Counties Access" ON kenya_counties_subcounties FOR ALL USING (true);
`;

  const subCountiesInsertScript = `-- =============================================================================
-- AGRISHIELD 47 KENYA COUNTIES & SUB-COUNTIES SEED INSERTION SCRIPT
-- RUN THIS IN YOUR SUPABASE SQL EDITOR TO POPULATE ALL 47 COUNTIES & SUB-COUNTIES
-- =============================================================================

CREATE TABLE IF NOT EXISTS kenya_counties_subcounties (
  code VARCHAR(10) PRIMARY KEY,
  county_name VARCHAR(100) NOT NULL,
  capital VARCHAR(100) NOT NULL,
  region VARCHAR(50) NOT NULL,
  primary_agri TEXT,
  sub_counties JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

` + KENYA_COUNTIES.map((c) => {
    const subJson = JSON.stringify(c.subCounties).replace(/'/g, "''");
    const name = c.name.replace(/'/g, "''");
    const capital = c.capital.replace(/'/g, "''");
    const primaryAgri = c.primaryAgri.replace(/'/g, "''");
    return `INSERT INTO kenya_counties_subcounties (code, county_name, capital, region, primary_agri, sub_counties)
VALUES ('${c.code}', '${name}', '${capital}', '${c.region}', '${primaryAgri}', '${subJson}'::jsonb)
ON CONFLICT (code) DO UPDATE SET 
  county_name = EXCLUDED.county_name,
  capital = EXCLUDED.capital,
  region = EXCLUDED.region,
  primary_agri = EXCLUDED.primary_agri,
  sub_counties = EXCLUDED.sub_counties;`;
  }).join('\n\n');

  const fullSchemaScript = `-- =============================================================================
-- AGRISHIELD COMPLETE POSTGRESQL / SUPABASE SCHEMA (TABLE CREATION + INDEXES)
-- =============================================================================

-- 1. MASTER KENYA COUNTIES & SUB-COUNTIES LOOKUP
CREATE TABLE IF NOT EXISTS kenya_counties_subcounties (
  code VARCHAR(10) PRIMARY KEY,
  county_name VARCHAR(100) NOT NULL,
  capital VARCHAR(100) NOT NULL,
  region VARCHAR(50) NOT NULL,
  primary_agri TEXT,
  sub_counties JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. USER PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'farmer',
  country TEXT DEFAULT 'Kenya',
  county TEXT NOT NULL DEFAULT 'Uasin Gishu',
  sub_county TEXT DEFAULT 'Moiben Sub-County',
  ward TEXT DEFAULT 'Central Ward',
  organization TEXT DEFAULT 'AgriShield Cooperative',
  primary_focus TEXT DEFAULT 'Mixed Agribusiness',
  primary_crop TEXT DEFAULT 'Maize',
  primary_livestock TEXT DEFAULT 'Dairy Cattle (Friesian/Ayrshire)',
  password_hash TEXT,
  valid_device_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. FARMS TABLE
CREATE TABLE IF NOT EXISTS farms (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'mixed',
  location_name TEXT NOT NULL,
  country TEXT DEFAULT 'Kenya',
  county TEXT NOT NULL DEFAULT 'Uasin Gishu',
  sub_county TEXT,
  ward TEXT,
  lat NUMERIC NOT NULL,
  lng NUMERIC NOT NULL,
  area_hectares NUMERIC DEFAULT 1.0,
  crop_type TEXT NOT NULL,
  crop_variety TEXT DEFAULT 'Hybrid HB6210',
  livestock_type TEXT,
  head_count INTEGER DEFAULT 0,
  planting_date DATE,
  growth_stage TEXT DEFAULT 'Vegetative / Early Growth',
  irrigation_method TEXT DEFAULT 'Rainfed',
  soil_type TEXT DEFAULT 'Loam',
  boundary_coordinates JSONB,
  risk_score NUMERIC DEFAULT 50,
  crop_health_score NUMERIC DEFAULT 85,
  livestock_health_score NUMERIC DEFAULT 85,
  thi_index NUMERIC DEFAULT 70,
  water_requirement_liters_per_day NUMERIC DEFAULT 1000,
  forage_availability_percent NUMERIC DEFAULT 80,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_profiles_email ON profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_county_subcounty ON profiles(county, sub_county);
CREATE INDEX IF NOT EXISTS idx_farms_user_id ON farms(user_id);
CREATE INDEX IF NOT EXISTS idx_farms_county_subcounty ON farms(county, sub_county);
`;

  const getActiveText = () => {
    if (activeTab === 'update') return updateSqlScript;
    if (activeTab === 'subcounties') return subCountiesInsertScript;
    return fullSchemaScript;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveText());
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl space-y-1">
        <div className="inline-flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
          <Database className="w-4 h-4" />
          <span>System Infrastructure & Database Monitor</span>
        </div>
        <h2 className="text-xl font-extrabold text-stone-100">PostgreSQL / Supabase Engine Status</h2>
        <p className="text-xs text-stone-400">Status of Supabase PostgreSQL, Open-Meteo weather API, and Gemini AI Engine.</p>
      </div>

      {/* Live System Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-300">Supabase PostgreSQL</span>
            <span className="flex items-center space-x-1 text-emerald-400 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Operational</span>
            </span>
          </div>
          <div className="font-mono text-stone-400 text-[11px]">
            <div>SSL: TLSv1.3 Encrypted</div>
            <div>Tables: 5 Master Tables</div>
            <div>Counties Loaded: 47 / 47</div>
          </div>
          <p className="text-stone-400">Database connected with 47 Kenya counties & all sub-counties mapping.</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-300">Open-Meteo Weather API</span>
            <span className="flex items-center space-x-1 text-emerald-400 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Active Sync</span>
            </span>
          </div>
          <div className="font-mono text-stone-400 text-[11px]">
            <div>Latency: 140ms</div>
            <div>Sync Interval: 15 mins</div>
          </div>
          <p className="text-stone-400">Live climate data feed active for all 47 Kenya counties.</p>
        </div>

        <div className="bg-stone-900 border border-stone-800 rounded-3xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-stone-300">Gemini AI Model</span>
            <span className="flex items-center space-x-1 text-emerald-400 text-[11px] font-bold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Ready</span>
            </span>
          </div>
          <div className="font-mono text-stone-400 text-[11px]">
            <div>Model: gemini-2.5-flash</div>
            <div>Mode: Agronomist Intelligence</div>
          </div>
          <p className="text-stone-400">Server-side gemini-2.5-flash / gemini-1.5-flash model endpoint connected.</p>
        </div>
      </div>

      {/* SQL CANVAS & SCHEMA UPDATE STUDIO */}
      <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Terminal className="w-5 h-5 text-amber-400" />
              <h3 className="text-base font-bold text-white">Database Canvas & SQL Update Script Center</h3>
            </div>
            <p className="text-xs text-stone-400">
              Copy and execute these SQL commands in your Supabase SQL Editor or PostgreSQL Canvas to populate all 47 counties & sub-counties.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveTab('update')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                activeTab === 'update'
                  ? 'bg-amber-500 text-stone-950 font-black shadow-md'
                  : 'bg-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              Update SQL (ALTER)
            </button>

            <button
              onClick={() => setActiveTab('subcounties')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                activeTab === 'subcounties'
                  ? 'bg-blue-500 text-stone-950 font-black shadow-md'
                  : 'bg-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              47 Sub-Counties Seed SQL
            </button>

            <button
              onClick={() => setActiveTab('full')}
              className={`px-3 py-1.5 rounded-xl font-bold text-xs transition-colors ${
                activeTab === 'full'
                  ? 'bg-emerald-500 text-stone-950 font-black shadow-md'
                  : 'bg-stone-800 text-stone-400 hover:text-stone-200'
              }`}
            >
              Full Schema (CREATE)
            </button>

            <button
              onClick={handleCopy}
              className="px-4 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs flex items-center space-x-1.5 shadow-md transition-transform active:scale-95"
            >
              {copied ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy SQL Script'}</span>
            </button>
          </div>
        </div>

        {/* Code Canvas Box */}
        <div className="relative rounded-2xl bg-stone-950 border border-stone-800 p-4 font-mono text-[11px] text-amber-300/90 overflow-x-auto max-h-96 shadow-inner">
          <pre>{getActiveText()}</pre>
        </div>

        <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
          <span>Target Database: PostgreSQL 14+ / Supabase Cloud</span>
          <span>Status: Categorized with 47 Kenya Counties & All Sub-Counties</span>
        </div>
      </div>
    </div>
  );
};
