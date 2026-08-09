import React, { useState, useEffect } from 'react';
import { Wifi, Signal, Smartphone, Sparkles, Palette } from 'lucide-react';

export default function IPhone17ProMaxFrame({ children, currentTheme, onSelectTheme }) {
  const [time, setTime] = useState('9:41');
  const [deviceFinish, setDeviceFinish] = useState('titanium');
  const [isDynamicIslandExpanded, setIsDynamicIslandExpanded] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 30000);
    return () => clearInterval(interval);
  }, []);

  const finishColors = {
    titanium: { bezel: '#232E2D', shadow: 'rgba(0, 229, 192, 0.25)' },
    desert: { bezel: '#382E25', shadow: 'rgba(212, 163, 115, 0.25)' },
    cyan: { bezel: '#0F2C29', shadow: 'rgba(0, 242, 254, 0.3)' }
  };

  const activeFinish = finishColors[deviceFinish];

  const themes = [
    { id: 'emerald', label: 'Dark Emerald', primary: '#00E5C0' },
    { id: 'cyber', label: 'Cyber Midnight', primary: '#00F2FE' },
    { id: 'solar', label: 'Solar Amber', primary: '#FFB703' },
    { id: 'tokyo', label: 'Tokyo Pink', primary: '#FF007A' },
    { id: 'light-minimal', label: 'Frost Jade (Light)', primary: '#00A88C' },
    { id: 'light-rose', label: 'Coral Rose (Light)', primary: '#E05A47' }
  ];

  const isLightTheme = currentTheme === 'light-minimal' || currentTheme === 'light-rose';
  const iconColor = isLightTheme ? 'var(--text-primary)' : '#FFFFFF';

  return (
    <div
      data-theme={currentTheme || 'emerald'}
      style={{
        width: '100%',
        minHeight: '100vh',
        background: '#060A0D',
        backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.08) 1px, transparent 1px)',
        backgroundSize: '24px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '54px 16px 20px 16px',
        position: 'relative',
        boxSizing: 'border-box'
      }}
    >
      {/* ── Figma Workspace Canvas Top Toolbar ── */}
      <div style={{
        position: 'fixed',
        top: '10px',
        left: '16px',
        right: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '8px',
        zIndex: 500
      }}>
        {/* Left Badge */}
        <div style={{
          padding: '6px 14px',
          borderRadius: '12px',
          background: 'rgba(13, 35, 34, 0.95)',
          border: '1px solid var(--border-subtle)',
          backdropFilter: 'blur(14px)',
          color: '#FFF',
          fontSize: '12px',
          fontWeight: '800',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
          <Smartphone size={16} color="var(--accent-cyan)" />
          <span>Figma Prototype • iPhone 17 Pro Max</span>
          <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', background: 'var(--border-subtle)', padding: '2px 6px', borderRadius: '6px' }}>
            430 x 932 px
          </span>
        </div>

        {/* Theme Palette Switcher */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 8px',
          borderRadius: '14px',
          background: 'rgba(13, 35, 34, 0.95)',
          border: '1px solid var(--border-subtle)',
          backdropFilter: 'blur(14px)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
          overflowX: 'auto'
        }}>
          <span style={{ fontSize: '11px', color: '#8AA8A5', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', paddingLeft: '4px' }}>
            <Palette size={13} color="var(--accent-cyan)" /> Theme:
          </span>
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => onSelectTheme(t.id)}
              style={{
                padding: '4px 10px',
                borderRadius: '10px',
                background: currentTheme === t.id ? t.primary : 'transparent',
                color: currentTheme === t.id ? '#FFFFFF' : '#8AA8A5',
                border: 'none',
                fontSize: '11px',
                fontWeight: '800',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                whiteSpace: 'nowrap'
              }}
            >
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.primary, display: 'inline-block' }} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── iPhone 17 Pro Max Chassis Container ── */}
      <div style={{
        position: 'relative',
        width: '410px',
        height: '840px',
        borderRadius: '50px',
        border: `10px solid ${activeFinish.bezel}`,
        boxShadow: `0 35px 90px rgba(0, 0, 0, 0.95), 0 0 60px ${activeFinish.shadow}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: '#000000',
        margin: 'auto 0',
        flexShrink: 0,
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        boxSizing: 'border-box'
      }}>
        {/* Left Physical Side Buttons (Action & Volume) */}
        <div style={{
          position: 'absolute', left: '-13px', top: '100px', width: '3px', height: '26px',
          background: activeFinish.bezel, borderRadius: '3px 0 0 3px', zIndex: 100
        }} />
        <div style={{
          position: 'absolute', left: '-13px', top: '142px', width: '3px', height: '48px',
          background: activeFinish.bezel, borderRadius: '3px 0 0 3px', zIndex: 100
        }} />
        <div style={{
          position: 'absolute', left: '-13px', top: '202px', width: '3px', height: '48px',
          background: activeFinish.bezel, borderRadius: '3px 0 0 3px', zIndex: 100
        }} />

        {/* Right Side Power Button */}
        <div style={{
          position: 'absolute', right: '-13px', top: '155px', width: '3px', height: '70px',
          background: activeFinish.bezel, borderRadius: '0 3px 3px 0', zIndex: 100
        }} />

        {/* ── Seamless Edge-to-Edge Inner Viewport Screen Glass ── */}
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
          overflow: 'hidden',
          borderRadius: '40px',
          background: 'var(--bg-dark)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Transparent iPhone 17 Status Bar Floating Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '44px',
            padding: '10px 22px 0 22px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 350,
            pointerEvents: 'none',
            background: 'transparent'
          }}>
            {/* Live Clock */}
            <span style={{
              fontSize: '14px',
              fontWeight: '800',
              color: iconColor,
              letterSpacing: '-0.2px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
            }}>
              {time}
            </span>

            {/* Dynamic Island Notch */}
            <div
              onClick={() => setIsDynamicIslandExpanded(!isDynamicIslandExpanded)}
              style={{
                position: 'absolute',
                top: '8px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: isDynamicIslandExpanded ? '200px' : '118px',
                height: isDynamicIslandExpanded ? '36px' : '30px',
                background: '#000000',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 10px',
                cursor: 'pointer',
                pointerEvents: 'auto',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.12)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#0D1418' }} />
                {isDynamicIslandExpanded && (
                  <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Sparkles size={12} />
                    Pulse Active
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {isDynamicIslandExpanded && (
                  <span style={{ fontSize: '11px', color: '#22C55E', fontWeight: '800' }}>
                    AQI 38
                  </span>
                )}
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#121A20' }} />
              </div>
            </div>

            {/* Pixel-Perfect iPhone 17 Status Icons (5G Signal, Wi-Fi, Battery Pill) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              color: iconColor
            }}>
              {/* 5G Signal Bars */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5px', height: '11px' }}>
                <div style={{ width: '2.5px', height: '3px', borderRadius: '0.5px', background: iconColor }} />
                <div style={{ width: '2.5px', height: '5.5px', borderRadius: '0.5px', background: iconColor }} />
                <div style={{ width: '2.5px', height: '8px', borderRadius: '0.5px', background: iconColor }} />
                <div style={{ width: '2.5px', height: '11px', borderRadius: '0.5px', background: iconColor }} />
              </div>

              {/* Wi-Fi Icon */}
              <Wifi size={14} strokeWidth={2.5} color={iconColor} />

              {/* iPhone 17 Battery Pill Indicator with 98% Badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ fontSize: '11px', fontWeight: '800', opacity: 0.9, color: iconColor }}>98%</span>
                <div style={{
                  width: '23px',
                  height: '11px',
                  borderRadius: '3.5px',
                  border: `1.5px solid ${iconColor}`,
                  padding: '1.5px',
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  <div style={{
                    width: '85%',
                    height: '100%',
                    background: iconColor,
                    borderRadius: '1.5px'
                  }} />
                  {/* Battery Nipple Cap */}
                  <div style={{
                    position: 'absolute',
                    right: '-3.5px',
                    top: '2.5px',
                    width: '2px',
                    height: '4px',
                    borderRadius: '0 1px 1px 0',
                    background: iconColor
                  }} />
                </div>
              </div>
            </div>
          </div>

          {/* Children Screen Content - Seamless 100% Height */}
          <div style={{
            flex: 1,
            width: '100%',
            height: '100%',
            position: 'relative',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {children}
          </div>

          {/* Home Indicator Bar Floating Overlay */}
          <div style={{
            position: 'absolute',
            bottom: '6px',
            left: 0,
            right: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 350,
            pointerEvents: 'none'
          }}>
            <div style={{
              width: '130px',
              height: '4px',
              background: isLightTheme ? 'rgba(0, 0, 0, 0.4)' : 'rgba(255, 255, 255, 0.7)',
              borderRadius: '2px'
            }} />
          </div>
        </div>
      </div>
    </div>
  );
}
