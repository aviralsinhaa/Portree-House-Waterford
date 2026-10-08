/**
 * Intelligent Local Intent Engine & Conversational Memory for Mambeg Stay Assistant
 * 
 * Deterministic, reliable, privacy-preserving, and grounded strictly in verified Mambeg property facts.
 */

export interface AssistantAction {
  label: string;
  type?: 'booking' | 'phone' | 'prompt';
  prompt?: string;
  roomId?: string;
  guests?: number;
  notes?: string;
}

export interface AssistantResponse {
  intent: string;
  text: string;
  actions?: AssistantAction[];
  complexity: 'simple' | 'normal' | 'compound' | 'unknown';
}

export interface ConversationMemory {
  history: { query: string; intent: string; timestamp: number }[];
  lastIntent?: string;
  lastTopic?: string;
  lastRoomInterest?: string;
  guestCount?: number;
  travellingWithPet?: boolean;
}

// Global session memory
const sessionMemory: ConversationMemory = {
  history: [],
};

export function getSessionMemory(): ConversationMemory {
  return sessionMemory;
}

export function resetSessionMemory(): void {
  sessionMemory.history = [];
  sessionMemory.lastIntent = undefined;
  sessionMemory.lastTopic = undefined;
  sessionMemory.lastRoomInterest = undefined;
  sessionMemory.guestCount = undefined;
  sessionMemory.travellingWithPet = undefined;
}

/**
 * Normalises raw user input
 */
export function normalizeQuery(raw: string): string {
  let q = raw.toLowerCase().trim();

  // Normalize contractions and apostrophes
  q = q.replace(/['’]/g, '');

  // Normalize punctuation to spaces
  q = q.replace(/[,.?!;:—\-_/]/g, ' ');

  // Collapse multiple spaces
  q = q.replace(/\s+/g, ' ').trim();

  return q;
}

/**
 * Extract numbers of guests if present (e.g., "4 people", "2 guests")
 */
function extractGuestCount(q: string): number | undefined {
  const match = q.match(/\b(\d+)\s*(people|guests|adults|persons|person)?\b/);
  if (match) {
    const num = parseInt(match[1], 10);
    if (num > 0 && num <= 10) return num;
  }
  if (q.includes('four people') || q.includes('four guests') || q.includes('family of four')) return 4;
  if (q.includes('three people') || q.includes('three guests')) return 3;
  if (q.includes('two people') || q.includes('two guests') || q.includes('couple')) return 2;
  if (q.includes('one person') || q.includes('solo') || q.includes('single')) return 1;
  return undefined;
}

/**
 * Evaluate intent scores based on weighted keywords and phrases
 */
export function processAssistantQuery(
  rawQuery: string,
  contextRoomId?: string
): AssistantResponse {
  const q = normalizeQuery(rawQuery);
  const words = q.split(' ');

  // Track guest counts if mentioned
  const detectedGuests = extractGuestCount(q);
  if (detectedGuests) {
    sessionMemory.guestCount = detectedGuests;
  }

  // Track pet mention
  if (/\b(dog|dogs|pet|pets|puppy|hound)\b/.test(q)) {
    sessionMemory.travellingWithPet = true;
  }

  // 1. SPECIFIC CONTEXT ROOM INQUIRY
  if (contextRoomId && (q.includes('this room') || q.includes('current room') || q.includes('tell me more'))) {
    sessionMemory.lastIntent = 'SPECIFIC_ROOM';
    return {
      intent: 'SPECIFIC_ROOM',
      complexity: 'normal',
      text: `You are viewing Room 3 En-Suite Double. It features a private en-suite shower room, silent mini-fridge, hospitality tray with tea/coffee & biscuits, flat-screen TV/DVD, and views over the grounds. Fresh Scottish breakfast and private parking are included.`,
      actions: [
        { label: 'Enquire for Room 3', type: 'booking', roomId: 'room-3-ensuite-double' },
        { label: 'Breakfast details', type: 'prompt', prompt: 'Tell me about breakfast' },
      ],
    };
  }

  // 2. COMPOUND QUERIES (Multi-intent)
  const hasParking = /\b(parking|car park|park|parked|drive)\b/.test(q);
  const hasBreakfast = /\b(breakfast|food|eat|meal|meals|dining|morning meal)\b/.test(q);
  const hasPets = /\b(dog|dogs|pet|pets|puppy)\b/.test(q);
  const hasRooms = /\b(room|rooms|bedroom|bedrooms|stay|accommodation|bed|beds)\b/.test(q);
  const hasTrain = /\b(train|station|rail|railway|sleeper|west highland)\b/.test(q);
  const hasLocation = /\b(where|location|address|direction|directions|postcode|reach|find you|get there|getting there|travel to|how do i get)\b/.test(q);
  const hasContact = /\b(contact|phone|telephone|call|email|number|david)\b/.test(q);
  const hasPricing = /\b(price|pricing|cost|rate|rates|how much)\b/.test(q);
  const hasCheckTimes = /\b(checkin|check in|checkout|check out|arrive|depart|arrival time|departure time|leave)\b/.test(q);
  const hasWifi = /\b(wifi|wi fi|internet|broadband)\b/.test(q);

  // Compound: "parking and breakfast"
  if (hasParking && hasBreakfast) {
    sessionMemory.lastIntent = 'MULTI_PARKING_BREAKFAST';
    return {
      intent: 'MULTI_PARKING_BREAKFAST',
      complexity: 'compound',
      text: `Yes on both accounts:\n\n• Parking: Generous complimentary on-site parking is provided directly on the grounds, monitored by CCTV and set safely back from the road.\n• Breakfast: A freshly cooked Full Scottish Breakfast is prepared to order each morning, alongside continental choices, fruit, and fresh tea/coffee.\n\nBoth are included with your stay at Mambeg.`,
      actions: [
        { label: 'Check room choices', type: 'prompt', prompt: 'What rooms do you have?' },
        { label: 'Prepare stay enquiry', type: 'booking' },
      ],
    };
  }

  // Compound: "2 people with a dog" or guest count with dog
  if (hasPets && (detectedGuests || (q.includes('we are') && sessionMemory.guestCount) || q.includes('what should we do'))) {
    const guests = detectedGuests || sessionMemory.guestCount || 2;
    sessionMemory.lastIntent = 'MULTI_PETS_ROOMS';
    return {
      intent: 'MULTI_PETS_ROOMS',
      complexity: 'compound',
      text: `For a party of ${guests} travelling with a dog:\n\n• Accommodation: Room 3 En-Suite Double or the Loch View Double would work nicely, offering direct ground access through the guest wing.\n• Pet Policy: Dogs are welcomed by prior arrangement at Mambeg. We ask that you let host David know when booking so an appropriate room is allocated.\n\nWould you like to enquire for these arrangements?`,
      actions: [
        {
          label: 'Enquire for stay with dog',
          type: 'booking',
          guests,
          notes: `Travelling with a dog (${guests} guests) - please confirm pet policy arrangements.`,
        },
        { label: 'View Room 3 Double', type: 'prompt', prompt: 'Tell me about Room 3' },
      ],
    };
  }

  // 3. CONVERSATIONAL / SOCIAL INTENTS

  // Greetings: "hi", "hello", "hey"
  if (/^(hi|hello|hey|good morning|good evening|good afternoon)\b/.test(q) && words.length <= 4) {
    sessionMemory.lastIntent = 'GREETING';
    const greetings = [
      `Hello! Welcome to Mambeg Country Guest House. How can I assist with your stay plans, room details, breakfast, or directions today?`,
      `Good day! I'm here to help with questions about our rooms, Scottish breakfasts, parking, or travel along Gare Loch. What would you like to know?`,
      `Hello there. Welcome to Mambeg. Whether you're planning a visit or checking practical stay details, I'm glad to help.`,
    ];
    return {
      intent: 'GREETING',
      complexity: 'simple',
      text: greetings[Math.floor(Math.random() * greetings.length)],
      actions: [
        { label: 'Explore rooms', type: 'prompt', prompt: 'What rooms do you have?' },
        { label: 'Breakfast details', type: 'prompt', prompt: 'Is breakfast included?' },
        { label: 'Getting here', type: 'prompt', prompt: 'How do I get to Mambeg?' },
      ],
    };
  }

  // Identity: "who are you"
  if (q.includes('who are you') || q.includes('what are you') || q.includes('your name')) {
    sessionMemory.lastIntent = 'IDENTITY';
    return {
      intent: 'IDENTITY',
      complexity: 'simple',
      text: `I'm Mambeg's Stay Assistant — a digital guide to the guest house, our rooms, and the surrounding Garelochhead area. I'm here to help you check the practical details before you speak with host David or submit an enquiry.`,
      actions: [
        { label: 'Explore rooms', type: 'prompt', prompt: 'What rooms do you have?' },
        { label: 'Where is Mambeg?', type: 'prompt', prompt: 'Where is Mambeg located?' },
      ],
    };
  }

  // Are you real / AI check
  if (q.includes('are you real') || q.includes('are you human') || q.includes('are you a bot') || q.includes('are you ai')) {
    sessionMemory.lastIntent = 'ARE_YOU_REAL';
    return {
      intent: 'ARE_YOU_REAL',
      complexity: 'simple',
      text: `I'm a website stay assistant rather than a live member of staff. I use verified property details about Mambeg Country Guest House to give quick, accurate answers about rooms, breakfast, parking, and arrival. For bespoke personal requests, you can speak directly with host David.`,
      actions: [
        { label: 'Contact host David', type: 'phone' },
        { label: 'Send stay enquiry', type: 'booking' },
      ],
    };
  }

  // How are you
  if (q.includes('how are you') || q.includes('how are things') || q.includes('hows it going')) {
    sessionMemory.lastIntent = 'HOW_ARE_YOU';
    return {
      intent: 'HOW_ARE_YOU',
      complexity: 'simple',
      text: `I'm doing well — and ready to help with your visit. Are you looking at accommodation options, planning your travel to Garelochhead, or checking property amenities?`,
      actions: [
        { label: 'View rooms', type: 'prompt', prompt: 'What rooms do you have?' },
        { label: 'Explore local area', type: 'prompt', prompt: 'What can we do nearby?' },
      ],
    };
  }

  // Interesting fact
  if (q.includes('interesting') || q.includes('fun fact') || q.includes('trivia') || q.includes('tell me something')) {
    sessionMemory.lastIntent = 'INTERESTING';
    return {
      intent: 'INTERESTING',
      complexity: 'normal',
      text: `One of Mambeg's nicest advantages is its setting along the Rosneath Peninsula: it feels tucked quietly into the Argyll countryside with panoramic outlooks over Gare Loch, yet Garelochhead Railway Station on the world-famous West Highland Line is only 1.2 miles away.\n\nTrains from there run directly to Glasgow, Fort William, and Oban, making Mambeg a peaceful base for exploring Scotland by rail.`,
      actions: [
        { label: 'West Highland Line info', type: 'prompt', prompt: 'Can I come by train?' },
        { label: 'View rooms', type: 'prompt', prompt: 'What rooms do you have?' },
      ],
    };
  }

  // Humor / mythical
  if (q.includes('dragon') || q.includes('unicorn') || q.includes('dinosaur')) {
    sessionMemory.lastIntent = 'MYTHICAL';
    return {
      intent: 'MYTHICAL',
      complexity: 'simple',
      text: `I don't have a dragon policy on record 😄. Mambeg is listed as pet-friendly for dogs by prior arrangement, but for anything mythical I would definitely confirm directly with host David first!`,
      actions: [
        { label: 'Dog policy', type: 'prompt', prompt: 'Can I bring a dog?' },
        { label: 'Contact property', type: 'phone' },
      ],
    };
  }

  // Weather: Notice word boundary \brain\b so train does NOT match!
  if (/\b(weather|forecast|rain|sunny|temperature)\b/.test(q)) {
    sessionMemory.lastIntent = 'WEATHER';
    return {
      intent: 'WEATHER',
      complexity: 'simple',
      text: `I don't have live weather sensors connected here. For current conditions across Garelochhead and Argyll, I'd recommend checking the Met Office forecast before your trip. The Scottish scenery over Gare Loch is atmospheric in all seasons!`,
      actions: [
        { label: 'Directions & Arrival', type: 'prompt', prompt: 'Where is Mambeg located?' },
        { label: 'View rooms', type: 'prompt', prompt: 'What rooms do you have?' },
      ],
    };
  }

  // Thanks
  if (/\b(thanks|thank you|cheers|appreciate)\b/.test(q)) {
    sessionMemory.lastIntent = 'THANKS';
    return {
      intent: 'THANKS',
      complexity: 'simple',
      text: `You're very welcome! Let me know if you need any other information for your stay, or feel free to prepare an enquiry when you have dates in mind.`,
      actions: [
        { label: 'Prepare stay enquiry', type: 'booking' },
        { label: 'Explore local sights', type: 'prompt', prompt: 'What can we do nearby?' },
      ],
    };
  }

  // Goodbye
  if (/\b(bye|goodbye|see you|farewell)\b/.test(q)) {
    sessionMemory.lastIntent = 'GOODBYE';
    return {
      intent: 'GOODBYE',
      complexity: 'simple',
      text: `Safe travels! If you have any further questions before your Scottish break, feel free to return anytime. We hope to welcome you to Mambeg.`,
    };
  }

  // 4. SPECIFIC TOPIC INTENTS (Prioritized over general guest count fallback)

  // Train / Station
  if (hasTrain) {
    sessionMemory.lastIntent = 'TRAIN';
    sessionMemory.lastTopic = 'travel';
    return {
      intent: 'TRAIN',
      complexity: 'normal',
      text: `Garelochhead Railway Station is just 1.2 miles from Mambeg (a 3-minute drive or scenic countryside walk). It sits on the world-renowned West Highland Line, with direct trains to Glasgow Queen Street, Oban, Fort William, and Mallaig, as well as the London Euston Caledonian Sleeper service.\n\nLocal bus 316 also connects Garelochhead with Helensburgh along the B833.`,
      actions: [
        { label: 'Road directions', type: 'prompt', prompt: 'How do I get to Mambeg?' },
        { label: 'Check rooms', type: 'prompt', prompt: 'What rooms do you have?' },
      ],
    };
  }

  // Breakfast
  if (hasBreakfast) {
    sessionMemory.lastIntent = 'BREAKFAST';
    sessionMemory.lastTopic = 'dining';
    return {
      intent: 'BREAKFAST',
      complexity: 'normal',
      text: `Every morning begins with a freshly cooked Full Scottish Breakfast prepared to order, alongside porridge, cereals, toast, fruit, juices, and freshly brewed coffee and tea.\n\nGuests also enjoy 24/7 access to our dedicated Residents Lounge, which features dining tables, chairs, a microwave, plates, glasses, and cutlery, making it easy to enjoy a takeaway meal in the evening.`,
      actions: [
        { label: 'Ask about rooms', type: 'prompt', prompt: 'What rooms do you have?' },
        { label: 'Enquire about dates', type: 'booking' },
      ],
    };
  }

  // Parking
  if (hasParking) {
    sessionMemory.lastIntent = 'PARKING';
    sessionMemory.lastTopic = 'amenities';
    return {
      intent: 'PARKING',
      complexity: 'simple',
      text: `Parking at Mambeg is straightforward and complimentary. We have generous private on-site parking directly on the property grounds, set comfortably back from Rosneath Road and monitored by CCTV. There is ample room for cars, estates, and SUVs, and no advance reservation is needed.`,
      actions: [
        { label: 'Where is Mambeg?', type: 'prompt', prompt: 'Where is Mambeg located?' },
        { label: 'Check room choices', type: 'prompt', prompt: 'What rooms do you have?' },
      ],
    };
  }

  // Wi-Fi
  if (hasWifi) {
    sessionMemory.lastIntent = 'WIFI';
    return {
      intent: 'WIFI',
      complexity: 'simple',
      text: `Yes, complimentary high-speed Wi-Fi is available throughout all guest bedrooms, hallways, and the residents lounge. Network connection details are provided in your room guide on arrival.`,
      actions: [
        { label: 'Ask about rooms', type: 'prompt', prompt: 'What rooms do you have?' },
      ],
    };
  }

  // Pets / Dogs
  if (hasPets) {
    sessionMemory.lastIntent = 'PETS';
    sessionMemory.lastTopic = 'policies';
    return {
      intent: 'PETS',
      complexity: 'normal',
      text: `Mambeg Country Guest House is dog-friendly by prior arrangement. We kindly request that you mention your dog when submitting your enquiry or speaking with host David, so we can prepare an appropriate ground-accessible room and grounds setup.`,
      actions: [
        {
          label: 'Enquire with dog',
          type: 'booking',
          notes: 'Travelling with a dog - please confirm pet policy arrangements.',
        },
        { label: 'Grounds & garden info', type: 'prompt', prompt: 'What are the grounds and garden like?' },
      ],
    };
  }

  // Location / Address / Directions
  if (hasLocation) {
    sessionMemory.lastIntent = 'LOCATION';
    sessionMemory.lastTopic = 'travel';
    return {
      intent: 'LOCATION',
      complexity: 'normal',
      text: `Mambeg Country Guest House is located on Rosneath Road (B833) in the coastal hamlet of Mambeg, Scotland (G84 0EN).\n\nWe sit on the eastern shore of the Rosneath peninsula overlooking Gare Loch, approximately 1.2 miles south of Garelochhead village and 6 miles west of Helensburgh. Look for the white "Mambeg House" signs at the foot of our private driveway.`,
      actions: [
        { label: 'Train station info', type: 'prompt', prompt: 'Can I come by train?' },
        { label: 'Parking on site', type: 'prompt', prompt: 'Is parking available?' },
      ],
    };
  }

  // Check-in / Check-out times
  if (hasCheckTimes) {
    sessionMemory.lastIntent = 'CHECK_TIMES';
    sessionMemory.lastTopic = 'policies';
    return {
      intent: 'CHECK_TIMES',
      complexity: 'simple',
      text: `Standard check-in is between 2:00 PM (14:00) and 9:00 PM. Check-out on your departure morning is by 10:00 AM.\n\nIf you anticipate an earlier arrival or a later train arriving at Garelochhead station, please let host David know in advance so arrangements can be coordinated.`,
      actions: [
        { label: 'Contact host David', type: 'phone' },
        { label: 'Prepare stay enquiry', type: 'booking' },
      ],
    };
  }

  // Pricing / Rates
  if (hasPricing) {
    sessionMemory.lastIntent = 'PRICING';
    sessionMemory.lastTopic = 'booking';
    return {
      intent: 'PRICING',
      complexity: 'normal',
      text: `Rates and exact availability are confirmed directly by the property based on the season, room type, and length of stay. Because Mambeg is an independent guest house, you receive direct personal rates with no online third-party commissions.\n\nYou can submit an enquiry with your preferred dates, or call host David directly.`,
      actions: [
        { label: 'Prepare stay enquiry', type: 'booking' },
        { label: 'Call +44 1436 810136', type: 'phone' },
      ],
    };
  }

  // Contact / Phone / Email
  if (hasContact) {
    sessionMemory.lastIntent = 'CONTACT';
    return {
      intent: 'CONTACT',
      complexity: 'simple',
      text: `You can reach Mambeg Country Guest House directly:\n\n• Host: David\n• Telephone: +44 1436 810136\n• Email: mambegcountryguesthouse@gmail.com\n• Address: Rosneath Road, Mambeg, Garelochhead, Helensburgh, Argyll, G84 0EN, Scotland`,
      actions: [
        { label: 'Call +44 1436 810136', type: 'phone' },
        { label: 'Prepare stay enquiry', type: 'booking' },
      ],
    };
  }

  // Availability / Dates
  if (/\b(availab|tomorrow|dates|book|reserve)\b/.test(q)) {
    sessionMemory.lastIntent = 'AVAILABILITY';
    sessionMemory.lastTopic = 'booking';
    return {
      intent: 'AVAILABILITY',
      complexity: 'normal',
      text: `Date availability is managed directly with host David. You can send a direct stay enquiry right here on the website with your dates and party size, or call the property directly on +44 1436 810136. David responds promptly with confirmed room options.`,
      actions: [
        { label: 'Prepare stay enquiry', type: 'booking' },
        { label: 'Call host David', type: 'phone' },
      ],
    };
  }

  // Local attractions / things to do
  if (/\b(nearby|attraction|attractions|explore|things to do|hill house|lomond|cobbler|walk|hike)\b/.test(q)) {
    sessionMemory.lastIntent = 'AREA';
    return {
      intent: 'AREA',
      complexity: 'normal',
      text: `Highlights in our immediate area include:\n\n• The Hill House: Charles Rennie Mackintosh's world-famous masterwork in Helensburgh (15 mins)\n• Loch Lomond & The Trossachs: Luss and scenic loch shores (20 mins)\n• Arrochar Alps & The Cobbler: Celebrated mountain hiking routes (20 mins)\n• Gare Loch foreshore: Peaceful walks along the quiet Rosneath Peninsula road\n• Kilcreggan Ferry: Passenger ferry crossing the Clyde to Gourock`,
      actions: [
        { label: 'Getting here info', type: 'prompt', prompt: 'Where is Mambeg located?' },
        { label: 'Check room choices', type: 'prompt', prompt: 'What rooms do you have?' },
      ],
    };
  }

  // Amenities / Garden / Grounds
  if (/\b(amenities|amenity|garden|grounds|picnic|games|bbq|lounge)\b/.test(q)) {
    sessionMemory.lastIntent = 'AMENITIES';
    return {
      intent: 'AMENITIES',
      complexity: 'normal',
      text: `Mambeg includes a range of relaxed guest facilities:\n\n• Country garden grounds and picnic area with outdoor furniture overlooking the loch\n• Dedicated Residents Lounge with dining tables, chairs, and loch views\n• Microwave, plates, glasses, and cutlery for guest use\n• Board games, puzzles, and extensive book & DVD collection\n• Free Wi-Fi & private CCTV-monitored parking`,
      actions: [
        { label: 'Check room choices', type: 'prompt', prompt: 'What rooms do you have?' },
        { label: 'Prepare stay enquiry', type: 'booking' },
      ],
    };
  }

  // Specific Room 3
  if (q.includes('room 3') || q.includes('room3') || q.includes('ensuite double')) {
    sessionMemory.lastIntent = 'ROOM_3';
    sessionMemory.lastTopic = 'rooms';
    return {
      intent: 'ROOM_3',
      complexity: 'normal',
      text: `Room 3 is a comfortable En-Suite Double Bedroom in the quiet guest wing. It features:\n\n• Double bed with reading lamps\n• Private en-suite shower room with Scottish toiletries\n• Silent mini-fridge & hospitality tray with tea/coffee\n• Flat-screen TV with DVD player\n• Free Wi-Fi and parking included`,
      actions: [
        { label: 'Enquire for Room 3', type: 'booking', roomId: 'room-3-ensuite-double' },
        { label: 'View all room options', type: 'prompt', prompt: 'What rooms do you have?' },
      ],
    };
  }

  // Specific Family Room or Party Size query (explicit)
  if (q.includes('family') || q.includes('4 people') || q.includes('four people') || q.includes('children') || q.includes('kids') || (q.includes('work for us') && sessionMemory.guestCount && sessionMemory.guestCount >= 3)) {
    sessionMemory.lastIntent = 'FAMILY';
    sessionMemory.lastTopic = 'rooms';
    const count = sessionMemory.guestCount || 4;
    return {
      intent: 'FAMILY',
      complexity: 'normal',
      text: `For a party of ${count}, Mambeg offers an interconnected Family Suite featuring two connected bedrooms. It includes private en-suite facilities, silent fridge, and hospitality trays.\n\nFamilies also appreciate our residents lounge with children's books, DVDs, board games, and microwave facilities, as well as the garden picnic area.`,
      actions: [
        {
          label: 'Enquire for Family Suite',
          type: 'booking',
          roomId: 'room-family-suite',
          guests: count,
          notes: `Enquiry for Family Suite accommodation (${count} guests).`,
        },
        { label: 'Ask about breakfast', type: 'prompt', prompt: 'What is included for breakfast?' },
      ],
    };
  }

  // General Rooms & Accommodation inquiry
  if (hasRooms || q.includes('what would work') || q.includes('options')) {
    sessionMemory.lastIntent = 'ROOMS';
    sessionMemory.lastTopic = 'rooms';
    const guestNote = sessionMemory.guestCount ? ` For your party of ${sessionMemory.guestCount}:` : '';
    return {
      intent: 'ROOMS',
      complexity: 'normal',
      text: `Mambeg Country Guest House offers approximately four private en-suite guest rooms, each accessed from a dedicated guest wing:${guestNote}\n\n• Room 3 En-Suite Double: Double bed, private shower room, silent fridge, TV/DVD, tea/coffee.\n• Loch View Double Room: Peaceful bedroom with commanding outlook toward Gare Loch.\n• Twin Bedroom: Two comfortable single beds for companions.\n• Family Suite: Interconnected two-bedroom setup sleeping up to 4 guests.\n\nAll stays include freshly cooked Scottish breakfast and private parking.`,
      actions: [
        { label: 'Tell me about Room 3', type: 'prompt', prompt: 'Tell me about Room 3' },
        { label: 'Family Suite details', type: 'prompt', prompt: 'Do you have family rooms?' },
        { label: 'Prepare stay enquiry', type: 'booking', guests: sessionMemory.guestCount || 2 },
      ],
    };
  }

  // 5. RICH UNKNOWN / FALLBACK
  sessionMemory.lastIntent = 'UNKNOWN';
  return {
    intent: 'UNKNOWN',
    complexity: 'unknown',
    text: `I may have missed that specific detail. Try asking me about our rooms, Full Scottish breakfast, on-site parking, dog-friendly policy, directions from Garelochhead station, or how to prepare a stay enquiry.`,
    actions: [
      { label: 'Room options', type: 'prompt', prompt: 'What rooms do you have?' },
      { label: 'Cooked breakfast', type: 'prompt', prompt: 'Is breakfast included?' },
      { label: 'Parking & arrival', type: 'prompt', prompt: 'Where is Mambeg and is parking free?' },
    ],
  };
}
