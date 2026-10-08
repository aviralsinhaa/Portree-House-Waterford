import { MambegConfig } from '../types';
import { MAMBEG_MEDIA } from './mediaAssets';

export const mambegConfig: MambegConfig = {
  name: 'Mambeg Country Guest House',
  subname: 'Garelochhead · Helensburgh · Scotland',
  tagline: 'A peaceful stay in the Scottish countryside.',
  area: 'Garelochhead / Helensburgh',
  region: 'Argyll and Bute',
  country: 'Scotland, United Kingdom',
  postcode: 'G84 0EN',
  address: 'Rosneath Road, Garelochhead, Helensburgh, Argyll, G84 0EN, United Kingdom',
  phone: '+44 1436 810136',
  email: 'mambegcountryguesthouse@gmail.com',
  host: 'David',
  checkIn: '2:00 PM (14:00)',
  checkOut: '10:00 AM',
  parking: 'Complimentary private on-site parking with CCTV coverage',
  wifi: 'Free high-speed Wi-Fi throughout guest rooms and lounge',
  roomsCount: 4,

  hero: {
    title: 'MAMBEG',
    headline: 'A quieter side of Scotland.',
    subheadline:
      'A welcoming countryside guest house near Garelochhead, offering comfortable en-suite rooms, tranquil gardens, and genuine personal hospitality.',
    image: MAMBEG_MEDIA.property.hero,
    primaryCta: 'Explore the Rooms',
    secondaryCta: 'Enquire About a Stay',
  },

  story: {
    headline: 'A small guest house with room to breathe.',
    subheading: 'Set along the quiet B833 on the western shores of Gare Loch',
    paragraphs: [
      'Situated along Rosneath Road, approximately 1.2 miles south of Garelochhead village and 6 miles from Helensburgh, Mambeg Country Guest House is a peaceful independent stay nestled amongst mature woodland and open gardens.',
      'Unlike large commercial hotels, Mambeg offers a relaxed personal scale: comfortable en-suite bedrooms accessible via a private guest entrance, a dedicated residents’ lounge with dining tables and microwave, and a calm base from which to discover the lochs and glens of Argyll.',
    ],
    features: [
      {
        title: 'Intimate Scale',
        desc: 'Approximately four guest rooms with personal attention and relaxed atmosphere.',
      },
      {
        title: 'Private Guest Access',
        desc: 'Separate guest entrance from the main house for privacy and freedom of movement.',
      },
      {
        title: 'Dedicated Residents Lounge',
        desc: 'Comfortable seating, dining table, microwave, crockery, and extensive DVD collection.',
      },
      {
        title: 'Generous Private Parking',
        desc: 'Large dedicated parking area with CCTV coverage well back from the main road.',
      },
    ],
  },

  rooms: [
    {
      id: 'room-3-double',
      number: '01',
      name: 'Room 3 — En-Suite Double',
      type: 'Double Room',
      subtitle: 'First-floor en-suite bedroom with garden & hill outlook',
      capacity: '2 Guests',
      bedSetup: '1 Comfortable Double Bed',
      bathroom: 'Private En-Suite Shower Room',
      featuredImage: MAMBEG_MEDIA.rooms.room3Double,
      gallery: [
        MAMBEG_MEDIA.rooms.room3Double,
        MAMBEG_MEDIA.rooms.room3Ensuite,
        MAMBEG_MEDIA.property.lounge,
        MAMBEG_MEDIA.property.outlook,
      ],
      description:
        'A spacious and comfortable double bedroom equipped with a silent in-room refrigerator, complimentary light snacks, hospitality tea and coffee facilities, flat-screen television with DVD player, and a private en-suite shower room.',
      highlights: [
        'Private en-suite shower room',
        'Silent in-room refrigerator with light snack',
        'Tea & coffee making facilities',
        'Flat-screen TV with DVD library access',
      ],
      amenities: [
        'En-Suite Shower Room',
        'Silent In-Room Fridge',
        'Complimentary Tea & Coffee Tray',
        'Complimentary Light Snack',
        'Flat-Screen TV & DVD Player',
        'Free High-Speed Wi-Fi',
        'Fresh Towels & Toiletries',
        'Central Heating & Hairdryer',
      ],
      view: 'Peaceful garden and woodland setting',
      rateNote: 'Contact host David directly for seasonal rates & availability',
    },
    {
      id: 'loch-view-double',
      number: '02',
      name: 'Loch View Double Room',
      type: 'Double Room',
      subtitle: 'Elevated bedroom with outlook toward Gare Loch',
      capacity: '2 Guests',
      bedSetup: '1 Comfortable Double Bed',
      bathroom: 'Private En-Suite Bathroom',
      featuredImage: MAMBEG_MEDIA.property.outlook,
      gallery: [
        MAMBEG_MEDIA.property.outlook,
        MAMBEG_MEDIA.rooms.room3Double,
        MAMBEG_MEDIA.rooms.room3Ensuite,
        MAMBEG_MEDIA.property.lounge,
      ],
      description:
        'An inviting countryside double room offering an elevated outlook toward the calm waters of Gare Loch and the surrounding Argyll hills. Generously proportioned with comfortable bedding, private en-suite facilities, and countryside night stillness.',
      highlights: [
        'Scenic outlook toward Gare Loch & hills',
        'Private en-suite bathroom',
        'Tea and coffee making tray',
        'Television & DVD player',
      ],
      amenities: [
        'Private En-Suite Bathroom',
        'Scenic Gare Loch & Hill Outlook',
        'Complimentary Tea & Coffee Facilities',
        'Television & DVD Player',
        'Free High-Speed Wi-Fi',
        'Silent In-Room Fridge',
        'Comfortable Double Bed',
        'Wardrobe & Luggage Storage',
      ],
      view: 'Scenic outlook toward Gare Loch waters and hills',
      rateNote: 'Contact host David directly for seasonal rates & availability',
    },
    {
      id: 'family-suite',
      number: '03',
      name: 'Family Suite Accommodation',
      type: 'Family Suite',
      subtitle: 'Two connected bedrooms sleeping up to 4 guests',
      capacity: 'Up to 4 Guests',
      bedSetup: 'Two Connected Bedrooms (Double + Twin setup)',
      bathroom: 'Private En-Suite Bathroom',
      featuredImage: MAMBEG_MEDIA.rooms.room3Double,
      gallery: [
        MAMBEG_MEDIA.rooms.room3Double,
        MAMBEG_MEDIA.rooms.room3Ensuite,
        MAMBEG_MEDIA.property.lounge,
        MAMBEG_MEDIA.property.outlook,
      ],
      description:
        'A dedicated family-friendly option consisting of two connected bedrooms within the quiet guest wing to comfortably host parents and children or walking companions, with private en-suite facilities and full access to the residents lounge and gardens.',
      highlights: [
        'Accommodates up to 4 guests comfortably',
        'Two separate connected bedrooms',
        'Private en-suite bathroom facilities',
        'Full residents lounge access with microwave',
      ],
      amenities: [
        'Accommodates Up to 4 Guests',
        'Two Connected Bedrooms',
        'Private En-Suite Bathroom',
        'Silent Refrigerator in Room',
        'Tea & Coffee Hospitality Tray',
        'TV & DVD Player with Film Selection',
        'Residents Lounge Access with Microwave',
        'Free Wi-Fi & Ample Parking',
      ],
      view: 'Mature gardens and countryside grounds',
      rateNote: 'Contact host David directly for seasonal rates & availability',
    },
  ],

  highlights: [
    {
      title: 'Peace & Quiet',
      subtitle: 'Countryside Stillness',
      desc: 'Set back from the B833 amongst trees and lawn, away from noisy urban corridors and highway bustle.',
      icon: 'TreePine',
    },
    {
      title: 'A Personal Stay',
      subtitle: 'Owner-Operated Care',
      desc: 'A small, warm guest house hosted with personal attention, local recommendations, and thoughtful touches.',
      icon: 'Home',
    },
    {
      title: 'The Scottish Outdoors',
      subtitle: 'Springboard for Adventure',
      desc: 'Positioned right between Gare Loch, Loch Long, Loch Lomond, and the West Highland rail line.',
      icon: 'Compass',
    },
    {
      title: 'Room to Unwind',
      subtitle: 'Comfortable Common Areas',
      desc: 'A dedicated residents lounge with dining tables, microwave, cutlery, and an extensive DVD library.',
      icon: 'Coffee',
    },
  ],

  breakfast: {
    headline: 'Slow mornings start here.',
    subtitle: 'Hearty Scottish hospitality before heading out to the lochs',
    description:
      'Start your day with a freshly prepared Full Scottish Breakfast or continental morning options. In addition to morning breakfast, guests have continuous access to the dedicated residents lounge equipped with dining tables, chairs, a microwave, plates, cutlery, and glasses for heating light evening meals.',
    details: [
      'Full Scottish Breakfast prepared fresh to order',
      'Continental options, toast, preserves, and cereals',
      'Freshly brewed coffee and traditional breakfast teas',
      'Evening meal options may be arranged by advance request',
    ],
    loungeAmenities: [
      'Residents dining table & chairs',
      'Microwave oven for guest use',
      'Full set of plates, cutlery, and glassware',
      'Extensive DVD library and comfortable three-piece suite',
    ],
  },

  grounds: {
    headline: 'Surrounded by green.',
    subtitle: 'Quiet gardens, mature woodland, and coastal air',
    description:
      'The guest house sits within pleasant gardens framed by woodland, providing a natural buffer and a tranquil setting to unwind with a book or cup of tea after a day exploring the Scottish countryside.',
  },

  dayPace: [
    {
      time: '07:30',
      title: 'MORNING MIST OVER GARE LOCH',
      subtitle: 'Peaceful Scottish Dawn',
      description:
        'Wake to soft morning light filtering through the trees. Quiet birdsong and the calm waters of the sea loch just down the road.',
      image: MAMBEG_MEDIA.surroundings.mambegShore,
    },
    {
      time: '08:30',
      title: 'FRESH SCOTTISH BREAKFAST',
      subtitle: 'Served in the Residents Dining Area',
      description:
        'Enjoy a hot Full Scottish Breakfast or lighter continental breakfast with freshly brewed tea and coffee before your day begins.',
      image: MAMBEG_MEDIA.property.lounge,
    },
    {
      time: '10:30',
      title: 'EXPLORING THE LOCHS & GLENS',
      subtitle: 'Walking Trails & Coastlines',
      description:
        'Walk along the western shore of Gare Loch, explore the Rosneath peninsula, or catch a scenic train on the West Highland Line.',
      image: MAMBEG_MEDIA.surroundings.gareLoch,
    },
    {
      time: '14:30',
      title: 'DISCOVERING LOCAL HERITAGE',
      subtitle: 'Helensburgh & Mackintosh',
      description:
        'Visit Charles Rennie Mackintosh’s architectural masterpiece, The Hill House in Helensburgh, just a short 6-mile drive away.',
      image: MAMBEG_MEDIA.surroundings.hillHouse,
    },
    {
      time: '17:30',
      title: 'RETURNING TO MAMBEG',
      subtitle: 'Unwinding with Tea & Evening Views',
      description:
        'Step in from the fresh Scottish air, make a warm cup of tea, and relax in the residents lounge with a book, film, or quiet loch views.',
      image: MAMBEG_MEDIA.property.outlook,
    },
    {
      time: '21:00',
      title: 'COUNTRYSIDE STILLNESS',
      subtitle: 'Restful Night Sleep',
      description:
        'Clear dark skies and genuine quiet away from road noise. Comfortable beds ensure you wake refreshed and ready for tomorrow.',
      image: MAMBEG_MEDIA.rooms.room3Double,
    },
  ],

  attractions: [
    {
      id: 'gare-loch',
      title: 'Gare Loch & Rosneath Peninsula',
      category: 'Nature & Coastal Walks',
      distance: 'Adjacent (shore 200m)',
      description:
        'The sea loch immediately outside Mambeg offers peaceful waterside strolls, bracing coastal breezes, and panoramic vistas across to the Rosneath hills.',
      image: MAMBEG_MEDIA.surroundings.gareLoch,
      highlights: [
        'Waterfront walking trails along the B833',
        'Views across to the Cowal and Rosneath peninsulas',
        'Coastal birdwatching and marine scenery',
      ],
    },
    {
      id: 'garelochhead-station',
      title: 'Garelochhead Village & Railway Station',
      category: 'Transport & Village Life',
      distance: '1.2 miles (approx. 3 mins drive)',
      description:
        'The local village of Garelochhead features convenience stores, local pub, and a historic station on the world-renowned West Highland Line.',
      image: MAMBEG_MEDIA.surroundings.station,
      highlights: [
        'Direct train connections on the West Highland Line',
        'Local village amenities, post office & pub',
        'Starting point for regional walking routes',
      ],
    },
    {
      id: 'hill-house',
      title: 'The Hill House (Helensburgh)',
      category: 'Architecture & Culture',
      distance: '5.5 miles (approx. 12 mins drive)',
      description:
        'Charles Rennie Mackintosh’s celebrated architectural masterpiece, complete with iconic Arts and Crafts interiors, manicured gardens, and National Trust protection.',
      image: MAMBEG_MEDIA.surroundings.hillHouse,
      highlights: [
        'Internationally renowned Charles Rennie Mackintosh design',
        'Remarkable protective chainmail "Hill House Box"',
        'Elegant tearoom and landscaped gardens',
      ],
    },
    {
      id: 'loch-lomond',
      title: 'Loch Lomond & The Trossachs National Park',
      category: 'National Park & Hiking',
      distance: 'Approx. 10 miles (short scenic drive)',
      description:
        'Scotland’s premier national park is within easy reach, offering boat cruises on the loch, village stops at Luss and Balloch, and world-class Munro ascents.',
      image: MAMBEG_MEDIA.surroundings.b833Approach,
      highlights: [
        'Scenic cruises across the islands of Loch Lomond',
        'Hiking trails including Ben Lomond and Three Lochs Way',
        'Picturesque conservation villages like Luss',
      ],
    },
  ],

  gallery: [
    {
      id: 'm1',
      title: 'Scenic Outlook Toward Gare Loch',
      category: 'property',
      image: MAMBEG_MEDIA.property.outlook,
      caption: 'The tranquil sea loch and hill vista as seen from Mambeg House.',
      sourceNote: 'Authentic property photo (Airbnb Listing 28907596)',
      aspectRatio: 'landscape',
    },
    {
      id: 'm2',
      title: 'Room 3 Double Bedroom',
      category: 'property',
      image: MAMBEG_MEDIA.rooms.room3Double,
      caption: 'Comfortable double bed with in-room fridge, TV/DVD, and hospitality tray.',
      sourceNote: 'Authentic property photo (Airbnb Listing 28907596)',
      aspectRatio: 'landscape',
    },
    {
      id: 'm3',
      title: 'Room 3 En-Suite Shower Room',
      category: 'property',
      image: MAMBEG_MEDIA.rooms.room3Ensuite,
      caption: 'Clean, private en-suite shower room attached to Bedroom 3.',
      sourceNote: 'Authentic property photo (Airbnb Listing 28907596)',
      aspectRatio: 'portrait',
    },
    {
      id: 'm4',
      title: 'Residents Lounge & Dining Space',
      category: 'property',
      image: MAMBEG_MEDIA.property.lounge,
      caption: 'Residents lounge with dining table, chairs, microwave, crockery, and DVDs.',
      sourceNote: 'Authentic property photo (Airbnb Listing 28907596)',
      aspectRatio: 'landscape',
    },
    {
      id: 'm5',
      title: 'Upper Guest Landing',
      category: 'property',
      image: MAMBEG_MEDIA.property.landing,
      caption: 'Upper landing and corridor leading to private guest accommodation.',
      sourceNote: 'Authentic property photo (Airbnb Listing 28907596)',
      aspectRatio: 'portrait',
    },
    {
      id: 'm6',
      title: 'Interior Hallway & Staircase',
      category: 'property',
      image: MAMBEG_MEDIA.property.hallway,
      caption: 'Interior hallway and staircase within the guest house.',
      sourceNote: 'Authentic property photo (Airbnb Listing 28907596)',
      aspectRatio: 'portrait',
    },
    {
      id: 'm7',
      title: 'Rosneath Road (B833) at Mambeg',
      category: 'local-area',
      image: MAMBEG_MEDIA.surroundings.rosneathRoad,
      caption: 'Local Area: The countryside road connecting Garelochhead to Kilcreggan past Mambeg.',
      sourceNote: 'Local Area Photo: Thomas Nugent (Geograph Britain, CC-BY-SA 2.0)',
      aspectRatio: 'landscape',
    },
    {
      id: 'm8',
      title: 'View Across Gare Loch',
      category: 'local-area',
      image: MAMBEG_MEDIA.surroundings.gareLoch,
      caption: 'Local Area: The scenic sea loch waters and surrounding hills overlooking Mambeg.',
      sourceNote: 'Local Area Photo: Thomas Nugent (Geograph / Wikimedia, CC-BY-SA 2.0)',
      aspectRatio: 'landscape',
    },
    {
      id: 'm9',
      title: 'Garelochhead Railway Station',
      category: 'local-area',
      image: MAMBEG_MEDIA.surroundings.station,
      caption: 'Local Area: Historic station on the West Highland Line, just 1.2 miles away.',
      sourceNote: 'Local Area Photo: Nigel Corby (Wikimedia Commons, CC-BY-SA 2.0)',
      aspectRatio: 'landscape',
    },
    {
      id: 'm10',
      title: 'The Hill House, Helensburgh',
      category: 'local-area',
      image: MAMBEG_MEDIA.surroundings.hillHouse,
      caption: 'Local Area: Charles Rennie Mackintosh’s architectural landmark in Helensburgh (5.5 mi).',
      sourceNote: 'Local Area Photo: Wikimedia Commons (CC-BY-SA 3.0)',
      aspectRatio: 'landscape',
    },
  ],

  faqs: [
    {
      question: 'Where is Mambeg Country Guest House located?',
      answer:
        'The guest house is located on Rosneath Road (B833) in Mambeg, approximately 1.2 miles south of Garelochhead village and 6 miles from Helensburgh, in Argyll and Bute, Scotland (postcode G84 0EN).',
      category: 'arrival',
    },
    {
      question: 'What are the check-in and check-out times?',
      answer:
        'Standard check-in time is from 2:00 PM (14:00), and check-out is by 10:00 AM.',
      category: 'policies',
    },
    {
      question: 'Is parking available on site?',
      answer:
        'Yes. Mambeg Country Guest House provides a large dedicated private parking area with CCTV coverage, set comfortably back from the main road.',
      category: 'arrival',
    },
    {
      question: 'Is Wi-Fi provided?',
      answer:
        'Yes, complimentary high-speed Wi-Fi is available in all guest bedrooms and public areas.',
      category: 'rooms',
    },
    {
      question: 'What amenities are included in the guest rooms?',
      answer:
        'Rooms feature private en-suite bathrooms, silent in-room refrigerators, complimentary light snacks, tea and coffee making facilities, and flat-screen televisions with DVD players.',
      category: 'rooms',
    },
    {
      question: 'Is breakfast included?',
      answer:
        'Yes, guests enjoy a freshly prepared Full Scottish Breakfast and continental options. Guests also have access to the residents lounge equipped with a microwave, dining tables, plates, cutlery, and glasses.',
      category: 'dining',
    },
    {
      question: 'Can families be accommodated?',
      answer:
        'Yes. A family suite/apartment option is available consisting of two separate connected bedrooms that can accommodate up to 4 guests.',
      category: 'rooms',
    },
    {
      question: 'Are dogs or pets welcome?',
      answer:
        'Public listings indicate the guest house is dog-friendly by prior arrangement. Please mention your pet when submitting an enquiry so suitable arrangements can be confirmed.',
      category: 'policies',
    },
    {
      question: 'How do I check availability or make an enquiry?',
      answer:
        'You can use the direct enquiry form on this website, call +44 1436 810136, or email mambegcountryguesthouse@gmail.com.',
      category: 'arrival',
    },
  ],

  sentiment: {
    source: 'Tripadvisor Traveller Feedback',
    rating: '4.0 / 5.0 Rating',
    rank: 'Ranked #2 B&B in Garelochhead',
    summary:
      'Verified guest reviews consistently praise Mambeg Country Guest House for its friendly host (David), excellent Full Scottish Breakfast, spotless cleanliness, comfortable beds, and tranquil woodland location.',
    highlights: [
      'Frequently commended Full Scottish Breakfast',
      'Warm and attentive owner-hosted hospitality',
      'Quiet countryside sleep quality',
      'Comfortable rooms with en-suite facilities and thoughtful snacks',
    ],
  },
};


