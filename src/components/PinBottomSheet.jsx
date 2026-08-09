import React from 'react';
import { Navigation, Clock, ShieldCheck, Phone, MapPin, X, Star } from 'lucide-react';

export default function PinBottomSheet({ pin, onClose, onNavigate }) {
  if (!pin) return null;

  const isMedical = pin.pinType === 'medical' || pin.type === 'Hospital' || pin.type === 'Emergency Clinic';
  const isWashroom = pin.pinType === 'washroom' || pin.hygiene !== undefined;
  const isFood = pin.pinType === 'food';
  const isStay = pin.pinType === 'stay';

  const rating = pin.googleRating || pin.rating || 4.6;
  const reviewsCount = pin.googleReviewsCount || 94;

  return (
    <div style={{
      position: 'absolute',
      bottom: '80px',
      left: '12px',
      right: '12px',
      background: 'rgba(18, 28, 42, 0.95)',
      backdropFilter: 'blur(16px)',
      border: isMedical ? '1px solid #EF4444' : isWashroom ? '1px solid #3B82F6' : isFood ? '1px solid #F59E0B' : '1px solid #00F2FE',
      borderRadius: '24px',
      padding: '20px',
      zIndex: 150
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div>
          <span style={{
            fontSize: '11px',
            fontWeight: '700',
            textTransform: 'uppercase',
            color: isMedical ? '#EF4444' : isWashroom ? '#3B82F6' : isFood ? '#F59E0B' : '#00F2FE',
            letterSpacing: '0.5px'
          }}>
            {isMedical ? '🚨 Emergency Health Hub' : isWashroom ? '🚽 Public Restroom' : isFood ? '🍲 LocoGem Food Spot' : '🏠 Verified Stay'}
          </span>
          <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#F8FAFC', marginTop: '2px' }}>
            {pin.name}
          </h3>
        </div>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>
          <X size={20} />
        </button>
      </div>

      <div style={{ display: 'flex', gap: '10px', alignItems: 'center', fontSize: '12px', color: '#94A3B8', marginBottom: '14px', flexWrap: 'wrap' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F3A952', fontWeight: '700' }}>
          <Star size={13} fill="#F3A952" />
          {rating} ({reviewsCount} Google Reviews)
        </span>
        <span>•</span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <MapPin size={13} color="#00F2FE" />
          {pin.distance || 'Near Locality'}
        </span>
        {pin.hygiene && (
          <>
            <span>•</span>
            <span style={{ color: '#22C55E', fontWeight: '700' }}>
              🧼 Hygiene: {pin.hygiene}%
            </span>
          </>
        )}
      </div>

      {pin.googleReviews && pin.googleReviews.length > 0 && (
        <div style={{
          fontSize: '11px',
          color: '#CBD5E1',
          background: 'rgba(255, 255, 255, 0.04)',
          padding: '8px 12px',
          borderRadius: '12px',
          marginBottom: '14px',
          fontStyle: 'italic'
        }}>
          "{pin.googleReviews[0].text}"
        </div>
      )}

      <div style={{ display: 'flex', gap: '10px' }}>
        {pin.phone && (
          <a
            href={`tel:${pin.phone}`}
            style={{
              flex: 1,
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              color: '#EF4444',
              borderRadius: '14px',
              padding: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontWeight: '700',
              fontSize: '13px',
              textDecoration: 'none'
            }}
          >
            <Phone size={16} />
            <span>Call</span>
          </a>
        )}

        <a
          href={`https://www.google.com/maps/dir/?api=1&destination=${pin.lat},${pin.lng}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => onNavigate && onNavigate(pin)}
          className="btn-primary"
          style={{ flex: 2, padding: '12px', textDecoration: 'none', textAlign: 'center' }}
        >
          <Navigation size={18} />
          <span>Navigate Now</span>
        </a>
      </div>
    </div>
  );
}
