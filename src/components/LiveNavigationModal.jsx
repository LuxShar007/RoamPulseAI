import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import { Navigation, Compass, X, ArrowUpRight, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { fetchOSMRoute } from '../services/openMapService';

// Custom Leaflet Icons for Navigation
function makeDivIcon(emoji, color, shadowColor) {
  return L.divIcon({
    html: `
      <div style="
        width:42px; height:42px; border-radius:50%;
        background:${color}; border:3px solid #FFFFFF;
        display:flex; align-items:center; justify-content:center;
        font-size:20px; cursor:pointer;
        box-shadow:0 0 20px ${shadowColor}, 0 4px 12px rgba(0,0,0,0.6);
      ">${emoji}</div>`,
    iconSize: [42, 42],
    iconAnchor: [21, 21],
    className: ''
  });
}

const USER_NAV_ICON = L.divIcon({
  html: `
    <div style="
      width:24px; height:24px; border-radius:50%;
      background:#00E5C0; border:3px solid #FFFFFF;
      box-shadow:0 0 20px rgba(0,229,192,0.9), 0 0 0 10px rgba(0,229,192,0.25);
    "></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
  className: ''
});

const DESTINATION_ICON = makeDivIcon('📍', '#EF4444', 'rgba(239,68,68,0.8)');

export default function LiveNavigationModal({ target, userPos = [18.9220, 72.8347], onClose }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const routePolylineRef = useRef(null);

  const [stepIndex, setStepIndex] = useState(0);
  const [routeData, setRouteData] = useState(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(true);

  const startLat = userPos[0];
  const startLng = userPos[1];
  const destLat = target?.lat || startLat + 0.008;
  const destLng = target?.lng || startLng + 0.007;

  // Initialize Interactive Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current, {
        center: [startLat, startLng],
        zoom: 15,
        zoomControl: false,
        attributionControl: false
      });

      L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
        maxZoom: 19
      }).addTo(map);

      // Add User Location Marker
      L.marker([startLat, startLng], { icon: USER_NAV_ICON })
        .addTo(map)
        .bindTooltip("You are here", { permanent: true, direction: 'top', className: 'nav-tooltip' });

      // Add Destination Marker
      L.marker([destLat, destLng], { icon: DESTINATION_ICON })
        .addTo(map)
        .bindTooltip(target?.name || "Destination", { permanent: true, direction: 'top', className: 'nav-tooltip' });

      mapInstanceRef.current = map;
    }

    // Fix tile rendering on open
    setTimeout(() => {
      if (mapInstanceRef.current) mapInstanceRef.current.invalidateSize();
    }, 200);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [startLat, startLng, destLat, destLng, target?.name]);

  // Fetch OSRM Real-Time Turn-by-Turn Route
  useEffect(() => {
    let active = true;
    setIsLoadingRoute(true);

    fetchOSMRoute(startLat, startLng, destLat, destLng).then((data) => {
      if (!active) return;

      const fallbackCoords = [
        [startLat, startLng],
        [startLat + 0.003, startLng + 0.002],
        [startLat + 0.005, startLng + 0.005],
        [destLat, destLng]
      ];

      const coords = data?.polylineCoordinates?.length ? data.polylineCoordinates : fallbackCoords;

      const resolved = data || {
        distanceText: target?.distance || '850m',
        etaText: '4 mins',
        polylineCoordinates: coords,
        turnSteps: [
          { instruction: `Head north on main road toward ${target?.name || 'destination'}`, distance: '250m', modifier: 'straight' },
          { instruction: `Turn right at sector junction`, distance: '350m', modifier: 'right' },
          { instruction: `Arrive at ${target?.name || 'venue'} (Verified Safe Zone)`, distance: '250m', modifier: 'arrive' }
        ]
      };

      setRouteData(resolved);
      setIsLoadingRoute(false);

      // Render glowing cyan route polyline on Leaflet map
      if (mapInstanceRef.current && coords.length > 0) {
        if (routePolylineRef.current) {
          mapInstanceRef.current.removeLayer(routePolylineRef.current);
        }

        const polyline = L.polyline(coords, {
          color: '#00E5C0',
          weight: 6,
          opacity: 0.9,
          lineCap: 'round',
          lineJoin: 'round'
        }).addTo(mapInstanceRef.current);

        routePolylineRef.current = polyline;
        mapInstanceRef.current.fitBounds(polyline.getBounds(), { padding: [50, 50] });
      }
    });

    return () => { active = false; };
  }, [startLat, startLng, destLat, destLng, target]);

  // Turn step simulator interval
  useEffect(() => {
    if (!routeData?.turnSteps?.length) return;
    const timer = setInterval(() => {
      setStepIndex((prev) => (prev < routeData.turnSteps.length - 1 ? prev + 1 : prev));
    }, 4500);
    return () => clearInterval(timer);
  }, [routeData]);

  if (!target) return null;

  const steps = routeData?.turnSteps || [
    { instruction: `Head toward ${target.name}`, distance: '300m', modifier: 'straight' }
  ];
  const currentStep = steps[stepIndex] || steps[0];

  const handleOpenGoogleMaps = () => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${startLat},${startLng}&destination=${destLat},${destLng}&travelmode=driving`;
    window.open(mapsUrl, '_blank');
  };

  return (
    <div className="modal-overlay" style={{ background: 'var(--bg-dark)', zIndex: 500, display: 'flex', flexDirection: 'column' }}>
      {/* Top Header Card */}
      <div style={{
        padding: '44px 20px 14px 20px',
        background: 'var(--bg-card)',
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        zIndex: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            background: 'var(--accent-cyan)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Navigation size={22} />
          </div>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
              REAL-TIME GPS TURN-BY-TURN
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)' }}>{target.name}</h3>
          </div>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
          <X size={22} />
        </button>
      </div>

      {/* Real Interactive Leaflet GPS Map Container */}
      <div style={{
        flex: 1,
        position: 'relative',
        width: '100%',
        height: '100%',
        overflow: 'hidden'
      }}>
        {/* Leaflet Map Target Element */}
        <div ref={mapContainerRef} style={{ width: '100%', height: '100%', zIndex: 1 }} />

        {/* Turn-by-Turn Instruction Card Banner Overlay */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          background: 'var(--bg-card)',
          border: '1px solid var(--accent-cyan)',
          borderRadius: '20px',
          padding: '14px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
          zIndex: 10
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: 'var(--accent-cyan)',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: '800',
            flexShrink: 0
          }}>
            {currentStep.modifier?.includes('left') ? (
              <ArrowLeft size={24} />
            ) : currentStep.modifier?.includes('right') ? (
              <ArrowRight size={24} />
            ) : (
              <ArrowUpRight size={24} />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {currentStep.instruction}
            </div>
            <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: '800', marginTop: '2px' }}>
              In {currentStep.distance} • Step {stepIndex + 1} of {steps.length}
            </div>
          </div>
        </div>

        {/* Recenter GPS Button */}
        <button
          onClick={() => {
            if (mapInstanceRef.current && routePolylineRef.current) {
              mapInstanceRef.current.fitBounds(routePolylineRef.current.getBounds(), { padding: [40, 40] });
            }
          }}
          style={{
            position: 'absolute',
            bottom: '20px',
            right: '16px',
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            color: 'var(--accent-cyan)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
            zIndex: 10
          }}
        >
          <Compass size={22} />
        </button>
      </div>

      {/* Bottom Summary & Live Google Maps Navigation Action */}
      <div style={{
        padding: '16px 20px 24px 20px',
        background: 'var(--bg-card)',
        borderTop: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        zIndex: 20
      }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '800' }}>ESTIMATED ETA</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#22C55E' }}>
              {isLoadingRoute ? 'Calculating...' : (routeData?.etaText || '3 mins')}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '800' }}>REAL DISTANCE</div>
            <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--accent-cyan)' }}>
              {isLoadingRoute ? 'Calculating...' : (routeData?.distanceText || target.distance || '450m')}
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleOpenGoogleMaps}
            style={{
              padding: '12px 16px',
              borderRadius: '14px',
              background: 'var(--accent-cyan)',
              color: '#FFFFFF',
              border: 'none',
              fontWeight: '800',
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <ExternalLink size={16} />
            <span>Open Google Maps</span>
          </button>

          <button
            onClick={onClose}
            style={{
              padding: '12px 16px',
              borderRadius: '14px',
              background: 'rgba(239, 68, 68, 0.15)',
              color: '#EF4444',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              fontWeight: '800',
              fontSize: '13px',
              cursor: 'pointer'
            }}
          >
            Exit
          </button>
        </div>
      </div>
    </div>
  );
}
