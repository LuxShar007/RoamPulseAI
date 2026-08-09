import React, { useState, useEffect } from 'react';
import { ChevronLeft, Share2, Heart, MapPin, Sparkles, Navigation, BookmarkCheck, ArrowRight, Star, Volume2 } from 'lucide-react';
import AIReviewModal from './AIReviewModal';
import VoiceAssistantModal from './VoiceAssistantModal';
import LiveNavigationModal from './LiveNavigationModal';

async function fetchLiveStats(placeName, placeLocation) {
  try {
    const query = encodeURIComponent(`${placeName} ${placeLocation || ''}`);
    const res = await fetch(`http://localhost:5000/api/google/place?query=${query}`);
    if (!res.ok) throw new Error('API offline');
    const json = await res.json();
    return json.data;
  } catch {
    return null;
  }
}

export default function AIStatCardView({ stay, onBack, onNavigate, onBook }) {
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [showVoiceModal, setShowVoiceModal] = useState(false);
  const [showLiveNavModal, setShowLiveNavModal] = useState(false);
  const [activeImageIndex] = useState(0);
  const [saved, setSaved] = useState(false);
  const [liveData, setLiveData] = useState(null);
  const [isLoadingLive, setIsLoadingLive] = useState(true);

  const images = stay.gallery || [stay.image];
  const baseMetics = stay.aiMetrics || { hygiene: 94, safety: 95, peacefulness: 88, valueForMoney: 4.6, expectedSpend: 1200 };

  const metrics = {
    hygiene: liveData?.aiStats?.hygieneScore ?? baseMetics.hygiene,
    safety: liveData?.aiStats?.safetyIndex ?? baseMetics.safety,
    peacefulness: liveData?.aiStats?.peaceIndex ?? baseMetics.peacefulness,
    valueForMoney: liveData?.aiStats?.valueForMoneyScore ?? baseMetics.valueForMoney,
    expectedSpend: stay.price || baseMetics.expectedSpend
  };

  const resolvedInsights = liveData?.aiStats?.reviewInsights ?? stay.aiInsights ?? [
    'Consistently clean and sanitized facilities verified by RoamPulse AI.',
    '24/7 security monitored locality.',
    'Quiet ambient atmosphere.'
  ];

  const googleRating = liveData?.googleRating ?? stay.googleRating ?? stay.rating ?? 4.7;
  const reviewsCount = liveData?.googleReviewsCount ?? stay.googleReviewsCount ?? 142;
  const googleReviews = liveData?.googleReviews ?? stay.googleReviews ?? [];

  useEffect(() => {
    let cancelled = false;
    setIsLoadingLive(true);
    fetchLiveStats(stay.name, stay.location).then(data => {
      if (!cancelled) {
        setLiveData(data);
        setIsLoadingLive(false);
      }
    });
    return () => { cancelled = true; };
  }, [stay.name, stay.location]);

  return (
    <div style={{ background: 'var(--bg-dark)', minHeight: '100%', paddingBottom: '32px' }}>
      {/* Hero Image */}
      <div style={{ position: 'relative', height: '320px', width: '100%' }}>
        <img src={liveData?.photoUrl || images[activeImageIndex]} alt={stay.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(180deg, rgba(6,11,18,0.7) 0%, rgba(6,11,18,0) 40%, rgba(11,19,30,0.85) 100%)'
        }} />

        {/* Back + Action buttons */}
        <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 10 }}>
          <button onClick={onBack} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(6,11,18,0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <ChevronLeft size={22} />
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button onClick={() => setShowVoiceModal(true)} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(0, 229, 192, 0.25)', backdropFilter: 'blur(10px)', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Volume2 size={20} />
            </button>
            <button onClick={() => setSaved(!saved)} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(6,11,18,0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', color: saved ? '#EF4444' : '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Heart size={20} fill={saved ? '#EF4444' : 'none'} />
            </button>
            <button style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(6,11,18,0.7)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', color: '#FFF', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <Share2 size={20} />
            </button>
          </div>
        </div>

        {/* Title overlay */}
        <div style={{ position: 'absolute', bottom: '20px', left: '20px', right: '20px', zIndex: 10 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 12px', borderRadius: '20px', background: 'rgba(6, 11, 18, 0.85)', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)', fontSize: '12px', fontWeight: '800', marginBottom: '8px' }}>
            <Sparkles size={14} />
            <span>AI Verified Locality Stay</span>
          </div>
          <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#FFF', marginBottom: '4px' }}>{stay.name}</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: 'rgba(255,255,255,0.85)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} color="var(--accent-cyan)" />{stay.location}</span>
            <span>•</span>
            <span>{stay.distance}</span>
          </div>
        </div>
      </div>

      <div style={{ padding: '0 20px' }}>
        {/* Google Rating Badge & Review Trigger */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px', background: 'var(--bg-card)', borderRadius: '18px', border: '1px solid var(--border-subtle)', margin: '20px 0' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Star size={18} fill="#F3A952" color="#F3A952" />
              <span style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>{googleRating}</span>
              <span style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>({reviewsCount} Google Reviews)</span>
            </div>
            <div style={{ fontSize: '11px', color: '#22C55E', fontWeight: '800', marginTop: '2px' }}>
              ✓ Verified Customer Ratings
            </div>
          </div>
          <button onClick={() => setShowReviewModal(true)} style={{ background: 'var(--bg-surface)', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)', padding: '8px 14px', borderRadius: '12px', fontSize: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span>Read Reviews</span>
            <ArrowRight size={14} />
          </button>
        </div>

        {/* AI Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
          <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '18px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700' }}>HYGIENE SCORE</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#22C55E', margin: '4px 0' }}>{metrics.hygiene}%</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Sanitized Restrooms</div>
          </div>
          <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '18px', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700' }}>SAFETY INDEX</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent-cyan)', margin: '4px 0' }}>{metrics.safety}%</div>
            <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>24/7 CCTV & Patrol</div>
          </div>
        </div>

        {/* Insights list */}
        <div style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '18px', border: '1px solid var(--border-subtle)', marginBottom: '24px' }}>
          <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Sparkles size={16} color="var(--accent-cyan)" />
            <span>AI Review Summaries</span>
          </div>
          {resolvedInsights.map((insight, i) => (
            <div key={i} style={{ fontSize: '12px', color: 'var(--text-secondary)', padding: '6px 0', borderBottom: i < resolvedInsights.length - 1 ? '1px solid var(--border-subtle)' : 'none', display: 'flex', gap: '8px' }}>
              <span style={{ color: 'var(--accent-cyan)' }}>•</span>
              <span>{insight}</span>
            </div>
          ))}
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setShowLiveNavModal(true)}
            style={{
              flex: 1, background: 'var(--bg-card)', border: '1px solid var(--accent-cyan)', color: 'var(--accent-cyan)',
              fontWeight: '800', padding: '14px', borderRadius: '16px', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
              fontSize: '14px'
            }}
          >
            <Navigation size={18} />
            <span>Live GPS Navigation</span>
          </button>
          <button onClick={onBook} className="btn-primary" style={{ flex: 1.2 }}>
            <BookmarkCheck size={18} />
            <span>Book / Reserve</span>
          </button>
        </div>
      </div>

      {showVoiceModal && (
        <VoiceAssistantModal
          venue={stay}
          localityName={stay.location}
          onClose={() => setShowVoiceModal(false)}
        />
      )}

      {showReviewModal && (
        <AIReviewModal
          googleRating={googleRating}
          reviewsCount={reviewsCount}
          reviews={googleReviews}
          onClose={() => setShowReviewModal(false)}
        />
      )}

      {showLiveNavModal && (
        <LiveNavigationModal
          destination={stay.name}
          localityName={stay.location}
          onClose={() => setShowLiveNavModal(false)}
        />
      )}
    </div>
  );
}
