import React, { useState, useRef, useCallback } from 'react';
import { Search, X, Clock, ArrowUpRight, MapPin, Loader2, Map } from 'lucide-react';

/**
 * Fetches place suggestions from OpenStreetMap Nominatim.
 * Free, no API key required. Rate limit: ~1 req/s (debounced at 350ms).
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

export default function ActiveSearch({ onClose, recentSearches, onSelectQuery }) {
  const [query, setQuery]           = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const debounceRef = useRef(null);

  const suggestedFilters = ['Vegetarian', 'Hospitals', 'EV Charging', 'Co-working', 'Clean Restrooms'];

  // ── Debounced Nominatim fetch ─────────────────────────────────────────────
  const fetchSuggestions = useCallback((input) => {
    clearTimeout(debounceRef.current);
    if (!input.trim() || input.length < 3) {
      setSuggestions([]);
      return;
    }
    setIsFetching(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const results = await nominatimSearch(input);
        setSuggestions(results.slice(0, 6));
      } catch {
        setSuggestions([]);
      } finally {
        setIsFetching(false);
      }
    }, 350);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    fetchSuggestions(val);
  };

  const handleSelect = (text) => {
    onSelectQuery(text);
    onClose();
  };

  /**
   * Formats a Nominatim display_name into a short primary + secondary pair.
   * e.g. "Navi Mumbai, Thane District, Maharashtra, India"
   *   → primary: "Navi Mumbai", secondary: "Thane District, Maharashtra"
   */
  function formatSuggestion(item) {
    const parts = item.display_name.split(', ');
    const primary = parts.slice(0, 2).join(', ');
    const secondary = parts.slice(2, 4).join(', ');
    return { primary, secondary };
  }

  return (
    <div className="modal-overlay" style={{ justifyContent: 'flex-start' }}>
      <div style={{
        background: '#0B131E', height: '100%', width: '100%',
        padding: '20px', display: 'flex', flexDirection: 'column'
      }}>
        {/* Search bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{
            flex: 1, background: '#121C2A', border: '1px solid #00F2FE',
            borderRadius: '16px', padding: '12px 16px',
            display: 'flex', alignItems: 'center', gap: '10px'
          }}>
            <Search size={18} color="#00F2FE" />
            <input
              type="text"
              autoFocus
              placeholder="Search stays, food, amenities..."
              value={query}
              onChange={handleChange}
              style={{ background: 'none', border: 'none', color: '#F8FAFC', fontSize: '15px', outline: 'none', width: '100%' }}
            />
            {isFetching && (
              <Loader2 size={15} color="#00F2FE" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />
            )}
            {query && !isFetching && (
              <button onClick={() => { setQuery(''); setSuggestions([]); }}
                style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}>
                <X size={16} />
              </button>
            )}
          </div>
          <button onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#00F2FE', fontWeight: '600', cursor: 'pointer', fontSize: '14px', fontFamily: 'Inter, sans-serif' }}>
            Cancel
          </button>
        </div>

        {/* OpenStreetMap suggestions */}
        {suggestions.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ fontSize: '11px', color: '#64748B', fontWeight: '700', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Map size={11} color="#00F2FE" />
              OpenStreetMap Results
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {suggestions.map((s) => {
                const { primary, secondary } = formatSuggestion(s);
                return (
                  <div key={s.place_id}
                    onClick={() => handleSelect(s.display_name)}
                    style={{
                      padding: '12px 14px', borderRadius: '12px',
                      background: '#121C2A', border: '1px solid rgba(0,242,254,0.1)',
                      cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '10px',
                      transition: 'border-color 0.15s ease'
                    }}
                    onMouseOver={e => e.currentTarget.style.borderColor = 'rgba(0,242,254,0.35)'}
                    onMouseOut={e => e.currentTarget.style.borderColor = 'rgba(0,242,254,0.1)'}
                  >
                    <MapPin size={14} color="#00F2FE" style={{ flexShrink: 0, marginTop: '3px' }} />
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: '600', color: '#F8FAFC' }}>{primary}</div>
                      {secondary && <div style={{ fontSize: '12px', color: '#64748B', marginTop: '2px' }}>{secondary}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Suggested filter chips */}
        {!query && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '700', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Suggested Filters
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {suggestedFilters.map((filter, i) => (
                <button key={i}
                  onClick={() => handleSelect(filter)}
                  style={{ padding: '8px 14px', borderRadius: '12px', background: '#121C2A', border: '1px solid rgba(255,255,255,0.08)', color: '#F8FAFC', fontSize: '13px', cursor: 'pointer', fontWeight: '500', fontFamily: 'Inter, sans-serif' }}>
                  {filter}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Recent searches */}
        <div>
          <div style={{ fontSize: '12px', color: '#64748B', fontWeight: '700', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {query && suggestions.length === 0 && !isFetching ? 'No results — try a recent search' : 'Recent Searches'}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {(recentSearches || []).map((item, idx) => (
              <div key={idx}
                onClick={() => handleSelect(item)}
                style={{ padding: '14px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: '#94A3B8' }}>
                  <Clock size={16} />
                  <span style={{ color: '#F8FAFC', fontSize: '14px' }}>{item}</span>
                </div>
                <ArrowUpRight size={16} color="#64748B" />
              </div>
            ))}
          </div>
        </div>

        {/* OpenStreetMap attribution */}
        <div style={{ marginTop: 'auto', paddingTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
          <Map size={11} color="#334155" />
          <span style={{ fontSize: '10px', color: '#334155' }}>
            Search powered by <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer" style={{ color: '#3B82F6' }}>OpenStreetMap</a>
          </span>
        </div>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
}
