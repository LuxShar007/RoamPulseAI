import { mockData } from './mockData.js';
import { fetchAllLocalityData } from '../services/openMapService.js';
import { generateGoogleReviews } from '../services/googleReviewEngine.js';

const API_BASE_URL = '/api';

export const apiClient = {
  // ── Real-Time Locality Data (OpenStreetMap Engine) ─────────────────────────
  async getLiveLocalityData(lat = 18.989, lng = 73.117) {
    try {
      const res = await fetch(`${API_BASE_URL}/live/locality?lat=${lat}&lng=${lng}`);
      if (res.ok) {
        const json = await res.json();
        if (json?.data?.stays?.length) {
          return { ...json.data, locality: json.locality };
        }
      }
    } catch {
      // Backend offline fallback to client-side OSM engine
    }

    try {
      const realData = await fetchAllLocalityData(lat, lng);
      if (realData && (realData.stays?.length || realData.dining?.length)) {
        return realData;
      }
    } catch (err) {
      console.error('[apiClient] OSM client fetch error:', err);
    }

    const offsets = [
      [0.0025, 0.0032],
      [-0.0021, 0.0041],
      [0.0039, -0.0026],
      [-0.0031, -0.0038],
      [0.0012, -0.0052]
    ];

    const bindLocalityCoords = (list) => (list || []).map((item, idx) => {
      const [dLat, dLng] = offsets[idx % offsets.length];
      return {
        ...item,
        lat: lat + dLat,
        lng: lng + dLng
      };
    });

    const policeFallback = [
      { name: 'Panvel Central Police Station & Help Desk', location: 'Station Road, Panvel', lat: lat + 0.0018, lng: lng - 0.0024, category: 'Police Station' },
      { name: 'Panvel Traffic Control & Emergency Cell', location: 'Panvel Flyover, Panvel', lat: lat - 0.0022, lng: lng + 0.0031, category: 'Police Station' }
    ].map((item, idx) => {
      const gData = generateGoogleReviews(item.name, 'policeStations', idx + 1);
      return {
        ...item,
        rating: gData.googleRating,
        googleRating: gData.googleRating,
        googleReviewsCount: gData.googleReviewsCount,
        googleReviews: gData.googleReviews,
        aiMetrics: gData.aiStats,
        hygiene: gData.aiStats.hygieneScore,
        safety: gData.aiStats.safetyIndex,
        peacefulness: gData.aiStats.peaceIndex,
        aiInsights: gData.aiStats.reviewInsights
      };
    });

    return {
      locality: 'Panvel',
      stays: bindLocalityCoords(mockData.stays),
      dining: bindLocalityCoords(mockData.dining),
      locogems: bindLocalityCoords(mockData.locoGems),
      medicalHubs: bindLocalityCoords(mockData.medicalHubs),
      washrooms: bindLocalityCoords(mockData.washrooms),
      policeStations: policeFallback
    };
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
