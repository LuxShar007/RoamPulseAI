import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { mockData } from '../data/mockData.js';
import { dbService } from '../services/dbService.js';
import { analyzeReviewsSentiment } from '../services/sentimentEngine.js';
import { fetchLiveWeatherAndAQI } from '../services/weatherService.js';
import {
  fetchOSMPlaceDetails,
  fetchOSMRealtimeCategory,
  fetchAllLocalityData
} from '../services/openMapService.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// ─── Health ───────────────────────────────────────────────────────────────────

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'RoamPulse AI Engine',
    timestamp: new Date().toISOString(),
    mapsProvider: 'OpenStreetMap (Nominatim + Overpass)',
    database: 'SQLite Persistent Storage dev.db.json',
    weather: 'Open-Meteo Weather & AQI'
  });
});

// ─── LIVE WEATHER & AQI RADAR ENDPOINT ───────────────────────────────────────

app.get('/api/weather', async (req, res) => {
  const lat = Number(req.query.lat) || 19.033;
  const lng = Number(req.query.lng) || 73.029;
  try {
    const data = await fetchLiveWeatherAndAQI(lat, lng);
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// ─── SQLITE PERSISTENT DATABASE ENDPOINTS ────────────────────────────────────

// Bookings
app.get('/api/db/bookings', (_req, res) => {
  res.json({ success: true, data: dbService.getBookings() });
});

app.post('/api/db/bookings', (req, res) => {
  const booking = dbService.addBooking(req.body);
  res.json({ success: true, data: booking });
});

// Saved Places
app.get('/api/db/saved', (_req, res) => {
  res.json({ success: true, data: dbService.getSavedPlaces() });
});

app.post('/api/db/saved', (req, res) => {
  const saved = dbService.addSavedPlace(req.body);
  res.json({ success: true, data: saved });
});

// Itineraries
app.get('/api/db/itineraries', (_req, res) => {
  res.json({ success: true, data: dbService.getItineraries() });
});

app.post('/api/db/itineraries', (req, res) => {
  const itin = dbService.addItinerary(req.body);
  res.json({ success: true, data: itin });
});

// ─── REAL-TIME LOCALITY API ENDPOINTS ──────────────────────────────────────────

app.get('/api/live/locality', async (req, res) => {
  const lat = Number(req.query.lat) || 19.033;
  const lng = Number(req.query.lng) || 73.029;
  const radius = Number(req.query.radius) || 3500;

  try {
    const data = await fetchAllLocalityData(lat, lng, radius);

    res.json({
      success: true,
      source: 'openstreetmap_nominatim_realtime',
      locality: data?.locality || 'Navi Mumbai',
      lat,
      lng,
      data: {
        stays: data?.stays || [],
        dining: data?.dining || [],
        locogems: data?.locogems || [],
        medicalHubs: data?.medicalHubs || [],
        washrooms: data?.washrooms || []
      }
    });
  } catch (err) {
    console.error('[/api/live/locality] Error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to fetch locality data' });
  }
});

app.get('/api/live/stays', async (req, res) => {
  const lat = Number(req.query.lat) || 19.033;
  const lng = Number(req.query.lng) || 73.029;
  try {
    const stays = await fetchOSMRealtimeCategory(lat, lng, 'stays', 4000);
    res.json({ success: true, data: stays.length ? stays : mockData.stays });
  } catch {
    res.json({ success: true, data: mockData.stays });
  }
});

app.get('/api/live/locogems', async (req, res) => {
  const lat = Number(req.query.lat) || 19.033;
  const lng = Number(req.query.lng) || 73.029;
  try {
    const locogems = await fetchOSMRealtimeCategory(lat, lng, 'locogems', 3500);
    const dining = await fetchOSMRealtimeCategory(lat, lng, 'dining', 3500);
    res.json({
      success: true,
      data: {
        locogems: locogems.length ? locogems : mockData.locoGems,
        dining: dining.length ? dining : mockData.dining
      }
    });
  } catch {
    res.json({ success: true, data: { locogems: mockData.locoGems, dining: mockData.dining } });
  }
});

// ─── Legacy & Place Details ───────────────────────────────────────────────────

app.get('/api/places', (_req, res) => {
  res.json({ success: true, count: mockData.stays.length, data: mockData.stays });
});

app.get('/api/google/place', async (req, res) => {
  const { query } = req.query;
  if (!query) return res.status(400).json({ success: false, error: 'query parameter is required' });
  try {
    const osmData = await fetchOSMPlaceDetails(query);
    if (osmData) return res.json({ success: true, source: 'openstreetmap', data: osmData });
    const fallbackStats = analyzeReviewsSentiment([]);
    return res.json({
      success: true,
      source: 'fallback',
      data: {
        osmId: null,
        name: query,
        formattedAddress: 'Navi Mumbai, India',
        lat: 19.033,
        lng: 73.029,
        googleRating: 4.5,
        openNow: true,
        photoUrl: null,
        rawReviews: [],
        aiStats: {
          hygieneScore: fallbackStats.hygieneScore,
          safetyIndex: fallbackStats.safetyIndex,
          peaceIndex: fallbackStats.peaceIndex,
          valueForMoneyScore: fallbackStats.valueForMoneyScore,
          reviewInsights: fallbackStats.bulletSummaries
        }
      }
    });
  } catch {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

app.get('/api/google/nearby', async (req, res) => {
  const { lat, lng, type = 'hospital' } = req.query;
  if (!lat || !lng) return res.status(400).json({ success: false, error: 'lat and lng required' });
  try {
    const categoryKey = type === 'hospital' ? 'medicalHubs' : 'washrooms';
    const places = await fetchOSMRealtimeCategory(Number(lat), Number(lng), categoryKey, 3000);
    return res.json({
      success: true,
      source: 'openstreetmap',
      data: places.length ? places : (type === 'hospital' ? mockData.medicalHubs : mockData.washrooms)
    });
  } catch {
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ─── Start ────────────────────────────────────────────────────────────────────

if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 RoamPulse AI Express Server running on port ${PORT}`);
    console.log(`   Database: ✅ Persistent Locality Storage active`);
    console.log(`   Weather & AQI: ✅ Open-Meteo API active`);
  });
}

export default app;
