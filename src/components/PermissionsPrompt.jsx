import React from 'react';
import { MapPin, Bell } from 'lucide-react';

export default function PermissionsPrompt({ onExplore }) {
  return (
    <div style={{
      padding: '36px 24px',
      display: 'flex',
      flexDirection: 'column',
      justify: 'space-between',
      height: '100%',
      background: '#0D2322'
    }}>
      <div>
        <div style={{ textAlign: 'center', marginTop: '16px', marginBottom: '28px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            border: '2px solid rgba(0, 229, 192, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              background: '#00E5C0',
              color: '#0D2322',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MapPin size={24} />
            </div>
          </div>

          <h2 style={{ fontSize: '24px', fontWeight: '800', marginBottom: '8px', color: '#FFF' }}>Activate Your Radar</h2>
          <p style={{ color: '#8AA8A5', fontSize: '13px', lineHeight: 1.5, maxWidth: '300px', margin: '0 auto' }}>
            RoamPulse needs key permissions to monitor safe spots, clean washrooms, and close proximity emergency hubs.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <div style={{
            padding: '16px',
            borderRadius: '16px',
            background: '#152E2E',
            border: '1px solid rgba(0, 229, 192, 0.15)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px'
          }}>
            <MapPin size={20} color="#00E5C0" style={{ marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: '800', fontSize: '14px', color: '#FFF' }}>Location Services (Always-on)</div>
              <div style={{ fontSize: '12px', color: '#8AA8A5', marginTop: '2px', lineHeight: 1.4 }}>
                Detect verified clean amenities and safety hazards in real-time.
              </div>
            </div>
          </div>

          <div style={{
            padding: '16px',
            borderRadius: '16px',
            background: '#152E2E',
            border: '1px solid rgba(0, 229, 192, 0.15)',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '14px'
          }}>
            <Bell size={20} color="#F3A952" style={{ marginTop: '2px' }} />
            <div>
              <div style={{ fontWeight: '800', fontSize: '14px', color: '#FFF' }}>Smart Notifications</div>
              <div style={{ fontSize: '12px', color: '#8AA8A5', marginTop: '2px', lineHeight: 1.4 }}>
                Instant updates on crowd spikes or quick safety check alerts.
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <button onClick={() => onExplore({ gps: true, notifs: true })} className="btn-primary">
          <span>Enable Location Services</span>
        </button>

        <button
          onClick={() => onExplore({ gps: false, notifs: true })}
          style={{
            width: '100%',
            background: '#152E2E',
            border: '1px solid rgba(0, 229, 192, 0.2)',
            borderRadius: '14px',
            padding: '14px',
            color: '#FFF',
            fontWeight: '700',
            fontSize: '14px',
            cursor: 'pointer',
            fontFamily: 'Plus Jakarta Sans, sans-serif'
          }}
        >
          Allow Notifications
        </button>

        <button
          onClick={() => onExplore({ gps: false, notifs: false })}
          style={{ background: 'none', border: 'none', color: '#6B8B88', fontSize: '13px', fontWeight: '600', cursor: 'pointer', marginTop: '4px' }}
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
