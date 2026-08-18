export interface CoupleProfile {
  groom: {
    name: string;
    fullName: string;
    title: string;
    parents: string;
    bio: string;
    image: string;
  };
  bride: {
    name: string;
    fullName: string;
    title: string;
    parents: string;
    bio: string;
    image: string;
  };
  familyTitle: string;
  weddingDate: string; // ISO string
  weddingTime: string;
  timezone: string;
  biblicalVerse: {
    quote: string;
    reference: string;
  };
  secondaryVerse?: {
    quote: string;
    reference: string;
  };
}

export interface VenueDetail {
  name: string;
  hallName: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  pincode: string;
  googleMapsUrl: string;
  embedMapUrl: string;
  latitude: number;
  longitude: number;
  contactNumber: string;
  amenities: string[];
  landmarks: string[];
  travelTips: {
    byAir: string;
    byTrain: string;
    byRoad: string;
  };
}

export interface WeddingEvent {
  id: string;
  title: string;
  teluguTitle?: string;
  date: string;
  time: string;
  formattedDateTime: string;
  venue: string;
  dressCode: string;
  description: string;
  icon: string;
  color: string;
}

export interface PhotoItem {
  id: string;
  title: string;
  category: 'portrait' | 'couple' | 'moments' | 'family' | 'guest' | string;
  imageUrl: string;
  caption: string;
  isCustom?: boolean;
}

export interface BlessingNote {
  id: string;
  name: string;
  city?: string;
  message: string;
  timestamp: string;
  likes: number;
  isUserAdded?: boolean;
}

export interface LeaderboardPlayer {
  id: string;
  name: string;
  phone: string;
  score: number;
  team: 'moshe' | 'priya';
  gamesPlayed: number;
  lastPlayed: string;
}


