import React, { useState } from 'react';

export default function PreferencesSetup({ onSave }) {
  const [userType, setUserType] = useState('Tourist'); // Tourist vs Local Resident
  const [budgetTier, setBudgetTier] = useState('Mid-Range');
  const [travelStyle, setTravelStyle] = useState('Solo');

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
        <div style={{ marginBottom: '24px' }}>
          <span style={{
            fontSize: '11px',
            fontWeight: '800',
            color: '#00E5C0',
            textTransform: 'uppercase',
            letterSpacing: '1px'
          }}>PREFERENCES</span>
          <h2 style={{ fontSize: '24px', fontWeight: '800', marginTop: '4px', color: '#FFF' }}>Tailor Your Pulse</h2>
          <p style={{ color: '#8AA8A5', fontSize: '13px', marginTop: '4px' }}>
            Our AI models curate safety scores & spots based on your travel profile.
          </p>
        </div>

        {/* Tourist vs Local Resident Pill Toggle */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', fontWeight: '700', color: '#FFF', display: 'block', marginBottom: '8px' }}>
            Are you a tourist or local?
          </label>
          <div style={{
            display: 'flex',
            background: '#152E2E',
            borderRadius: '16px',
            padding: '4px',
            border: '1px solid rgba(0, 229, 192, 0.2)'
          }}>
            {['Tourist', 'Local Resident'].map((type) => (
              <button
                key={type}
                onClick={() => setUserType(type)}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  background: userType === type ? '#00E5C0' : 'transparent',
                  color: userType === type ? '#0B1B1B' : '#8AA8A5',
                  border: 'none',
                  fontWeight: '800',
                  fontSize: '13px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Budget Tier Pills */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', fontWeight: '700', color: '#FFF', display: 'block', marginBottom: '8px' }}>
            Budget Tier
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['Budget', 'Mid-Range', 'Premium'].map((tier) => (
              <button
                key={tier}
                onClick={() => setBudgetTier(tier)}
                style={{
                  flex: 1,
                  padding: '10px 8px',
                  borderRadius: '14px',
                  background: budgetTier === tier ? 'rgba(0, 229, 192, 0.15)' : '#152E2E',
                  border: budgetTier === tier ? '1px solid #00E5C0' : '1px solid rgba(0, 229, 192, 0.12)',
                  color: budgetTier === tier ? '#00E5C0' : '#FFF',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>

        {/* Travel Style Pills */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ fontSize: '12px', fontWeight: '700', color: '#FFF', display: 'block', marginBottom: '8px' }}>
            Travel Style
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {['Solo', 'Couple', 'Family', 'Group', 'Backpacker', 'Business'].map((style) => (
              <button
                key={style}
                onClick={() => setTravelStyle(style)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '20px',
                  background: travelStyle === style ? 'rgba(0, 229, 192, 0.15)' : '#152E2E',
                  border: travelStyle === style ? '1px solid #00E5C0' : '1px solid rgba(0, 229, 192, 0.12)',
                  color: travelStyle === style ? '#00E5C0' : '#FFF',
                  fontWeight: '700',
                  fontSize: '12px',
                  cursor: 'pointer'
                }}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={() => onSave({ userType, budgetTier, travelStyle })} className="btn-primary">
        <span>Continue</span>
      </button>
    </div>
  );
}
