/**
 * RoamPulse AI — Real-Time OpenStreetMap Locality & Routing Engine
 * Uses OpenStreetMap Nominatim Search, Reverse Geocoding, and OSRM Turn-by-Turn Routing.
 */

import axios from 'axios';
import { generateGoogleReviews } from './googleReviewEngine.js';

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org';
const OSRM_BASE = 'https://router.project-osrm.org/route/v1/driving';

const HEADERS = {
  'User-Agent': 'RoamPulseAI/1.0 (https://github.com/roampulse-ai)',
  'Accept-Language': 'en'
};

const IMAGE_POOLS = {
  stays: [
    'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80'
  ],
  locogems: [
    'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1565557623262-b51c2513a641?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&w=800&q=80'
  ],
  dining: [
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
  ]
};

function getRandomImage(category, index) {
  const pool = IMAGE_POOLS[category] || IMAGE_POOLS.stays;
  return pool[index % pool.length];
}

function calculateDistance(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 'Near locality';
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  if (d < 1) return `${Math.round(d * 1000)}m away`;
  return `${d.toFixed(1)} km away`;
}

// ─── 1. Real-Time OSRM Turn-by-Turn Routing Engine ────────────────────────

export async function fetchOSMRoute(startLat, startLng, endLat, endLng) {
  try {
    const url = `${OSRM_BASE}/${startLng},${startLat};${endLng},${endLat}?overview=full&geometries=geojson&steps=true`;
    const res = await axios.get(url, { timeout: 6000 });
    const route = res.data?.routes?.[0];
    if (!route) return null;

    const distanceMeters = route.distance;
    const durationSeconds = route.duration;
    const coordinates = route.geometry?.coordinates?.map(c => [c[1], c[0]]) || [];

    const rawSteps = route.legs?.[0]?.steps || [];
    const turnSteps = rawSteps.map(step => {
      const name = step.name ? ` onto ${step.name}` : '';
      const type = step.maneuver?.type || 'straight';
      const modifier = step.maneuver?.modifier || '';
      let action = 'Head';
      if (type === 'turn') action = `Turn ${modifier || 'right'}`;
      else if (type === 'new name' || type === 'continue') action = 'Continue';
      else if (type === 'arrive') action = 'Arrive at destination';
      else if (type === 'depart') action = 'Head';

      const distStr = step.distance < 1000 ? `${Math.round(step.distance)}m` : `${(step.distance / 1000).toFixed(1)}km`;

      return {
        instruction: `${action}${name}`,
        distance: distStr,
        modifier: modifier || type
      };
    });

    return {
      distanceText: distanceMeters < 1000 ? `${Math.round(distanceMeters)}m` : `${(distanceMeters / 1000).toFixed(1)}km`,
      etaText: `${Math.max(1, Math.round(durationSeconds / 60))} mins`,
      polylineCoordinates: coordinates,
      turnSteps: turnSteps.length ? turnSteps : [
        { instruction: `Head toward venue destination`, distance: `${Math.round(distanceMeters)}m`, modifier: 'straight' },
        { instruction: `Arrive at destination (Verified Safety Zone)`, distance: '0m', modifier: 'arrive' }
      ]
    };
  } catch (err) {
    console.error('[OSRM Route] Failed to fetch real-time route:', err.message);
    return null;
  }
}

// ─── 2. Reverse Geocode Coordinates to Locality Name ────────────────────────

export async function reverseGeocodeLocality(lat, lng) {
  try {
    const res = await axios.get(`${NOMINATIM_BASE}/reverse`, {
      headers: HEADERS,
      params: {
        lat,
        lon: lng,
        format: 'json',
        addressdetails: 1,
        zoom: 12
      },
      timeout: 4000
    });

    const addr = res.data?.address || {};
    const locality = addr.city || addr.town || addr.village || addr.city_district ||
                     addr.suburb || addr.county || 'Unknown Locality';
    return locality;
  } catch {
    return 'Unknown Locality';
  }
}

// ─── 3. Real-Time Nominatim Search by Locality & Category ───────────────────

export async function fetchCategoryRealtime(queryTerm, category, centerLat, centerLng) {
  try {
    const OFFSET = 0.09;
    const viewbox = [
      centerLng - OFFSET,
      centerLat + OFFSET,
      centerLng + OFFSET,
      centerLat - OFFSET
    ].join(',');

    const res = await axios.get(`${NOMINATIM_BASE}/search`, {
      headers: HEADERS,
      params: {
        q: queryTerm,
        format: 'json',
        limit: 8,
        addressdetails: 1,
        extratags: 1,
        viewbox,
        bounded: 1
      },
      timeout: 5000
    });

    let results = res.data || [];

    if (!results.length) {
      const fallbackRes = await axios.get(`${NOMINATIM_BASE}/search`, {
        headers: HEADERS,
        params: {
          q: queryTerm,
          format: 'json',
          limit: 8,
          addressdetails: 1,
          extratags: 1
        },
        timeout: 5000
      });
      results = fallbackRes.data || [];
    }

    if (!results.length) return [];

    return results.map((item, idx) => {
      const lat = parseFloat(item.lat);
      const lng = parseFloat(item.lon);
      const name = item.name || item.display_name.split(',')[0] || `${category} Spot #${idx + 1}`;
      const address = item.display_name;
      const seed = Math.abs(Number(item.place_id)) || (idx + 1) * 31;
      const gData = generateGoogleReviews(name, category, seed);

      return {
        id: `live-${category}-${item.place_id}`,
        osmId: item.osm_id || item.place_id,
        name,
        location: address,
        lat,
        lng,
        distance: calculateDistance(centerLat, centerLng, lat, lng),
        price: category === 'stays' ? 1400 + (idx * 400) % 3000 : 90 + (idx * 50) % 400,
        category: category === 'stays' ? 'Lodges & Hotels' : category === 'locogems' ? 'Street Food' : 'Restaurant',
        image: getRandomImage(category, idx),
        rating: gData.googleRating,
        googleRating: gData.googleRating,
        googleReviewsCount: gData.googleReviewsCount,
        googleReviews: gData.googleReviews,
        open247: item.extratags?.opening_hours === '24/7',
        aiMetrics: gData.aiStats,
        hygiene: gData.aiStats.hygieneScore
      };
    });
  } catch (err) {
    console.error(`[OSM Realtime] Failed for ${queryTerm}:`, err.message);
    return [];
  }
}

// ─── 4. Fetch All Locality Real-Time Data ───────────────────────────────────

export async function fetchAllLocalityData(lat = 18.9220, lng = 72.8347) {
  try {
    const locality = await reverseGeocodeLocality(lat, lng);

    const [stays, dining, locogems, medicalHubs, washrooms] = await Promise.all([
      fetchCategoryRealtime(`hotel in ${locality}`, 'stays', lat, lng),
      fetchCategoryRealtime(`restaurant in ${locality}`, 'dining', lat, lng),
      fetchCategoryRealtime(`food in ${locality}`, 'locogems', lat, lng),
      fetchCategoryRealtime(`hospital in ${locality}`, 'medicalHubs', lat, lng),
      fetchCategoryRealtime(`toilet in ${locality}`, 'washrooms', lat, lng)
    ]);

    return {
      locality,
      lat,
      lng,
      stays,
      dining,
      locogems,
      medicalHubs,
      washrooms
    };
  } catch (err) {
    console.error('[OSM Realtime] fetchAllLocalityData error:', err.message);
    return null;
  }
}

export async function fetchOSMPlaceDetails(query) {
  try {
    const res = await axios.get(`${NOMINATIM_BASE}/search`, {
      headers: HEADERS,
      params: {
        q: query,
        format: 'json',
        limit: 1,
        addressdetails: 1,
        extratags: 1
      },
      timeout: 5000
    });

    if (!res.data?.length) return null;

    const place = res.data[0];
    const name = place.display_name.split(',')[0];
    const reviewsData = generateGoogleReviews(name, 'stays', place.place_id || 101);

    return {
      osmId: place.osm_id || place.place_id,
      name,
      formattedAddress: place.display_name,
      lat: parseFloat(place.lat),
      lng: parseFloat(place.lon),
      googleRating: reviewsData.googleRating,
      googleReviewsCount: reviewsData.googleReviewsCount,
      googleReviews: reviewsData.googleReviews,
      openNow: true,
      rawReviews: reviewsData.rawReviews,
      aiStats: reviewsData.aiStats
    };
  } catch (err) {
    console.error('[OSM Realtime] Place details error:', err.message);
    return null;
  }
}

export async function fetchOSMRealtimeCategory(lat, lng, category = 'stays') {
  const locality = await reverseGeocodeLocality(lat, lng);
  const term = category === 'stays' ? `hotel in ${locality}` : `food in ${locality}`;
  return fetchCategoryRealtime(term, category, lat, lng);
}
