import React, { useState } from 'react';
import { Download, Check, Map } from 'lucide-react';

export default function OfflineMaps() {
  const [packs, setPacks] = useState([
    { id: 1, name: 'Navi Mumbai & Thane Amenity Pack', size: '142 MB', downloaded: true },
    { id: 2, name: 'Coorg & Western Ghats Safety Radar', size: '210 MB', downloaded: true },
    { id: 3, name: 'Bangalore Tech Nomad Pack', size: '185 MB', downloaded: false }
  ]);

  const toggleDownload = (id) => {
    setPacks(packs.map(p => p.id === id ? { ...p, downloaded: !p.downloaded } : p));
  };

  return (
    <div style={{ padding: '20px', background: 'var(--bg-dark)', minHeight: '100%' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700' }}>Offline Map Packs</h2>
        <p style={{ fontSize: '13px', color: '#94A3B8' }}>Access emergency radar & washrooms without internet</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {packs.map((pack) => (
          <div
            key={pack.id}
            className="glass-card"
            style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: pack.downloaded ? 'rgba(34, 197, 94, 0.15)' : 'rgba(0, 242, 254, 0.15)',
                color: pack.downloaded ? '#22C55E' : '#00F2FE',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Map size={20} />
              </div>
              <div>
                <div style={{ fontWeight: '700', fontSize: '14px', color: '#FFF' }}>{pack.name}</div>
                <div style={{ fontSize: '12px', color: '#64748B' }}>{pack.size}</div>
              </div>
            </div>

            <button
              onClick={() => toggleDownload(pack.id)}
              style={{
                padding: '8px 14px',
                borderRadius: '12px',
                background: pack.downloaded ? 'rgba(255, 255, 255, 0.05)' : '#00F2FE',
                color: pack.downloaded ? '#94A3B8' : '#060B12',
                border: 'none',
                fontWeight: '700',
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {pack.downloaded ? (
                <>
                  <Check size={14} color="#22C55E" />
                  <span>Ready</span>
                </>
              ) : (
                <>
                  <Download size={14} />
                  <span>Download</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
