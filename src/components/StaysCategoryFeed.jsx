import React, { useState } from 'react';
import { Star, ShieldCheck, MapPin, Heart } from 'lucide-react';
import { formatPrice } from '../utils/currency';

export default function StaysCategoryFeed({ staysList, onSelectStay, activeCategoryTab = 'all', loading = false, currency = 'INR' }) {
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

      {loading ? (
        <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
          <span className="live-dot" />
          <div style={{ color: 'var(--accent-cyan)', fontWeight: '800', fontSize: '13px', marginTop: '8px' }}>
            Fetching Live OpenStreetMap Accommodations...
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No accommodations found in this category. Try selecting "All Stays".
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {filtered.map((stay) => {
            const isSaved = savedIds.includes(stay.id);
            return (
              <div
                key={stay.id}
                onClick={() => onSelectStay(stay)}
                className="glass-card feed-card-hover"
                style={{ cursor: 'pointer', overflow: 'hidden', padding: 0 }}
              >
                <div style={{ position: 'relative', width: '100%', height: '160px' }}>
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
                      width: '34px',
                      height: '34px',
                      borderRadius: '50%',
                      background: 'rgba(6, 11, 18, 0.65)',
                      backdropFilter: 'blur(8px)',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer'
                    }}
                  >
                    <Heart size={16} fill={isSaved ? '#EF4444' : 'none'} color={isSaved ? '#EF4444' : '#FFFFFF'} />
                  </button>

                  <div style={{
                    position: 'absolute',
                    top: '12px',
                    left: '12px',
                    padding: '4px 10px',
                    borderRadius: '12px',
                    background: 'rgba(6, 11, 18, 0.85)',
                    backdropFilter: 'blur(8px)',
                    color: '#FFF',
                    fontSize: '11px',
                    fontWeight: '800'
                  }}>
                    {stay.category}
                  </div>

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
                    {formatPrice(stay.price, currency)}
                    <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', fontWeight: '400' }}>
                      {stay.pricePeriod || '/night'}
                    </span>
                  </div>

                  {stay.aiMetrics && (
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
                  )}
                </div>

                <div style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                      {stay.name}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--border-subtle)', padding: '2px 8px', borderRadius: '8px' }}>
                      <Star size={12} fill="#FFB703" color="#FFB703" />
                      <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
                        {stay.rating}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '12px', marginBottom: '8px' }}>
                    <MapPin size={12} color="var(--text-muted)" />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '280px' }}>
                      {stay.location}
                    </span>
                  </div>

                  {stay.aiMetrics && (
                    <div style={{ display: 'flex', gap: '12px', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)', fontSize: '11px' }}>
                      <span style={{ color: 'var(--text-muted)' }}>Safety: <strong style={{ color: '#22C55E' }}>{stay.aiMetrics.safety}%</strong></span>
                      <span style={{ color: 'var(--text-muted)' }}>Peace: <strong style={{ color: 'var(--accent-cyan)' }}>{stay.aiMetrics.peace}%</strong></span>
                      <span style={{ color: 'var(--text-muted)' }}>Distance: <strong style={{ color: 'var(--text-primary)' }}>{stay.distance}</strong></span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
