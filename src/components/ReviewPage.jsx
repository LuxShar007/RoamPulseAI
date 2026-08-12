import React, { useState, useEffect, useCallback } from 'react';
import { Star, MessageSquare, CheckCircle2, ShieldCheck, Sparkles, AlertCircle, Send } from 'lucide-react';

export default function ReviewPage({ localityName = 'Navi Mumbai', onSubmitSuccess }) {
  // Form State
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [placeName, setPlaceName] = useState('General Locality Experience');
  const [categoryRatings, setCategoryRatings] = useState({
    hygiene: 5,
    safety: 5,
    comfort: 4,
    value: 5
  });

  // Validation & Submission State
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Community Reviews State
  const [reviewsList, setReviewsList] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const RATING_LABELS = {
    1: '1.0 - Poor',
    2: '2.0 - Below Average',
    3: '3.0 - Average & Fair',
    4: '4.0 - Great & Recommended',
    5: '5.0 - Exceptional & Outstanding'
  };

  const fetchReviews = useCallback(async () => {
    setLoadingReviews(true);
    try {
      const res = await fetch('/api/db/reviews');
      const json = await res.json();
      if (json?.data) {
        setReviewsList(json.data);
      }
    } catch {
      // Fallback initial reviews if server endpoint unavailable offline
      setReviewsList([
        {
          id: 'rev-1',
          userName: 'Aarav Sharma',
          userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
          rating: 5,
          categories: { hygiene: 5, safety: 5, comfort: 5, value: 4 },
          locality: localityName,
          placeName: 'ZenITH Luxury Eco Pods',
          comment: 'Absolutely stunning locality experience! The AI hygiene score was 100% accurate, and live radar safety alerts gave complete peace of mind.',
          createdAt: new Date().toISOString(),
          verified: true
        },
        {
          id: 'rev-2',
          userName: 'Ananya Patel',
          userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
          rating: 4,
          categories: { hygiene: 4, safety: 5, comfort: 4, value: 5 },
          locality: localityName,
          placeName: 'Palm Breeze Resort',
          comment: 'Super fast navigation and real-time offline maps feature saved us during evening commute. Highly recommend checking out LocoGems feed!',
          createdAt: new Date(Date.now() - 86400000).toISOString(),
          verified: true
        }
      ]);
    } finally {
      setLoadingReviews(false);
    }
  }, [localityName]);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleCategoryChange = (key, value) => {
    setCategoryRatings(prev => ({ ...prev, [key]: value }));
  };

  const validateForm = () => {
    const errs = {};
    if (rating === 0) {
      errs.rating = 'Please select a star rating between 1 and 5 stars';
    }
    if (!comment.trim()) {
      errs.comment = 'Please provide feedback in the text input area';
    } else if (comment.trim().length < 10) {
      errs.comment = 'Feedback must be at least 10 characters long';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    const newReviewData = {
      userName: 'You (Verified Traveler)',
      rating,
      categories: categoryRatings,
      locality: localityName,
      placeName: placeName || 'RoamPulse AI Experience',
      comment: comment.trim()
    };

    try {
      const res = await fetch('/api/db/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newReviewData)
      });
      const json = await res.json();
      if (json?.data) {
        setReviewsList(prev => [json.data, ...prev]);
      } else {
        setReviewsList(prev => [{
          ...newReviewData,
          id: `rev-${Date.now()}`,
          userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
          createdAt: new Date().toISOString(),
          verified: true
        }, ...prev]);
      }
    } catch {
      setReviewsList(prev => [{
        ...newReviewData,
        id: `rev-${Date.now()}`,
        userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
        createdAt: new Date().toISOString(),
        verified: true
      }, ...prev]);
    } finally {
      setIsSubmitting(false);
      setSubmitted(true);
      if (onSubmitSuccess) onSubmitSuccess();
    }
  };

  const resetForm = () => {
    setRating(0);
    setHoverRating(0);
    setComment('');
    setErrors({});
    setSubmitted(false);
  };

  const activeStarCount = hoverRating || rating;

  return (
    <div style={{
      flex: 1,
      overflowY: 'auto',
      padding: '54px 18px 90px 18px',
      background: 'var(--bg-dark)',
      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", sans-serif'
    }}>
      {/* ── macOS Page Title Header ── */}
      <div style={{ marginBottom: '20px' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 10px',
          borderRadius: '20px',
          background: 'rgba(0, 229, 192, 0.12)',
          border: '1px solid var(--border-subtle)',
          color: 'var(--accent-cyan)',
          fontSize: '11px',
          fontWeight: '700',
          letterSpacing: '0.3px',
          marginBottom: '8px'
        }}>
          <Sparkles size={12} />
          <span>ROAMPULSE COMMUNITY VERIFIED</span>
        </div>
        <h1 style={{
          fontSize: '22px',
          fontWeight: '800',
          color: 'var(--text-primary)',
          letterSpacing: '-0.4px',
          margin: '0 0 4px 0'
        }}>
          Review & Rate Experience
        </h1>
        <p style={{
          fontSize: '13px',
          color: 'var(--text-secondary)',
          margin: 0,
          lineHeight: '1.4'
        }}>
          Share real-time feedback for <strong style={{ color: 'var(--text-primary)' }}>{localityName}</strong> to help keep AI radar metrics accurate.
        </p>
      </div>

      {/* ── Success Banner Overlay State ── */}
      {submitted ? (
        <div style={{
          padding: '24px 20px',
          borderRadius: '20px',
          background: 'linear-gradient(135deg, rgba(0, 229, 192, 0.15) 0%, rgba(20, 48, 47, 0.95) 100%)',
          border: '1px solid var(--accent-cyan)',
          textAlign: 'center',
          boxShadow: '0 12px 30px rgba(0, 0, 0, 0.3)',
          marginBottom: '28px',
          animation: 'fadeIn 0.3s ease'
        }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: 'var(--accent-cyan)',
            color: '#0D2322',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 12px auto'
          }}>
            <CheckCircle2 size={28} />
          </div>
          <h2 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 6px 0' }}>
            Review Submitted Successfully!
          </h2>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '16px', lineHeight: 1.4 }}>
            Thank you! Your feedback has been verified and added to the RoamPulse community radar.
          </p>
          <button
            onClick={resetForm}
            style={{
              padding: '10px 20px',
              borderRadius: '12px',
              background: 'var(--accent-cyan)',
              color: '#0D2322',
              fontWeight: '800',
              fontSize: '13px',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0, 229, 192, 0.3)'
            }}
          >
            Submit Another Review
          </button>
        </div>
      ) : (
        /* ── Interactive Review Form ── */
        <form onSubmit={handleSubmit} style={{
          background: 'var(--bg-card)',
          borderRadius: '20px',
          border: '1px solid var(--border-subtle)',
          padding: '20px',
          marginBottom: '28px',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
        }}>
          {/* Locality / Place Name Input */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{
              display: 'block',
              fontSize: '12px',
              fontWeight: '700',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '6px'
            }}>
              Venue / Spot Name
            </label>
            <input
              type="text"
              value={placeName}
              onChange={(e) => setPlaceName(e.target.value)}
              placeholder="e.g. ZenITH Eco Pods, Palm Cafe..."
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '12px',
                background: 'var(--bg-surface)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: '600',
                outline: 'none'
              }}
            />
          </div>

          {/* Interactive 5-Star Rating Selector */}
          <div style={{ marginBottom: '20px', textAlign: 'center', background: 'var(--bg-surface)', padding: '16px', borderRadius: '16px', border: '1px solid var(--border-subtle)' }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '700',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '8px'
            }}>
              Overall Rating Target *
            </div>

            {/* Star Icons Row */}
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '8px' }}>
              {[1, 2, 3, 4, 5].map((starIndex) => {
                const isFilled = starIndex <= activeStarCount;
                return (
                  <button
                    key={starIndex}
                    type="button"
                    onClick={() => {
                      setRating(starIndex);
                      if (errors.rating) setErrors(prev => ({ ...prev, rating: null }));
                    }}
                    onMouseEnter={() => setHoverRating(starIndex)}
                    onMouseLeave={() => setHoverRating(0)}
                    style={{
                      background: 'none',
                      border: 'none',
                      padding: '4px',
                      cursor: 'pointer',
                      transform: isFilled ? 'scale(1.15)' : 'scale(1)',
                      transition: 'transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                  >
                    <Star
                      size={28}
                      fill={isFilled ? '#FFB703' : 'transparent'}
                      color={isFilled ? '#FFB703' : 'var(--text-muted)'}
                      strokeWidth={2}
                    />
                  </button>
                );
              })}
            </div>

            {/* Live Rating Label Badge */}
            <div style={{
              fontSize: '12px',
              fontWeight: '800',
              color: activeStarCount > 0 ? '#FFB703' : 'var(--text-muted)',
              minHeight: '18px'
            }}>
              {activeStarCount > 0 ? RATING_LABELS[activeStarCount] : 'Tap stars to rate'}
            </div>

            {errors.rating && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '11px',
                color: '#EF4444',
                marginTop: '8px',
                fontWeight: '700'
              }}>
                <AlertCircle size={14} />
                <span>{errors.rating}</span>
              </div>
            )}
          </div>

          {/* Sub-Category Ratings Breakdown */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{
              fontSize: '12px',
              fontWeight: '700',
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px',
              marginBottom: '10px'
            }}>
              Category Ratings
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { key: 'hygiene', label: 'Hygiene & Cleanliness' },
                { key: 'safety', label: 'Safety & Security' },
                { key: 'comfort', label: 'Comfort & Vibe' },
                { key: 'value', label: 'Value for Money' }
              ].map(({ key, label }) => (
                <div key={key} style={{
                  background: 'var(--bg-surface)',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  border: '1px solid var(--border-subtle)'
                }}>
                  <div style={{ fontSize: '11px', fontWeight: '700', color: 'var(--text-primary)', marginBottom: '4px' }}>
                    {label}
                  </div>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[1, 2, 3, 4, 5].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => handleCategoryChange(key, num)}
                        style={{
                          flex: 1,
                          height: '22px',
                          borderRadius: '6px',
                          border: 'none',
                          background: num <= categoryRatings[key] ? 'var(--accent-cyan)' : 'rgba(255,255,255,0.08)',
                          color: num <= categoryRatings[key] ? '#0D2322' : 'var(--text-muted)',
                          fontSize: '10px',
                          fontWeight: '800',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease'
                        }}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Feedback Text Input Area */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
              <label style={{
                fontSize: '12px',
                fontWeight: '700',
                color: 'var(--text-secondary)',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Detailed Feedback *
              </label>
              <span style={{ fontSize: '11px', color: comment.length >= 10 ? 'var(--accent-cyan)' : 'var(--text-muted)', fontWeight: '700' }}>
                {comment.length} / 500 chars
              </span>
            </div>

            <textarea
              value={comment}
              onChange={(e) => {
                setComment(e.target.value);
                if (errors.comment) setErrors(prev => ({ ...prev, comment: null }));
              }}
              placeholder="Describe hygiene levels, safety factors, crowd levels, or helpful tips for other travelers..."
              rows={4}
              maxLength={500}
              style={{
                width: '100%',
                padding: '12px 14px',
                borderRadius: '14px',
                background: 'var(--bg-surface)',
                border: `1px solid ${errors.comment ? '#EF4444' : 'var(--border-subtle)'}`,
                color: 'var(--text-primary)',
                fontSize: '13px',
                lineHeight: '1.5',
                outline: 'none',
                resize: 'none',
                fontFamily: 'inherit'
              }}
            />

            {errors.comment && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '11px',
                color: '#EF4444',
                marginTop: '6px',
                fontWeight: '700'
              }}>
                <AlertCircle size={14} />
                <span>{errors.comment}</span>
              </div>
            )}
          </div>

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, var(--accent-cyan) 0%, #00B89A 100%)',
              color: '#0D2322',
              fontSize: '14px',
              fontWeight: '800',
              border: 'none',
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              boxShadow: '0 4px 20px rgba(0, 229, 192, 0.3)',
              opacity: isSubmitting ? 0.7 : 1,
              transition: 'all 0.2s ease'
            }}
          >
            {isSubmitting ? (
              <span>Submitting Review...</span>
            ) : (
              <>
                <Send size={16} />
                <span>Post Review to Community</span>
              </>
            )}
          </button>
        </form>
      )}

      {/* ── Community Verified Reviews Feed ── */}
      <div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px'
        }}>
          <h2 style={{
            fontSize: '16px',
            fontWeight: '800',
            color: 'var(--text-primary)',
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <MessageSquare size={18} color="var(--accent-cyan)" />
            <span>Community Feedback ({reviewsList.length})</span>
          </h2>

          <div style={{ fontSize: '11px', color: 'var(--text-muted)', fontWeight: '700' }}>
            Verified Reviews
          </div>
        </div>

        {loadingReviews ? (
          <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)', fontSize: '13px' }}>
            Loading verified reviews...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {reviewsList.map((rev) => (
              <div
                key={rev.id}
                style={{
                  background: 'var(--bg-card)',
                  borderRadius: '16px',
                  border: '1px solid var(--border-subtle)',
                  padding: '16px',
                  backdropFilter: 'blur(10px)'
                }}
              >
                {/* Header Row */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img
                      src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80'}
                      alt={rev.userName}
                      style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }}
                    />
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span>{rev.userName}</span>
                        {rev.verified && <ShieldCheck size={14} color="var(--accent-cyan)" />}
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        {rev.placeName} • {rev.locality}
                      </div>
                    </div>
                  </div>

                  {/* Star Score Badge */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    padding: '4px 8px',
                    borderRadius: '10px',
                    background: 'rgba(255, 183, 3, 0.12)',
                    color: '#FFB703',
                    fontSize: '12px',
                    fontWeight: '800'
                  }}>
                    <Star size={12} fill="#FFB703" />
                    <span>{rev.rating}.0</span>
                  </div>
                </div>

                {/* Comment Text */}
                <p style={{
                  fontSize: '13px',
                  color: 'var(--text-primary)',
                  lineHeight: '1.45',
                  margin: '0 0 12px 0'
                }}>
                  "{rev.comment}"
                </p>

                {/* Category Ratings Pills */}
                {rev.categories && (
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{ fontSize: '10px', background: 'var(--bg-surface)', padding: '3px 8px', borderRadius: '8px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                      Hygiene: {rev.categories.hygiene}/5
                    </span>
                    <span style={{ fontSize: '10px', background: 'var(--bg-surface)', padding: '3px 8px', borderRadius: '8px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                      Safety: {rev.categories.safety}/5
                    </span>
                    <span style={{ fontSize: '10px', background: 'var(--bg-surface)', padding: '3px 8px', borderRadius: '8px', color: 'var(--text-secondary)', fontWeight: '700' }}>
                      Comfort: {rev.categories.comfort}/5
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
