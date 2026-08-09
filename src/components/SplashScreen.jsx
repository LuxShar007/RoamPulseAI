import React from 'react';
import { Activity } from 'lucide-react';

export default function SplashScreen({ onStart }) {
  return (
    <div
      onClick={onStart}
      style={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        cursor: 'pointer',
        background: '#0B1E1D'
      }}
    >
      {/* ── 1. High-Definition Dark Emerald Cloud Smoke Background Image (With Breathing Motion) ── */}
      <img
        src="/splash_cloud_bg.png"
        alt="RoamPulse AI Background"
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          zIndex: 1,
          filter: 'brightness(0.95) contrast(1.15)',
          animation: 'bgZoomMotion 18s ease-in-out infinite'
        }}
      />

      {/* ── 2. Live Dynamic Swirling Smoke Aura Layer 1 ── */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '480px',
        height: '480px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 229, 204, 0.35) 0%, rgba(26, 58, 53, 0.4) 45%, transparent 75%)',
        filter: 'blur(30px)',
        zIndex: 2,
        animation: 'smokeSwirl1 22s linear infinite',
        pointerEvents: 'none'
      }} />

      {/* ── 3. Live Dynamic Swirling Smoke Aura Layer 2 ── */}
      <div style={{
        position: 'absolute',
        top: '48%',
        left: '52%',
        width: '560px',
        height: '560px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 242, 254, 0.25) 0%, rgba(139, 92, 246, 0.2) 50%, transparent 80%)',
        filter: 'blur(45px)',
        zIndex: 3,
        animation: 'smokeSwirl2 28s linear infinite',
        pointerEvents: 'none'
      }} />

      {/* ── 4. Dark Vignette Ambient Overlay ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'radial-gradient(circle at 50% 50%, rgba(0, 229, 204, 0.12) 0%, rgba(11, 30, 29, 0.35) 60%, rgba(6, 17, 16, 0.8) 100%)',
        zIndex: 4,
        pointerEvents: 'none'
      }} />

      {/* ── 5. Center Radar Concentric Circles & Animated Sonar Pulse Heartbeat Button ── */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '-40px'
      }}>
        {/* Concentric Circles Container */}
        <div style={{
          position: 'relative',
          width: '280px',
          height: '280px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '36px'
        }}>
          {/* Animated Sonar Expansion Ring */}
          <div style={{
            position: 'absolute',
            width: '280px',
            height: '280px',
            borderRadius: '50%',
            border: '2px solid rgba(0, 229, 204, 0.4)',
            animation: 'sonarWave 3.5s ease-in-out infinite'
          }} />

          {/* Outer Thin Circle */}
          <div style={{
            position: 'absolute',
            width: '270px',
            height: '270px',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 0 50px rgba(0, 229, 204, 0.2)'
          }} />

          {/* Middle Thin Circle */}
          <div style={{
            position: 'absolute',
            width: '175px',
            height: '175px',
            borderRadius: '50%',
            border: '1px solid rgba(255, 255, 255, 0.4)'
          }} />

          {/* Center White Circle Pulse Button */}
          <div style={{
            position: 'relative',
            width: '68px',
            height: '68px',
            borderRadius: '50%',
            background: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0B1E1D',
            boxShadow: '0 0 35px rgba(255, 255, 255, 0.9), 0 0 60px rgba(0, 229, 204, 0.65)'
          }} className="radar-pulse">
            <Activity size={32} strokeWidth={2.2} />
          </div>
        </div>

        {/* Branding Typography */}
        <h1 style={{
          fontSize: '34px',
          fontWeight: '800',
          lineHeight: 1.1,
          color: '#FFFFFF',
          marginBottom: '8px',
          letterSpacing: '-0.5px',
          textAlign: 'center',
          textShadow: '0 2px 12px rgba(0,0,0,0.6)'
        }}>
          RoamPulse <span style={{ color: '#00E5CC' }}>AI</span>
        </h1>

        <p style={{
          fontSize: '15px',
          color: 'rgba(255, 255, 255, 0.88)',
          fontWeight: '500',
          letterSpacing: '-0.2px',
          textAlign: 'center',
          textShadow: '0 2px 10px rgba(0,0,0,0.6)'
        }}>
          Pulse-check your journey
        </p>
      </div>

      {/* Tap to Start Hint */}
      <div style={{
        position: 'absolute',
        bottom: '36px',
        zIndex: 10,
        fontSize: '13px',
        color: '#00E5CC',
        fontWeight: '700',
        letterSpacing: '0.5px',
        textTransform: 'uppercase',
        opacity: 0.9
      }}>
        Tap anywhere to start →
      </div>
    </div>
  );
}
