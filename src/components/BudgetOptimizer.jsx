import React from 'react';
import { PiggyBank, Sparkles } from 'lucide-react';

// Safe inline price formatter (no external import required)
const safeFormatPrice = (amount, currency = 'INR') => {
  if (amount === undefined || amount === null) return '₹0';
  const symbols = { INR: '₹', USD: '$', EUR: '€', GBP: '£' };
  const symbol = symbols[currency] || '₹';
  return `${symbol}${Number(amount).toLocaleString('en-IN')}`;
};

export default function BudgetOptimizer({ savingsSummary, currency = 'INR' }) {
  // Safe default summary if prop is undefined or null
  const summary = savingsSummary || {
    totalSaved: 1450,
    hotelSavings: 900,
    foodSavings: 550,
    recommendations: [
      { id: 1, title: 'Book Local Lodge instead of 3-Star', saveAmount: 600, badge: 'High Impact' },
      { id: 2, title: 'Eat at Verified Street Food LocoGems', saveAmount: 350, badge: 'Popular' },
      { id: 3, title: 'Use Public Transport / Walking Routes', saveAmount: 200, badge: 'Easy' }
    ]
  };

  const recommendations = summary.recommendations || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Top Banner Card */}
      <div className="glass-card" style={{ padding: '20px', background: 'linear-gradient(135deg, rgba(0, 229, 192, 0.15) 0%, rgba(34, 197, 94, 0.1) 100%)', border: '1px solid var(--accent-cyan)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--accent-cyan)', color: '#FFFFFF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <PiggyBank size={22} />
            </div>
            <div>
              <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: '800', letterSpacing: '0.5px' }}>
                AI LOCALITY SAVINGS PULSE
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>Budget Optimizer</h3>
            </div>
          </div>
          <span style={{ fontSize: '11px', color: '#22C55E', background: 'rgba(34, 197, 94, 0.15)', padding: '4px 10px', borderRadius: '10px', fontWeight: '800' }}>
            ACTIVE
          </span>
        </div>

        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
          <div>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>TOTAL SAVED SO FAR</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: '#22C55E' }}>
              {safeFormatPrice(summary.totalSaved ?? 0, currency)}
            </div>
          </div>
          <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '16px' }}>
            <div style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>AVG SAVINGS RATE</div>
            <div style={{ fontSize: '24px', fontWeight: '800', color: 'var(--accent-cyan)' }}>28% / trip</div>
          </div>
        </div>
      </div>

      {/* Breakdown Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="glass-card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700' }}>STAYS SAVINGS</div>
          <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--accent-cyan)', margin: '4px 0' }}>
            {safeFormatPrice(summary.hotelSavings ?? 0, currency)}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Vs average city hotel tariff</div>
        </div>

        <div className="glass-card" style={{ padding: '14px' }}>
          <div style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: '700' }}>FOOD SAVINGS</div>
          <div style={{ fontSize: '18px', fontWeight: '800', color: '#22C55E', margin: '4px 0' }}>
            {safeFormatPrice(summary.foodSavings ?? 0, currency)}
          </div>
          <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Via LocoGems street food</div>
        </div>
      </div>

      {/* Recommendations */}
      <div className="glass-card" style={{ padding: '16px' }}>
        <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={16} color="var(--accent-cyan)" />
          <span>AI Money-Saving Recommendations</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recommendations.map((rec) => (
            <div key={rec.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 12px', background: 'var(--bg-surface)', borderRadius: '12px', border: '1px solid var(--border-subtle)' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>{rec.title}</div>
                <div style={{ fontSize: '11px', color: '#22C55E', fontWeight: '700', marginTop: '2px' }}>
                  Save ~{safeFormatPrice(rec.saveAmount, currency)}
                </div>
              </div>
              <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', background: 'var(--border-subtle)', padding: '2px 8px', borderRadius: '6px', fontWeight: '800' }}>
                {rec.badge}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
