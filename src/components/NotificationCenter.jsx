import React, { useState } from 'react';
import { ShieldAlert, Tag, CheckCircle2, X } from 'lucide-react';

export default function NotificationCenter({ notifications, onClose }) {
  const [selectedNotif, setSelectedNotif] = useState(null);

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ height: '88vh', background: '#0D2322', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#FFF' }}>Notifications</h2>
            <p style={{ fontSize: '12px', color: '#8AA8A5', marginTop: '2px' }}>Real-time safety, price & hygiene alerts</p>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#00E5C0', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}>
            Mark all read
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          {notifications.map((item) => {
            const isMedical = item.type === 'medical';
            const isSavings = item.type === 'savings';
            const isWashroom = item.type === 'washroom';

            return (
              <div
                key={item.id}
                onClick={() => setSelectedNotif(item)}
                style={{
                  padding: '16px',
                  borderRadius: '18px',
                  background: '#14302F',
                  border: isMedical ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(0, 229, 192, 0.15)',
                  cursor: 'pointer',
                  display: 'flex',
                  gap: '14px',
                  alignItems: 'flex-start'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '12px',
                  background: isMedical ? 'rgba(239, 68, 68, 0.2)' : isSavings ? 'rgba(243, 169, 82, 0.2)' : 'rgba(0, 229, 192, 0.2)',
                  color: isMedical ? '#EF4444' : isSavings ? '#F3A952' : '#00E5C0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {isMedical && <ShieldAlert size={20} />}
                  {isSavings && <Tag size={20} />}
                  {isWashroom && <CheckCircle2 size={20} />}
                </div>

                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <div style={{ fontWeight: '800', fontSize: '14px', color: '#FFF' }}>{item.title}</div>
                    <span style={{ fontSize: '11px', color: '#6B8B88' }}>{item.time}</span>
                  </div>
                  <p style={{ fontSize: '12px', color: '#8AA8A5', lineHeight: 1.4 }}>
                    {item.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {selectedNotif && (
          <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(13, 35, 34, 0.94)',
            backdropFilter: 'blur(14px)',
            zIndex: 300,
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center'
          }}>
            <div className="glass-card" style={{ padding: '24px', border: '1px solid #00E5C0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '11px', color: '#00E5C0', fontWeight: '800', textTransform: 'uppercase' }}>AI Notification Alert Detail</span>
                <button onClick={() => setSelectedNotif(null)} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}>
                  <X size={20} />
                </button>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '8px', color: '#FFF' }}>{selectedNotif.title}</h3>
              <p style={{ color: '#8AA8A5', fontSize: '13px', lineHeight: 1.5, marginBottom: '20px' }}>
                {selectedNotif.description}
              </p>
              <button onClick={() => setSelectedNotif(null)} className="btn-primary">
                <span>Acknowledge & Dismiss</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
