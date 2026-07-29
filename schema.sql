-- ====================================================================
-- Climate Tech AgriTech & Livestock Innovation Platform (AgriShield AI)
-- PostgreSQL / Supabase SQL Database Schema & RLS Security Rules
-- Compatible with Supabase Auth, Firestore & PostgreSQL Environments
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 2. TABLES DEFINITION
-- ====================================================================

-- Profiles table linked with Auth users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'farmer' CHECK (role IN ('farmer', 'extension_officer', 'researcher', 'ngo', 'admin')),
    country TEXT NOT NULL DEFAULT 'Kenya',
    county TEXT NOT NULL DEFAULT 'Uasin Gishu',
    organization TEXT,
    primary_focus TEXT DEFAULT 'Mixed Agribusiness' CHECK (primary_focus IN ('Crops', 'Livestock', 'Mixed Agribusiness')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Farms & Livestock Enterprises table
CREATE TABLE IF NOT EXISTS public.farms (
    id TEXT PRIMARY KEY DEFAULT ('farm-' || gen_random_uuid()),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    location_name TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'Kenya',
    county TEXT NOT NULL DEFAULT 'Uasin Gishu',
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    area_hectares DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    category TEXT NOT NULL DEFAULT 'mixed' CHECK (category IN ('crop', 'livestock', 'mixed')),
    crop_type TEXT NOT NULL DEFAULT 'Maize',
    livestock_type TEXT,
    head_count INT DEFAULT 0,
    planting_date DATE,
    growth_stage TEXT NOT NULL DEFAULT 'Vegetative / Early Growth',
    irrigation_method TEXT NOT NULL DEFAULT 'Rainfed',
    soil_type TEXT NOT NULL DEFAULT 'Loam',
    boundary_coordinates JSONB NOT NULL DEFAULT '[]'::jsonb,
    risk_score INT NOT NULL DEFAULT 50 CHECK (risk_score BETWEEN 0 AND 100),
    crop_health_score INT NOT NULL DEFAULT 85 CHECK (crop_health_score BETWEEN 0 AND 100),
    livestock_health_score INT DEFAULT 85 CHECK (livestock_health_score BETWEEN 0 AND 100),
    thi_index DOUBLE PRECISION DEFAULT 70.0,
    water_requirement_liters_per_day DOUBLE PRECISION DEFAULT 1000.0,
    forage_availability_percent INT DEFAULT 80 CHECK (forage_availability_percent BETWEEN 0 AND 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Community Outbreak & Climate Intel Reports
CREATE TABLE IF NOT EXISTS public.community_reports (
    id TEXT PRIMARY KEY DEFAULT ('rep-' || gen_random_uuid()),
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    user_name TEXT NOT NULL,
    farm_name TEXT NOT NULL,
    report_type TEXT NOT NULL CHECK (report_type IN ('pest', 'disease', 'flood', 'drought', 'water_shortage', 'erosion', 'livestock_disease', 'pasture_depletion')),
    crop_affected TEXT NOT NULL,
    severity TEXT NOT NULL DEFAULT 'medium' CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    description TEXT NOT NULL,
    photo_url TEXT,
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT FALSE,
    upvotes INT NOT NULL DEFAULT 1,
    distance_km DOUBLE PRECISION DEFAULT 1.0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- AI Decision & Extension Recommendations
CREATE TABLE IF NOT EXISTS public.recommendations (
    id TEXT PRIMARY KEY DEFAULT ('rec-' || gen_random_uuid()),
    farm_id TEXT REFERENCES public.farms(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    action_type TEXT NOT NULL CHECK (action_type IN ('irrigation', 'planting', 'harvest', 'pest_control', 'fertilizer', 'crop_switch', 'livestock_shelter', 'fodder_preservation', 'vaccination', 'pasture_rotation', 'water_management')),
    priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('high', 'medium', 'low')),
    summary TEXT NOT NULL,
    reason TEXT NOT NULL,
    confidence_score INT NOT NULL DEFAULT 90 CHECK (confidence_score BETWEEN 0 AND 100),
    supporting_data JSONB NOT NULL DEFAULT '[]'::jsonb,
    potential_impact TEXT NOT NULL,
    suggested_action_steps JSONB NOT NULL DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'dismissed', 'completed')),
    asset_category TEXT DEFAULT 'mixed',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Disease & Climate Vector Predictions
CREATE TABLE IF NOT EXISTS public.disease_predictions (
    id TEXT PRIMARY KEY DEFAULT ('pred-' || gen_random_uuid()),
    disease_name TEXT NOT NULL,
    pest_name TEXT,
    crop_target TEXT NOT NULL,
    category TEXT NOT NULL DEFAULT 'crop' CHECK (category IN ('crop', 'livestock', 'mixed')),
    risk_level TEXT NOT NULL CHECK (risk_level IN ('Low', 'Medium', 'High', 'Critical')),
    risk_score INT NOT NULL CHECK (risk_score BETWEEN 0 AND 100),
    spread_vector TEXT NOT NULL,
    trigger_factors JSONB NOT NULL DEFAULT '[]'::jsonb,
    mitigation_strategy TEXT NOT NULL,
    predicted_area TEXT NOT NULL,
    outbreak_probability_next_7_days INT NOT NULL CHECK (outbreak_probability_next_7_days BETWEEN 0 AND 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Market Intelligence & Commodity Pricing
CREATE TABLE IF NOT EXISTS public.market_prices (
    id TEXT PRIMARY KEY DEFAULT ('mkt-' || gen_random_uuid()),
    item_category TEXT NOT NULL CHECK (item_category IN ('crop', 'livestock', 'dairy_poultry')),
    item_name TEXT NOT NULL,
    crop_name TEXT,
    market_name TEXT NOT NULL,
    distance_km DOUBLE PRECISION NOT NULL,
    price_per_unit DOUBLE PRECISION NOT NULL,
    unit TEXT NOT NULL DEFAULT 'Kg',
    price_per_kg DOUBLE PRECISION,
    currency TEXT NOT NULL DEFAULT 'USD',
    price_change_percent DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    trend TEXT NOT NULL CHECK (trend IN ('up', 'down', 'stable')),
    advice TEXT NOT NULL,
    region TEXT NOT NULL,
    last_updated TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Alert Notifications
CREATE TABLE IF NOT EXISTS public.alert_notifications (
    id TEXT PRIMARY KEY DEFAULT ('notif-' || gen_random_uuid()),
    farm_id TEXT REFERENCES public.farms(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('flood', 'heatwave', 'pest', 'disease', 'weather_warning', 'harvest_reminder', 'livestock_health')),
    severity TEXT NOT NULL CHECK (severity IN ('info', 'warning', 'critical')),
    message TEXT NOT NULL,
    read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ====================================================================
-- 3. INDEXES FOR PERFORMANCE
-- ====================================================================

CREATE INDEX IF NOT EXISTS idx_farms_user_id ON public.farms(user_id);
CREATE INDEX IF NOT EXISTS idx_farms_category ON public.farms(category);
CREATE INDEX IF NOT EXISTS idx_community_reports_created ON public.community_reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recommendations_farm_id ON public.recommendations(farm_id);
CREATE INDEX IF NOT EXISTS idx_alert_notifications_farm_id ON public.alert_notifications(farm_id);

-- ====================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.farms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disease_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alert_notifications ENABLE ROW LEVEL SECURITY;

-- 4.1 Profiles Security Policies
CREATE POLICY "Public profiles are viewable by authenticated users"
    ON public.profiles FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    TO authenticated
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- 4.2 Farms Security Policies
CREATE POLICY "Users can view their own farms or shared public farms"
    ON public.farms FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY "Authenticated users can create farms"
    ON public.farms FOR INSERT
    TO authenticated, anon
    WITH CHECK (true);

CREATE POLICY "Users can update their own farms"
    ON public.farms FOR UPDATE
    TO authenticated, anon
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Users can delete their own farms"
    ON public.farms FOR DELETE
    TO authenticated, anon
    USING (true);

-- 4.3 Community Reports Security Policies
CREATE POLICY "Community reports are viewable by all users"
    ON public.community_reports FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY "Authenticated users can submit community reports"
    ON public.community_reports FOR INSERT
    TO authenticated, anon
    WITH CHECK (true);

CREATE POLICY "Users can update community reports upvotes or verification"
    ON public.community_reports FOR UPDATE
    TO authenticated, anon
    USING (true);

-- 4.4 Recommendations Security Policies
CREATE POLICY "Recommendations viewable by everyone"
    ON public.recommendations FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY "Recommendations insertable by system or users"
    ON public.recommendations FOR INSERT
    TO authenticated, anon
    WITH CHECK (true);

CREATE POLICY "Recommendations status updatable"
    ON public.recommendations FOR UPDATE
    TO authenticated, anon
    USING (true);

-- 4.5 Disease Predictions Security Policies
CREATE POLICY "Disease predictions viewable by everyone"
    ON public.disease_predictions FOR SELECT
    TO authenticated, anon
    USING (true);

-- 4.6 Market Prices Security Policies
CREATE POLICY "Market prices viewable by everyone"
    ON public.market_prices FOR SELECT
    TO authenticated, anon
    USING (true);

-- 4.7 Alert Notifications Security Policies
CREATE POLICY "Notifications viewable by everyone"
    ON public.alert_notifications FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY "Notifications insertable"
    ON public.alert_notifications FOR INSERT
    TO authenticated, anon
    WITH CHECK (true);

-- ====================================================================
-- 5. AUTOMATIC TRIGGERS & FUNCTIONS
-- ====================================================================

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_farms_updated_at ON public.farms;
CREATE TRIGGER set_farms_updated_at
    BEFORE UPDATE ON public.farms
    FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- ====================================================================
-- 6. INITIAL SEED DATA (Database Records)
-- ====================================================================

-- 6.1 Sample Registered Profiles
INSERT INTO public.profiles (id, name, email, phone, role, country, county, organization, primary_focus)
VALUES
('00000000-0000-0000-0000-000000000001', 'Ian Kipkoech Chirchir', 'iankipkoechchirchir06@gmail.com', '0143791311', 'admin', 'Kenya', 'Uasin Gishu', 'AgriShield AI Developer & Administration', 'Mixed Agribusiness'),
('00000000-0000-0000-0000-000000000002', 'Samuel Kiprop', 'samuel.kiprop@agrishield.org', '+254 712 345 678', 'farmer', 'Kenya', 'Uasin Gishu', 'Eldoret Dairy & Crop Co-operative', 'Mixed Agribusiness')
ON CONFLICT (id) DO NOTHING;

-- 6.2 Sample Registered Farms
INSERT INTO public.farms (id, user_id, name, location_name, country, county, lat, lng, area_hectares, category, crop_type, livestock_type, head_count, planting_date, growth_stage, irrigation_method, soil_type, boundary_coordinates, risk_score, crop_health_score, livestock_health_score, thi_index, water_requirement_liters_per_day, forage_availability_percent)
VALUES
('farm-001', '00000000-0000-0000-0000-000000000002', 'Eldoret Valley Dairy & Maize Shamba', 'Ziwa Ward, Eldoret, Uasin Gishu', 'Kenya', 'Uasin Gishu', 0.5143, 35.2698, 3.8, 'mixed', 'Maize', 'Dairy Cattle (Friesian/Ayrshire)', 28, '2026-03-15', 'Lactation / Milking', 'Borehole / Livestock Trough', 'Loam', '[[0.5155, 35.2680], [0.5160, 35.2715], [0.5130, 35.2710], [0.5125, 35.2675]]'::jsonb, 58, 84, 88, 71.0, 1680.0, 78),
('farm-002', '00000000-0000-0000-0000-000000000002', 'Simba Ridge Goats & Sorghum Shamba', 'Rongai, Nakuru County', 'Kenya', 'Nakuru', -0.1732, 35.8643, 4.5, 'mixed', 'Sorghum', 'Goats & Sheep (Dorper/Galla)', 65, '2026-04-01', 'Grazing & Growth', 'Rainfed', 'Pasture Rangeland', '[]'::jsonb, 64, 76, 82, 75.0, 850.0, 62)
ON CONFLICT (id) DO NOTHING;

-- 6.3 Sample Community Reports
INSERT INTO public.community_reports (id, user_id, user_name, farm_name, report_type, crop_affected, severity, description, photo_url, lat, lng, verified, upvotes, distance_km)
VALUES
('rep-001', '00000000-0000-0000-0000-000000000002', 'David Mwangi', 'Mwangi Dairy & Grain Shamba', 'livestock_disease', 'Dairy Cattle (Friesian)', 'critical', 'East Coast Fever (ECF) tick infestation reported on 4 cows following recent damp pasture growth. High fever and swollen lymph nodes observed.', 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?auto=format&fit=crop&w=600&q=80', 0.5210, 35.2740, TRUE, 18, 1.8),
('rep-002', '00000000-0000-0000-0000-000000000002', 'Mary Chebet', 'Chebet Organics & Poultry', 'pest', 'Maize (Vegetative Stage)', 'high', 'Fall Armyworm larvae clusters sighted on underside of young maize leaves in 2-acre plot. Rapid foliar destruction.', 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=600&q=80', 0.5090, 35.2610, TRUE, 14, 2.4)
ON CONFLICT (id) DO NOTHING;

-- 6.4 Sample AI Recommendations
INSERT INTO public.recommendations (id, farm_id, title, action_type, priority, summary, reason, confidence_score, supporting_data, potential_impact, suggested_action_steps, status, asset_category)
VALUES
('rec-101', 'farm-001', 'Deploy Livestock Shade Nets & Electrolyte Water for Dairy Herd', 'livestock_shelter', 'high', 'Afternoon THI index exceeds thermal neutral zone for Friesian cows. Milk yield drops by 12-18% when unmitigated.', 'High ambient heat combined with relative humidity limits heat dissipation in heavy milking cows.', 96, '["Forecast THI > 72 threshold", "28 Dairy cows under peak lactation", "Hydration requirement increases to 85 Liters/cow/day"]'::jsonb, 'Prevents $320 weekly milk production drop & mitigates mastitis risk', '["Ensure shade structures are open for maximum cross-ventilation.", "Add electrolyte powder or molasses to drinking water troughs by 11:00 AM.", "Provide chilled water or mist sprays during peak afternoon heat."]'::jsonb, 'pending', 'livestock'),
('rec-102', 'farm-001', 'Harvest & Ensile Napier Grass Before Downpour', 'fodder_preservation', 'high', 'Upcoming heavy rain will cause waterlogging in Napier forage plot. Chop and pit ensile to secure 60 days of fodder.', 'Heavy rains risk soil contamination of standing grass fodder.', 91, '["38.4mm precipitation expected", "Forage availability currently at 78%"]'::jsonb, 'Saves 4.5 Tons of clean livestock fodder valued at $550', '["Chop mature Napier grass to 2-3cm pieces today.", "Compress firmly into silage pit with plastic sheeting and soil capping before storm."]'::jsonb, 'pending', 'mixed')
ON CONFLICT (id) DO NOTHING;

-- 6.5 Disease & Climate Vector Predictions
INSERT INTO public.disease_predictions (id, disease_name, pest_name, crop_target, category, risk_level, risk_score, spread_vector, trigger_factors, mitigation_strategy, predicted_area, outbreak_probability_next_7_days)
VALUES
('pred-1', 'East Coast Fever (Theileria parva)', 'Brown Ear Tick Vector', 'Dairy & Beef Cattle', 'livestock', 'Critical', 89, 'High grass humidity post-rain favoring tick activity on pastures', '["Rainfall >35mm", "Overgrown pasture brush", "Neighboring outbreak reports"]'::jsonb, 'Apply synthetic pyrethroid acaricide spray/dip twice weekly; restrict communal grazing.', 'Ziwa / Eldoret North Sector (4km radius)', 88),
('pred-2', 'Rift Valley Fever (Mosquito Vector Alert)', NULL, 'Sheep, Goats & Cattle', 'livestock', 'High', 78, 'Aedes & Culex mosquito breeding in stagnant water bodies', '["Heavy rainfall >30mm", "Flood probability 62%", "Warm night temperatures >18°C"]'::jsonb, 'Vaccinate non-pregnant stock; spray larvicides near standing water pools; stall shelter at night.', 'Rift Valley Lowland Basins', 75),
('pred-3', 'Fall Armyworm (Spodoptera frugiperda)', 'Fall Armyworm Larvae', 'Maize & Sorghum', 'crop', 'High', 82, 'Wind drift carrying adult moths', '["Warm moist temperatures (20-28°C)", "Vegetative growth stage maize"]'::jsonb, 'Apply Bacillus thuringiensis (Bt) or bio-pesticide into leaf whorls early morning.', 'Uasin Gishu Maize Belt', 80)
ON CONFLICT (id) DO NOTHING;

-- 6.6 Market Intelligence & Commodity Pricing
INSERT INTO public.market_prices (id, item_category, item_name, crop_name, market_name, distance_km, price_per_unit, unit, price_per_kg, currency, price_change_percent, trend, advice, region)
VALUES
('mkt-1', 'dairy_poultry', 'Fresh Raw Milk', 'Maize', 'Eldoret Dairy Co-op Depot', 4.2, 0.48, 'Liter', 0.48, 'USD', 8.5, 'up', 'Processors offering +8% bonus for chilled grade-A milk delivered before 8:30 AM.', 'Eldoret'),
('mkt-2', 'crop', 'Dry White Maize', 'Maize', 'NCPB Grain Silo Eldoret', 6.8, 28.5, '90kg Bag', 0.32, 'USD', 4.2, 'up', 'Millers purchasing dry grain at moisture content <13.5%.', 'Uasin Gishu'),
('mkt-3', 'livestock', 'Live Goat (Dorper Breed)', 'Sorghum', 'Kipkaren Livestock Market', 12.0, 68.0, 'Head', 2.2, 'USD', 12.0, 'up', 'High trader demand for fattened bucks ahead of festive weekend.', 'Eldoret West'),
('mkt-4', 'dairy_poultry', 'Kienyeji Eggs (Tray)', 'Tomatoes', 'Nakuru Wholesale Market', 28.0, 3.80, 'Tray', 2.5, 'USD', 3.5, 'stable', 'Strong hotel demand for organic farm-fresh eggs.', 'Nakuru')
ON CONFLICT (id) DO NOTHING;

-- 6.7 Alert Notifications
INSERT INTO public.alert_notifications (id, farm_id, title, type, severity, message, read)
VALUES
('notif-1', 'farm-001', 'Afternoon THI Alert (75 Index)', 'heatwave', 'warning', 'Thermal humidity index has crossed 75. Ensure shade and cool water for dairy cows.', FALSE),
('notif-2', 'farm-001', 'Heavy Rain Forecast (38.4mm)', 'weather_warning', 'info', 'Torrential downpour expected after 2:00 PM. Clear drainage and secure silage.', FALSE)
ON CONFLICT (id) DO NOTHING;
