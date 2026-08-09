import { mockData } from './mockData.js';

const API_BASE_URL = 'http://localhost:5000/api';

export const apiClient = {
  // ── Real-Time Locality Data (OpenStreetMap Overpass) ────────────────────────
  async getLiveLocalityData(lat = 19.033, lng = 73.029) {
    try {
      const res = await fetch(`${API_BASE_URL}/live/locality?lat=${lat}&lng=${lng}`);
      if (!res.ok) throw new Error('Locality API error');
      const json = await res.json();
      return { ...json.data, locality: json.locality };
    } catch {
      console.log('[apiClient] Fallback to mock locality data');
      return {
        stays: mockData.stays,
        dining: mockData.dining,
        locogems: mockData.locoGems,
        medicalHubs: mockData.medicalHubs,
        washrooms: mockData.washrooms
      };
    }
  },

  // ── Mock Places Feed ─────────────────────────────────────────────────────
  async getPlaces(params = {}) {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${API_BASE_URL}/places?${query}`);
      if (!res.ok) throw new Error('API offline');
      const data = await res.json();
      return data.data;
    } catch {
      console.log('[apiClient] Offline fallback: places');
      return mockData.stays;
    }
  },

  // ── Radar Amenities ────────────────────────────────────────────────
  async getRadarData() {
    try {
      const res = await fetch(`${API_BASE_URL}/radar`);
      if (!res.ok) throw new Error('API offline');
      const data = await res.json();
      return { medicalHubs: data.medicalHubs, washrooms: data.washrooms };
    } catch {
      return { medicalHubs: mockData.medicalHubs, washrooms: mockData.washrooms };
    }
  },

  // ── NLP Sentiment Analysis ────────────────────────────────────────────────
  async analyzeSentiment(reviews) {
    try {
      const res = await fetch(`${API_BASE_URL}/sentiment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviews })
      });
      if (!res.ok) throw new Error('API offline');
      const data = await res.json();
      return data.data;
    } catch {
      return {
        hygieneScore: 94,
        safetyIndex: 95,
        peaceIndex: 88,
        valueForMoneyScore: 4.6,
        bulletSummaries: [
          'Consistently clean and sanitized washroom facilities verified by Pulse AI.',
          '24/7 security guard at entrance makes it super safe for solo travelers.',
          'Limited parking during peak evening hours.'
        ]
      };
    }
  },

  // ── Google Place Details + AI Stats ──────────────────────────────────────
  async getGooglePlace(query) {
    try {
      const res = await fetch(
        `${API_BASE_URL}/google/place?query=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error('API offline');
      const json = await res.json();
      return json.success ? json.data : null;
    } catch {
      console.log('[apiClient] Offline fallback: google/place');
      return null;
    }
  },

  // ── Nearby Amenities ───────────────────────────────────────────────
  async getNearbyAmenities(lat, lng, type = 'hospital') {
    try {
      const res = await fetch(
        `${API_BASE_URL}/google/nearby?lat=${lat}&lng=${lng}&type=${type}`
      );
      if (!res.ok) throw new Error('API offline');
      const json = await res.json();
      return json.success ? json.data : [];
    } catch {
      console.log('[apiClient] Offline fallback: google/nearby');
      return type === 'hospital' ? mockData.medicalHubs : mockData.washrooms;
    }
  }
};
