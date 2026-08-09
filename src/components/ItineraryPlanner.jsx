import React, { useState } from 'react';
import { Sparkles, Calendar, Compass, Clock, ShieldCheck, MapPin, X, ArrowRight, Download, CheckCircle2 } from 'lucide-react';

export default function ItineraryPlanner({ localityName = 'Navi Mumbai', onClose, onSaveItinerary }) {
  const [days, setDays] = useState(2);
  const [vibe, setVibe] = useState('PEACE'); // PEACE, BUDGET, SOLO, LUXURY
  const [budget, setBudget] = useState('₹3,000 - ₹6,000');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState(null);

  const vibeOptions = [
    { id: 'PEACE', label: '🧘 Peaceful & Quiet', desc: 'Tranquil stays, noise < 25dB, calm cafes' },
    { id: 'BUDGET', label: '💰 Budget Explorer', desc: 'Verified LocoGems street food, value lodges' },
    { id: 'SOLO', label: '🎒 Solo Backpacker', desc: '24/7 safe security stays & vibrant markets' },
    { id: 'LUXURY', label: '✨ Luxury & Dining', desc: '5-Star boutique hotels & fine dining' }
  ];

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const plan = [];
      for (let d = 1; d <= days; d++) {
        plan.push({
          day: d,
          title: `Day ${d}: ${d === 1 ? 'Locality Arrival & Heritage Explorer' : d === 2 ? 'LocoGems Street Food & Tranquil Stays' : 'Scenic Spots & Fine Dining'}`,
          overview: `Curated AI itinerary for ${localityName} matching your ${vibe} vibe preference.`,
          activities: [
            {
              time: '08:30 AM',
              name: 'Morning Fuel & Fresh Breakfast',
              spot: `${localityName} Local Cafe & Dosa Hub`,
              type: 'Food',
              hygiene: 96,
              cost: '₹180',
              note: 'Verified 100% glove-worn hygiene service & stainless preparation.'
            },
            {
              time: '11:00 AM',
              name: 'Locality Exploration & Sightseeing',
              spot: `${localityName} Central Heritage Promenade`,
              type: 'Sightseeing',
              hygiene: 92,
              cost: 'Free',
              note: '24/7 CCTV monitored safety zone with public rest stops nearby.'
            },
            {
              time: '01:30 PM',
              name: 'Authentic Street Food (LocoGems Lunch)',
              spot: `Sharma Street Food Market ${localityName}`,
              type: 'LocoGem',
              hygiene: 95,
              cost: '₹140',
              note: 'Google ⭐ 4.8 rated street food vendor. Fresh oil verified.'
            },
            {
              time: '04:30 PM',
              name: 'Afternoon Check-in & Rest Pulse',
              spot: `ZenITH Boutique Lodge & Suites`,
              type: 'Stay',
              hygiene: 98,
              cost: '₹1,500/night',
              note: 'Soundproof acoustics, sanitized washroom, quiet index > 90%.'
            },
            {
              time: '07:30 PM',
              name: 'Evening Dining & Sunset Radar Walk',
              spot: `Coastal Spice Bistro ${localityName}`,
              type: 'Dining',
              hygiene: 94,
              cost: '₹450',
              note: 'Outdoor seating with high safety index and verified clean restrooms.'
            }
          ]
        });
      }
      setGeneratedPlan(plan);
      setIsGenerating(false);
    }, 800);
  };

  const handleSaveAndClose = () => {
    if (onSaveItinerary && generatedPlan) {
      onSaveItinerary(generatedPlan);
    }
    if (onClose) onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto', padding: '24px', background: 'var(--bg-card)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '14px',
              background: 'var(--border-subtle)',
              color: 'var(--accent-cyan)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Compass size={24} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)' }}>AI Travel Itinerary Generator</h2>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Tailored day-by-day plan for {localityName}</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {!generatedPlan ? (
          <div>
            {/* Days Selection */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                Trip Duration (Days)
              </label>
              <div style={{ display: 'flex', gap: '10px' }}>
                {[1, 2, 3].map((d) => (
                  <button
                    key={d}
                    onClick={() => setDays(d)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '14px',
                      background: days === d ? 'var(--accent-cyan)' : 'var(--bg-surface)',
                      color: days === d ? '#FFFFFF' : 'var(--text-secondary)',
                      border: days === d ? 'none' : '1px solid var(--border-subtle)',
                      fontWeight: '800',
                      fontSize: '14px',
                      cursor: 'pointer'
                    }}
                  >
                    {d} Day{d > 1 ? 's' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Travel Vibe Selector */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                Select Travel Vibe & Preference
              </label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {vibeOptions.map((v) => (
                  <div
                    key={v.id}
                    onClick={() => setVibe(v.id)}
                    style={{
                      padding: '14px',
                      borderRadius: '16px',
                      background: vibe === v.id ? 'var(--border-subtle)' : 'var(--bg-surface)',
                      border: vibe === v.id ? '1px solid var(--accent-cyan)' : '1px solid var(--border-subtle)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>{v.label}</div>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>{v.desc}</div>
                    </div>
                    {vibe === v.id && <CheckCircle2 size={20} color="var(--accent-cyan)" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Budget Selector */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', display: 'block', marginBottom: '8px' }}>
                Target Locality Budget
              </label>
              <select
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '14px',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '14px',
                  fontWeight: '800',
                  outline: 'none'
                }}
              >
                <option value="₹1,500 - ₹3,000">₹1,500 - ₹3,000 (Budget Explorer)</option>
                <option value="₹3,000 - ₹6,000">₹3,000 - ₹6,000 (Balanced Mid-Range)</option>
                <option value="₹6,000 - ₹12,000+">₹6,000 - ₹12,000+ (Premium Luxury)</option>
              </select>
            </div>

            <button onClick={handleGenerate} disabled={isGenerating} className="btn-primary">
              <Sparkles size={18} />
              <span>{isGenerating ? 'AI Generating Itinerary...' : `Generate ${days}-Day Itinerary`}</span>
            </button>
          </div>
        ) : (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '12px', color: 'var(--accent-cyan)', fontWeight: '800', textTransform: 'uppercase' }}>
                Generated {localityName} Plan ({days} Days)
              </span>
              <button onClick={() => setGeneratedPlan(null)} style={{ background: 'none', border: 'none', color: 'var(--accent-cyan)', fontSize: '12px', fontWeight: '800', cursor: 'pointer' }}>
                Re-generate
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
              {generatedPlan.map((dayItem) => (
                <div key={dayItem.day} style={{ background: 'var(--bg-surface)', borderRadius: '18px', padding: '16px', border: '1px solid var(--border-subtle)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--accent-cyan)', marginBottom: '4px' }}>
                    {dayItem.title}
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                    {dayItem.overview}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {dayItem.activities?.map((act, idx) => (
                      <div key={idx} style={{ background: 'var(--bg-card)', padding: '12px', borderRadius: '14px', border: '1px solid var(--border-subtle)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: '800' }}>{act.time}</span>
                          <span style={{ fontSize: '11px', color: '#22C55E', fontWeight: '800' }}>✓ {act.hygiene}% Hygiene</span>
                        </div>
                        <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--text-primary)' }}>{act.name}</div>
                        <div style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <MapPin size={12} color="var(--accent-cyan)" />
                          <span>{act.spot}</span>
                        </div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '6px', fontStyle: 'italic' }}>
                          {act.note}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button onClick={handleSaveAndClose} className="btn-primary">
              <CheckCircle2 size={18} />
              <span>Save Itinerary to Profile & SQLite DB</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
