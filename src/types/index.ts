export interface GuestRoom {
  id: string;
  number: string;
  name: string;
  type: string;
  subtitle: string;
  capacity: string;
  bedSetup: string;
  bathroom: string;
  featuredImage: string;
  gallery: string[];
  description: string;
  highlights: string[];
  amenities: string[];
  view: string;
  rateNote: string;
}

export interface DayMoment {
  time: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

export interface LocalAttraction {
  id: string;
  title: string;
  category: string;
  distance: string;
  description: string;
  image: string;
  highlights: string[];
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'property' | 'local-area' | 'house' | 'rooms' | 'grounds' | 'area';
  image: string;
  caption: string;
  sourceNote: string;
  aspectRatio: 'landscape' | 'portrait' | 'square';
}

export interface PracticalFAQ {
  question: string;
  answer: string;
  category: 'arrival' | 'rooms' | 'dining' | 'policies';
}

export interface MambegConfig {
  name: string;
  subname: string;
  tagline: string;
  area: string;
  region: string;
  country: string;
  postcode: string;
  address: string;
  phone: string;
  email: string;
  host: string;
  checkIn: string;
  checkOut: string;
  parking: string;
  wifi: string;
  roomsCount: number;
  hero: {
    title: string;
    headline: string;
    subheadline: string;
    image: string;
    primaryCta: string;
    secondaryCta: string;
  };
  story: {
    headline: string;
    subheading: string;
    paragraphs: string[];
    features: { title: string; desc: string }[];
  };
  rooms: GuestRoom[];
  highlights: { title: string; subtitle: string; desc: string; icon: string }[];
  breakfast: {
    headline: string;
    subtitle: string;
    description: string;
    details: string[];
    loungeAmenities: string[];
  };
  grounds: {
    headline: string;
    subtitle: string;
    description: string;
  };
  dayPace: DayMoment[];
  attractions: LocalAttraction[];
  gallery: GalleryItem[];
  faqs: PracticalFAQ[];
  sentiment: {
    source: string;
    rating: string;
    rank: string;
    summary: string;
    highlights: string[];
  };
}
