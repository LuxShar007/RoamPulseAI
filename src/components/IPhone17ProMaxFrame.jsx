import React, { useState, useEffect } from 'react';
import { Smartphone, Sparkles, Palette, ExternalLink, Sliders, Zap, HelpCircle, X, Compass, MapPin, Navigation, BookOpen, Star } from 'lucide-react';
import { useFramePacing } from '../utils/frameScheduler';

function FigmaIcon({ size = 15 }) {
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

/* macOS Minimalist Line-Art Wi-Fi Icon */
function MacOSWifiIcon({ color = '#FFFFFF', size = 15 }) {
  return (
    <svg width={size} height={size * 0.8} viewBox="0 0 20 16" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round">
      <path d="M1.5 4.5C6.2 -0.5 13.8 -0.5 18.5 4.5" />
      <path d="M4.5 8C7.5 4.8 12.5 4.8 15.5 8" />
      <path d="M7.5 11.5C9 10 11 10 12.5 11.5" />
      <circle cx="10" cy="14.5" r="1.2" fill={color} stroke="none" />
    </svg>
  );
}

/* macOS Battery Pill Indicator */
function MacOSBatteryPill({ color = '#FFFFFF', percentage = 98 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
      <span style={{
        fontSize: '11px',
        fontWeight: '700',
        letterSpacing: '-0.2px',
        color: color,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
      }}>
        {percentage}%
      </span>

      {/* macOS Pill Frame */}
      <div style={{
        width: '24px',
        height: '12px',
        borderRadius: '4.5px',
        border: `1.5px solid ${color}`,
        padding: '1.5px',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(0,0,0,0.1)'
      }}>
        {/* Inner Battery Fill */}
        <div style={{
          width: `${percentage}%`,
          height: '100%',
          background: percentage > 20 ? (color === '#FFFFFF' ? '#34D399' : color) : '#EF4444',
          borderRadius: '2px',
          transition: 'width 0.3s ease'
        }} />

        {/* Battery Nipple Cap */}
        <div style={{
          position: 'absolute',
          right: '-4px',
          top: '3px',
          width: '2px',
          height: '4px',
          borderRadius: '0 1.5px 1.5px 0',
          background: color
        }} />
      </div>
    </div>
  );
}

export default function IPhone17ProMaxFrame({ children, currentTheme, onSelectTheme }) {
  const [time, setTime] = useState('9:41');
  const [deviceFinish, setDeviceFinish] = useState('titanium');
  const [isDynamicIslandExpanded, setIsDynamicIslandExpanded] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  // 240Hz Dynamic Frame Pacing Telemetry
  const frameStats = useFramePacing();

  const figmaDesignUrl = "https://www.figma.com/design/8RbDA2X0xEqG5NJW0pQf11/RoamPulseAI?node-id=0-1&t=w7L1KqsOf1UQdOH9-1";

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
    titanium: { name: 'Titanium', bezel: '#232E2D', shadow: 'rgba(0, 229, 192, 0.35)', accent: '#00E5C0' },
    desert: { name: 'Desert Gold', bezel: '#382E25', shadow: 'rgba(212, 163, 115, 0.35)', accent: '#D4A373' },
    cyan: { name: 'Cyber Cyan', bezel: '#0F2C29', shadow: 'rgba(0, 242, 254, 0.4)', accent: '#00F2FE' },
    midnight: { name: 'Midnight Black', bezel: '#181920', shadow: 'rgba(162, 89, 255, 0.35)', accent: '#A259FF' }
  };

  const activeFinish = finishColors[deviceFinish] || finishColors.titanium;

  const themes = [
    { id: 'emerald', label: 'Dark Emerald', primary: '#00E5C0', aura: 'rgba(0, 229, 192, 0.18)' },
    { id: 'cyber', label: 'Cyber Midnight', primary: '#00F2FE', aura: 'rgba(0, 242, 254, 0.18)' },
    { id: 'solar', label: 'Solar Amber', primary: '#FFB703', aura: 'rgba(255, 183, 3, 0.18)' },
    { id: 'tokyo', label: 'Tokyo Pink', primary: '#FF007A', aura: 'rgba(255, 0, 122, 0.18)' },
    { id: 'light-minimal', label: 'Frost Jade (Light)', primary: '#00A88C', aura: 'rgba(0, 168, 140, 0.14)' },
    { id: 'light-rose', label: 'Coral Rose (Light)', primary: '#E05A47', aura: 'rgba(224, 90, 71, 0.14)' }
  ];

  const currentThemeObj = themes.find(t => t.id === currentTheme) || themes[0];
  const isLightTheme = currentTheme === 'light-minimal' || currentTheme === 'light-rose';
  const iconColor = isLightTheme ? 'var(--text-primary)' : '#FFFFFF';

  return (
    <div
      data-theme={currentTheme || 'emerald'}
      className="studio-canvas-root"
      style={{ '--studio-aura': currentThemeObj.aura }}
    >
      {/* Dynamic Ambient Background Glow Orb */}
      <div className="studio-glow-orb" />

      {/* ── Studio Glass Header (Themes & Figma Prototype) ── */}
      <div
        className="studio-glass-bar"
        style={{
          position: 'fixed',
          top: '12px',
          left: '20px',
          right: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '8px 18px',
          borderRadius: '20px',
          zIndex: 500,
          gap: '16px',
          flexWrap: 'wrap'
        }}
      >
        {/* Brand Title */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '30px',
            height: '30px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #00E5C0 0%, #00F2FE 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(0, 229, 192, 0.4)'
          }}>
            <Sparkles size={16} color="#060A0D" />
          </div>
          <div>
            <span style={{ fontSize: '14px', fontWeight: '900', color: '#FFFFFF', letterSpacing: '-0.3px' }}>
              RoamPulse AI
            </span>
          </div>
        </div>

        {/* Theme & Chassis Finish Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Theme Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 8px',
            borderRadius: '14px',
            background: 'rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <span style={{ fontSize: '11px', color: '#8AA8A5', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px', paddingLeft: '4px' }}>
              <Palette size={13} color="var(--accent-cyan)" /> Theme:
            </span>
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => onSelectTheme && onSelectTheme(t.id)}
                title={t.label}
                className="studio-pill-btn"
                style={{
                  padding: '4px 10px',
                  borderRadius: '10px',
                  background: currentTheme === t.id ? 'rgba(255, 255, 255, 0.12)' : 'transparent',
                  border: currentTheme === t.id ? `1px solid ${t.primary}` : '1px solid transparent',
                  color: currentTheme === t.id ? '#FFFFFF' : '#8AA8A5',
                  fontSize: '11px',
                  fontWeight: '800',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  whiteSpace: 'nowrap'
                }}
              >
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: t.primary, display: 'inline-block', boxShadow: currentTheme === t.id ? `0 0 8px ${t.primary}` : 'none' }} />
                {t.label}
              </button>
            ))}
          </div>

          {/* Chassis Finish Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            padding: '4px 8px',
            borderRadius: '14px',
            background: 'rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.08)'
          }}>
            <span style={{ fontSize: '11px', color: '#8AA8A5', fontWeight: '700', paddingLeft: '4px' }}>Finish:</span>
            {Object.entries(finishColors).map(([key, item]) => (
              <button
                key={key}
                onClick={() => setDeviceFinish(key)}
                title={item.name}
                className="studio-pill-btn"
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: item.bezel,
                  border: deviceFinish === key ? `2px solid ${item.accent}` : '1.5px solid rgba(255,255,255,0.2)',
                  cursor: 'pointer',
                  boxShadow: deviceFinish === key ? `0 0 10px ${item.accent}` : 'none'
                }}
              />
            ))}
          </div>

          {/* Figma Prototype Link */}
          <a
            href={figmaDesignUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="studio-pill-btn"
            style={{
              padding: '6px 14px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, rgba(242,78,30,0.2) 0%, rgba(13,35,34,0.95) 100%)',
              border: '1px solid rgba(242,78,30,0.6)',
              color: '#FFFFFF',
              fontSize: '12px',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none',
              cursor: 'pointer'
            }}
          >
            <FigmaIcon size={13} />
            <span>Figma Canvas</span>
            <ExternalLink size={13} color="var(--accent-cyan)" />
          </a>
        </div>
      </div>

      {/* ── Left Side Floating Interactive App Guide Trigger Icon ── */}
      <div style={{
        position: 'fixed',
        left: '24px',
        top: '50%',
        transform: 'translateY(-50%)',
        zIndex: 600,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '12px'
      }}>
        <button
          onClick={() => setShowGuideModal(!showGuideModal)}
          className="studio-pill-btn"
          style={{
            padding: '12px 18px',
            borderRadius: '30px',
            background: 'rgba(12, 18, 28, 0.92)',
            border: '1.5px solid var(--accent-cyan)',
            color: '#FFFFFF',
            fontSize: '13px',
            fontWeight: '800',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: '0 0 25px rgba(0, 242, 254, 0.35), 0 8px 30px rgba(0,0,0,0.6)',
            backdropFilter: 'blur(16px)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
          }}
        >
          <div style={{
            width: '26px',
            height: '26px',
            borderRadius: '50%',
            background: 'rgba(0, 242, 254, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)'
          }}>
            <HelpCircle size={17} />
          </div>
          <span>App User Guide</span>
          <span style={{
            fontSize: '9px',
            fontWeight: '900',
            color: '#060B12',
            background: 'var(--accent-cyan)',
            padding: '2px 7px',
            borderRadius: '10px',
            letterSpacing: '0.5px'
          }}>
            TIPS
          </span>
        </button>

        {/* ── Pop-Up App Feature Guide Modal (Smooth Fade-In & Pop) ── */}
        {showGuideModal && (
          <div
            style={{
              width: '340px',
              maxHeight: '78vh',
              overflowY: 'auto',
              borderRadius: '24px',
              background: 'rgba(10, 16, 26, 0.96)',
              border: '1px solid rgba(0, 242, 254, 0.4)',
              boxShadow: '0 30px 90px rgba(0, 0, 0, 0.9), 0 0 40px rgba(0, 242, 254, 0.2)',
              backdropFilter: 'blur(20px)',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
              animation: 'guidePopIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards',
              scrollbarWidth: 'none'
            }}
          >
            <style>{`
              @keyframes guidePopIn {
                0% { opacity: 0; transform: scale(0.85) translateX(-20px); }
                100% { opacity: 1; transform: scale(1) translateX(0); }
              }
            `}</style>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={20} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '15px', fontWeight: '800', color: '#FFF' }}>RoamPulse AI Feature Guide</h3>
              </div>
              <button
                onClick={() => setShowGuideModal(false)}
                style={{ background: 'none', border: 'none', color: '#8AA8A5', cursor: 'pointer', padding: '4px' }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ fontSize: '11px', color: '#94A3B8', lineHeight: '1.5' }}>
              Quick guide for discovering real-time places, AI travel planning & live turn navigation:
            </div>

            {/* Feature Tip 1 */}
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#22C55E', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <MapPin size={15} /> 1. Locality Radar & Needs
              </div>
              <div style={{ fontSize: '11px', color: '#CBD5E1', lineHeight: '1.4' }}>
                Fetches <strong>100% real-time OpenStreetMap</strong> places surrounding your exact location in Panvel (or any city). Covers Stays, Street Food, 24/7 Hospitals, & Clean Restrooms.
              </div>
            </div>

            {/* Feature Tip 2 */}
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#00F2FE', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Navigation size={15} /> 2. OSRM Turn-by-Turn Route
              </div>
              <div style={{ fontSize: '11px', color: '#CBD5E1', lineHeight: '1.4' }}>
                Click <strong>"Live Route"</strong> on any stay or venue card to generate real turn-by-turn driving directions with distance & ETA.
              </div>
            </div>

            {/* Feature Tip 3 */}
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#F59E0B', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <BookOpen size={15} /> 3. AI Travel Itinerary Planner
              </div>
              <div style={{ fontSize: '11px', color: '#CBD5E1', lineHeight: '1.4' }}>
                Tailor custom 1–3 day plans based on your budget & vibe. Save generated itineraries to your profile & persistent storage.
              </div>
            </div>

            {/* Feature Tip 4 */}
            <div style={{ background: 'rgba(255, 255, 255, 0.04)', padding: '12px', borderRadius: '16px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#EC4899', display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                <Star size={15} /> 4. Reviews & AI Hygiene Ratings
              </div>
              <div style={{ fontSize: '11px', color: '#CBD5E1', lineHeight: '1.4' }}>
                Click any stay or dining card to view real Google star ratings, user reviews, and AI safety scores.
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── iPhone 17 Pro Max Chassis Container ── */}
      <div style={{
        position: 'relative',
        width: '410px',
        height: '840px',
        borderRadius: '52px',
        border: `10px solid ${activeFinish.bezel}`,
        boxShadow: `0 35px 100px rgba(0, 0, 0, 0.95), 0 0 70px ${activeFinish.shadow}`,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        background: '#000000',
        margin: 'auto 0',
        flexShrink: 0,
        transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
        boxSizing: 'border-box',
        zIndex: 2
      }}>
        {/* Left Physical Side Buttons */}
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
          {/* macOS Inspired System Status Bar Floating Overlay */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '44px',
            padding: '10px 14px 0 16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 350,
            pointerEvents: 'none',
            background: 'transparent'
          }}>
            {/* Live Clock & macOS Typography */}
            <span style={{
              fontSize: '13px',
              fontWeight: '700',
              color: iconColor,
              letterSpacing: '-0.3px',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", sans-serif'
            }}>
              {time}
            </span>

            {/* Dynamic Island / macOS Notch */}
            <div
              onClick={() => setIsDynamicIslandExpanded(!isDynamicIslandExpanded)}
              style={{
                position: 'absolute',
                top: '7px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: isDynamicIslandExpanded ? '180px' : '110px',
                height: isDynamicIslandExpanded ? '32px' : '28px',
                background: '#000000',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0 8px',
                cursor: 'pointer',
                pointerEvents: 'auto',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                boxShadow: '0 4px 15px rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.14)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0D1418' }} />
                {isDynamicIslandExpanded && (
                  <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Sparkles size={11} />
                    240Hz
                  </span>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                {isDynamicIslandExpanded && (
                  <span style={{ fontSize: '10px', color: '#22C55E', fontWeight: '800' }}>
                    AQI 38
                  </span>
                )}
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#121A20' }} />
              </div>
            </div>

            {/* macOS System Status Icons (Minimalist Line-Art 5G Signal, Wi-Fi, Battery Pill) */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              color: iconColor
            }}>
              {/* 5G Signal Bars */}
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '1.5px', height: '10px' }}>
                <div style={{ width: '2px', height: '3px', borderRadius: '0.5px', background: iconColor }} />
                <div style={{ width: '2px', height: '5px', borderRadius: '0.5px', background: iconColor }} />
                <div style={{ width: '2px', height: '7.5px', borderRadius: '0.5px', background: iconColor }} />
                <div style={{ width: '2px', height: '10px', borderRadius: '0.5px', background: iconColor }} />
              </div>

              {/* Wi-Fi Line-Art Icon */}
              <MacOSWifiIcon color={iconColor} size={14} />

              {/* Pill Battery Indicator */}
              <MacOSBatteryPill color={iconColor} percentage={98} />
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
