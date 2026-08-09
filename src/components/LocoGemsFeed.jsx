import React, { useState } from 'react';
import { Flame, ShieldCheck, Star, MapPin } from 'lucide-react';

export default function LocoGemsFeed({ diningList, locoGemsList, onSelectFood, loading = false }) {
  const [filterTab, setFilterTab] = useState('all');

  const allItems = [...(locoGemsList || []), ...(diningList || [])];
  const filtered = filterTab === 'locogems'
    ? (locoGemsList || [])
    : filterTab === 'dining'
    ? (diningList || [])
    : allItems;

  return (
    <div style={{ padding: '0 20px 24px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>Locality Food Feed</h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Real-time street food & restaurant radar</p>
        </div>
        <div style={{
          padding: '6px 12px',
          borderRadius: '12px',
          background: 'rgba(243, 169, 82, 0.15)',
          border: '1px solid rgba(243, 169, 82, 0.3)',
          color: '#F3A952',
          fontSize: '12px',
          fontWeight: '800',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <Flame size={14} />
          <span>{loading ? 'Scanning...' : `${filtered.length} Real-Time Spots`}</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {[
          { id: 'all', label: 'All Spots' },
          { id: 'locogems', label: 'Street Food (LocoGems)' },
          { id: 'dining', label: 'Restaurants' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterTab(tab.id)}
            style={{
              padding: '6px 14px',
              borderRadius: '16px',
              background: filterTab === tab.id ? 'var(--accent-cyan)' : 'var(--bg-card)',
              color: filterTab === tab.id ? '#FFFFFF' : 'var(--text-secondary)',
              border: filterTab === tab.id ? 'none' : '1px solid var(--border-subtle)',
              fontWeight: '800',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        {filtered.map((item) => (
          <div
            key={item.id}
            onClick={() => onSelectFood && onSelectFood(item)}
            className="glass-card"
            style={{
              padding: '0',
              overflow: 'hidden',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            <div style={{ position: 'relative', height: '140px', width: '100%' }}>
              <img
                src={item.image}
                alt={item.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '12px',
                padding: '4px 10px',
                borderRadius: '20px',
                background: 'rgba(6, 11, 18, 0.85)',
                backdropFilter: 'blur(8px)',
                border: '1px solid rgba(34, 197, 94, 0.4)',
                color: '#22C55E',
                fontSize: '12px',
                fontWeight: '800',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <ShieldCheck size={14} />
                <span>{item.hygiene}% Hygiene</span>
              </div>
              {item.avgSpend && (
                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  background: 'rgba(6, 11, 18, 0.85)',
                  backdropFilter: 'blur(8px)',
                  color: 'var(--accent-cyan)',
                  fontSize: '12px',
                  fontWeight: '800'
                }}>
                  {item.avgSpend}
                </div>
              )}
            </div>

            <div style={{ padding: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>{item.name}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F3A952', fontSize: '13px', fontWeight: '800' }}>
                  <Star size={14} fill="#F3A952" />
                  <span>{item.googleRating || item.rating}</span>
                  <span style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '400' }}>({item.googleReviewsCount || 90})</span>
                </div>
              </div>

              <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <MapPin size={12} color="var(--accent-cyan)" />
                <span>{item.distance}</span>
                <span>•</span>
                <span>{item.cuisine || item.type}</span>
              </div>

              {item.specialty && (
                <div style={{
                  fontSize: '12px',
                  color: 'var(--text-primary)',
                  background: 'var(--bg-surface)',
                  padding: '6px 10px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  🔥 Speciality: <strong>{item.specialty}</strong>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
