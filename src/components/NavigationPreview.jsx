import React from 'react';
import { Navigation, ShieldCheck, X, Compass } from 'lucide-react';

export default function NavigationPreview({ target, onClose }) {
  if (!target) return null;

  return (
    <div style={{
      position: 'absolute',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'var(--bg-dark)',
      zIndex: 250,
      display: 'flex',
      flexDirection: 'column'
    }}>
      <div style={{
        padding: '20px',
        background: '#121C2A',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #00F2FE 0%, #00D2C4 100%)',
            color: '#060B12',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Navigation size={22} />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#00F2FE', fontWeight: '700', textTransform: 'uppercase' }}>Turn-by-Turn AI Route</div>
            <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#F8FAFC' }}>Navigating to {target.name}</h3>
          </div>
        </div>

        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}>
          <X size={24} />
        </button>
      </div>

      <div style={{ flex: 1, position: 'relative', background: '#0B131E', overflow: 'hidden' }}>
        <svg style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
          <path
            d="M 120 450 Q 200 350 250 250 T 320 120"
            fill="none"
            stroke="#00F2FE"
            strokeWidth="5"
            strokeDasharray="10 6"
          />
          <circle cx="120" cy="450" r="12" fill="#00F2FE" opacity="0.4" className="radar-pulse" />
          <circle cx="120" cy="450" r="6" fill="#00F2FE" />
          <circle cx="320" cy="120" r="14" fill="#EF4444" opacity="0.3" />
          <circle cx="320" cy="120" r="7" fill="#EF4444" />
        </svg>

        <div style={{
          position: 'absolute',
          top: '30px',
          left: '20px',
          right: '20px',
          background: 'rgba(18, 28, 42, 0.9)',
          backdropFilter: 'blur(10px)',
          padding: '16px',
          borderRadius: '16px',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          display: 'flex',
          alignItems: 'center',
          gap: '14px'
        }}>
          <Compass size={28} color="#00F2FE" className="radar-pulse" />
          <div>
            <div style={{ fontSize: '16px', fontWeight: '800', color: '#FFF' }}>In 150m, Turn Right</div>
            <div style={{ fontSize: '12px', color: '#94A3B8' }}>Onto Station Main Road (Safest AI Route)</div>
          </div>
        </div>
      </div>

      <div style={{
        padding: '20px',
        background: '#121C2A',
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        justify: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <div style={{ fontSize: '24px', fontWeight: '800', color: '#22C55E' }}>4 mins <span style={{ fontSize: '14px', color: '#94A3B8', fontWeight: '400' }}>(350m)</span></div>
          <div style={{ fontSize: '12px', color: '#00F2FE', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ShieldCheck size={14} />
            <span>AI Crowd Density: Low (Safe Route)</span>
          </div>
        </div>

        <button onClick={onClose} style={{
          background: '#EF4444',
          color: '#FFF',
          fontWeight: '700',
          padding: '12px 20px',
          borderRadius: '14px',
          border: 'none',
          cursor: 'pointer'
        }}>
          End Route
        </button>
      </div>
    </div>
  );
}
