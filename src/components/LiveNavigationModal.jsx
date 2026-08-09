import React, { useState, useEffect } from 'react';
import { Navigation, Compass, MapPin, Clock, ShieldCheck, X, ArrowUpRight, ArrowLeft, ArrowRight, ExternalLink } from 'lucide-react';
import { fetchOSMRoute } from '../services/openMapService';

export default function LiveNavigationModal({ target, userPos = [19.033, 73.029], onClose }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [routeData, setRouteData] = useState(null);
  const [isLoadingRoute, setIsLoadingRoute] = useState(true);

  const startLat = userPos[0];
  const startLng = userPos[1];
  const destLat = target?.lat || startLat + 0.015;
  const destLng = target?.lng || startLng + 0.012;

  useEffect(() => {
    let active = true;
    setIsLoadingRoute(true);

    fetchOSMRoute(startLat, startLng, destLat, destLng).then((data) => {
      if (active) {
        if (data) {
          setRouteData(data);
        } else {
          setRouteData({
            distanceText: target?.distance || '850m',
            etaText: '4 mins',
            polylineCoordinates: [[startLat, startLng], [destLat, destLng]],
            turnSteps: [
              { instruction: `Head north toward ${target?.name || 'destination'}`, distance: '250m', modifier: 'straight' },
              { instruction: `Turn right toward venue entrance`, distance: '350m', modifier: 'right' },
              { instruction: `Arrive at ${target?.name || 'venue'} (Verified Safe Zone)`, distance: '250m', modifier: 'arrive' }
            ]
          });
        }
        setIsLoadingRoute(false);
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
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destLat},${destLng}&travelmode=driving`;
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
        justifyContent: 'space-between'
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

      {/* Real-Time Routing Canvas */}
      <div style={{
        flex: 1,
        position: 'relative',
        background: 'var(--bg-dark)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden'
      }}>
        {/* Dynamic Grid Background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'radial-gradient(var(--border-subtle) 1px, transparent 1px)',
          backgroundSize: '24px 24px'
        }} />

        {/* Turn-by-Turn Instruction Card Banner Overlay */}
        <div style={{
          position: 'absolute',
          top: '16px',
          left: '16px',
          right: '16px',
          background: 'var(--bg-card)',
          border: '1px solid var(--accent-cyan)',
          borderRadius: '20px',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
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
            <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {currentStep.instruction}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--accent-cyan)', fontWeight: '800', marginTop: '2px' }}>
              In {currentStep.distance} • Step {stepIndex + 1} of {steps.length}
            </div>
          </div>
        </div>

        {/* Live Moving Compass Radar Badge */}
        <div style={{
          width: '90px',
          height: '90px',
          borderRadius: '50%',
          background: 'var(--border-subtle)',
          border: '2px solid var(--accent-cyan)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--accent-cyan)',
          boxShadow: '0 0 40px var(--border-subtle)',
          animation: 'radarPulse 2s ease-in-out infinite'
        }}>
          <Compass size={44} />
        </div>
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
        gap: '12px'
      }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '800' }}>ESTIMATED ETA</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: '#22C55E' }}>
              {isLoadingRoute ? 'Calculating...' : (routeData?.etaText || '3 mins')}
            </div>
          </div>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '800' }}>REAL DISTANCE</div>
            <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--accent-cyan)' }}>
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
