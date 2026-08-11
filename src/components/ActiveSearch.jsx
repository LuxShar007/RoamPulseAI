import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Search, X, Clock, MapPin, Loader2, Sparkles, Building2, Utensils, ShieldCheck, HeartPulse, ChevronRight } from 'lucide-react';

/**
 * Fetches place suggestions from OpenStreetMap Nominatim API.
 */
async function nominatimSearch(query) {
  try {
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
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default function ActiveSearch({ onClose, recentSearches = [], onSelectQuery, liveData = {} }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isFetching, setIsFetching] = useState(false);
  const inputRef = useRef(null);
  const debounceRef = useRef(null);

  const suggestedFilters = [
    { label: 'Vegetarian', icon: Utensils, category: 'dining' },
    { label: 'Hospitals', icon: HeartPulse, category: 'medical' },
    { label: 'EV Charging', icon: Sparkles, category: 'amenities' },
    { label: 'Co-working', icon: Building2, category: 'stays' },
    { label: 'Clean Restrooms', icon: ShieldCheck, category: 'washrooms' }
  ];

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // ── Local Search Filter ──────────────────────────────────────────────────
  const allLocalItems = [
    ...(liveData.stays || []).map(item => ({ ...item, searchType: 'stay', tag: 'Hotel & Lodge', icon: Building2 })),
    ...(liveData.locogems || []).map(item => ({ ...item, searchType: 'gem', tag: 'LocoGem Spot', icon: Sparkles })),
    ...(liveData.dining || []).map(item => ({ ...item, searchType: 'dining', tag: 'Dining & Cafe', icon: Utensils })),
    ...(liveData.washrooms || []).map(item => ({ ...item, searchType: 'washroom', tag: 'Washroom', icon: ShieldCheck })),
    ...(liveData.medicalHubs || []).map(item => ({ ...item, searchType: 'medical', tag: 'Medical Hub', icon: HeartPulse }))
  ];

  const filteredLocal = query.trim().length >= 2
    ? allLocalItems.filter(item =>
        item.name?.toLowerCase().includes(query.toLowerCase()) ||
        item.location?.toLowerCase().includes(query.toLowerCase()) ||
        item.category?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, 5)
    : [];

  // ── Debounced Nominatim Geocoding Fetch ──────────────────────────────────
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
        setSuggestions(results.slice(0, 5));
      } catch {
        setSuggestions([]);
      } finally {
        setIsFetching(false);
      }
    }, 300);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    fetchSuggestions(val);
  };

  const handleSelect = (itemOrText) => {
    onSelectQuery(itemOrText);
    onClose();
  };

  function formatOSMDisplayName(displayName) {
    const parts = displayName.split(', ');
    const primary = parts.slice(0, 2).join(', ');
    const secondary = parts.slice(2, 4).join(', ');
    return { primary, secondary };
  }

  return (
    <div
      className="modal-overlay"
      style={{
        background: 'rgba(5, 8, 12, 0.88)',
        backdropFilter: 'blur(30px) saturate(190%)',
        WebkitBackdropFilter: 'blur(30px) saturate(190%)',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        padding: '0',
        zIndex: 600,
        fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", sans-serif'
      }}
    >
      <div style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        padding: '54px 18px 24px 18px',
        boxSizing: 'border-box',
        overflowY: 'auto'
      }}>
        {/* Apple iOS Spotlight Style Pill Search Bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '22px'
        }}>
          <div style={{
            flex: 1,
            height: '46px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            borderRadius: '23px',
            padding: '0 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.3)',
            transition: 'all 0.25s ease'
          }}>
            <Search size={18} color="var(--accent-cyan, #00E5C0)" style={{ flexShrink: 0 }} />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search stays, dining, washrooms, cities..."
              value={query}
              onChange={handleChange}
              style={{
                background: 'none',
                border: 'none',
                color: '#FFFFFF',
                fontSize: '15px',
                fontWeight: '500',
                outline: 'none',
                width: '100%',
                letterSpacing: '-0.2px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
              }}
            />
            {isFetching && (
              <Loader2 size={16} color="var(--accent-cyan, #00E5C0)" style={{ animation: 'spin 1s linear infinite', flexShrink: 0 }} />
            )}
            {query && !isFetching && (
              <button
                onClick={() => { setQuery(''); setSuggestions([]); }}
                style={{
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#FFFFFF',
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                <X size={12} />
              </button>
            )}
          </div>

          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--accent-cyan, #00E5C0)',
              fontWeight: '700',
              fontSize: '15px',
              letterSpacing: '-0.3px',
              cursor: 'pointer',
              fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
            }}
          >
            Cancel
          </button>
        </div>

        {/* ── Local Places Match Section ── */}
        {filteredLocal.length > 0 && (
          <div style={{ marginBottom: '22px' }}>
            <div style={{
              fontSize: '11px',
              fontWeight: '800',
              color: '#8AA8A5',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '10px',
              paddingLeft: '4px'
            }}>
              Locality Spots & Facilities
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {filteredLocal.map((item) => {
                const IconComp = item.icon || MapPin;
                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelect(item)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '12px',
                        background: 'rgba(0, 229, 192, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'var(--accent-cyan, #00E5C0)',
                        flexShrink: 0
                      }}>
                        <IconComp size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF', letterSpacing: '-0.2px' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: '12px', color: '#8AA8A5', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
                          <span>{item.tag}</span>
                          {item.location && <span>• {item.location}</span>}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={16} color="#547573" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── OpenStreetMap Geocoding Search Suggestions ── */}
        {suggestions.length > 0 && (
          <div style={{ marginBottom: '22px' }}>
            <div style={{
              fontSize: '11px',
              fontWeight: '800',
              color: '#8AA8A5',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '10px',
              paddingLeft: '4px'
            }}>
              Global Places & Cities
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {suggestions.map((s) => {
                const { primary, secondary } = formatOSMDisplayName(s.display_name);
                return (
                  <div
                    key={s.place_id}
                    onClick={() => handleSelect(s.display_name)}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '16px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{
                        width: '34px',
                        height: '34px',
                        borderRadius: '12px',
                        background: 'rgba(0, 242, 254, 0.15)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#00F2FE',
                        flexShrink: 0
                      }}>
                        <MapPin size={18} />
                      </div>
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '700', color: '#FFFFFF', letterSpacing: '-0.2px' }}>
                          {primary}
                        </div>
                        {secondary && (
                          <div style={{ fontSize: '12px', color: '#8AA8A5', marginTop: '2px' }}>
                            {secondary}
                          </div>
                        )}
                      </div>
                    </div>
                    <ChevronRight size={16} color="#547573" />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Suggested Filters (Apple Pill Strip) ── */}
        {!query && (
          <div style={{ marginBottom: '24px' }}>
            <div style={{
              fontSize: '11px',
              fontWeight: '800',
              color: '#8AA8A5',
              textTransform: 'uppercase',
              letterSpacing: '0.8px',
              marginBottom: '12px',
              paddingLeft: '4px'
            }}>
              Suggested Filters
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {suggestedFilters.map((f, idx) => {
                const Icon = f.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(f.label)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '20px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      color: '#FFFFFF',
                      fontSize: '13px',
                      fontWeight: '700',
                      letterSpacing: '-0.2px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                      fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif'
                    }}
                  >
                    <Icon size={14} color="var(--accent-cyan, #00E5C0)" />
                    <span>{f.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Recent Searches (Apple SF Pro List) ── */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{
            fontSize: '11px',
            fontWeight: '800',
            color: '#8AA8A5',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            marginBottom: '10px',
            paddingLeft: '4px'
          }}>
            {query && suggestions.length === 0 && filteredLocal.length === 0 && !isFetching
              ? 'No exact match — try recent searches'
              : 'Recent Searches'}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {(recentSearches || []).map((item, idx) => (
              <div
                key={idx}
                onClick={() => handleSelect(item)}
                style={{
                  padding: '14px 4px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.07)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <Clock size={16} color="#6A8885" />
                  <span style={{
                    color: '#FFFFFF',
                    fontSize: '14px',
                    fontWeight: '600',
                    letterSpacing: '-0.2px'
                  }}>
                    {item}
                  </span>
                </div>
                <ChevronRight size={16} color="#547573" />
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
