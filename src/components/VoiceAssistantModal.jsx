import React, { useState, useEffect } from 'react';
import { X, Play, Square, Sparkles } from 'lucide-react';
import { voiceService } from '../services/voiceService';

export default function VoiceAssistantModal({ venue, localityName = 'Navi Mumbai', onClose }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const title = venue ? venue.name : localityName;
  const rating = venue?.googleRating || 4.7;
  const hygiene = venue?.aiMetrics?.hygieneScore || venue?.hygiene || 96;
  const safety = venue?.aiMetrics?.safetyIndex || 94;

  const scriptText = venue
    ? `Welcome to RoamPulse AI Voice Assistant. Here is your briefing for ${venue.name} in ${localityName}. This venue holds a Google rating of ${rating} stars based on verified customer reviews. Pulse AI rates the hygiene score at ${hygiene} percent, with a safety index of ${safety} percent. Key highlights from local guides: sanitized restrooms, 24/7 security monitoring, and excellent customer service. Have a safe and pleasant stay!`
    : `Welcome to RoamPulse AI Audio Guide for ${localityName}. Locality safety status is active with clean air index and 24/7 emergency response. Over 15 verified stays, street food spots, and sanitization stations are available near your position. Explore safely and enjoy your journey!`;

  const handleTogglePlay = () => {
    if (isPlaying) {
      voiceService.stop();
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      voiceService.speak(scriptText, () => setIsPlaying(false));
    }
  };

  useEffect(() => {
    setIsPlaying(true);
    voiceService.speak(scriptText, () => setIsPlaying(false));
    return () => voiceService.stop();
  }, [scriptText, venue, localityName]);

  return (
    <div className="modal-overlay" style={{ background: 'rgba(6, 11, 18, 0.85)', backdropFilter: 'blur(16px)' }}>
      <div className="modal-content" style={{ padding: '24px', textAlign: 'center', maxWidth: '420px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#00F2FE', fontSize: '12px', fontWeight: '800' }}>
            <Sparkles size={16} />
            <span>AI VOICE AUDIO BRIEFING</span>
          </div>
          <button onClick={() => { voiceService.stop(); onClose(); }} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* Animated Soundwave Visualizer */}
        <div style={{
          height: '100px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          margin: '20px 0'
        }}>
          {[40, 75, 100, 60, 90, 45, 80, 50, 95, 30].map((h, i) => (
            <div
              key={i}
              style={{
                width: '6px',
                height: isPlaying ? `${h}%` : '15%',
                background: 'linear-gradient(180deg, #00F2FE 0%, #8B5CF6 100%)',
                borderRadius: '4px',
                transition: 'height 0.25s ease-in-out',
                animation: isPlaying ? `pulseWave 1.${i % 3 + 2}s infinite ease-in-out` : 'none'
              }}
            />
          ))}
        </div>

        <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#FFF', marginBottom: '4px' }}>
          {title}
        </h3>
        <p style={{ fontSize: '13px', color: '#94A3B8', marginBottom: '20px', lineHeight: 1.5 }}>
          {scriptText}
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', marginTop: '16px' }}>
          <button
            onClick={handleTogglePlay}
            style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #00F2FE 0%, #8B5CF6 100%)',
              border: 'none',
              color: '#060B12',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)'
            }}
          >
            {isPlaying ? <Square size={24} fill="#060B12" /> : <Play size={24} fill="#060B12" style={{ marginLeft: '4px' }} />}
          </button>
        </div>
      </div>
    </div>
  );
}
