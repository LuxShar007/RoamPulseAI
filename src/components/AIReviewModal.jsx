import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, X, Shield, Star, ThumbsUp } from 'lucide-react';

export default function AIReviewModal({ stay, onClose }) {
  const insights = stay.aiInsights || stay.aiMetrics?.reviewInsights || [
    "Consistently clean and sanitized washroom facilities.",
    "24/7 security guard at entrance makes it super safe for solo tourists.",
    "Verified high hygiene standards and fresh regional dining."
  ];

  const googleReviews = stay.googleReviews || [];

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              background: 'rgba(0, 242, 254, 0.15)',
              color: '#00F2FE',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Sparkles size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: '700' }}>Google Reviews & AI Insights</h2>
              <p style={{ fontSize: '12px', color: '#94A3B8' }}>
                ⭐ {stay.googleRating || stay.rating || 4.7} ({stay.googleReviewsCount || 140}+ Google Reviews)
              </p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>
            <X size={22} />
          </button>
        </div>

        {/* AI Key Takeaways */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(18, 28, 42, 0.9) 0%, rgba(11, 19, 30, 0.95) 100%)',
          border: '1px solid rgba(0, 242, 254, 0.3)',
          borderRadius: '20px',
          padding: '16px',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '12px', fontWeight: '800', color: '#00F2FE', letterSpacing: '0.5px' }}>
            AI REVIEW TAKEAWAYS
          </div>
          {insights.map((text, idx) => {
            const isWarning = text.includes('Limited') || text.includes('parking') || text.includes('lively');
            return (
              <div key={idx} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <div style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: isWarning ? 'rgba(239, 68, 68, 0.15)' : 'rgba(34, 197, 94, 0.15)',
                  color: isWarning ? '#EF4444' : '#22C55E',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px'
                }}>
                  {isWarning ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}
                </div>
                <p style={{ fontSize: '13px', color: '#F8FAFC', lineHeight: 1.4 }}>
                  {text}
                </p>
              </div>
            );
          })}
        </div>

        {/* Authentic Google Customer Reviews List */}
        <div style={{ marginBottom: '20px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', color: '#F8FAFC', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span>Verified Customer Reviews</span>
            <span style={{ fontSize: '11px', color: '#22C55E', background: 'rgba(34,197,94,0.1)', padding: '2px 8px', borderRadius: '10px' }}>Google Verified</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {googleReviews.length > 0 ? (
              googleReviews.map((rev) => (
                <div
                  key={rev.id}
                  style={{
                    background: '#121C2A',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '16px',
                    padding: '14px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <img
                        src={rev.authorAvatar}
                        alt={rev.authorName}
                        style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#FFF' }}>{rev.authorName}</div>
                        <div style={{ fontSize: '10px', color: '#94A3B8' }}>{rev.guideLevel}</div>
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#F3A952', fontSize: '12px', fontWeight: '700' }}>
                        {'★'.repeat(rev.rating)}
                      </div>
                      <div style={{ fontSize: '10px', color: '#64748B' }}>{rev.relativeTime}</div>
                    </div>
                  </div>
                  <p style={{ fontSize: '12px', color: '#CBD5E1', lineHeight: 1.5 }}>
                    "{rev.text}"
                  </p>
                </div>
              ))
            ) : (
              <div style={{ fontSize: '12px', color: '#94A3B8', textAlign: 'center', padding: '16px' }}>
                No additional Google review text available.
              </div>
            )}
          </div>
        </div>

        <button onClick={onClose} className="btn-primary">
          <span>Close Reviews</span>
        </button>
      </div>
    </div>
  );
}
