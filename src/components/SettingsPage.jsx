import React, { useState } from 'react';
import { DollarSign, Palette, Lock, LogOut, ArrowLeft, Check, Globe } from 'lucide-react';

export default function SettingsPage({ user, onBack, onLogout, currency, setCurrency, currentTheme, onSelectTheme }) {
  const [privacy, setPrivacy] = useState(true);

  const themes = [
    { id: 'emerald', label: 'Dark Emerald', desc: 'Deep forest teal & mint cyan', primary: '#00E5C0' },
    { id: 'cyber', label: 'Cyber Midnight', desc: 'Electric blue & neon purple', primary: '#00F2FE' },
    { id: 'solar', label: 'Solar Amber', desc: 'Warm ochre & vibrant gold', primary: '#FFB703' },
    { id: 'tokyo', label: 'Tokyo Neon Pink', desc: 'Futuristic magenta & dark indigo', primary: '#FF007A' },
    { id: 'light-minimal', label: 'Frost Jade (Light)', desc: 'Clean ice slate & jade mint', primary: '#00A88C' },
    { id: 'light-rose', label: 'Coral Rose (Light)', desc: 'Soft linen cream & coral rose', primary: '#E05A47' }
  ];

  const currencies = [
    { code: 'INR', symbol: '₹', label: 'INR (Indian Rupee)' },
    { code: 'USD', symbol: '$', label: 'USD (US Dollar)' },
    { code: 'EUR', symbol: '€', label: 'EUR (Euro)' },
    { code: 'GBP', symbol: '£', label: 'GBP (British Pound)' },
    { code: 'AED', symbol: 'AED ', label: 'AED (UAE Dirham)' },
    { code: 'JPY', symbol: '¥', label: 'JPY (Japanese Yen)' }
  ];

  return (
    <div style={{ padding: '44px 20px 20px 20px', background: 'var(--bg-dark)', minHeight: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
          <button onClick={onBack} style={{ background: 'none', border: 'none', color: 'var(--text-primary)', cursor: 'pointer' }}>
            <ArrowLeft size={20} />
          </button>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>Settings & Preferences</h2>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Currency Display Selector */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <Globe size={20} color="var(--accent-cyan)" />
              <div>
                <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--text-primary)' }}>Global Currency Format</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Select default pricing currency</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {currencies.map((c) => {
                const isSelected = currency === c.code;
                return (
                  <button
                    key={c.code}
                    onClick={() => setCurrency(c.code)}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '12px',
                      background: isSelected ? 'var(--accent-cyan)' : 'var(--bg-surface)',
                      color: isSelected ? '#FFFFFF' : 'var(--text-primary)',
                      border: isSelected ? 'none' : '1px solid var(--border-subtle)',
                      fontWeight: '800',
                      fontSize: '12px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <span>{c.symbol} {c.code}</span>
                    {isSelected && <Check size={14} color="#FFFFFF" strokeWidth={3} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme Selection */}
          <div className="glass-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
              <Palette size={20} color="var(--accent-cyan)" />
              <div>
                <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--text-primary)' }}>Theme Preset</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Select color theme for RoamPulse AI</div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {themes.map((t) => {
                const isSelected = (currentTheme || 'emerald') === t.id;
                return (
                  <div
                    key={t.id}
                    onClick={() => onSelectTheme(t.id)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '14px',
                      background: isSelected ? 'var(--border-subtle)' : 'var(--bg-surface)',
                      border: isSelected ? '1px solid var(--accent-cyan)' : '1px solid transparent',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: t.primary, flexShrink: 0 }} />
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '13px', color: isSelected ? 'var(--accent-cyan)' : 'var(--text-primary)' }}>
                          {t.label}
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{t.desc}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <Check size={16} color="var(--accent-cyan)" strokeWidth={3} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Privacy Toggle */}
          <div className="glass-card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Lock size={20} color="#22C55E" />
              <div>
                <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--text-primary)' }}>Anonymous Radar Privacy</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Mask GPS in crowd counts</div>
              </div>
            </div>
            <input
              type="checkbox"
              checked={privacy}
              onChange={() => setPrivacy(!privacy)}
              style={{ width: '20px', height: '20px', accentColor: 'var(--accent-cyan)', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      <div style={{ marginTop: '28px' }}>
        <button
          onClick={onLogout}
          style={{
            width: '100%',
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#EF4444',
            fontWeight: '800',
            padding: '14px',
            borderRadius: '16px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
        >
          <LogOut size={18} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}
