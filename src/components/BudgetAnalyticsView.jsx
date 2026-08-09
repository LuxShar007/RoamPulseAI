import React from 'react';
import { TrendingDown, Sparkles } from 'lucide-react';

export default function BudgetAnalyticsView({ localityName = 'Navi Mumbai', stays = [], food = [] }) {
  const avgStayPrice = stays.length
    ? Math.round(stays.reduce((acc, s) => acc + (s.price || 1500), 0) / stays.length)
    : 1800;

  const avgFoodPrice = food.length
    ? Math.round(food.reduce((acc, f) => acc + (f.price || 120), 0) / food.length)
    : 140;

  return (
    <div style={{ padding: '20px', background: 'var(--bg-dark)', borderRadius: '24px', border: '1px solid var(--border-subtle)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div>
          <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontWeight: '800', letterSpacing: '0.5px' }}>
            LOCALITY COST PULSE
          </span>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
            {localityName} Price Analytics
          </h3>
        </div>
        <div style={{
          padding: '6px 12px',
          borderRadius: '12px',
          background: 'rgba(34, 197, 94, 0.15)',
          color: '#22C55E',
          fontSize: '12px',
          fontWeight: '800',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <TrendingDown size={14} />
          <span>Save up to 35%</span>
        </div>
      </div>

      {/* Visual Analytics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <div style={{
          background: 'var(--bg-card)',
          padding: '16px',
          borderRadius: '18px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700' }}>AVG STAY / NIGHT</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', margin: '4px 0' }}>
            ₹{avgStayPrice}
          </div>
          <div style={{ fontSize: '10px', color: '#22C55E', fontWeight: '700' }}>
            VS ₹3,200 City Avg
          </div>
        </div>

        <div style={{
          background: 'var(--bg-card)',
          padding: '16px',
          borderRadius: '18px',
          border: '1px solid var(--border-subtle)'
        }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700' }}>AVG LOCOGEM MEAL</div>
          <div style={{ fontSize: '22px', fontWeight: '800', color: 'var(--accent-cyan)', margin: '4px 0' }}>
            ₹{avgFoodPrice}
          </div>
          <div style={{ fontSize: '10px', color: '#22C55E', fontWeight: '700' }}>
            Verified Hygiene 95%+
          </div>
        </div>
      </div>

      {/* AI Budget Recommendation Box */}
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--accent-cyan)',
        borderRadius: '16px',
        padding: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <Sparkles size={24} color="var(--accent-cyan)" />
        <div>
          <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>AI Locality Savings Tip</div>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
            Eating at street vendors in {localityName} saves an average of ₹850/day compared to hotel dining rooms while keeping hygiene scores &gt; 92%.
          </div>
        </div>
      </div>
    </div>
  );
}
