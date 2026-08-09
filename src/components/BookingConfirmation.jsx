import React from 'react';
import { CheckCircle2, QrCode, MapPin, ArrowLeft } from 'lucide-react';

export default function BookingConfirmation({ booking, onBackToHome }) {
  const item = booking || {
    name: "ZenITH Capsule Pods",
    location: "Bangalore, India",
    date: "Aug 12 - Aug 14, 2026",
    price: 1400,
    hygiene: 97,
    ticketId: "RP-884920-AI"
  };

  return (
    <div style={{ padding: '24px 20px', background: 'var(--bg-dark)', minHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <button onClick={onBackToHome} style={{ background: 'none', border: 'none', color: '#FFF', cursor: 'pointer' }}>
            <ArrowLeft size={20} />
          </button>
          <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Booking Confirmation</h2>
        </div>

        <div style={{ textAlign: 'center', margin: '16px 0 24px 0' }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'rgba(34, 197, 94, 0.15)',
            border: '2px solid #22C55E',
            color: '#22C55E',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto'
          }}>
            <CheckCircle2 size={36} />
          </div>
          <h1 style={{ fontSize: '22px', fontWeight: '800' }}>Reservation Confirmed!</h1>
          <p style={{ color: '#94A3B8', fontSize: '13px', marginTop: '4px' }}>Pass synced to your RoamPulse AI Wallet</p>
        </div>

        <div className="glass-card" style={{ padding: '20px', position: 'relative', border: '1px dashed #00F2FE' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '12px' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700' }}>TICKET ID</div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#00F2FE' }}>{item.ticketId}</div>
            </div>
            <div style={{
              background: 'rgba(34, 197, 94, 0.15)',
              color: '#22C55E',
              padding: '4px 10px',
              borderRadius: '12px',
              fontSize: '11px',
              fontWeight: '700'
            }}>
              Active Pass
            </div>
          </div>

          <h3 style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px' }}>{item.name}</h3>
          <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <MapPin size={14} color="#00F2FE" />
            <span>{item.location}</span>
          </p>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', background: 'rgba(255, 255, 255, 0.03)', padding: '12px', borderRadius: '12px' }}>
            <div>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '700' }}>CHECK-IN DATES</div>
              <div style={{ fontSize: '13px', fontWeight: '700', color: '#FFF' }}>{item.date}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '10px', color: '#64748B', fontWeight: '700' }}>TOTAL PAID</div>
              <div style={{ fontSize: '14px', fontWeight: '800', color: '#00F2FE' }}>₹{item.price?.toLocaleString()}</div>
            </div>
          </div>

          <div style={{
            background: '#FFF',
            borderRadius: '16px',
            padding: '16px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px'
          }}>
            <QrCode size={110} color="#060B12" />
            <span style={{ fontSize: '11px', color: '#475569', fontWeight: '700', letterSpacing: '1px' }}>SCAN AT CHECK-IN</span>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '24px' }}>
        <button onClick={onBackToHome} className="btn-primary">
          <span>Return to Dashboard</span>
        </button>
      </div>
    </div>
  );
}
