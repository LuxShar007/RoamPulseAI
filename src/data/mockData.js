import { generateGoogleReviews } from '../services/googleReviewEngine.js';

function enrichItem(item, category, idx) {
  const gData = generateGoogleReviews(item.name, category, (idx + 1) * 37);
  return {
    ...item,
    rating: gData.googleRating,
    googleRating: gData.googleRating,
    googleReviewsCount: gData.googleReviewsCount,
    googleReviews: gData.googleReviews,
    aiMetrics: {
      hygiene: gData.aiStats.hygieneScore,
      safety: gData.aiStats.safetyIndex,
      peacefulness: gData.aiStats.peaceIndex,
      valueForMoney: gData.aiStats.valueForMoneyScore,
      expectedSpend: item.price || 1200
    },
    hygiene: gData.aiStats.hygieneScore,
    safety: gData.aiStats.safetyIndex,
    peacefulness: gData.aiStats.peaceIndex,
    aiInsights: gData.aiStats.reviewInsights
  };
}

const rawMockData = {
  user: {
    name: "Sharv",
    location: "Navi Mumbai, India",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    travelType: "Peace Seeker",
    savedAmount: 1800,
    preferences: ["Budget Explorer", "Solo Traveler", "Peace Seeker"],
    permissions: {
      gps: true,
      notifications: true,
      radar: true
    }
  },

  categories: [
    { id: "all", label: "All", icon: "Sparkles" },
    { id: "stays", label: "Stays", icon: "Home" },
    { id: "dining", label: "Dining", icon: "Utensils" },
    { id: "locogems", label: "Street Food (LocoGems)", icon: "Flame" },
    { id: "emergency", label: "Emergency", icon: "ShieldAlert" }
  ],

  recentSearches: [
    "Clean washrooms nearby",
    "Quiet lodges under ₹1,500",
    "Late-night pharmacy",
    "Vegetarian LocoGems"
  ],

  stays: [
    {
      id: "stay-1",
      name: "Luminary Eco Lodge",
      location: "Coorg, Western Ghats",
      distance: "1.2 km away",
      price: 2800,
      pricePeriod: "/night",
      rating: 4.8,
      reviewsCount: 142,
      category: "Lodges",
      image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80",
      gallery: [
        "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80",
        "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80"
      ],
      aiMetrics: {
        hygiene: 94,
        safety: 95,
        peacefulness: 88,
        valueForMoney: 4.6,
        expectedSpend: 1200
      },
      nearbyAmenities: {
        restroom: "150m",
        medical: "800m"
      },
      aiInsights: [
        "Consistently clean and sanitized washroom facilities verified by Pulse AI.",
        "24/7 security guard at entrance makes it super safe for solo travelers.",
        "Limited parking during peak evening hours."
      ],
      description: "Nestled in dense pine groves, Luminary Eco Lodge offers quiet solar-powered cabins with real-time AI monitored air quality and zero-noise index."
    },
    {
      id: "stay-2",
      name: "ZenITH Capsule Pods",
      location: "Bangalore, India",
      distance: "800m away",
      price: 1400,
      pricePeriod: "/night",
      rating: 4.7,
      reviewsCount: 289,
      category: "Cottages",
      image: "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
      aiMetrics: {
        hygiene: 97,
        safety: 93,
        peacefulness: 90,
        valueForMoney: 4.8,
        expectedSpend: 1400
      },
      nearbyAmenities: {
        restroom: "50m",
        medical: "400m"
      },
      aiInsights: [
        "Ultra-sanitized pods with touchless bio-lock entry.",
        "High-speed 500Mbps fiber internet & soundproof capsule design.",
        "Shared lounge can get lively during weekend hackathons."
      ],
      description: "Futuristic micro-stay capsules designed for digital nomads with real-time room climate pulse."
    },
    {
      id: "stay-3",
      name: "Canyon Retreat Woods",
      location: "Coorg, India",
      distance: "2.4 km away",
      price: 3900,
      pricePeriod: "/night",
      rating: 4.9,
      reviewsCount: 96,
      category: "5-Star Hotels",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80",
      aiMetrics: {
        hygiene: 91,
        safety: 96,
        peacefulness: 93,
        valueForMoney: 4.5,
        expectedSpend: 3900
      },
      nearbyAmenities: {
        restroom: "300m",
        medical: "1.2km"
      },
      aiInsights: [
        "Private natural plunge pools sanitized daily with organic filters.",
        "Strict quiet hours enforced after 9 PM by resort management.",
        "Requires advance reservation for hilltop dining."
      ],
      description: "Luxury wood suites overlooking misty mountain ravines with private infinity views."
    }
  ],

  dining: [
    {
      id: "food-1",
      name: "Verdant Bistro",
      cuisine: "Vegetarian • Authentic Local",
      distance: "450m away",
      rating: 4.8,
      hygiene: 96,
      safetyBadge: "Authentic Local",
      avgSpend: "₹250/person",
      image: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      tags: ["Vegetarian", "Organic", "Quiet Workspace"]
    },
    {
      id: "food-2",
      name: "Saffron Street Kitchen",
      cuisine: "Indian Buffet • Tandoori",
      distance: "1.2 km away",
      rating: 4.5,
      hygiene: 92,
      safetyBadge: "Top Safety",
      avgSpend: "₹180/person",
      image: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
      tags: ["LocoGems", "Spicy", "Family Friendly"]
    },
    {
      id: "food-3",
      name: "Pulse Café & Co-work",
      cuisine: "Coffee & Light Bites",
      distance: "2.1 km away",
      rating: 4.6,
      hygiene: 95,
      safetyBadge: "Quiet Workspace",
      avgSpend: "₹150/person",
      image: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80",
      tags: ["Café", "EV Charging", "Co-working"]
    }
  ],

  locoGems: [
    {
      id: "loco-1",
      name: "Navi Mumbai Street Chaat (LocoGem)",
      type: "Local Street Food Stall",
      distance: "300m away",
      rating: 4.7,
      hygiene: 89,
      avgSpend: "₹60/person",
      specialty: "Authentic Sev Puri & Vadapav",
      verifiedBy: "Pulse Community AI",
      image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80"
    },
    {
      id: "loco-2",
      name: "Royal Biryani Corner",
      type: "Night Food Cart",
      distance: "600m away",
      rating: 4.6,
      hygiene: 87,
      avgSpend: "₹120/person",
      specialty: "Dum Biryani & Kebabs",
      verifiedBy: "LocoGems Radar",
      image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80"
    }
  ],

  medicalHubs: [
    {
      id: "med-1",
      name: "24/7 Medical Hub & Trauma Center",
      distance: "300m away",
      openStatus: "Open 24/7",
      safetyScore: 99,
      type: "Hospital",
      lat: 19.033,
      lng: 73.029,
      phone: "+91 98765 43210",
      address: "Sector 15, Navi Mumbai"
    },
    {
      id: "med-2",
      name: "Apex City Hospital & Pharmacy",
      distance: "800m away",
      openStatus: "Open 24/7",
      safetyScore: 98,
      type: "Emergency Clinic",
      lat: 19.038,
      lng: 73.035,
      phone: "+91 98765 12345",
      address: "CBD Belapur, Navi Mumbai"
    },
    {
      id: "med-3",
      name: "Sunrise 24-hr Express Pharmacy",
      distance: "500m away",
      openStatus: "Open 24/7",
      safetyScore: 95,
      type: "Pharmacy",
      lat: 19.028,
      lng: 73.024,
      phone: "+91 98765 99887",
      address: "Station Road, Navi Mumbai"
    }
  ],

  washrooms: [
    {
      id: "wash-1",
      name: "Metro Station Public Restroom (Verified)",
      distance: "150m away",
      openStatus: "Open 24/7",
      hygiene: 94,
      features: ["Touchless Faucets", "Wheelchair Accessible", "Sanitizer Dispenser"],
      lat: 19.031,
      lng: 73.027,
      verifiedAt: "10 mins ago"
    },
    {
      id: "wash-2",
      name: "Central Park Eco Washroom",
      distance: "400m away",
      openStatus: "Open 6am - 11pm",
      hygiene: 90,
      features: ["Solar Water", "Baby Care Unit"],
      lat: 19.035,
      lng: 73.031,
      verifiedAt: "1 hour ago"
    },
    {
      id: "wash-3",
      name: "Smart Pod Sanitized Restroom",
      distance: "650m away",
      openStatus: "Open 24/7",
      hygiene: 96,
      features: ["Self-Cleaning UV", "AC Cabin"],
      lat: 19.025,
      lng: 73.022,
      verifiedAt: "2 hours ago"
    }
  ],

  notifications: [
    {
      id: "notif-1",
      type: "medical",
      title: "24/7 Medical Hub 300m away",
      description: "AI Safety Radar matched closest trauma clinic based on your travel profile.",
      time: "1 min ago",
      urgent: true
    },
    {
      id: "notif-2",
      type: "savings",
      title: "Price drop on booked Lodge – Save ₹800",
      description: "RoamPulse negotiated dynamic price alert triggered for ZenITH Capsule Rooms.",
      time: "12 mins ago",
      urgent: false
    },
    {
      id: "notif-3",
      type: "washroom",
      title: "Washroom verified clean",
      description: "Pulse crowdsourced validator updated public restroom hygiene score to 96% nearby.",
      time: "2 hours ago",
      urgent: false
    }
  ],

  savingsSummary: {
    totalSaved: 1800,
    currency: "₹",
    breakdown: [
      { category: "Stays Dynamic Discount", amount: 800, count: "1 stay" },
      { category: "LocoGems Street Food vs Dining", amount: 650, count: "3 meals" },
      { category: "AI Route Fuel Optimization", amount: 350, count: "4 trips" }
    ],
    tips: [
      "Book ZenITH Capsule Pods on Tuesdays for an extra 15% pulse discount.",
      "Eat at LocoGems street food stalls verified above 85% hygiene to save ₹400/day."
    ]
  }
};

export const mockData = {
  ...rawMockData,
  stays: (rawMockData.stays || []).map((item, idx) => enrichItem(item, 'stays', idx)),
  dining: (rawMockData.dining || []).map((item, idx) => enrichItem(item, 'dining', idx)),
  locoGems: (rawMockData.locoGems || []).map((item, idx) => enrichItem(item, 'locogems', idx)),
  medicalHubs: (rawMockData.medicalHubs || []).map((item, idx) => enrichItem(item, 'medicalHubs', idx)),
  washrooms: (rawMockData.washrooms || []).map((item, idx) => enrichItem(item, 'washrooms', idx))
};
