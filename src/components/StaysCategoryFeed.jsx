import React, { useState } from 'react';
import { Star, ShieldCheck, MapPin, Heart } from 'lucide-react';

export default function StaysCategoryFeed({ staysList, onSelectStay, activeCategoryTab = 'all', loading = false }) {
  const [selectedSubTab, setSelectedSubTab] = useState(activeCategoryTab);
  const [savedIds, setSavedIds] = useState(['stay-1']);

  const tabs = [
    { id: 'all', label: 'All Stays' },
    { id: 'Lodges', label: 'Lodges' },
    { id: 'Cottages', label: 'Cottages' },
    { id: '3-Star Hotels', label: '3-Star' },
    { id: '5-Star Hotels', label: '5-Star' }
  ];

  const filtered = selectedSubTab === 'all'
    ? staysList
    : staysList.filter(s => s.category === selectedSubTab);

  const toggleSave = (e, id) => {
    e.stopPropagation();
    if (savedIds.includes(id)) {
      setSavedIds(savedIds.filter(i => i !== id));
    } else {
      setSavedIds([...savedIds, id]);
    }
  };

  return (
    <div style={{ padding: '0 20px 24px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>Stays Radar</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Real-time OpenStreetMap locality stays</p>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--accent-cyan)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '6px' }}>
          {loading && <span className="live-dot" />}
          <span>{loading ? 'Scanning Locality...' : `${filtered.length} Live Spots`}</span>
        </span>
      </div>

      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', marginBottom: '16px', scrollbarWidth: 'none' }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedSubTab(tab.id)}
            style={{
              padding: '6px 14px',
              borderRadius: '16px',
              background: selectedSubTab === tab.id ? 'var(--accent-cyan)' : 'var(--bg-card)',
              color: selectedSubTab === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
              border: selectedSubTab === tab.id ? 'none' : '1px solid var(--border-subtle)',
              fontWeight: '800',
              fontSize: '12px',
              cursor: 'pointer',
              whiteSpace: 'nowrap'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.map((stay) => {
          const isSaved = savedIds.includes(stay.id);
          return (
            <div
              key={stay.id}
              onClick={() => onSelectStay(stay)}
              className="glass-card"
              style={{
                padding: '0',
                overflow: 'hidden',
                cursor: 'pointer'
              }}
            >
              <div style={{ position: 'relative', height: '170px', width: '100%' }}>
                <img
                  src={stay.image}
                  alt={stay.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />

                <button
                  onClick={(e) => toggleSave(e, stay.id)}
                  style={{
                    position: 'absolute',
                    top: '12px',
                    right: '12px',
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    background: 'rgba(6, 11, 18, 0.7)',
                    backdropFilter: 'blur(8px)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: isSaved ? '#EF4444' : '#FFF',
                    cursor: 'pointer'
                  }}
                >
                  <Heart size={16} fill={isSaved ? '#EF4444' : 'none'} />
                </button>

                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  right: '12px',
                  padding: '6px 12px',
                  borderRadius: '12px',
                  background: 'rgba(6, 11, 18, 0.85)',
                  backdropFilter: 'blur(8px)',
                  color: '#FFF',
                  fontWeight: '800',
                  fontSize: '14px'
                }}>
                  ₹{stay.price.toLocaleString()}<span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: '400' }}>{stay.pricePeriod}</span>
                </div>

                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  background: 'rgba(6, 11, 18, 0.85)',
                  backdropFilter: 'blur(8px)',
                  border: '1px solid var(--accent-cyan)',
                  color: 'var(--accent-cyan)',
                  fontSize: '11px',
                  fontWeight: '800',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}>
                  <ShieldCheck size={12} />
                  <span>Hygiene {stay.aiMetrics.hygiene}%</span>
                </div>
              </div>

              <div style={{ padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-primary)' }}>{stay.name}</h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F3A952', fontSize: '13px', fontWeight: '800' }}>
                    <Star size={14} fill="#F3A952" />
                    <span>{stay.googleRating || stay.rating}</span>
                    <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '400' }}>({stay.googleReviewsCount || 140})</span>
                  </div>
                </div>

                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <MapPin size={12} color="var(--accent-cyan)" />
                  <span>{stay.location} • {stay.distance}</span>
                </div>

                <div style={{
                  display: 'flex',
                  gap: '8px',
                  background: 'var(--bg-surface)',
                  padding: '8px 12px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700' }}>SAFETY</div>
                    <div style={{ fontSize: '13px', color: '#22C55E', fontWeight: '800' }}>{stay.aiMetrics.safety}% Index</div>
                  </div>
                  <div style={{ width: '1px', background: 'var(--border-subtle)' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '700' }}>PEACEFULNESS</div>
                    <div style={{ fontSize: '13px', color: '#8B5CF6', fontWeight: '800' }}>{stay.aiMetrics.peacefulness}% Quiet</div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
