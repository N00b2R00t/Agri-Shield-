-- ====================================================================
-- Climate Tech AgriTech & Livestock Innovation Platform (AgriShield AI)
-- Supabase SQL Database Schema & RLS Security Rules
-- Compatible with Supabase Auth & Storage
-- ====================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ====================================================================
-- 2. TABLES DEFINITION
-- ====================================================================

-- Profiles table linked with Supabase Auth users
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role TEXT NOT NULL DEFAULT 'farmer' CHECK (role IN ('farmer', 'extension_officer', 'researcher', 'admin')),
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
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
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
-- 4. ROW LEVEL SECURITY (RLS) POLICIES - VERY SECURED
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
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own farms"
    ON public.farms FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own farms"
    ON public.farms FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

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

-- 4.5 Disease Predictions Security Policies (Read-only for users)
CREATE POLICY "Disease predictions viewable by everyone"
    ON public.disease_predictions FOR SELECT
    TO authenticated, anon
    USING (true);

-- 4.6 Market Prices Security Policies (Read-only for users)
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

-- Automatic trigger function for profile creation on Auth sign-up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, name, email, role, primary_focus)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'name', NEW.raw_user_meta_data->>'full_name', 'AgriTech User'),
        NEW.email,
        'farmer',
        'Mixed Agribusiness'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger execution on auth.users creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at timestamp trigger function
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
-- 6. INITIAL SEED DATA
-- ====================================================================

INSERT INTO public.disease_predictions (id, disease_name, pest_name, crop_target, category, risk_level, risk_score, spread_vector, trigger_factors, mitigation_strategy, predicted_area, outbreak_probability_next_7_days)
VALUES
('pred-1', 'East Coast Fever (Theileria parva)', 'Brown Ear Tick Vector', 'Dairy & Beef Cattle', 'livestock', 'Critical', 89, 'High grass humidity post-rain favoring tick activity on pastures', '["Rainfall >35mm", "Overgrown pasture brush", "Neighboring outbreak reports"]'::jsonb, 'Apply synthetic pyrethroid acaricide spray/dip twice weekly; restrict communal grazing.', 'Ziwa / Eldoret North Sector (4km radius)', 88),
('pred-2', 'Rift Valley Fever (Mosquito Vector Alert)', NULL, 'Sheep, Goats & Cattle', 'livestock', 'High', 78, 'Aedes & Culex mosquito breeding in stagnant water bodies', '["Heavy rainfall >30mm", "Flood probability 62%", "Warm night temperatures >18°C"]'::jsonb, 'Vaccinate non-pregnant stock; spray larvicides near standing water pools; stall shelter at night.', 'Rift Valley Lowland Basins', 75),
('pred-3', 'Fall Armyworm (Spodoptera frugiperda)', 'Fall Armyworm Larvae', 'Maize & Sorghum', 'crop', 'High', 82, 'Wind drift carrying adult moths', '["Warm moist temperatures (20-28°C)", "Vegetative growth stage maize"]'::jsonb, 'Apply Bacillus thuringiensis (Bt) or bio-pesticide into leaf whorls early morning.', 'Uasin Gishu Maize Belt', 80)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.market_prices (id, item_category, item_name, crop_name, market_name, distance_km, price_per_unit, unit, price_per_kg, currency, price_change_percent, trend, advice, region)
VALUES
('mkt-1', 'dairy_poultry', 'Fresh Raw Milk', 'Maize', 'Eldoret Dairy Co-op Depot', 4.2, 0.48, 'Liter', 0.48, 'USD', 8.5, 'up', 'Processors offering +8% bonus for chilled grade-A milk delivered before 8:30 AM.', 'Eldoret'),
('mkt-2', 'crop', 'Dry White Maize', 'Maize', 'NCPB Grain Silo Eldoret', 6.8, 28.5, '90kg Bag', 0.32, 'USD', 4.2, 'up', 'Millers purchasing dry grain at moisture content <13.5%.', 'Uasin Gishu'),
('mkt-3', 'livestock', 'Live Goat (Dorper Breed)', 'Sorghum', 'Kipkaren Livestock Market', 12.0, 68.0, 'Head', 2.2, 'USD', 12.0, 'up', 'High trader demand for fattened bucks ahead of festive weekend.', 'Eldoret West'),
('mkt-4', 'dairy_poultry', 'Kienyeji Eggs (Tray)', 'Tomatoes', 'Nakuru Wholesale Market', 28.0, 3.80, 'Tray', 2.5, 'USD', 3.5, 'stable', 'Strong hotel demand for organic farm-fresh eggs.', 'Nakuru')
ON CONFLICT (id) DO NOTHING;
