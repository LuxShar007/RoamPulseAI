import React, { useState } from 'react';
import { X, SlidersHorizontal, Sparkles } from 'lucide-react';

export default function FilterModal({ onClose, onApplyFilters, currentMaxBudget = 5000, currentPeaceIndex = 80 }) {
  const [maxBudget, setMaxBudget] = useState(currentMaxBudget);
  const [peaceIndex, setPeaceIndex] = useState(currentPeaceIndex);
  const [selectedStar, setSelectedStar] = useState('all');

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <SlidersHorizontal size={20} color="#00F2FE" />
            <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Filter Adjustment</h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: '700', fontSize: '15px' }}>Budget Range</span>
            <span style={{ color: '#00F2FE', fontWeight: '800', fontSize: '16px' }}>₹1,000 – ₹{maxBudget.toLocaleString()}</span>
          </div>
          <input
            type="range"
            min="1000"
            max="10000"
            step="500"
            value={maxBudget}
            onChange={(e) => setMaxBudget(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#00F2FE', height: '6px', borderRadius: '4px', cursor: 'pointer' }}
          />
        </div>

        <div style={{ marginBottom: '28px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontWeight: '700', fontSize: '15px' }}>Peacefulness Index</span>
            <span style={{ color: '#8B5CF6', fontWeight: '800', fontSize: '16px' }}>&gt; {peaceIndex}%</span>
          </div>
          <input
            type="range"
            min="50"
            max="98"
            step="2"
            value={peaceIndex}
            onChange={(e) => setPeaceIndex(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#8B5CF6', height: '6px', borderRadius: '4px', cursor: 'pointer' }}
          />
        </div>

        <div style={{ marginBottom: '32px' }}>
          <span style={{ fontWeight: '700', fontSize: '15px', display: 'block', marginBottom: '10px' }}>Star Rating</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            {['all', '3★', '4★', '5★'].map((star) => (
              <button
                key={star}
                onClick={() => setSelectedStar(star)}
                style={{
                  flex: 1,
                  padding: '10px',
                  borderRadius: '12px',
                  background: selectedStar === star ? 'rgba(0, 242, 254, 0.15)' : '#121C2A',
                  border: selectedStar === star ? '1px solid #00F2FE' : '1px solid rgba(255, 255, 255, 0.08)',
                  color: selectedStar === star ? '#00F2FE' : '#F8FAFC',
                  fontWeight: '700',
                  fontSize: '13px',
                  cursor: 'pointer'
                }}
              >
                {star === 'all' ? 'All Stars' : star}
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={() => {
            onApplyFilters({ maxBudget, peaceIndex, selectedStar });
            onClose();
          }}
          className="btn-primary"
        >
          <Sparkles size={18} />
          <span>Apply Filters</span>
        </button>
      </div>
    </div>
  );
}
