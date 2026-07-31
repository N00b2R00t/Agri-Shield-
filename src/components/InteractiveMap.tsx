import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Farm, CommunityReport, MarketPrice } from '../types';
import { MapPin, Layers, Bug, CloudRain, AlertTriangle, Store, Plus, Check, Search, Compass } from 'lucide-react';
import { KENYA_COUNTIES, KenyaCounty } from '../data/kenyaCounties';

interface InteractiveMapProps {
  activeFarm?: Farm | null;
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

  const [selectedCountyCode, setSelectedCountyCode] = useState<string>('027'); // Default Uasin Gishu
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [showReports, setShowReports] = useState(true);
  const [showRiskOverlays, setShowRiskOverlays] = useState(true);
  const [showMarkets, setShowMarkets] = useState(true);
  const [clickToReportMode, setClickToReportMode] = useState(false);

  const activeCountyObj = KENYA_COUNTIES.find((c) => c.code === selectedCountyCode) || KENYA_COUNTIES[26];

  // Handle County Selection Fly-To
  const handleCountyChange = (code: string) => {
    setSelectedCountyCode(code);
    const county = KENYA_COUNTIES.find((c) => c.code === code);
    if (county && mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([county.lat, county.lng], 11, {
        duration: 1.2,
      });
    }
  };

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Destroy prior map instance if existing
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    // Initialize Leaflet Map
    const initialLat = activeCountyObj ? activeCountyObj.lat : (activeFarm ? activeFarm.lat : 0.5143);
    const initialLng = activeCountyObj ? activeCountyObj.lng : (activeFarm ? activeFarm.lng : 35.2698);

    const map = L.map(mapContainerRef.current, {
      center: [initialLat, initialLng],
      zoom: 11,
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
    if (showBoundaries && farms && farms.length > 0) {
      farms.forEach((f) => {
        if (!f) return;
        const isCurrent = activeFarm && f.id === activeFarm.id;
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
              <span style="font-size: 11px; color: #6b7280;">County: ${f.county} • Area: ${f.areaHectares} ha</span>
            </div>
          `);
        }

        // Custom Farm Marker
        if (typeof f.lat === 'number' && typeof f.lng === 'number') {
          const farmIcon = L.divIcon({
            className: 'custom-farm-icon',
            html: `<div style="background-color: ${isCurrent ? '#059669' : '#4b5563'}; width: 28px; height: 28px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 12px;">🌾</div>`,
            iconSize: [28, 28],
            iconAnchor: [14, 14],
          });

          const farmMarker = L.marker([f.lat, f.lng], { icon: farmIcon }).addTo(map);
          farmMarker.bindPopup(`<b>${f.name}</b><br/>${f.locationName} (${f.county} County)`);
        }
      });
    }

    // 2. Draw County Focus Pin
    if (activeCountyObj && typeof activeCountyObj.lat === 'number' && typeof activeCountyObj.lng === 'number') {
      const countyIcon = L.divIcon({
        className: 'custom-county-icon',
        html: `<div style="background-color: #2563eb; width: 32px; height: 32px; border-radius: 50%; border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 14px;">📍</div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });
      const cMarker = L.marker([activeCountyObj.lat, activeCountyObj.lng], { icon: countyIcon }).addTo(map);
      cMarker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px;">
          <strong style="font-size: 14px; color: #1e40af;">${activeCountyObj.name} County (${activeCountyObj.code})</strong><br/>
          <span style="font-size: 12px; color: #374151;">Capital: <b>${activeCountyObj.capital}</b> • Region: ${activeCountyObj.region}</span><br/>
          <span style="font-size: 11px; color: #059669; font-weight: bold;">Focus: ${activeCountyObj.primaryAgri}</span>
        </div>
      `);
    }

    // 3. Draw Risk Overlay Circles
    if (showRiskOverlays && typeof initialLat === 'number' && typeof initialLng === 'number') {
      // Armyworm Spread Circle
      L.circle([initialLat + 0.02, initialLng + 0.02], {
        color: '#ef4444',
        fillColor: '#f87171',
        fillOpacity: 0.18,
        radius: 3200,
      })
        .addTo(map)
        .bindPopup('<b>Armyworm / Vector Outbreak Buffer</b><br/>Monitored in ' + (activeCountyObj?.name || 'Local') + ' Sector.');

      // Flood Risk Buffer
      L.circle([initialLat - 0.02, initialLng - 0.01], {
        color: '#3b82f6',
        fillColor: '#60a5fa',
        fillOpacity: 0.22,
        radius: 2200,
      })
        .addTo(map)
        .bindPopup('<b>Riverine / Lowland Flood Buffer</b><br/>High rainfall vulnerability.');
    }

    // 4. Draw Community Reports Pins
    if (showReports && reports && reports.length > 0) {
      reports.forEach((rep) => {
        if (!rep || typeof rep.lat !== 'number' || typeof rep.lng !== 'number') return;
        let color = '#eab308';
        if (rep.severity === 'critical') color = '#dc2626';
        else if (rep.severity === 'high') color = '#f97316';
        else if (rep.severity === 'low') color = '#3b82f6';

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

    // 5. Draw Markets
    if (showMarkets && markets && markets.length > 0) {
      markets.forEach((mkt) => {
        const mktIcon = L.divIcon({
          className: 'custom-mkt-icon',
          html: `<div style="background-color: #059669; width: 22px; height: 22px; border-radius: 6px; border: 2px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; font-size: 10px; color: white;">🏪</div>`,
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        const mMarker = L.marker([initialLat - 0.015, initialLng + 0.025], { icon: mktIcon }).addTo(map);
        mMarker.bindPopup(`<b>${mkt.marketName}</b><br/>${mkt.cropName || mkt.itemName} Price: $${mkt.pricePerUnit}/unit`);
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [activeFarm, farms, reports, markets, showBoundaries, showReports, showRiskOverlays, showMarkets, clickToReportMode, selectedCountyCode]);

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col space-y-0">
      
      {/* Top Bar: Kenya 47 Counties Quick Filter */}
      <div className="p-3 bg-stone-950 border-b border-stone-800 text-stone-100 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <Compass className="w-5 h-5 text-emerald-400 shrink-0 animate-spin-slow" />
          <div className="text-xs font-bold shrink-0">Kenya County GIS (47 Counties):</div>
          
          <select
            value={selectedCountyCode}
            onChange={(e) => handleCountyChange(e.target.value)}
            className="w-full md:w-64 p-1.5 rounded-xl bg-stone-850 border border-stone-700 text-stone-100 font-extrabold text-xs focus:outline-none focus:border-emerald-500"
          >
            {KENYA_COUNTIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} - {c.name} ({c.region})
              </option>
            ))}
          </select>
        </div>

        {activeCountyObj && (
          <div className="text-[11px] text-stone-300 bg-stone-900 border border-stone-800 px-3 py-1 rounded-xl truncate max-w-full">
            <span className="font-extrabold text-emerald-400">{activeCountyObj.name}:</span>{' '}
            <span className="text-stone-400">{activeCountyObj.primaryAgri}</span>
          </div>
        )}
      </div>

      {/* Map Header Layer Controls */}
      <div className="p-3 bg-stone-900 text-stone-100 flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex items-center space-x-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h2 className="text-xs font-bold tracking-tight">
            Map Controls & Risk Vectors
          </h2>
        </div>

        {/* Toggle Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            onClick={() => setShowBoundaries(!showBoundaries)}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors border ${
              showBoundaries ? 'bg-emerald-950 text-emerald-300 border-emerald-700' : 'bg-stone-800 text-stone-400 border-stone-700'
            }`}
          >
            🌾 Farms
          </button>
          <button
            onClick={() => setShowReports(!showReports)}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors border ${
              showReports ? 'bg-amber-950 text-amber-300 border-amber-700' : 'bg-stone-800 text-stone-400 border-stone-700'
            }`}
          >
            ⚠️ Reports ({reports.length})
          </button>
          <button
            onClick={() => setShowRiskOverlays(!showRiskOverlays)}
            className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-colors border ${
              showRiskOverlays ? 'bg-red-950 text-red-300 border-red-700' : 'bg-stone-800 text-stone-400 border-stone-700'
            }`}
          >
            🌊 Hazards
          </button>
          <button
            onClick={() => setClickToReportMode(!clickToReportMode)}
            className={`px-3 py-1 rounded-lg font-black text-xs transition-all flex items-center space-x-1 border ${
              clickToReportMode
                ? 'bg-red-600 text-white border-red-500 animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
            }`}
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{clickToReportMode ? 'Click Map Now' : 'Drop Report Pin'}</span>
          </button>
        </div>
      </div>

      {/* Map Canvas */}
      <div className="relative w-full h-[460px] bg-stone-100">
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Map Legend Floating Overlay */}
        <div className="absolute bottom-4 left-4 bg-stone-900/90 backdrop-blur-md text-stone-200 p-3 rounded-xl border border-stone-700 text-[11px] shadow-lg z-10 space-y-1.5 max-w-[230px]">
          <div className="font-bold text-stone-100 uppercase tracking-wider text-[10px] pb-1 border-b border-stone-800 flex items-center justify-between">
            <span>Map Legend</span>
            <span className="text-emerald-400 font-mono">{activeCountyObj.name}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white" />
            <span>Active Farm ({activeFarm.name})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-blue-600 border border-white" />
            <span>County Center ({activeCountyObj.capital})</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-600 border border-white" />
            <span>Critical Outbreak Report</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded bg-blue-500/40 border border-blue-500" />
            <span>Flood Risk Buffer</span>
          </div>
        </div>
      </div>

    </div>
  );
};
