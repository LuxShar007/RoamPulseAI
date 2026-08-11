import React, { useState, useRef, useCallback } from 'react';
import { MapPin, X, Navigation, Loader2, Search, CheckCircle, AlertTriangle } from 'lucide-react';

/**
 * LocationPicker — Dedicated modal for setting the user's starting location.
 * Separate from the destination/place search.
 * Allows: 1) GPS auto-detect  2) Manual city/area search
 */

async function nominatimSearch(query) {
  const params = new URLSearchParams({
    q: query,
    format: 'json',
    limit: 6,
    countrycodes: 'in',
    addressdetails: 1
  });
  const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
    headers: {
      'User-Agent': 'RoamPulseAI/1.0',
      'Accept-Language': 'en'
    }
  });
  if (!res.ok) throw new Error('Nominatim unavailable');
  return res.json();
}

export default function LocationPicker({ currentLocation, onSetLocation, onClose }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const [gpsStatus, setGpsStatus] = useState('idle');
  const [gpsMessage, setGpsMessage] = useState('');
  const debounceRef = useRef(null);

  const popularCities = [
    { name: 'Mumbai', lat: 18.9220, lng: 72.8347 },
    { name: 'Delhi', lat: 28.6129, lng: 77.2295 },
    { name: 'Bangalore', lat: 12.9716, lng: 77.5946 },
    { name: 'Pune', lat: 18.5204, lng: 73.8567 },
    { name: 'Hyderabad', lat: 17.3616, lng: 78.4747 },
    { name: 'Chennai', lat: 13.0827, lng: 80.2707 },
    { name: 'Kolkata', lat: 22.5726, lng: 88.3639 },
    { name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
  ];

  const handleDetectGPS = () => {
    if (!navigator.geolocation) {
      setGpsStatus('error');
      setGpsMessage('Geolocation is not supported by your browser.');
      return;
    }
    setGpsStatus('detecting');
    setGpsMessage('Requesting GPS access...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        const accuracy = Math.round(pos.coords.accuracy);
        setGpsStatus('success');
        setGpsMessage(`Located! Accuracy: ~${accuracy}m`);

        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1&zoom=12`, {
          headers: { 'User-Agent': 'RoamPulseAI/1.0', 'Accept-Language': 'en' }
        })
          .then(r => r.json())
          .then(data => {
            const addr = data?.address || {};
            const locality = addr.city || addr.town || addr.village || addr.city_district ||
                             addr.suburb || addr.county || 'Your Location';
            onSetLocation(locality, lat, lng);
            setTimeout(() => onClose(), 600);
          })
          .catch(() => {
            onSetLocation('Your Location', lat, lng);
            setTimeout(() => onClose(), 600);
          });
      },
      (err) => {
        setGpsStatus('error');
        if (err.code === 1) {
          setGpsMessage('Location permission denied. Allow location access in browser settings, or select a city below.');
        } else if (err.code === 2) {
          setGpsMessage('Location unavailable. Try selecting a city manually below.');
        } else {
          setGpsMessage('Location request timed out. Try selecting a city manually below.');
        }
      },
      { enableHighAccuracy: true, maximumAge: 0, timeout: 10000 }
    );
  };

  const fetchSuggestions = useCallback((input) => {
    clearTimeout(debounceRef.current);
    if (!input.trim() || input.length < 2) { setSuggestions([]); return; }
    setIsFetching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await nominatimSearch(input);
        setSuggestions(results.slice(0, 6));
      } catch { setSuggestions([]); }
      finally { setIsFetching(false); }
    }, 350);
  }, []);

  const handleChange = (e) => { const val = e.target.value; setQuery(val); fetchSuggestions(val); };

  const handleSelectSuggestion = (item) => {
    const name = item.display_name.split(', ')[0];
    onSetLocation(name, parseFloat(item.lat), parseFloat(item.lon));
    onClose();
  };

  const handleSelectCity = (city) => { onSetLocation(city.name, city.lat, city.lng); onClose(); };

  return (
    <div className="modal-overlay" style={{ justifyContent: 'flex-start', zIndex: 600 }}>
      <div style={{ background: '#0B131E', height: '100%', width: '100%', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <MapPin size={20} color="#00F2FE" />
            <div>
              <div style={{ fontSize: '16px', fontWeight: '800', color: '#F8FAFC' }}>Set Your Location</div>
              <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '600' }}>
                Current: <span style={{ color: '#00F2FE' }}>{currentLocation}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}><X size={22} /></button>
        </div>

        {/* GPS Button */}
        <button onClick={handleDetectGPS} disabled={gpsStatus === 'detecting'}
          style={{
            width: '100%', padding: '14px 18px', borderRadius: '16px',
            background: gpsStatus === 'success' ? 'rgba(34,197,94,0.15)' : gpsStatus === 'error' ? 'rgba(239,68,68,0.1)' : 'linear-gradient(135deg, rgba(0,242,254,0.15), rgba(0,242,254,0.05))',
            border: gpsStatus === 'success' ? '1px solid rgba(34,197,94,0.4)' : gpsStatus === 'error' ? '1px solid rgba(239,68,68,0.3)' : '1px solid rgba(0,242,254,0.3)',
            color: '#F8FAFC', cursor: gpsStatus === 'detecting' ? 'wait' : 'pointer',
            display: 'flex', alignItems: 'center', gap: '12px', fontFamily: 'Inter, sans-serif', marginBottom: '8px', transition: 'all 0.2s ease'
          }}>
          {gpsStatus === 'detecting' ? <Loader2 size={20} color="#00F2FE" style={{ animation: 'spin 1s linear infinite' }} /> :
           gpsStatus === 'success' ? <CheckCircle size={20} color="#22C55E" /> :
           gpsStatus === 'error' ? <AlertTriangle size={20} color="#EF4444" /> :
           <Navigation size={20} color="#00F2FE" />}
          <div style={{ textAlign: 'left' }}>
            <div style={{ fontSize: '14px', fontWeight: '700' }}>
              {gpsStatus === 'detecting' ? 'Detecting your location...' : gpsStatus === 'success' ? 'Location detected!' : gpsStatus === 'error' ? 'GPS Failed' : 'Use My Current Location'}
            </div>
            {gpsMessage && <div style={{ fontSize: '11px', color: gpsStatus === 'error' ? '#F87171' : gpsStatus === 'success' ? '#4ADE80' : '#64748B', marginTop: '2px' }}>{gpsMessage}</div>}
          </div>
        </button>

        {/* Divider */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '16px 0', color: '#334155', fontSize: '11px', fontWeight: '700' }}>
          <div style={{ flex: 1, height: '1px', background: '#1E293B' }} />OR SEARCH MANUALLY<div style={{ flex: 1, height: '1px', background: '#1E293B' }} />
        </div>

        {/* Search */}
        <div style={{ background: '#121C2A', border: '1px solid rgba(0,242,254,0.2)', borderRadius: '16px', padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <Search size={18} color="#00F2FE" />
          <input type="text" autoFocus placeholder="Search your city or area..." value={query} onChange={handleChange}
            style={{ background: 'none', border: 'none', color: '#F8FAFC', fontSize: '15px', outline: 'none', width: '100%', fontFamily: 'Inter, sans-serif' }} />
          {isFetching && <Loader2 size={15} color="#00F2FE" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />}
          {query && !isFetching && <button onClick={() => { setQuery(''); setSuggestions([]); }} style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}><X size={16} /></button>}
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div style={{ marginBottom: '20px', maxHeight: '250px', overflowY: 'auto' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Search Results</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {suggestions.map((s) => {
                const parts = s.display_name.split(', ');
                return (
                  <div key={s.place_id} onClick={() => handleSelectSuggestion(s)}
                    style={{ padding: '12px 14px', borderRadius: '12px', background: '#121C2A', border: '1px solid rgba(0,242,254,0.1)', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '10px' }}
                    onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(0,242,254,0.35)'}
                    onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(0,242,254,0.1)'}>
                    <MapPin size={14} color="#00F2FE" style={{ flexShrink: 0, marginTop: '3px' }} />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#F8FAFC' }}>{parts.slice(0, 2).join(', ')}</div>
                      <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{parts.slice(2, 4).join(', ')}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick picks */}
        {!query && (
          <div>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Quick Pick</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {popularCities.map((city) => (
                <button key={city.name} onClick={() => handleSelectCity(city)}
                  style={{
                    padding: '10px 16px', borderRadius: '14px',
                    background: currentLocation === city.name ? 'rgba(0,242,254,0.2)' : '#121C2A',
                    border: currentLocation === city.name ? '1px solid #00F2FE' : '1px solid rgba(255,255,255,0.08)',
                    color: currentLocation === city.name ? '#00F2FE' : '#F8FAFC',
                    fontSize: '13px', fontWeight: '600', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                    display: 'flex', alignItems: 'center', gap: '6px', transition: 'all 0.15s ease'
                  }}>
                  <MapPin size={12} />{city.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
