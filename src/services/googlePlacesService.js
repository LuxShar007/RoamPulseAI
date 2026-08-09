/**
 * RoamPulse AI — Google Places Service (Backend)
 * Wraps Google Places Text Search + Place Details API calls.
 * Falls back gracefully when GOOGLE_PLACES_API_KEY is absent or quota exceeded.
 */

import axios from 'axios';
import { analyzeReviewsSentiment } from './sentimentEngine.js';

const PLACES_BASE = 'https://maps.googleapis.com/maps/api/place';
const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Returns true when a Google API key is configured and non-placeholder.
 */
function hasApiKey() {
  return !!(API_KEY && API_KEY !== 'your-google-places-api-key-here' && API_KEY.length > 10);
}

/**
 * Converts a Google Places photo reference into a displayable photo URL.
 */
function buildPhotoUrl(photoRef, maxWidth = 800) {
  if (!photoRef) return null;
  return `${PLACES_BASE}/photo?maxwidth=${maxWidth}&photoreference=${photoRef}&key=${API_KEY}`;
}

// ─── Core API Calls ───────────────────────────────────────────────────────────

/**
 * Fetches place data from the Google Places Text Search API,
 * then retrieves detailed fields via the Place Details API.
 *
 * @param {string} query - Search string, e.g. "Verdant Bistro Navi Mumbai"
 * @returns {object|null} Normalised place object, or null on failure / missing key.
 */
export async function fetchGooglePlaceDetails(query) {
  if (!hasApiKey()) {
    console.log('[GooglePlaces] No API key — using fallback data.');
    return null;
  }

  try {
    // Step 1: Text Search to get a place_id
    const searchRes = await axios.get(`${PLACES_BASE}/textsearch/json`, {
      params: { query, key: API_KEY }
    });

    if (searchRes.data.status !== 'OK' || !searchRes.data.results?.length) {
      console.warn('[GooglePlaces] Text Search returned no results for:', query);
      return null;
    }

    const placeId = searchRes.data.results[0].place_id;

    // Step 2: Place Details to get reviews, photos, hours, etc.
    const detailRes = await axios.get(`${PLACES_BASE}/details/json`, {
      params: {
        place_id: placeId,
        fields: [
          'place_id',
          'name',
          'formatted_address',
          'geometry',
          'rating',
          'price_level',
          'opening_hours',
          'photos',
          'reviews'
        ].join(','),
        key: API_KEY
      }
    });

    if (detailRes.data.status !== 'OK') {
      console.warn('[GooglePlaces] Place Details failed:', detailRes.data.status);
      return null;
    }

    const detail = detailRes.data.result;

    // Step 3: Extract raw review texts for the sentiment engine
    const rawReviews = (detail.reviews || []).map(r => r.text);

    // Step 4: Run sentiment scoring on real Google reviews
    const aiStats = analyzeReviewsSentiment(rawReviews);

    // Step 5: Build first photo URL if available
    const firstPhoto = detail.photos?.[0]?.photo_reference
      ? buildPhotoUrl(detail.photos[0].photo_reference)
      : null;

    return {
      googlePlaceId: detail.place_id,
      name: detail.name,
      formattedAddress: detail.formatted_address,
      lat: detail.geometry?.location?.lat ?? null,
      lng: detail.geometry?.location?.lng ?? null,
      googleRating: detail.rating ?? null,
      priceLevel: detail.price_level ?? null,
      openNow: detail.opening_hours?.open_now ?? null,
      photoUrl: firstPhoto,
      rawReviews,
      aiStats: {
        hygieneScore: aiStats.hygieneScore,
        safetyIndex: aiStats.safetyIndex,
        peaceIndex: aiStats.peaceIndex,
        valueForMoneyScore: aiStats.valueForMoneyScore,
        reviewInsights: aiStats.bulletSummaries
      }
    };
  } catch (err) {
    // Don't crash the server — just log and fall back
    console.error('[GooglePlaces] API call failed:', err.message);
    return null;
  }
}

/**
 * Searches for nearby amenities (hospitals, restrooms) around a lat/lng coordinate.
 *
 * @param {number} lat
 * @param {number} lng
 * @param {'hospital'|'doctor'|'pharmacy'|'lodging'|'restaurant'} type - Google Places type
 * @param {number} radius - Radius in metres (default 2000)
 * @returns {Array} Array of normalised nearby place objects, or [] on failure.
 */
export async function fetchNearbyPlaces(lat, lng, type = 'hospital', radius = 2000) {
  if (!hasApiKey()) {
    console.log('[GooglePlaces] No API key — nearby search returning empty.');
    return [];
  }

  try {
    const res = await axios.get(`${PLACES_BASE}/nearbysearch/json`, {
      params: {
        location: `${lat},${lng}`,
        radius,
        type,
        key: API_KEY
      }
    });

    if (res.data.status !== 'OK') {
      console.warn('[GooglePlaces] Nearby search failed:', res.data.status);
      return [];
    }

    return res.data.results.slice(0, 6).map(p => ({
      googlePlaceId: p.place_id,
      name: p.name,
      formattedAddress: p.vicinity,
      lat: p.geometry?.location?.lat,
      lng: p.geometry?.location?.lng,
      googleRating: p.rating ?? null,
      openNow: p.opening_hours?.open_now ?? null,
      type
    }));
  } catch (err) {
    console.error('[GooglePlaces] Nearby search error:', err.message);
    return [];
  }
}
