import React, { useState } from 'react';
import { Heart, Calendar, Sparkles, MapPin, ChevronDown, ChevronUp } from 'lucide-react';
import { formatPrice } from '../utils/currency';

export default function SavedPlaces({ savedStays = [], savedFood = [], savedItineraries = [], onSelectStay, currency = 'INR' }) {
  const [expandedItineraryId, setExpandedItineraryId] = useState(null);

  const toggleExpand = (id) => {
    setExpandedItineraryId(expandedItineraryId === id ? null : id);
  };

  return (
    <div style={{ padding: '44px 20px 20px 20px', background: 'var(--bg-dark)', minHeight: '100%' }}>
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)' }}>Saved Places & Itineraries</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Your bookmarked stays, AI itineraries & food spots</p>
      </div>

      {/* ── 1. Saved AI Travel Itineraries (SQLite DB) ── */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '13px', color: 'var(--accent-cyan)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={16} />
          <span>Saved AI Travel Itineraries ({savedItineraries.length})</span>
        </div>

        {savedItineraries.length === 0 ? (
          <div className="glass-card" style={{ padding: '20px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '13px' }}>
            No saved itineraries yet. Generate one in the <strong>Itinerary Planner</strong> tab!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {savedItineraries.map((itinerary) => {
              const isExpanded = expandedItineraryId === itinerary.id;
              let planDays = [];
              try {
                planDays = typeof itinerary.planJson === 'string' ? JSON.parse(itinerary.planJson) : (itinerary.planJson || []);
              } catch {
                planDays = [];
              }

              return (
                <div
                  key={itinerary.id}
                  className="glass-card"
                  style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '14px',
                        background: 'var(--border-subtle)',
                        color: 'var(--accent-cyan)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Calendar size={20} />
                      </div>
                      <div>
                        <div style={{ fontWeight: '800', fontSize: '16px', color: 'var(--text-primary)' }}>
                          {itinerary.locality || 'Locality'} {itinerary.days || 3}-Day AI Plan
                        </div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span>Vibe: {itinerary.vibe || 'PEACE'}</span>
                          <span>•</span>
                          <span>Budget: {itinerary.budget || '₹3,000 - ₹6,000'}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => toggleExpand(itinerary.id)}
                      style={{
                        background: 'var(--bg-surface)',
                        border: '1px solid var(--border-subtle)',
                        borderRadius: '10px',
                        padding: '6px 10px',
                        color: 'var(--accent-cyan)',
                        fontSize: '12px',
                        fontWeight: '800',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <span>{isExpanded ? 'Hide' : 'View Plan'}</span>
                      {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>
                  </div>

                  {/* Expanded Day-by-Day Activity Details */}
                  {isExpanded && planDays.length > 0 && (
                    <div style={{
                      marginTop: '8px',
                      paddingTop: '12px',
                      borderTop: '1px solid var(--border-subtle)',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}>
                      {planDays.map((dayItem, dIdx) => (
                        <div key={dIdx} style={{ background: 'var(--bg-surface)', padding: '12px', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
                          <div style={{ fontWeight: '800', fontSize: '13px', color: 'var(--accent-cyan)', marginBottom: '4px' }}>
                            Day {dayItem.day}: {dayItem.title}
                          </div>
                          <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                            {dayItem.overview}
                          </div>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            {dayItem.activities?.map((act, aIdx) => (
                              <div key={aIdx} style={{ fontSize: '12px', color: 'var(--text-primary)', display: 'flex', justifyContent: 'space-between' }}>
                                <span>• <strong>{act.time}:</strong> {act.name}</span>
                                <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{act.cost}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── 2. Saved Accommodations ── */}
      <div style={{ marginBottom: '28px' }}>
        <div style={{ fontSize: '13px', color: 'var(--accent-cyan)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '12px' }}>
          Saved Accommodations ({savedStays.length})
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {savedStays.map((stay) => (
            <div
              key={stay.id}
              onClick={() => onSelectStay(stay)}
              className="glass-card"
              style={{ padding: '14px', display: 'flex', gap: '12px', alignItems: 'center', cursor: 'pointer' }}
            >
              <img
                src={stay.image}
                alt={stay.name}
                style={{ width: '70px', height: '70px', borderRadius: '12px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '800', fontSize: '15px', color: 'var(--text-primary)' }}>{stay.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0' }}>{stay.location}</div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--accent-cyan)' }}>
                  {formatPrice(stay.price, currency)}/night
                </div>
              </div>
              <Heart size={18} fill="#EF4444" color="#EF4444" />
            </div>
          ))}
        </div>
      </div>

      {/* ── 3. Saved Street Food Spots ── */}
      <div>
        <div style={{ fontSize: '13px', color: 'var(--accent-amber)', fontWeight: '800', textTransform: 'uppercase', marginBottom: '12px' }}>
          Saved Street Food Spots (LocoGems)
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {savedFood.map((food) => (
            <div
              key={food.id}
              className="glass-card"
              style={{ padding: '14px', display: 'flex', gap: '12px', alignItems: 'center' }}
            >
              <img
                src={food.image}
                alt={food.name}
                style={{ width: '60px', height: '60px', borderRadius: '12px', objectFit: 'cover' }}
              />
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--text-primary)' }}>{food.name}</div>
                <div style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{food.cuisine || food.type}</div>
                <div style={{ fontSize: '12px', color: '#22C55E', fontWeight: '800' }}>
                  {food.hygiene}% Hygiene • {formatPrice(food.price || food.avgSpend || 180, currency)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
