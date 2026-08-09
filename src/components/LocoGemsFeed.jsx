import React, { useState } from 'react';
import { Star, ShieldCheck, MapPin, Sparkles } from 'lucide-react';
import { formatPrice } from '../utils/currency';

export default function LocoGemsFeed({ locoGemsList = [], diningList = [], onSelectFood, loading = false, currency = 'INR' }) {
  const [activeTab, setActiveTab] = useState('all');

  const combined = activeTab === 'dining' ? diningList : activeTab === 'gems' ? locoGemsList : [...locoGemsList, ...diningList];

  return (
    <div style={{ padding: '0 20px 24px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span>LocoGems & Street Food Radar</span>
            <Sparkles size={18} color="var(--accent-cyan)" />
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Verified hygiene scores & authentic regional spots</p>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--accent-cyan)', fontWeight: '800' }}>
          {combined.length} Spots
        </span>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <button
          onClick={() => setActiveTab('all')}
          style={{
            padding: '6px 14px',
            borderRadius: '16px',
            background: activeTab === 'all' ? 'var(--accent-cyan)' : 'var(--bg-card)',
            color: activeTab === 'all' ? '#FFFFFF' : 'var(--text-secondary)',
            border: activeTab === 'all' ? 'none' : '1px solid var(--border-subtle)',
            fontWeight: '800',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          All Food
        </button>
        <button
          onClick={() => setActiveTab('gems')}
          style={{
            padding: '6px 14px',
            borderRadius: '16px',
            background: activeTab === 'gems' ? 'var(--accent-cyan)' : 'var(--bg-card)',
            color: activeTab === 'gems' ? '#FFFFFF' : 'var(--text-secondary)',
            border: activeTab === 'gems' ? 'none' : '1px solid var(--border-subtle)',
            fontWeight: '800',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          Street Food Gems
        </button>
        <button
          onClick={() => setActiveTab('dining')}
          style={{
            padding: '6px 14px',
            borderRadius: '16px',
            background: activeTab === 'dining' ? 'var(--accent-cyan)' : 'var(--bg-card)',
            color: activeTab === 'dining' ? '#FFFFFF' : 'var(--text-secondary)',
            border: activeTab === 'dining' ? 'none' : '1px solid var(--border-subtle)',
            fontWeight: '800',
            fontSize: '12px',
            cursor: 'pointer'
          }}
        >
          Dining & Cafes
        </button>
      </div>

      {loading ? (
        <div className="glass-card" style={{ padding: '30px', textAlign: 'center' }}>
          <span className="live-dot" />
          <div style={{ color: 'var(--accent-cyan)', fontWeight: '800', fontSize: '13px', marginTop: '8px' }}>
            Scanning Locality Street Food & Restaurants...
          </div>
        </div>
      ) : combined.length === 0 ? (
        <div className="glass-card" style={{ padding: '24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          No spots found in this category.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {combined.map((item) => (
            <div
              key={item.id}
              onClick={() => onSelectFood && onSelectFood(item)}
              className="glass-card feed-card-hover"
              style={{ cursor: 'pointer', overflow: 'hidden', padding: 0 }}
            >
              <div style={{ position: 'relative', width: '100%', height: '140px' }}>
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
                  borderRadius: '12px',
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

                <div style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '12px',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  background: 'rgba(6, 11, 18, 0.85)',
                  backdropFilter: 'blur(8px)',
                  color: '#FFF',
                  fontSize: '11px',
                  fontWeight: '800'
                }}>
                  Avg {formatPrice(item.price || item.avgSpend || 180, currency)}/person
                </div>
              </div>

              <div style={{ padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                    {item.name}
                  </h3>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'var(--border-subtle)', padding: '2px 8px', borderRadius: '8px' }}>
                    <Star size={12} fill="#FFB703" color="#FFB703" />
                    <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>
                      {item.rating || 4.6}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--text-secondary)', fontSize: '12px' }}>
                  <MapPin size={12} color="var(--text-muted)" />
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '280px' }}>
                    {item.location}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
