import { supabase } from './supabase';
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
    // 1. Seed Farms if empty
    const { data: farms, error: farmsErr } = await supabase.from('farms').select('id').limit(1);
    if (!farmsErr && (!farms || farms.length === 0)) {
      console.log('Seeding initial farms to Supabase PostgreSQL...');
      for (const farm of INITIAL_FARMS) {
        await saveFarmToDb(farm);
      }
    }

    // 2. Seed Reports
    const { data: reports, error: repErr } = await supabase.from('community_reports').select('id').limit(1);
    if (!repErr && (!reports || reports.length === 0)) {
      console.log('Seeding community reports to Supabase PostgreSQL...');
      for (const rep of INITIAL_REPORTS) {
        await addReportToDb(rep);
      }
    }

    // 3. Seed Recommendations
    const { data: recs, error: recErr } = await supabase.from('recommendations').select('id').limit(1);
    if (!recErr && (!recs || recs.length === 0)) {
      console.log('Seeding recommendations to Supabase PostgreSQL...');
      await saveRecommendationsToDb(INITIAL_RECOMMENDATIONS);
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
