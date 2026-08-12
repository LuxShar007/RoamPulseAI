import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { LocateFixed, ChevronRight } from 'lucide-react';
import PinBottomSheet from './PinBottomSheet';
import { useFramePacing } from '../utils/frameScheduler.js';


// ─── Custom DivIcon Makers ────────────────────────────────────────────────────
function makeDivIcon(emoji, color, shadowColor) {
  return L.divIcon({
    html: `
      <div style="
        width:38px; height:38px; border-radius:50%;
        background:${color}; border:3px solid rgba(255,255,255,0.9);
        display:flex; align-items:center; justify-content:center;
        font-size:17px; cursor:pointer;
        box-shadow:0 0 16px ${shadowColor}, 0 4px 10px rgba(0,0,0,0.6);
        transition:transform 0.15s ease;
      ">${emoji}</div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -20],
    className: ''
  });
}

const MEDICAL_ICON  = makeDivIcon('🏥', '#EF4444', 'rgba(239,68,68,0.7)');
const POLICE_ICON   = makeDivIcon('🚓', '#3B82F6', 'rgba(59,130,246,0.8)');
const WASHROOM_ICON = makeDivIcon('🚽', '#06B6D4', 'rgba(6,182,212,0.7)');
const STAY_ICON     = makeDivIcon('🏠', '#22C55E', 'rgba(34,197,94,0.7)');
const FOOD_ICON     = makeDivIcon('🍲', '#F59E0B', 'rgba(245,158,11,0.7)');
const USER_ICON     = L.divIcon({
  html: `
    <div style="
      width:22px; height:22px; border-radius:50%;
      background:#00F2FE; border:3px solid #fff;
      box-shadow:0 0 0 0 rgba(0,242,254,0.5);
      animation:userPulse 2s ease-in-out infinite;
    "></div>
    <style>
      @keyframes userPulse {
        0%,100%{box-shadow:0 0 0 0 rgba(0,242,254,0.5)}
        50%{box-shadow:0 0 0 14px rgba(0,242,254,0)}
      }
    </style>`,
  iconSize: [22, 22],
  iconAnchor: [11, 11],
  className: ''
});

const DEFAULT_CENTER = [18.989, 73.117];
const DARK_TILE_URL = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const DARK_TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>';

export default function RadarMap({ medicalHubs, washrooms, policeStations, stays, locogems, userCenter, onNavigate }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersGroupRef = useRef(null);
  const filterScrollRef = useRef(null);

  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedPin, setSelectedPin] = useState(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const userPos = userCenter || DEFAULT_CENTER;

  const handleMouseDown = (e) => {
    setIsMouseDown(true);
    if (!filterScrollRef.current) return;
    setStartX(e.pageX - filterScrollRef.current.offsetLeft);
    setScrollLeftState(filterScrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => setIsMouseDown(false);
  const handleMouseUp = () => setIsMouseDown(false);

  const handleMouseMove = (e) => {
    if (!isMouseDown || !filterScrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - filterScrollRef.current.offsetLeft;
    const walk = (x - startX) * 1.8;
    filterScrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  // 240Hz Frame Scheduler integration for smooth radar animation
  useFramePacing();


  // Initialise Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    const map = L.map(mapContainerRef.current, {
      center: userPos,
      zoom: 14,
      zoomControl: false,
      attributionControl: true
    });

    L.tileLayer(DARK_TILE_URL, {
      attribution: DARK_TILE_ATTRIBUTION,
      maxZoom: 19
    }).addTo(map);

    markersGroupRef.current = L.layerGroup().addTo(map);
    mapInstanceRef.current = map;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, [userPos]);

  // Re-center when userPos changes
  useEffect(() => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setView(userPos, 14);
    }
  }, [userPos]);

  // Render markers
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    // User Location Marker
    const userMarker = L.marker(userPos, { icon: USER_ICON });
    userMarker.bindPopup(`
      <div style="text-align:center; padding:4px;">
        <div style="font-size:13px; font-weight:800; color:#00F2FE;">📍 Your Locality</div>
        <div style="font-size:11px; color:#94A3B8; margin-top:2px;">Real-Time OpenStreetMap Active</div>
      </div>
    `);
    markersGroup.addLayer(userMarker);

    const showPolice    = activeFilter === 'all' || activeFilter === 'police';
    const showMedical   = activeFilter === 'all' || activeFilter === 'medical';
    const showWashrooms = activeFilter === 'all' || activeFilter === 'washroom';
    const showStays     = activeFilter === 'all' || activeFilter === 'stays';
    const showFood      = activeFilter === 'all' || activeFilter === 'food';

    // Police Stations & Emergency Help Desk
    if (showPolice) {
      (policeStations || []).forEach((police) => {
        const lat = police.lat ?? police.latitude;
        const lng = police.lng ?? police.longitude;
        if (!lat || !lng) return;

        const marker = L.marker([lat, lng], { icon: POLICE_ICON });
        marker.bindPopup(`
          <div style="padding:4px 0;">
            <div style="font-weight:800; font-size:13px; color:#3B82F6; margin-bottom:4px;">🚓 ${police.name}</div>
            <div style="font-size:11px; color:#94A3B8; margin-bottom:6px;">${police.distance || police.location || '24/7 Emergency Police Station'}</div>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" rel="noopener noreferrer" style="display:block; margin-top:6px; text-align:center; font-size:11px; color:#00F2FE; font-weight:700;">Emergency Directions →</a>
          </div>
        `);
        marker.on('click', () => setSelectedPin({ ...police, pinType: 'police' }));
        markersGroup.addLayer(marker);
      });
    }

    // Medical Hubs
    if (showMedical) {
      (medicalHubs || []).forEach((hub) => {
        const lat = hub.lat ?? hub.latitude;
        const lng = hub.lng ?? hub.longitude;
        if (!lat || !lng) return;

        const marker = L.marker([lat, lng], { icon: MEDICAL_ICON });
        marker.bindPopup(`
          <div style="padding:4px 0;">
            <div style="font-weight:800; font-size:13px; color:#EF4444; margin-bottom:4px;">🏥 ${hub.name}</div>
            <div style="font-size:11px; color:#94A3B8; margin-bottom:6px;">${hub.distance || hub.location || 'Locality Medical'}</div>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" rel="noopener noreferrer" style="display:block; margin-top:6px; text-align:center; font-size:11px; color:#00F2FE; font-weight:700;">Get Directions →</a>
          </div>
        `);
        marker.on('click', () => setSelectedPin({ ...hub, pinType: 'medical' }));
        markersGroup.addLayer(marker);
      });
    }

    // Washrooms
    if (showWashrooms) {
      (washrooms || []).forEach((wash) => {
        const lat = wash.lat ?? wash.latitude;
        const lng = wash.lng ?? wash.longitude;
        if (!lat || !lng) return;

        const marker = L.marker([lat, lng], { icon: WASHROOM_ICON });
        marker.bindPopup(`
          <div style="padding:4px 0;">
            <div style="font-weight:800; font-size:13px; color:#3B82F6; margin-bottom:4px;">🚽 ${wash.name}</div>
            <div style="font-size:11px; color:#94A3B8; margin-bottom:6px;">${wash.distance || wash.location || 'Verified Washroom'}</div>
            <a href="https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}" target="_blank" rel="noopener noreferrer" style="display:block; margin-top:6px; text-align:center; font-size:11px; color:#00F2FE; font-weight:700;">Get Directions →</a>
          </div>
        `);
        marker.on('click', () => setSelectedPin({ ...wash, pinType: 'washroom' }));
        markersGroup.addLayer(marker);
      });
    }

    // Stays
    if (showStays) {
      (stays || []).forEach((stay) => {
        const lat = stay.lat ?? stay.latitude;
        const lng = stay.lng ?? stay.longitude;
        if (!lat || !lng) return;

        const marker = L.marker([lat, lng], { icon: STAY_ICON });
        marker.bindPopup(`
          <div style="padding:4px 0;">
            <div style="font-weight:800; font-size:13px; color:#22C55E; margin-bottom:4px;">🏠 ${stay.name}</div>
            <div style="font-size:11px; color:#94A3B8; margin-bottom:4px;">${stay.location || 'Real Stay'}</div>
            <div style="font-size:12px; color:#00F2FE; font-weight:700;">₹${stay.price?.toLocaleString() || 1200}/night</div>
          </div>
        `);
        marker.on('click', () => setSelectedPin({ ...stay, pinType: 'stay' }));
        markersGroup.addLayer(marker);
      });
    }

    // LocoGems / Dining Food Spots
    if (showFood) {
      (locogems || []).forEach((food) => {
        const lat = food.lat ?? food.latitude;
        const lng = food.lng ?? food.longitude;
        if (!lat || !lng) return;

        const marker = L.marker([lat, lng], { icon: FOOD_ICON });
        marker.bindPopup(`
          <div style="padding:4px 0;">
            <div style="font-weight:800; font-size:13px; color:#F59E0B; margin-bottom:4px;">🍲 ${food.name}</div>
            <div style="font-size:11px; color:#94A3B8; margin-bottom:4px;">${food.location || 'Local Street Food'}</div>
            <div style="font-size:11px; color:#22C55E; font-weight:700;">Hygiene Score: ${food.aiMetrics?.hygiene || 90}%</div>
          </div>
        `);
        marker.on('click', () => setSelectedPin({ ...food, pinType: 'food' }));
        markersGroup.addLayer(marker);
      });
    }

  }, [activeFilter, medicalHubs, washrooms, policeStations, stays, locogems, userPos]);

  const handleRecenter = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo(userPos, 14, { duration: 1 });
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: 'calc(100vh - 70px)' }}>
      {/* Leaflet map container */}
      <div ref={mapContainerRef} style={{ width: '100%', height: '100%', minHeight: 'calc(100vh - 70px)', zIndex: 1 }} />



      {/* Top Filter Chips Container (Smooth Drag & Touch Swipe) */}
      <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', zIndex: 400 }}>
        {/* Floating Slide Indicator Pill */}
        <div style={{
          position: 'absolute',
          right: '4px',
          top: '50%',
          transform: 'translateY(-50%)',
          zIndex: 420,
          background: 'linear-gradient(to left, rgba(6,11,18,0.95) 60%, rgba(6,11,18,0))',
          padding: '6px 10px 6px 20px',
          borderRadius: '0 20px 20px 0',
          pointerEvents: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          color: 'var(--accent-cyan)',
          fontSize: '10px',
          fontWeight: '800'
        }}>
          <span>Swipe</span>
          <ChevronRight size={13} />
        </div>

        <div
          ref={filterScrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{
            display: 'flex',
            gap: '8px',
            overflowX: 'scroll',
            WebkitOverflowScrolling: 'touch',
            scrollSnapType: 'x mandatory',
            userSelect: 'none',
            cursor: isMouseDown ? 'grabbing' : 'grab',
            paddingRight: '60px',
            scrollbarWidth: 'none'
          }}
        >
          {[
            { id: 'all', label: 'All Markers', color: '#00F2FE' },
            { id: 'police', label: '🚓 Police & Help', color: '#3B82F6' },
            { id: 'medical', label: '🏥 Medical & Clinics', color: '#EF4444' },
            { id: 'washroom', label: '🚽 Washrooms & Utilities', color: '#06B6D4' },
            { id: 'stays', label: '🏠 Stays', color: '#22C55E' },
            { id: 'food', label: '🍲 Food & Street Vendors', color: '#F59E0B' },
          ].map(filter => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              style={{
                padding: '8px 14px',
                borderRadius: '20px',
                background: activeFilter === filter.id ? filter.color : 'rgba(18, 28, 42, 0.92)',
                color: activeFilter === filter.id ? '#060B12' : '#FFF',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(8px)',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                scrollSnapAlign: 'start',
                flexShrink: 0,
                boxShadow: activeFilter === filter.id ? `0 0 14px ${filter.color}` : 'none'
              }}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Re-center Button */}
      <button
        onClick={handleRecenter}
        style={{
          position: 'absolute',
          bottom: '100px',
          right: '16px',
          zIndex: 400,
          width: '46px',
          height: '46px',
          borderRadius: '50%',
          background: 'rgba(18, 28, 42, 0.9)',
          border: '1px solid #00F2FE',
          color: '#00F2FE',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(0, 242, 254, 0.3)'
        }}
      >
        <LocateFixed size={22} />
      </button>

      {/* Bottom Pin Sheet */}
      {selectedPin && (
        <PinBottomSheet pin={selectedPin} onClose={() => setSelectedPin(null)} onNavigate={onNavigate} />
      )}
    </div>
  );
}
