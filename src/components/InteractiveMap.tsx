import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Farm, CommunityReport, MarketPrice } from '../types';
import { MapPin, Layers, Bug, CloudRain, AlertTriangle, Store, Plus, Check } from 'lucide-react';

interface InteractiveMapProps {
  activeFarm: Farm;
  farms: Farm[];
  reports: CommunityReport[];
  markets: MarketPrice[];
  onReportClick?: (report: CommunityReport) => void;
  onRequestNewReport: (lat: number, lng: number) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({
  activeFarm,
  farms,
  reports,
  markets,
  onReportClick,
  onRequestNewReport,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);

  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showReports, setShowReports] = useState(true);
  const [showRiskOverlays, setShowRiskOverlays] = useState(true);
  const [showMarkets, setShowMarkets] = useState(true);
  const [clickToReportMode, setClickToReportMode] = useState(false);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy prior map instance if existing
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Leaflet Map
    const map = L.map(mapContainerRef.current, {
      center: [activeFarm.lat, activeFarm.lng],
      zoom: 13,
      zoomControl: true,
    });

    mapInstanceRef.current = map;

    // Tile Layer: CartoDB Positron / OpenStreetMap standard
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
      maxZoom: 19,
    }).addTo(map);

    // Click handler for dropping reports
    map.on('click', (e: L.LeafletMouseEvent) => {
      if (clickToReportMode) {
        onRequestNewReport(e.latlng.lat, e.latlng.lng);
        setClickToReportMode(false);
      }
    });

    // 1. Draw Active Farm Polygon & Marker
    if (showBoundaries) {
      farms.forEach((f) => {
        const isCurrent = f.id === activeFarm.id;
        if (f.boundaryCoordinates && f.boundaryCoordinates.length >= 3) {
          const poly = L.polygon(f.boundaryCoordinates as L.LatLngTuple[], {
            color: isCurrent ? '#10b981' : '#6b7280',
            fillColor: isCurrent ? '#10b981' : '#9ca3af',
            fillOpacity: isCurrent ? 0.35 : 0.15,
            weight: isCurrent ? 3 : 1.5,
          }).addTo(map);

          poly.bindPopup(`
            <div style="font-family: sans-serif; padding: 4px;">
              <strong style="font-size: 14px; color: #064e3b;">${f.name}</strong><br/>
              <span style="font-size: 12px; color: #374151;">Crop: <b>${f.cropType}</b> (${f.growthStage})</span><br/>
              <span style="font-size: 11px; color: #6b7280;">Area: ${f.areaHectares} ha • Soil: ${f.soilType}</span>
            </div>
          `);
        }

        // Custom Farm Marker
        const farmIcon = L.divIcon({
          className: 'custom-farm-icon',
          html: `<div style="background-color: ${isCurrent ? '#059669' : '#4b5563'}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">🌾</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
        });

        const farmMarker = L.marker([f.lat, f.lng], { icon: farmIcon }).addTo(map);
        farmMarker.bindPopup(`<b>${f.name}</b><br/>${f.locationName}`);
      });
    }

    // 2. Draw Risk Overlay Circles (Flood Risk Zone & Pest Spread Buffer)
    if (showRiskOverlays) {
      // Armyworm Spread Circle around Nakuru
      L.circle([-0.168, 35.871], {
        color: '#ef4444',
        fillColor: '#f87171',
        fillOpacity: 0.18,
        radius: 2800, // 2.8 km spread buffer
      })
        .addTo(map)
        .bindPopup('<b>Armyworm Outbreak Vector Buffer</b><br/>High probability of windward spread towards North-East.');

      // Flood Risk Buffer around River lowlands
      L.circle([-0.19, 35.882], {
        color: '#3b82f6',
        fillColor: '#60a5fa',
        fillOpacity: 0.22,
        radius: 1800,
      })
        .addTo(map)
        .bindPopup('<b>Riverine Flash Flood Hazard Zone</b><br/>38mm downpour expected in next 24 hours.');
    }

    // 3. Draw Community Reports Pins
    if (showReports) {
      reports.forEach((rep) => {
        let color = '#eab308'; // medium = yellow
        if (rep.severity === 'critical') color = '#dc2626'; // red
        else if (rep.severity === 'high') color = '#f97316'; // orange
        else if (rep.severity === 'low') color = '#3b82f6'; // blue

        const iconHtml = `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 11px;">⚠️</div>`;

        const repIcon = L.divIcon({
          className: 'custom-report-icon',
          html: iconHtml,
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([rep.lat, rep.lng], { icon: repIcon }).addTo(map);

        marker.bindPopup(`
          <div style="font-family: sans-serif; max-width: 200px;">
            <div style="font-weight: bold; color: ${color}; text-transform: uppercase; font-size: 10px;">${rep.severity} ${rep.reportType}</div>
            <div style="font-size: 13px; font-weight: bold;">${rep.cropAffected} - ${rep.farmName}</div>
            <p style="font-size: 11px; color: #4b5563; margin: 4px 0;">${rep.description}</p>
            <div style="font-size: 10px; color: #9ca3af;">Reported by ${rep.userName}</div>
          </div>
        `);

        if (onReportClick) {
          marker.on('click', () => onReportClick(rep));
        }
      });
    }

    // 4. Draw Markets
    if (showMarkets) {
      markets.forEach((mkt) => {
        const mktIcon = L.divIcon({
          className: 'custom-mkt-icon',
          html: `<div style="background-color: #059669; width: 22px; height: 22px; border-radius: 6px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 10px; color: white;">🏪</div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        const mMarker = L.marker([activeFarm.lat - 0.02, activeFarm.lng + 0.03], { icon: mktIcon }).addTo(map);
        mMarker.bindPopup(`<b>${mkt.marketName}</b><br/>${mkt.cropName} Price: $${mkt.pricePerKg}/kg (${mkt.priceChangePercent > 0 ? '+' : ''}${mkt.priceChangePercent}%)`);
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [activeFarm, farms, reports, markets, showBoundaries, showReports, showRiskOverlays, showMarkets, clickToReportMode]);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col">
      
      {/* Map Header Controls */}
      <div className="p-4 bg-stone-900 text-stone-100 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center space-x-2">
          <Layers className="w-5 h-5 text-emerald-400" />
          <h2 className="text-sm font-bold tracking-tight">
            Interactive Climate & GIS Map Layer
          </h2>
          <span className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-mono">
            OpenStreetMap GIS
          </span>
        </div>

        {/* Toggle Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setShowBoundaries(!showBoundaries)}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors border ${
              showBoundaries ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-stone-800 text-stone-400 border-stone-700'
            }`}
          >
            🌾 Farm Boundaries
          </button>
          <button
            onClick={() => setShowReports(!showReports)}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors border ${
              showReports ? 'bg-amber-950 text-amber-300 border-amber-700' : 'bg-stone-800 text-stone-400 border-stone-700'
            }`}
          >
            ⚠️ Outbreak Reports ({reports.length})
          </button>
          <button
            onClick={() => setShowRiskOverlays(!showRiskOverlays)}
            className={`px-2.5 py-1 rounded-lg font-medium transition-colors border ${
              showRiskOverlays ? 'bg-red-950 text-red-300 border-red-700' : 'bg-stone-800 text-stone-400 border-stone-700'
            }`}
          >
            🌊 Flood & Pest Buffers
          </button>
          <button
            onClick={() => setClickToReportMode(!clickToReportMode)}
            className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center space-x-1 border ${
              clickToReportMode
                ? 'bg-red-600 text-white border-red-500 animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{clickToReportMode ? 'Click Map Position Now' : 'Drop Report Pin'}</span>
          </button>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative w-full h-[450px] bg-stone-100">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Map Legend Floating Overlay */}
        <div className="absolute bottom-4 left-4 bg-stone-900/90 backdrop-blur-md text-stone-200 p-3 rounded-xl border border-stone-700 text-[11px] shadow-lg z-10 space-y-1.5 max-w-[220px]">
          <div className="font-bold text-stone-100 uppercase tracking-wider text-[10px] pb-1 border-b border-stone-800">
            Map Intelligence Key
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white" />
            <span>Active Farm ({activeFarm.name})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-600 border border-white" />
            <span>Critical Outbreak Report</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 border border-white" />
            <span>High Hazard Pest/Disease</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded bg-blue-500/40 border border-blue-500" />
            <span>River Flood Hazard Zone</span>
          </div>
        </div>
      </div>

    </div>
  );
};
