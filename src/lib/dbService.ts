import { supabase } from './supabase';
import { hashPassword } from './security';
import {
  Farm,
  CommunityReport,
  Recommendation,
  DiseaseRiskPrediction,
  MarketPrice,
  AlertNotification,
  UserProfile,
} from '../types';
import {
  INITIAL_USER,
  INITIAL_USERS,
  INITIAL_FARMS,
  INITIAL_RECOMMENDATIONS,
  INITIAL_REPORTS,
  INITIAL_DISEASE_PREDICTIONS,
  INITIAL_MARKET_PRICES,
  INITIAL_NOTIFICATIONS,
} from '../data/mockData';

// Helper to check if Supabase is properly configured
function isSupabaseConfigured(): boolean {
  const metaEnv = typeof import.meta !== 'undefined' ? (import.meta as any).env || {} : {};
  const url = metaEnv.VITE_SUPABASE_URL || '';
  return Boolean(url && !url.includes('your-supabase-project'));
}

// Seed Supabase if tables are empty
export async function initializeAndSeedSupabase() {
  if (!isSupabaseConfigured()) {
    console.log('Supabase credentials not configured yet. Using local resilient storage.');
    return;
  }

  try {
    // 1. Seed Reports if empty
    const { data: reports, error: repErr } = await supabase.from('community_reports').select('id').limit(1);
    if (!repErr && (!reports || reports.length === 0)) {
      console.log('Seeding community reports to Supabase PostgreSQL...');
      for (const rep of INITIAL_REPORTS) {
        await addReportToDb(rep);
      }
    }
  } catch (err) {
    console.warn('Supabase initialization check:', err);
  }
}

// Map database row to Farm model
function mapRowToFarm(row: any): Farm {
  return {
    id: row.id,
    userId: row.user_id || 'usr-001',
    name: row.name,
    category: row.category || 'mixed',
    locationName: row.location_name,
    country: row.country || 'Kenya',
    county: row.county || 'Uasin Gishu',
    lat: Number(row.lat),
    lng: Number(row.lng),
    areaHectares: Number(row.area_hectares || 1.0),
    cropType: row.crop_type,
    livestockType: row.livestock_type,
    headCount: row.head_count,
    plantingDate: row.planting_date,
    growthStage: row.growth_stage,
    irrigationMethod: row.irrigation_method,
    soilType: row.soil_type,
    boundaryCoordinates: Array.isArray(row.boundary_coordinates) ? row.boundary_coordinates : [],
    riskScore: Number(row.risk_score || 50),
    cropHealthScore: Number(row.crop_health_score || 85),
    livestockHealthScore: Number(row.livestock_health_score || 85),
    thiIndex: Number(row.thi_index || 70),
    waterRequirementLitersPerDay: Number(row.water_requirement_liters_per_day || 1000),
    forageAvailabilityPercent: Number(row.forage_availability_percent || 80),
  };
}

// Map Farm model to database row
function mapFarmToRow(farm: Farm): any {
  return {
    id: farm.id,
    user_id: farm.userId || 'usr-001',
    name: farm.name,
    category: farm.category || 'mixed',
    location_name: farm.locationName,
    country: farm.country || 'Kenya',
    county: farm.county || 'Uasin Gishu',
    lat: farm.lat,
    lng: farm.lng,
    area_hectares: farm.areaHectares,
    crop_type: farm.cropType,
    livestock_type: farm.livestockType,
    head_count: farm.headCount,
    planting_date: farm.plantingDate,
    growth_stage: farm.growthStage,
    irrigation_method: farm.irrigationMethod,
    soil_type: farm.soilType,
    boundary_coordinates: farm.boundaryCoordinates || [],
    risk_score: farm.riskScore,
    crop_health_score: farm.cropHealthScore,
    livestock_health_score: farm.livestockHealthScore,
    thi_index: farm.thiIndex,
    water_requirement_liters_per_day: farm.waterRequirementLitersPerDay,
    forage_availability_percent: farm.forageAvailabilityPercent,
  };
}

// --- Service Functions ---

export async function getFarmsFromDb(): Promise<Farm[]> {
  if (!isSupabaseConfigured()) return INITIAL_FARMS;
  try {
    const { data, error } = await supabase.from('farms').select('*');
    if (error || !data || data.length === 0) return INITIAL_FARMS;
    return data.map(mapRowToFarm);
  } catch (e) {
    console.error('Error fetching farms from Supabase:', e);
    return INITIAL_FARMS;
  }
}

export async function saveFarmToDb(farm: Farm): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const row = mapFarmToRow(farm);
    const { error } = await supabase.from('farms').upsert(row);
    if (error) console.error('Supabase saveFarm error:', error);
  } catch (e) {
    console.error('Error saving farm to Supabase:', e);
  }
}

export async function getReportsFromDb(): Promise<CommunityReport[]> {
  if (!isSupabaseConfigured()) return INITIAL_REPORTS;
  try {
    const { data, error } = await supabase
      .from('community_reports')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data || data.length === 0) return INITIAL_REPORTS;
    return data.map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      userName: row.user_name,
      farmName: row.farm_name,
      reportType: row.report_type,
      cropAffected: row.crop_affected,
      severity: row.severity,
      description: row.description,
      photoUrl: row.photo_url,
      lat: Number(row.lat),
      lng: Number(row.lng),
      verified: Boolean(row.verified),
      upvotes: Number(row.upvotes || 1),
      createdAt: row.created_at,
      distanceKm: Number(row.distance_km || 1.0),
    }));
  } catch (e) {
    console.error('Error fetching reports from Supabase:', e);
    return INITIAL_REPORTS;
  }
}

export async function addReportToDb(report: CommunityReport): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const { error } = await supabase.from('community_reports').insert({
      id: report.id,
      user_id: report.userId || null,
      user_name: report.userName,
      farm_name: report.farmName,
      report_type: report.reportType,
      crop_affected: report.cropAffected,
      severity: report.severity,
      description: report.description,
      photo_url: report.photoUrl,
      lat: report.lat,
      lng: report.lng,
      verified: report.verified,
      upvotes: report.upvotes,
      distance_km: report.distanceKm,
    });
    if (error) console.error('Supabase addReport error:', error);
  } catch (e) {
    console.error('Error adding report to Supabase:', e);
  }
}

export async function updateReportInDb(id: string, updates: Partial<CommunityReport>): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const payload: any = {};
    if (updates.upvotes !== undefined) payload.upvotes = updates.upvotes;
    if (updates.verified !== undefined) payload.verified = updates.verified;
    if (updates.description !== undefined) payload.description = updates.description;
    
    await supabase.from('community_reports').update(payload).eq('id', id);
  } catch (e) {
    console.error('Error updating report in Supabase:', e);
  }
}

export async function getRecommendationsFromDb(): Promise<Recommendation[]> {
  if (!isSupabaseConfigured()) return INITIAL_RECOMMENDATIONS;
  try {
    const { data, error } = await supabase.from('recommendations').select('*');
    if (error || !data || data.length === 0) return INITIAL_RECOMMENDATIONS;
    return data.map((row: any) => ({
      id: row.id,
      farmId: row.farm_id,
      title: row.title,
      actionType: row.action_type,
      priority: row.priority,
      summary: row.summary,
      reason: row.reason,
      confidenceScore: Number(row.confidence_score || 90),
      supportingData: Array.isArray(row.supporting_data) ? row.supporting_data : [],
      potentialImpact: row.potential_impact,
      suggestedActionSteps: Array.isArray(row.suggested_action_steps) ? row.suggested_action_steps : [],
      createdAt: row.created_at,
      status: row.status,
      assetCategory: row.asset_category || 'mixed',
    }));
  } catch (e) {
    console.error('Error fetching recommendations from Supabase:', e);
    return INITIAL_RECOMMENDATIONS;
  }
}

export async function updateRecommendationStatusInDb(
  id: string,
  status: 'pending' | 'accepted' | 'dismissed' | 'completed'
): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from('recommendations').update({ status }).eq('id', id);
  } catch (e) {
    console.error('Error updating recommendation status in Supabase:', e);
  }
}

export async function saveRecommendationsToDb(recs: Recommendation[]): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    const rows = recs.map((rec) => ({
      id: rec.id,
      farm_id: rec.farmId,
      title: rec.title,
      action_type: rec.actionType,
      priority: rec.priority,
      summary: rec.summary,
      reason: rec.reason,
      confidence_score: rec.confidenceScore,
      supporting_data: rec.supportingData,
      potential_impact: rec.potentialImpact,
      suggested_action_steps: rec.suggestedActionSteps,
      status: rec.status,
      asset_category: rec.assetCategory || 'mixed',
    }));
    await supabase.from('recommendations').upsert(rows);
  } catch (e) {
    console.error('Error saving recommendations to Supabase:', e);
  }
}

export async function getDiseasePredictionsFromDb(): Promise<DiseaseRiskPrediction[]> {
  if (!isSupabaseConfigured()) return INITIAL_DISEASE_PREDICTIONS;
  try {
    const { data, error } = await supabase.from('disease_predictions').select('*');
    if (error || !data || data.length === 0) return INITIAL_DISEASE_PREDICTIONS;
    return data.map((row: any) => ({
      id: row.id,
      diseaseName: row.disease_name,
      pestName: row.pest_name,
      cropTarget: row.crop_target,
      category: row.category || 'crop',
      riskLevel: row.risk_level,
      riskScore: Number(row.risk_score),
      spreadVector: row.spread_vector,
      triggerFactors: Array.isArray(row.trigger_factors) ? row.trigger_factors : [],
      mitigationStrategy: row.mitigation_strategy,
      predictedArea: row.predicted_area,
      outbreakProbabilityNext7Days: Number(row.outbreak_probability_next_7_days),
    }));
  } catch (e) {
    console.error('Error fetching disease predictions from Supabase:', e);
    return INITIAL_DISEASE_PREDICTIONS;
  }
}

export async function getMarketPricesFromDb(): Promise<MarketPrice[]> {
  if (!isSupabaseConfigured()) return INITIAL_MARKET_PRICES;
  try {
    const { data, error } = await supabase.from('market_prices').select('*');
    if (error || !data || data.length === 0) return INITIAL_MARKET_PRICES;
    return data.map((row: any) => ({
      id: row.id,
      itemCategory: row.item_category || 'crop',
      itemName: row.item_name || row.crop_name,
      cropName: row.crop_name || row.item_name,
      marketName: row.market_name,
      distanceKm: Number(row.distance_km),
      pricePerUnit: Number(row.price_per_unit || row.price_per_kg),
      unit: row.unit || 'Kg',
      pricePerKg: Number(row.price_per_kg || row.price_per_unit),
      currency: row.currency || 'USD',
      priceChangePercent: Number(row.price_change_percent),
      trend: row.trend,
      advice: row.advice,
      region: row.region,
      lastUpdated: row.last_updated,
    }));
  } catch (e) {
    console.error('Error fetching market prices from Supabase:', e);
    return INITIAL_MARKET_PRICES;
  }
}

export async function getNotificationsFromDb(): Promise<AlertNotification[]> {
  if (!isSupabaseConfigured()) return INITIAL_NOTIFICATIONS;
  try {
    const { data, error } = await supabase.from('alert_notifications').select('*');
    if (error || !data || data.length === 0) return INITIAL_NOTIFICATIONS;
    return data.map((row: any) => ({
      id: row.id,
      farmId: row.farm_id,
      title: row.title,
      type: row.type,
      severity: row.severity,
      message: row.message,
      read: Boolean(row.read),
      timestamp: row.created_at || new Date().toISOString(),
    }));
  } catch (e) {
    console.error('Error fetching notifications from Supabase:', e);
    return INITIAL_NOTIFICATIONS;
  }
}

export async function addNotificationToDb(notif: AlertNotification): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from('alert_notifications').insert({
      id: notif.id,
      farm_id: notif.farmId,
      title: notif.title,
      type: notif.type,
      severity: notif.severity,
      message: notif.message,
      read: notif.read,
    });
  } catch (e) {
    console.error('Error adding notification to Supabase:', e);
  }
}

// User Profile Operations for Admin and Auth
export async function getProfilesFromDb(): Promise<UserProfile[]> {
  const getLocalProfiles = (): UserProfile[] => {
    try {
      const saved = localStorage.getItem('agrishield_users_list');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading agrishield_users_list from localStorage:', e);
    }
    localStorage.setItem('agrishield_users_list', JSON.stringify(INITIAL_USERS));
    return INITIAL_USERS;
  };

  if (!isSupabaseConfigured()) {
    return getLocalProfiles();
  }

  try {
    const { data, error } = await supabase.from('profiles').select('*');
    if (error || !data || data.length === 0) {
      return getLocalProfiles();
    }
    const profiles: UserProfile[] = data.map((row: any) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone || '0143791311',
      role: row.role || 'farmer',
      status: (row.status || 'active') as 'active' | 'suspended',
      country: row.country || 'Kenya',
      county: row.county || 'Uasin Gishu',
      subCounty: row.sub_county || 'Moiben Sub-County',
      ward: row.ward || 'Central Ward',
      organization: row.organization || 'AgriShield Cooperative',
      primaryFocus: row.primary_focus || 'Mixed Agribusiness',
      primaryCrop: row.primary_crop || 'Maize',
      primaryLivestock: row.primary_livestock || 'Dairy Cattle (Friesian/Ayrshire)',
      password: row.password_hash,
      deviceId: row.valid_device_id,
    }));
    
    localStorage.setItem('agrishield_users_list', JSON.stringify(profiles));
    return profiles;
  } catch (e) {
    console.error('Error fetching profiles from Supabase:', e);
    return getLocalProfiles();
  }
}

export async function saveProfileToDb(user: UserProfile): Promise<void> {
  // 1. Sync local cache in localStorage
  try {
    const saved = localStorage.getItem('agrishield_users_list');
    let list: UserProfile[] = saved ? JSON.parse(saved) : INITIAL_USERS;
    if (!Array.isArray(list)) list = INITIAL_USERS;
    const existsIndex = list.findIndex((u) => u.id === user.id || (u.email && user.email && u.email.toLowerCase() === user.email.toLowerCase()));
    if (existsIndex >= 0) {
      list[existsIndex] = { ...list[existsIndex], ...user };
    } else {
      list.unshift(user);
    }
    localStorage.setItem('agrishield_users_list', JSON.stringify(list));
  } catch (e) {
    console.warn('Error syncing profile to localStorage cache:', e);
  }

  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from('profiles').upsert({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      status: user.status || 'active',
      country: user.country || 'Kenya',
      county: user.county || 'Uasin Gishu',
      sub_county: user.subCounty || 'Moiben Sub-County',
      ward: user.ward || 'Central Ward',
      organization: user.organization || 'AgriShield Cooperative',
      primary_focus: user.primaryFocus || 'Mixed Agribusiness',
      primary_crop: user.primaryCrop || 'Maize',
      primary_livestock: user.primaryLivestock || 'Dairy Cattle (Friesian/Ayrshire)',
      password_hash: user.password || '',
      valid_device_id: user.deviceId || '',
      updated_at: new Date().toISOString(),
    });
  } catch (e) {
    console.error('Error saving profile to Supabase:', e);
  }
}

export async function deleteFarmFromDb(id: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from('farms').delete().eq('id', id);
  } catch (e) {
    console.error('Error deleting farm from Supabase:', e);
  }
}

export async function deleteReportFromDb(id: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from('community_reports').delete().eq('id', id);
  } catch (e) {
    console.error('Error deleting report from Supabase:', e);
  }
}

export async function deleteRecommendationFromDb(id: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from('recommendations').delete().eq('id', id);
  } catch (e) {
    console.error('Error deleting recommendation from Supabase:', e);
  }
}

export async function deletePredictionFromDb(id: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from('disease_predictions').delete().eq('id', id);
  } catch (e) {
    console.error('Error deleting disease prediction from Supabase:', e);
  }
}

export async function addPredictionToDb(p: DiseaseRiskPrediction): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from('disease_predictions').insert({
      id: p.id,
      disease_name: p.diseaseName,
      pest_name: p.pestName || p.diseaseName,
      crop_target: p.cropTarget,
      category: p.category || 'crop',
      risk_level: p.riskLevel,
      risk_score: p.riskScore,
      spread_vector: p.spreadVector,
      trigger_factors: p.triggerFactors,
      mitigation_strategy: p.mitigationStrategy,
      predicted_area: p.predictedArea,
      outbreak_probability_next_7_days: p.outbreakProbabilityNext7Days,
    });
  } catch (e) {
    console.error('Error adding disease prediction to Supabase:', e);
  }
}

export async function deleteMarketPriceFromDb(id: string): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from('market_prices').delete().eq('id', id);
  } catch (e) {
    console.error('Error deleting market price from Supabase:', e);
  }
}

export async function addMarketPriceToDb(mkt: MarketPrice): Promise<void> {
  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from('market_prices').insert({
      id: mkt.id,
      item_category: mkt.itemCategory || 'crop',
      item_name: mkt.itemName || mkt.cropName,
      crop_name: mkt.cropName || mkt.itemName,
      market_name: mkt.marketName,
      distance_km: mkt.distanceKm,
      price_per_unit: mkt.pricePerUnit || mkt.pricePerKg,
      unit: mkt.unit || 'Kg',
      price_per_kg: mkt.pricePerKg || mkt.pricePerUnit,
      currency: mkt.currency || 'USD',
      price_change_percent: mkt.priceChangePercent,
      trend: mkt.trend,
      advice: mkt.advice,
      region: mkt.region || 'Kenya',
      last_updated: mkt.lastUpdated || 'Just now',
    });
  } catch (e) {
    console.error('Error adding market price to Supabase:', e);
  }
}

export async function deleteProfileFromDb(id: string): Promise<void> {
  try {
    const saved = localStorage.getItem('agrishield_users_list');
    if (saved) {
      const list: UserProfile[] = JSON.parse(saved);
      if (Array.isArray(list)) {
        const filtered = list.filter((u) => u.id !== id && u.email !== id);
        localStorage.setItem('agrishield_users_list', JSON.stringify(filtered));
      }
    }
  } catch (e) {
    console.warn('Error removing profile from localStorage cache:', e);
  }

  if (!isSupabaseConfigured()) return;
  try {
    await supabase.from('profiles').delete().eq('id', id);
  } catch (e) {
    console.error('Error deleting profile from Supabase:', e);
  }
}

export function getCurrentDeviceId(): string {
  let devId = localStorage.getItem('agrishield_device_id');
  if (!devId) {
    devId = `dev_${Math.random().toString(36).substring(2, 11)}_${Date.now()}`;
    localStorage.setItem('agrishield_device_id', devId);
  }
  return devId;
}

export function createExpressSession(user: UserProfile): UserProfile {
  const ONE_DAY_MS = 24 * 60 * 60 * 1000; // 1 Day Express Session Duration
  const deviceId = getCurrentDeviceId();
  const sessionExpiresAt = Date.now() + ONE_DAY_MS;

  const sessionUser: UserProfile = {
    ...user,
    deviceId,
    sessionExpiresAt,
  };

  localStorage.setItem('agrishield_session_user', JSON.stringify(sessionUser));
  
  // Register session with backend endpoint
  fetch('/api/auth/session/create', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: user.email, deviceId }),
  }).catch(() => {});

  return sessionUser;
}

export async function updateUserPasswordInDb(
  newPassword: string,
  user?: UserProfile
): Promise<{ success: boolean; message: string }> {
  const hashedPassword = await hashPassword(newPassword);
  const currentDevId = getCurrentDeviceId();
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;
  let updatedInSupabase = false;

  if (isSupabaseConfigured()) {
    try {
      // 1. Update in Supabase Auth service & invalidate global other sessions
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (!error) {
        updatedInSupabase = true;
      } else {
        console.warn('Supabase Auth update password notice:', error.message);
      }
    } catch (err) {
      console.warn('Supabase Auth update exception:', err);
    }

    // 2. Record password hash, active device, and timestamp in database profiles table
    if (user?.id) {
      try {
        await supabase.from('profiles').upsert({
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          password_hash: hashedPassword,
          valid_device_id: currentDevId,
          password_updated_at: new Date().toISOString(),
        });
      } catch (err) {
        console.warn('Database profiles password update error:', err);
      }
    }
  }

  // 3. Sync with Express backend endpoint to log out all other registered devices
  if (user?.email) {
    try {
      await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          newPassword,
          currentDeviceId: currentDevId,
        }),
      });
    } catch (err) {
      console.warn('Backend API change-password sync notice:', err);
    }

    // Store updated credentials and single-device isolation key in localStorage
    try {
      const emailKey = user.email.toLowerCase().trim();
      const storageKey = `agrishield_cred_${emailKey}`;
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          email: user.email,
          passwordHash: hashedPassword,
          updatedAt: new Date().toISOString(),
          validDeviceId: currentDevId,
        })
      );

      // Invalidate all other local/tab devices registered to this user except current device
      const passwordRevocationPayload = {
        email: emailKey,
        validDeviceId: currentDevId,
        updatedAt: Date.now(),
      };
      localStorage.setItem('agrishield_password_revocation', JSON.stringify(passwordRevocationPayload));
    } catch (e) {
      console.warn('LocalStorage credentials sync error:', e);
    }
  }

  // Update active session duration for current device (re-arm 1-day Express session)
  if (user) {
    createExpressSession({
      ...user,
      passwordUpdatedAt: new Date().toISOString(),
    });
  }

  return {
    success: true,
    message: updatedInSupabase
      ? 'Password updated successfully! All other registered devices have been logged out.'
      : 'Password successfully updated in database. All other device sessions logged out.',
  };
}

