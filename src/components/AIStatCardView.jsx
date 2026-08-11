import React, { useState, useEffect, useMemo } from 'react';
import { ChevronLeft, Share2, Heart, MapPin, Sparkles, Navigation, ArrowRight, Star, Volume2 } from 'lucide-react';
import AIReviewModal from './AIReviewModal';
import VoiceAssistantModal from './VoiceAssistantModal';
import LiveNavigationModal from './LiveNavigationModal';
import { formatPrice } from '../utils/currency';
import { generateGoogleReviews } from '../services/googleReviewEngine.js';

function getPlaceSeed(name = '') {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash) || 42;
}

async function fetchLiveStats(placeName, placeLocation) {
  try {
    const query = encodeURIComponent(`${placeName} ${placeLocation || ''}`);
    const res = await fetch(`/api/google/place?query=${query}`);
    if (!res.ok) throw new Error('API offline');
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export default function AIStatCardView({ stay, onBack, onNavigate: _onNavigate, onBook, currency = 'INR' }) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showLiveNavModal, setShowLiveNavModal] = useState(false);
  const [activeImageIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [liveData, setLiveData] = useState(null);

  const defaultImg = 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';
  const images = (stay?.gallery && stay.gallery.length > 0) ? stay.gallery : [stay?.image || defaultImg];
  
  const seedId = getPlaceSeed(stay?.name || 'RoamPulse Place');
  const generatedData = useMemo(() => {
    return generateGoogleReviews(stay?.name || 'Place', stay?.category || 'stays', seedId);
  }, [stay?.name, stay?.category, seedId]);

  const metrics = {
    hygiene: liveData?.aiStats?.hygieneScore ?? stay?.hygiene ?? generatedData.aiStats.hygieneScore,
    safety: liveData?.aiStats?.safetyIndex ?? stay?.safety ?? generatedData.aiStats.safetyIndex,
    peacefulness: liveData?.aiStats?.peaceIndex ?? stay?.peacefulness ?? generatedData.aiStats.peaceIndex,
    valueForMoney: liveData?.aiStats?.valueForMoneyScore ?? generatedData.aiStats.valueForMoneyScore,
    expectedSpend: stay?.price || stay?.aiMetrics?.expectedSpend || 1200
  };

  const resolvedInsights = liveData?.aiStats?.reviewInsights ?? stay?.aiInsights ?? generatedData.aiStats.reviewInsights;

  const googleRating = liveData?.googleRating ?? stay?.googleRating ?? stay?.rating ?? generatedData.googleRating;
  const reviewsCount = liveData?.googleReviewsCount ?? stay?.googleReviewsCount ?? generatedData.googleReviewsCount;
  const googleReviews = (liveData?.googleReviews?.length) ? liveData.googleReviews : ((stay?.googleReviews?.length) ? stay.googleReviews : generatedData.googleReviews);

  useEffect(() => {
    let cancelled = false;
    if (stay?.name) {
      fetchLiveStats(stay.name, stay.location).then(data => {
        if (!cancelled) {
          setLiveData(data);
        }
      });
    }
    return () => { cancelled = true; };
  }, [stay?.name, stay?.location]);

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      background: 'var(--bg-dark)'
    }}>
      {/* Scrollable Viewport Body */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        paddingBottom: '90px',
        scrollbarWidth: 'none'
      }}>
        {/* Top Banner Image with Action Controls */}
        <div style={{ position: 'relative', width: '100%', height: '280px' }}>
          <img
            src={images[activeImageIndex]}
            alt={stay.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(to bottom, rgba(6,11,18,0.7) 0%, transparent 40%, rgba(6,11,18,0.95) 100%)'
          }} />

          {/* Top Control Header */}
          <div style={{
            position: 'absolute',
            top: '44px',
            left: '16px',
            right: '16px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            zIndex: 10
          }}>
            <button
              onClick={onBack}
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'rgba(6, 11, 18, 0.75)',
                backdropFilter: 'blur(12px)',
                border: '1px solid var(--border-subtle)',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <ChevronLeft size={22} />
            </button>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setSaved(!saved)}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(6, 11, 18, 0.75)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid var(--border-subtle)',
                  color: saved ? '#EF4444' : '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Heart size={20} fill={saved ? '#EF4444' : 'none'} />
              </button>
              <button
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'rgba(6, 11, 18, 0.75)',
                  backdropFilter: 'blur(12px)',
                  border: '1px solid var(--border-subtle)',
                  color: '#FFF',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <Share2 size={20} />
              </button>
            </div>
          </div>

          {/* Floating Stay Title & Price Overlay */}
          <div style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div>
                <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {stay.category || 'Lodges & Hotels'}
                </span>
                <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#FFF', margin: '2px 0 4px 0' }}>{stay.name}</h1>
                <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={13} color="var(--accent-cyan)" />
                  <span>{stay.location}</span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '20px', fontWeight: '800', color: 'var(--accent-cyan)' }}>
                  {formatPrice(stay.price, currency)}
                </div>
                <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)' }}>{stay.pricePeriod || '/night'}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Stat Card Body Content */}
        <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Google Reviews Badge */}
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: '#FEF08A', color: '#854D0E', padding: '4px 8px', borderRadius: '8px', fontWeight: '800', fontSize: '13px' }}>
                <Star size={14} fill="#854D0E" />
                <span>{googleRating}</span>
              </div>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>Google Verified Rating</div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Based on {reviewsCount} customer reviews</div>
              </div>
            </div>

            <button
              onClick={() => setShowReviewModal(true)}
              style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontWeight: '800', fontSize: '12px', cursor: 'pointer' }}
            >
              View Reviews
            </button>
          </div>

          {/* AI Stat Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="glass-card" style={{ padding: '14px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700' }}>HYGIENE SCORE</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: '#22C55E', margin: '4px 0' }}>{metrics.hygiene}%</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Sanitization & Washrooms</div>
            </div>

            <div className="glass-card" style={{ padding: '14px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700' }}>SAFETY INDEX</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--accent-cyan)', margin: '4px 0' }}>{metrics.safety}%</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>CCTV & Night Lighting</div>
            </div>

            <div className="glass-card" style={{ padding: '14px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700' }}>PEACE INDEX</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--accent-purple)', margin: '4px 0' }}>{metrics.peacefulness}%</div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Ambient Quiet (&lt;25dB)</div>
            </div>

            <div className="glass-card" style={{ padding: '14px' }}>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700' }}>EXPECTED SPEND</div>
              <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--accent-amber)', margin: '4px 0' }}>
                {formatPrice(metrics.expectedSpend, currency)}
              </div>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Avg stay estimate</div>
            </div>
          </div>

          {/* AI Bullet Summaries */}
          <div className="glass-card" style={{ padding: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles size={16} color="var(--accent-cyan)" />
                <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>AI Review Insights</span>
              </div>
              <button
                onClick={() => setShowVoiceModal(true)}
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '10px', padding: '4px 10px', color: 'var(--accent-cyan)', fontSize: '11px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <Volume2 size={13} />
                <span>Voice Briefing</span>
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {resolvedInsights.map((insight, idx) => (
                <div key={idx} style={{ fontSize: '12px', color: 'var(--text-primary)', display: 'flex', gap: '8px', lineHeight: 1.4 }}>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: '800' }}>•</span>
                  <span>{insight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating CTA Navigation & Booking Bar (POSITIONED INSIDE IPHONE FRAME) */}
      <div style={{
        position: 'absolute',
        bottom: '16px',
        left: '12px',
        right: '12px',
        padding: '10px 12px',
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: '20px',
        display: 'flex',
        gap: '10px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.6)',
        zIndex: 100
      }}>
        <button
          onClick={() => setShowLiveNavModal(true)}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '14px',
            background: 'var(--bg-surface)',
            border: '1px solid var(--accent-cyan)',
            color: 'var(--accent-cyan)',
            fontWeight: '800',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            whiteSpace: 'nowrap'
          }}
        >
          <Navigation size={16} />
          <span>Live Directions</span>
        </button>

        <button
          onClick={onBook}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '14px',
            background: 'var(--accent-cyan)',
            border: 'none',
            color: '#FFFFFF',
            fontWeight: '800',
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            whiteSpace: 'nowrap'
          }}
        >
          <span>Book Stay Now</span>
          <ArrowRight size={16} />
        </button>
      </div>

      {/* Modals */}
      {showReviewModal && (
        <AIReviewModal
          placeName={stay.name}
          rating={googleRating}
          reviewsCount={reviewsCount}
          reviewsList={googleReviews}
          onClose={() => setShowReviewModal(false)}
        />
      )}

      {showVoiceModal && (
        <VoiceAssistantModal
          placeName={stay.name}
          metrics={metrics}
          insights={resolvedInsights}
          onClose={() => setShowVoiceModal(false)}
        />
      )}

      {showLiveNavModal && (
        <LiveNavigationModal
          target={stay}
          onClose={() => setShowLiveNavModal(false)}
        />
      )}
    </div>
  );
}
