/**
 * RoamPulse AI — Persistent Locality Storage Engine
 * Persists bookings, saved places, and itineraries directly to local disk (dev.db.json).
 */

import fs from 'fs';
import path from 'path';

const DB_FILE = process.env.VERCEL
  ? path.join('/tmp', 'dev.db.json')
  : path.resolve(process.cwd(), 'prisma', 'dev.db.json');

// Initial schema
const INITIAL_DATA = {
  bookings: [
    {
      id: 'b-101',
      placeName: 'ZenITH Luxury Eco Pods',
      location: 'Navi Mumbai',
      dateRange: 'Aug 12 - Aug 14, 2026',
      price: 1400,
      hygiene: 98,
      ticketId: 'RP-884920-AI',
      createdAt: new Date().toISOString()
    }
  ],
  savedPlaces: [
    {
      id: 's-101',
      placeId: 'osm-stay-1',
      placeName: 'Palm Breeze Resort & Suites',
      category: 'Stay',
      location: 'Navi Mumbai',
      image: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date().toISOString()
    }
  ],
  itineraries: [
    {
      id: 'i-101',
      locality: 'Navi Mumbai',
      days: 2,
      vibe: 'PEACE',
      budget: '₹3,000 - ₹6,000',
      planJson: [
        {
          day: 1,
          title: 'Day 1: Arrival & LocoGems Exploration',
          timeline: [
            { time: '09:00 AM', title: 'Breakfast', spot: 'Navi Mumbai Local Cafe' }
          ]
        }
      ],
      createdAt: new Date().toISOString()
    }
  ],
  reviews: [
    {
      id: 'rev-101',
      userName: 'Aarav Sharma',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      rating: 5,
      categories: { hygiene: 5, safety: 5, comfort: 5, value: 4 },
      locality: 'Navi Mumbai',
      placeName: 'ZenITH Luxury Eco Pods',
      comment: 'Absolutely stunning locality experience! The AI hygiene score was 100% accurate, and live radar safety alerts gave complete peace of mind while traveling.',
      createdAt: '2026-08-10T14:32:00.000Z',
      verified: true
    },
    {
      id: 'rev-102',
      userName: 'Ananya Patel',
      userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
      rating: 4,
      categories: { hygiene: 4, safety: 5, comfort: 4, value: 5 },
      locality: 'Navi Mumbai',
      placeName: 'Palm Breeze Resort',
      comment: 'Super fast navigation and real-time offline maps feature saved us during evening commute. Highly recommend checking out LocoGems feed!',
      createdAt: '2026-08-09T09:15:00.000Z',
      verified: true
    }
  ]
};

function readDb() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
      fs.writeFileSync(DB_FILE, JSON.stringify(INITIAL_DATA, null, 2));
      return INITIAL_DATA;
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed.reviews) parsed.reviews = INITIAL_DATA.reviews;
    return parsed;
  } catch (err) {
    console.error('[DB] Read error:', err.message);
    return INITIAL_DATA;
  }
}

function writeDb(data) {
  try {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('[DB] Write error:', err.message);
  }
}

export const dbService = {
  // Bookings
  getBookings() {
    return readDb().bookings || [];
  },

  addBooking(booking) {
    const db = readDb();
    const newBooking = {
      id: `b-${Date.now()}`,
      placeName: booking.placeName || 'Reserved Venue',
      location: booking.location || 'Locality Center',
      dateRange: booking.dateRange || 'Aug 12 - Aug 14, 2026',
      price: Number(booking.price) || 1500,
      hygiene: Number(booking.hygiene) || 95,
      ticketId: booking.ticketId || `RP-${Math.floor(Math.random() * 900000 + 100000)}-AI`,
      createdAt: new Date().toISOString()
    };
    db.bookings.unshift(newBooking);
    writeDb(db);
    return newBooking;
  },

  // Saved Places
  getSavedPlaces() {
    return readDb().savedPlaces || [];
  },

  addSavedPlace(item) {
    const db = readDb();
    const newItem = {
      id: `s-${Date.now()}`,
      placeId: item.placeId || `place-${Date.now()}`,
      placeName: item.placeName || item.name || 'Saved Spot',
      category: item.category || 'Stay',
      location: item.location || 'Locality',
      image: item.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
      createdAt: new Date().toISOString()
    };
    db.savedPlaces.unshift(newItem);
    writeDb(db);
    return newItem;
  },

  // Itineraries
  getItineraries() {
    return readDb().itineraries || [];
  },

  addItinerary(itin) {
    const db = readDb();
    const newItin = {
      id: `i-${Date.now()}`,
      locality: itin.locality || 'Navi Mumbai',
      days: Number(itin.days) || 2,
      vibe: itin.vibe || 'PEACE',
      budget: itin.budget || '₹3,000 - ₹6,000',
      planJson: itin.planJson || [],
      createdAt: new Date().toISOString()
    };
    db.itineraries.unshift(newItin);
    writeDb(db);
    return newItin;
  },

  // Reviews
  getReviews() {
    return readDb().reviews || [];
  },

  addReview(review) {
    const db = readDb();
    const newReview = {
      id: `rev-${Date.now()}`,
      userName: review.userName || 'Verified Traveler',
      userAvatar: review.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      rating: Number(review.rating) || 5,
      categories: review.categories || { hygiene: 5, safety: 5, comfort: 5, value: 5 },
      locality: review.locality || 'Navi Mumbai',
      placeName: review.placeName || 'RoamPulse AI Experience',
      comment: review.comment || '',
      createdAt: new Date().toISOString(),
      verified: true
    };
    if (!db.reviews) db.reviews = [];
    db.reviews.unshift(newReview);
    writeDb(db);
    return newReview;
  }
};

