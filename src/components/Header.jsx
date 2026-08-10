import React from 'react';
import { MapPin, Search, Bell, SlidersHorizontal } from 'lucide-react';

export default function Header({
  location,
  searchQuery,
  onOpenSearch,
  onOpenNotifications,
  onOpenFilter,
  unreadNotifsCount = 3,
  weatherData
}) {
  const temp = weatherData?.temperature || 28;
  const aqiScore = weatherData?.aqi?.score || 38;
  const aqiColor = weatherData?.aqi?.color || '#22C55E';
  const icon = weatherData?.icon || '☀️';

  return (
    <div style={{ padding: '44px 20px 8px 20px', background: 'var(--bg-dark)' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            background: 'var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)'
          }}>
            <MapPin size={16} />
          </div>
          <div>
            <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Current Locality</div>
            <div style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span>{location}</span>
            </div>
          </div>
        </div>

        {/* Live Weather & AQI Radar Badge */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            padding: '4px 10px',
            borderRadius: '12px',
            background: 'var(--bg-card)',
            border: `1px solid ${aqiColor}`,
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px',
            fontWeight: '800',
            color: 'var(--text-primary)'
          }}>
            <span>{icon} {temp}°C</span>
            <span style={{ color: aqiColor, fontWeight: '800' }}>AQI {aqiScore}</span>
          </div>

          <button
            onClick={onOpenNotifications}
            style={{
              position: 'relative',
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-primary)',
              cursor: 'pointer'
            }}
          >
            <Bell size={18} />
            {unreadNotifsCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '6px',
                right: '6px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#EF4444'
              }} />
            )}
          </button>
        </div>
      </div>

      {/* Search Input Bar */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <div
          onClick={onOpenSearch}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '16px',
            padding: '12px 16px',
            cursor: 'pointer'
          }}
        >
          <Search size={18} color="var(--text-muted)" />
          <span style={{ fontSize: '13px', color: searchQuery ? 'var(--text-primary)' : 'var(--text-muted)', fontWeight: searchQuery ? '700' : '500' }}>
            {searchQuery || 'Search stays, LocoGems, emergency...'}
          </span>
        </div>

        <button
          onClick={onOpenFilter}
          style={{
            width: '46px',
            height: '46px',
            borderRadius: '16px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--accent-cyan)',
            cursor: 'pointer'
          }}
        >
          <SlidersHorizontal size={20} />
        </button>
      </div>
    </div>
  );
}
