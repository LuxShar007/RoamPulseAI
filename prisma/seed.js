import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding RoamPulse AI database...');

  // Clean existing data
  await prisma.savedPlace.deleteMany({});
  await prisma.aiStatCard.deleteMany({});
  await prisma.place.deleteMany({});
  await prisma.amenity.deleteMany({});
  await prisma.user.deleteMany({});

  // Seed Demo User
  await prisma.user.create({
    data: {
      email: 'sharv@roampulse.ai',
      passwordHash: '$2a$10$e8c1...demo',
      fullName: 'Sharv',
      travelPreference: 'PEACE'
    }
  });

  // 12 Seeding Places across Stays, Dining, LocoGems, Restrooms & Emergency Medical
  // googlePlaceId values are real Google Place IDs for use with the Places API.
  const placesData = [
    {
      name: 'Luminary Eco Lodge',
      category: 'STAYS',
      subCategory: 'LODGE',
      address: 'Coorg, Western Ghats, Karnataka',
      latitude: 12.3375,
      longitude: 75.8069,
      priceDisplay: '₹2,800/night',
      expectedSpend: 2800,
      googlePlaceId: 'ChIJMUCWJqM2rjsRKm9b2t91rMI', // Orange County Coorg (representative)
      googleRating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80',
      statCard: {
        hygieneScore: 94,
        safetyIndex: 95,
        peaceIndex: 88,
        valueForMoneyScore: 4.6,
        reviewInsights: [
          'Consistently clean and sanitized washroom facilities verified by Pulse AI.',
          '24/7 security guard at entrance makes it super safe for solo travelers.',
          'Limited parking during peak evening hours.'
        ]
      }
    },
    {
      name: 'ZenITH Capsule Pods',
      category: 'STAYS',
      subCategory: 'COTTAGE',
      address: 'Indiranagar, Bangalore, Karnataka',
      latitude: 12.9716,
      longitude: 77.5946,
      priceDisplay: '₹1,400/night',
      expectedSpend: 1400,
      googlePlaceId: 'ChIJbU60yXAWrjsR_gOA9R62EPA', // Treebo Indiranagar (representative)
      googleRating: 4.7,
      imageUrl: 'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80',
      statCard: {
        hygieneScore: 97,
        safetyIndex: 93,
        peaceIndex: 90,
        valueForMoneyScore: 4.8,
        reviewInsights: [
          'Ultra-sanitized pods with touchless bio-lock entry.',
          'High-speed 500Mbps fiber internet & soundproof capsule design.',
          'Shared lounge can get lively during weekend hackathons.'
        ]
      }
    },
    {
      name: 'Canyon Retreat Woods',
      category: 'STAYS',
      subCategory: 'FIVE_STAR',
      address: 'Madikeri, Coorg, Karnataka',
      latitude: 12.4244,
      longitude: 75.7382,
      priceDisplay: '₹3,900/night',
      expectedSpend: 3900,
      googlePlaceId: 'ChIJ0_y2Q6o2rjsRbRb0Tb0JI14', // Coorg Wilderness Resort (representative)
      googleRating: 4.9,
      imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80',
      statCard: {
        hygieneScore: 91,
        safetyIndex: 96,
        peaceIndex: 93,
        valueForMoneyScore: 4.5,
        reviewInsights: [
          'Private natural plunge pools sanitized daily with organic filters.',
          'Strict quiet hours enforced after 9 PM by resort management.',
          'Requires advance reservation for hilltop dining.'
        ]
      }
    },
    {
      name: 'Verdant Cliffside Suite',
      category: 'STAYS',
      subCategory: 'THREE_STAR',
      address: 'Western Ghats, Maharashtra',
      latitude: 17.9247,
      longitude: 73.6582,
      priceDisplay: '₹2,100/night',
      expectedSpend: 2100,
      googlePlaceId: null, // No matching Google Place ID — uses mock fallback
      googleRating: 4.6,
      imageUrl: 'https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80',
      statCard: {
        hygieneScore: 92,
        safetyIndex: 94,
        peaceIndex: 91,
        valueForMoneyScore: 4.7,
        reviewInsights: [
          'Panoramic mountain valley views with zero traffic noise.',
          'Fresh organic farm breakfast included.',
          'Steep walking steps near entrance.'
        ]
      }
    },
    {
      name: 'Verdant Bistro',
      category: 'DINING',
      subCategory: 'RESTAURANT',
      address: 'CBD Belapur, Navi Mumbai',
      latitude: 19.0205,
      longitude: 73.0402,
      priceDisplay: '₹250/person',
      expectedSpend: 250,
      googlePlaceId: 'ChIJhxkCaGBX5zsRp4M5GwqQqmY', // CBD Belapur restaurant (representative)
      googleRating: 4.8,
      imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80',
      statCard: {
        hygieneScore: 96,
        safetyIndex: 98,
        peaceIndex: 85,
        valueForMoneyScore: 4.7,
        reviewInsights: [
          'Open organic kitchen with 96% hygiene inspection score.',
          'Calm ambient jazz music suitable for remote work.',
          'Weekend lunch rush may require 10-minute wait.'
        ]
      }
    },
    {
      name: 'Saffron Street Kitchen',
      category: 'DINING',
      subCategory: 'RESTAURANT',
      address: 'Sector 15, Navi Mumbai',
      latitude: 19.033,
      longitude: 73.029,
      priceDisplay: '₹180/person',
      expectedSpend: 180,
      googlePlaceId: 'ChIJLQcf3V5X5zsROB_9q_GfYxE', // Sector 15 Navi Mumbai restaurant (representative)
      googleRating: 4.5,
      imageUrl: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80',
      statCard: {
        hygieneScore: 92,
        safetyIndex: 95,
        peaceIndex: 78,
        valueForMoneyScore: 4.6,
        reviewInsights: [
          'Generous tandoori buffet portions with fresh ingredients.',
          'Well-lit family dining area with security camera monitoring.',
          'Gets noisy during peak dinner hours.'
        ]
      }
    },
    {
      name: 'Pulse Café & Co-work',
      category: 'DINING',
      subCategory: 'RESTAURANT',
      address: 'Vashi, Navi Mumbai',
      latitude: 19.077,
      longitude: 72.998,
      priceDisplay: '₹150/person',
      expectedSpend: 150,
      googlePlaceId: 'ChIJL0Cl3X9X5zsRlwUO1nEzJ_E', // Vashi café (representative)
      googleRating: 4.6,
      imageUrl: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?auto=format&fit=crop&w=800&q=80',
      statCard: {
        hygieneScore: 95,
        safetyIndex: 94,
        peaceIndex: 89,
        valueForMoneyScore: 4.8,
        reviewInsights: [
          'EV charging station and high-speed Wi-Fi available.',
          'Artisanal drip coffee and clean restroom on premises.',
          'Limited outdoor seating during rain.'
        ]
      }
    },
    {
      name: 'Navi Mumbai Street Chaat (LocoGem)',
      category: 'STREET_FOOD',
      subCategory: 'STREET_VENDOR',
      address: 'Station Road Market, Navi Mumbai',
      latitude: 19.031,
      longitude: 73.027,
      priceDisplay: '₹60/person',
      expectedSpend: 60,
      googlePlaceId: null, // Street vendors typically have no Place ID
      googleRating: 4.7,
      imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=800&q=80',
      statCard: {
        hygieneScore: 89,
        safetyIndex: 92,
        peaceIndex: 70,
        valueForMoneyScore: 4.9,
        reviewInsights: [
          'Filtered mineral water used for all chutneys & panic puri.',
          'Gloved vendors with daily food safety certification.',
          'Busy evening crowd between 6 PM - 8 PM.'
        ]
      }
    },
    {
      name: 'Royal Biryani Corner',
      category: 'STREET_FOOD',
      subCategory: 'STREET_VENDOR',
      address: 'Kharghar, Navi Mumbai',
      latitude: 19.047,
      longitude: 73.069,
      priceDisplay: '₹120/person',
      expectedSpend: 120,
      googlePlaceId: null, // Street vendors typically have no Place ID
      googleRating: 4.6,
      imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?auto=format&fit=crop&w=800&q=80',
      statCard: {
        hygieneScore: 87,
        safetyIndex: 90,
        peaceIndex: 75,
        valueForMoneyScore: 4.8,
        reviewInsights: [
          'Aromatic dum biryani served in eco-friendly clay pots.',
          'Popular late-night spot with active street lighting.',
          'Spicy gravy might not suit mild palates.'
        ]
      }
    }
  ];

  for (const placeData of placesData) {
    const { statCard, ...place } = placeData;
    await prisma.place.create({
      data: {
        ...place,
        statCard: {
          create: statCard
        }
      }
    });
  }

  // Seed Amenities (Verified Washrooms & 24/7 Medical Hubs)
  await prisma.amenity.createMany({
    data: [
      {
        name: 'Metro Station Public Restroom (Verified)',
        type: 'WASHROOM',
        latitude: 19.031,
        longitude: 73.027,
        isVerified: true,
        hygieneRating: 94,
        open247: true
      },
      {
        name: 'Central Park Eco Washroom',
        type: 'WASHROOM',
        latitude: 19.035,
        longitude: 73.031,
        isVerified: true,
        hygieneRating: 90,
        open247: false
      },
      {
        name: '24/7 Medical Hub & Trauma Center',
        type: 'MEDICAL',
        latitude: 19.033,
        longitude: 73.029,
        isVerified: true,
        hygieneRating: 99,
        open247: true
      }
    ]
  });

  console.log('Successfully seeded 12 records into RoamPulse AI database!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
