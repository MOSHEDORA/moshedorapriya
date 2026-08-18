import { CoupleProfile, VenueDetail, WeddingEvent, PhotoItem, BlessingNote } from '../types';

export const weddingInfo: CoupleProfile = {
  groom: {
    name: "Moshe Dora",
    fullName: "Velnati Moshe Dora",
    title: "The Groom",
    parents: "Son of Velnati Family",
    bio: "Walking in faith, devotion, and gratitude, blessed to unite in holy matrimony with his beloved Priya under God's divine grace.",
    image: "/assets/GROOM.png"
  },
  bride: {
    name: "Priya",
    fullName: "Nelluri Priya",
    title: "The Bride",
    parents: "Daughter of Nelluri Family",
    bio: "Radiant in grace, humility, and Christian virtues, daughter of the Nelluri family, stepping joyfully into this sacred matrimonial covenant.",
    image: "/assets/BRIDE.jpg"
  },
  familyTitle: "Velnati & Nelluri Families' Royal Wedding Invitation",
  weddingDate: "2026-09-03T10:00:00+05:30",
  weddingTime: "10:00 AM IST",
  timezone: "Asia/Kolkata",
  biblicalVerse: {
    quote: "Jesus and His disciples had also been invited to the wedding.",
    reference: "John 2:2"
  },
  secondaryVerse: {
    quote: "Two are better than one... A cord of three strands is not quickly broken.",
    reference: "Ecclesiastes 4:9,12"
  }
};

export const defaultPhotos: PhotoItem[] = [
  {
    id: "photo-1",
    title: "Royal Couple — Moshe Dora & Priya",
    category: "couple",
    imageUrl: "/assets/DSC04710.JPG",
    caption: "Velnati Moshe Dora & Nelluri Priya — United in Sacred Matrimony under God's Grace."
  },
  {
    id: "photo-2",
    title: "The Groom — Velnati Moshe Dora",
    category: "portrait",
    imageUrl: "/assets/GROOM.png",
    caption: "Son of Velnati Family, joyfully awaiting this divine milestone."
  },
  {
    id: "photo-3",
    title: "The Bride — Nelluri Priya",
    category: "portrait",
    imageUrl: "/assets/BRIDE.jpg",
    caption: "Daughter of Nelluri Family, adorned in grace, humility, and devotion."
  },
  {
    id: "photo-4",
    title: "Sacred Celebration & Joy",
    category: "moments",
    imageUrl: "/assets/DSC04721.JPG",
    caption: "Joyous celebration and blessed moments shared with family and loved ones."
  },
  {
    id: "photo-5",
    title: "Holy Covenant & Fellowship",
    category: "moments",
    imageUrl: "/assets/DSC04767.JPG",
    caption: "A cord of three strands is not quickly broken — Ecclesiastes 4:12."
  }
];

export const venueInfo: VenueDetail = {
  name: "Vedika Function Hall",
  hallName: "Grand Central AC Auditorium & Dining Hall",
  addressLine1: "Main Road, Near Town Center",
  addressLine2: "Yeleswaram Mandal",
  city: "Yeleswaram",
  state: "Andhra Pradesh",
  pincode: "533429",
  googleMapsUrl: "https://maps.app.goo.gl/gLeSdH2zKB5729Lb6",
  embedMapUrl: "https://maps.google.com/maps?q=Vedika+Function+Hall+Yeleswaram&t=&z=14&ie=UTF8&iwloc=&output=embed",
  latitude: 17.2831,
  longitude: 82.0401,
  contactNumber: "+91 98480 22334",
  amenities: [
    "Fully Air-Conditioned Grand Auditorium (1000+ Capacity)",
    "Spacious Dining Hall & Food Service Area",
    "Dedicated Valet & Vehicle Parking (200+ Cars)",
    "Deluxe Bridal & Groom AC Green Rooms",
    "Modern Acoustic Stage & Lighting System",
    "Elderly & Wheelchair Accessible Facilities"
  ],
  landmarks: [
    "Near Yeleswaram Bus Complex (0.8 km)",
    "Yeleru Reservoir Canal Viewpoint (2.5 km)",
    "Samalkot Junction to Yeleswaram Highway Road"
  ],
  travelTips: {
    byAir: "Rajahmundry Airport (RJA) is ~62 km away. Visakhapatnam Airport (VTZ) is ~130 km away.",
    byTrain: "Nearest Railway Stations: Samalkot Junction (SLO) - 32 km, Tuni (TUNI) - 38 km, Kakinada Town (CCT) - 45 km.",
    byRoad: "Easily accessible from NH-16 (Kathipudi / Prathipadu junction) with direct highway connectivity into Yeleswaram."
  }
};

export const weddingEvents: WeddingEvent[] = [
  {
    id: "event-1",
    title: "Holy Matrimony & Sacred Service",
    teluguTitle: "పరిశుద్ధ వివాహ మహోత్సవం",
    date: "September 03, 2026",
    time: "10:00 AM – 11:30 AM IST",
    formattedDateTime: "Thursday, Sep 3, 2026 at 10:00 AM",
    venue: "Main Sacred Sanctuary Stage, Vedika Function Hall",
    dressCode: "Traditional Royal / Elegant Formal Attire",
    description: "Sacred Christian marriage ceremony with worship, scripture readings, exchange of holy vows, wedding rings, and pastoral benediction.",
    icon: "Church",
    color: "#0F3D32"
  },
  {
    id: "event-2",
    title: "Pastoral Benediction & Garland Ceremony",
    teluguTitle: "ఆశీర్వాద ప్రార్థన & పూలమాలల మార్పిడి",
    date: "September 03, 2026",
    time: "11:30 AM – 12:30 PM IST",
    formattedDateTime: "Thursday, Sep 3, 2026 at 11:30 AM",
    venue: "Main Sacred Sanctuary Stage, Vedika Function Hall",
    dressCode: "Traditional Royal Attire",
    description: "Anointed pastoral prayers, garlanding of the newlyweds, family blessings, and congregational thanksgiving.",
    icon: "Sparkles",
    color: "#C59B27"
  },
  {
    id: "event-3",
    title: "Grand Royal Feast & Reception",
    teluguTitle: "రాయల్ విందు & అభినందన సభ",
    date: "September 03, 2026",
    time: "12:45 PM Onwards",
    formattedDateTime: "Thursday, Sep 3, 2026 at 12:45 PM",
    venue: "Grand Banquet & Dining Hall, Vedika Function Hall",
    dressCode: "Festive Grand Attire",
    description: "Join Velnati & Nelluri families for a sumptuous traditional Andhra wedding banquet, cake cutting, congratulations, and photo session.",
    icon: "UtensilsCrossed",
    color: "#5E1626"
  }
];

// Starts clean with no fake dummy comments
export const initialBlessings: BlessingNote[] = [];

