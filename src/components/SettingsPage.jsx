import React, { useState } from 'react';
import { Palette, Lock, LogOut, ArrowLeft, Check, Globe, ExternalLink } from 'lucide-react';

function FigmaIcon({ size = 16 }) {
  return (
    <svg width={size} height={size * 1.5} viewBox="0 0 38 57" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M19 28.5C19 23.2533 23.2533 19 28.5 19C33.7467 19 38 23.2533 38 28.5C38 33.7467 33.7467 38 28.5 38H19V28.5Z" fill="#0ACF83"/>
      <path d="M0 47.5C0 42.2533 4.25329 38 9.5 38H19V47.5C19 52.7467 14.7467 57 9.5 57C4.25329 57 0 52.7467 0 47.5Z" fill="#1ABCFE"/>
      <path d="M0 28.5C0 23.2533 4.25329 19 9.5 19H19V38H9.5C4.25329 38 0 33.7467 0 28.5Z" fill="#A259FF"/>
      <path d="M0 9.5C0 4.25329 4.25329 0 9.5 0H19V19H9.5C4.25329 19 0 14.7467 0 9.5Z" fill="#F24E1E"/>
      <path d="M19 0H28.5C33.7467 0 38 4.25329 38 9.5C38 14.7467 33.7467 19 28.5 19H19V0Z" fill="#FF7262"/>
    </svg>
  );
}

export default function SettingsPage({ onBack, onLogout, currency, setCurrency, currentTheme, onSelectTheme }) {
  const [privacy, setPrivacy] = useState(true);

  const figmaDesignUrl = "https://www.figma.com/design/8RbDA2X0xEqG5NJW0pQf11/RoamPulseAI?node-id=0-1&t=w7L1KqsOf1UQdOH9-1";

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
          {/* Figma Brainstorm Prototype Link Card */}
          <div className="glass-card" style={{ background: 'linear-gradient(135deg, rgba(242,78,30,0.12) 0%, rgba(162,89,255,0.12) 100%)', border: '1px solid rgba(242,78,30,0.4)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'linear-gradient(135deg, #F24E1E 0%, #A259FF 100%)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FigmaIcon size={16} />
                </div>
                <div>
                  <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--text-primary)' }}>Figma Brainstorm Prototype</div>
                  <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>View raw scratch node canvas</div>
                </div>
              </div>

              <a
                href={figmaDesignUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: '8px 12px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #F24E1E 0%, #A259FF 100%)',
                  color: '#FFFFFF',
                  fontSize: '12px',
                  fontWeight: '800',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>Open Canvas</span>
                <ExternalLink size={13} />
              </a>
            </div>
          </div>

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
