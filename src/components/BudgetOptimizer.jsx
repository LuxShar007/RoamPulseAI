import React from 'react';
import { PiggyBank, TrendingUp, Sparkles } from 'lucide-react';

export default function BudgetOptimizer({ savingsSummary }) {
  const data = savingsSummary || {
    totalSaved: 1800,
    currency: "₹",
    breakdown: [
      { category: "Stays Dynamic Discount", amount: 800, count: "1 stay" },
      { category: "LocoGems Street Food vs Dining", amount: 650, count: "3 meals" },
      { category: "AI Route Fuel Optimization", amount: 350, count: "4 trips" }
    ],
    tips: [
      "Book ZenITH Capsule Pods on Tuesdays for an extra 15% pulse discount.",
      "Eat at LocoGems street food stalls verified above 85% hygiene to save ₹400/day."
    ]
  };

  return (
    <div style={{ padding: '20px', background: 'var(--bg-dark)', minHeight: '100%' }}>
      <div style={{
        background: 'var(--bg-surface)',
        border: '1px solid var(--accent-cyan)',
        borderRadius: '24px',
        padding: '24px',
        textAlign: 'center',
        marginBottom: '24px'
      }}>
        <div style={{
          width: '52px',
          height: '52px',
          borderRadius: '16px',
          background: 'var(--border-subtle)',
          color: 'var(--accent-cyan)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 12px auto'
        }}>
          <PiggyBank size={28} />
        </div>

        <span style={{ fontSize: '11px', fontWeight: '800', color: 'var(--accent-cyan)', letterSpacing: '1px', textTransform: 'uppercase' }}>
          AI BUDGET OPTIMIZER
        </span>
        <h1 style={{ fontSize: '32px', fontWeight: '800', margin: '6px 0', color: 'var(--text-primary)' }}>
          You saved {data.currency}{data.totalSaved.toLocaleString()}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
          using RoamPulse AI Value Suggestions & LocoGems
        </p>
      </div>

      <div style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px' }}>
          Savings Breakdown
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {data.breakdown.map((item, idx) => (
            <div
              key={idx}
              className="glass-card"
              style={{ padding: '14px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <div>
                <div style={{ fontWeight: '800', fontSize: '14px', color: 'var(--text-primary)' }}>{item.category}</div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{item.count}</div>
              </div>
              <div style={{ fontWeight: '800', fontSize: '16px', color: '#22C55E' }}>
                +{data.currency}{item.amount}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Sparkles size={16} color="var(--accent-cyan)" />
          <span>AI Value Recommendations</span>
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {data.tips.map((tip, i) => (
            <div
              key={i}
              style={{
                padding: '14px',
                borderRadius: '16px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-subtle)',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                lineHeight: 1.5,
                display: 'flex',
                gap: '10px'
              }}
            >
              <TrendingUp size={18} color="var(--accent-cyan)" flexShrink={0} />
              <span>{tip}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
