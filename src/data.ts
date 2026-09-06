import { CONFIG } from "./config";

export type Page = "home" | "properties" | "services" | "about" | "contact";

export interface Prefill {
  property: string;
  message: string;
  ts: number;
}

export type LocationName = "Iloilo" | "Tagaytay" | "Cavite" | "Antipolo" | "Binondo";

export const LOCATIONS: LocationName[] = ["Iloilo", "Tagaytay", "Cavite", "Antipolo", "Binondo"];

export interface Property {
  id: string;
  name: string;
  location: LocationName;
  area: string;
  type: string;
  badge: string;
  beds: number;
  baths: number;
  parking: number;
  sqm: number;
  lotNote?: string;
  price: number;
  priceNote?: string;
  priceLabel?: string;
  img: string;
  gallery?: string[];
  tagline: string;
  highlights?: string[];
  videoUrl?: string;
  videoId?: string;
  developer?: string;
}

const u = (id: string, w = 1000) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export const FEATURED_ID = "ongpin-tower";

export const PROPERTIES: Property[] = [
  {
    id: FEATURED_ID,
    name: "The Ongpin Tower",
    location: "Binondo",
    area: "Ongpin St., Binondo, Manila",
    type: "Luxury High-Rise Condominium",
    badge: "Featured",
    beds: 3,
    baths: 3,
    parking: 2,
    sqm: 155.55,
    lotNote: "57 Storeys · 2–5 Bedrooms · 99–480 sqm",
    price: 18_800_000,
    priceLabel: "Price starts at",
    priceNote: "Residences, Estates & Penthouses available upon inquiry.",
    img: "/assets/img/ongpin-tower-video.jpg",
    gallery: [
      "/assets/img/ongpin-tower-video.jpg",
      "/assets/img/ongpin-tower-render.png",
      "/assets/img/ongpin-tower-bg.jpg",
    ],
    videoUrl: "https://www.youtube.com/watch?v=WDHA59pcW4Y&t=5s",
    videoId: "WDHA59pcW4Y",
    developer: "Keen and Worth Property Developers, Inc.",
    tagline: "A sustainable home for generations in the heart of historic Chinatown — where rich heritage meets contemporary luxury living.",
    highlights: [
      "Heart of the world's oldest Chinatown (Binondo, Manila)",
      "Walking distance to Arranque Market, Binondo Church & Lucky Chinatown Mall",
      "Spacious residences (99–155 sqm), estates (205–243 sqm) & penthouses (461–480 sqm)",
      "Family-oriented amenities: gardens, playgrounds, sports club & rooftop recreation patios",
      "Sustainable eco-conscious development by Keen and Worth Property Developers",
    ],
  },
  {
    id: "pine-deluxe",
    name: "Pine Deluxe at Emerald Estate",
    location: "Iloilo",
    area: "Brgy. Cagbang, Oton, Iloilo",
    type: "House & Lot / Residential",
    badge: "Available",
    beds: 4,
    baths: 3,
    parking: 2,
    sqm: 90,
    lotNote: "100 sqm lot · 90 sqm floor area",
    price: 18516.86,
    priceLabel: "Monthly amortization starts at",
    priceNote: "4 Bedrooms · 3 T&B · 2-Car Carport · Balcony & Open-Plan Concept",
    img: "/assets/img/pine/pine_01.jpg",
    gallery: [
      "/assets/img/pine/pine_01.jpg",
      "/assets/img/pine/pine_19.jpg",
      "/assets/img/pine/pine_18.jpg",
      "/assets/img/pine/pine_02.jpg",
      "/assets/img/pine/pine_05.jpg",
      "/assets/img/pine/pine_03.jpg",
      "/assets/img/pine/pine_04.jpg",
      "/assets/img/pine/pine_07.jpg",
      "/assets/img/pine/pine_10.jpg",
      "/assets/img/pine/pine_17.jpg",
      "/assets/img/pine/pine_13.jpg",
      "/assets/img/pine/pine_06.jpg",
      "/assets/img/pine/pine_14.jpg",
      "/assets/img/pine/pine_15.jpg",
      "/assets/img/pine/pine_16.jpg",
      "/assets/img/pine/pine_08.jpg",
      "/assets/img/pine/pine_09.jpg",
      "/assets/img/pine/pine_11.jpg",
      "/assets/img/pine/pine_12.jpg",
    ],
    tagline: "Two-storey modern home featuring 4 bedrooms, 3 toilets and baths, 2-car carport provision, high ceilings, open-plan living, and balcony provision in Emerald Estates.",
    highlights: [
      "4 spacious bedrooms with balcony provision",
      "3 complete toilets and baths",
      "Carport provision for up to 2 vehicles (sedan & SUV)",
      "Open-plan living, dining, and modern kitchen concept",
      "High ceilings (approx. 9.5 ft) for natural cooling & airflow",
      "Approx. 90 sqm floor area on approx. 100 sqm lot",
      "Gated community in Brgy. Cagbang, Oton with 24/7 security, clubhouse & pool",
    ],
  },
  {
    id: "jaro-house",
    name: "House for Sale in Jaro, Iloilo City",
    location: "Iloilo",
    area: "Jaro, Iloilo City",
    type: "House / Residential",
    badge: "Available",
    beds: 3,
    baths: 2,
    parking: 1,
    sqm: 140,
    lotNote: "Two-storey · Carport · Balcony",
    price: 37921.82,
    priceLabel: "Monthly amortization",
    priceNote: "Monthly amortization as published on the official material.",
    img: "/assets/img/jaro-house-exterior.jpg",
    gallery: [
      "/assets/img/jaro-house-exterior.jpg",
      "/assets/img/flyer-house-for-sale.jpg",
    ],
    tagline: "Spacious living room, modern kitchen, dining area, three bedrooms, two toilet & bath and a carport.",
    highlights: [
      "Spacious living room & modern kitchen",
      "3 Bedrooms & 2 Toilet and Bath",
      "Private balcony with neighborhood views",
      "Covered driveway & secure gate",
    ],
  },
  {
    id: "samantha-welford",
    name: "Samantha House Model at Welford Estate",
    location: "Iloilo",
    area: "Jaro, Iloilo City",
    type: "Single Detached 2-Storey House & Lot",
    badge: "Available",
    beds: 4,
    baths: 3,
    parking: 1,
    sqm: 84,
    lotNote: "120 sqm lot · 84 sqm floor area",
    price: 4_800_000,
    priceLabel: "Price starts at",
    priceNote: "4 Bedrooms · 3 T&B · Paved Carport · Balcony & Maid's Room",
    img: "/assets/img/samantha/samantha-actual-facade.jpg",
    gallery: [
      "/assets/img/samantha/samantha-actual-facade.jpg",
      "/assets/img/samantha/samantha-model-unit.jpg",
      "/assets/img/samantha/samantha-floor-plans-complete.png",
      "/assets/img/samantha/floor-plan-ground.png",
      "/assets/img/samantha/floor-plan-second.png",
    ],
    tagline: "Two-storey modern residence with 4 spacious bedrooms, 3 toilet & baths, paved carport, maid's room, storage, and private balcony in Jaro, Iloilo City.",
    highlights: [
      "120 sqm Lot Area with private garden lawn & service area",
      "84 sqm Floor Area across two functional storeys",
      "4 spacious bedrooms including dedicated maid's / utility room",
      "3 complete toilets and baths (including master's ensuite)",
      "Paved carport and driveway entry",
      "Second-floor master's balcony with open neighborhood views",
      "Under-stairs dedicated storage area",
      "Located in a peaceful, master-planned community in Jaro, Iloilo City",
    ],
  },
  {
    id: "la-bella-vista",
    name: "La Bella Vista Townhomes",
    location: "Cavite",
    area: "Imus City, Cavite",
    type: "Townhouse",
    badge: "RFO",
    beds: 3,
    baths: 2,
    parking: 1,
    sqm: 96,
    price: 5_400_000,
    priceNote: "Bank & in-house financing",
    img: u("photo-1570129477492-45c003edd2be"),
    tagline: "Mediterranean-cut townhomes near Imus's new civic center and NIA road.",
  },
  {
    id: "amberfield",
    name: "Amberfield Estates",
    location: "Cavite",
    area: "Silang, Cavite",
    type: "Residential Lot",
    badge: "Pre-selling",
    beds: 0,
    baths: 0,
    parking: 0,
    sqm: 200,
    lotNote: "200–320 sqm cuts",
    price: 2_900_000,
    priceNote: "₱14,500/sqm",
    img: u("photo-1500382017468-9049fed747ef"),
    tagline: "Rolling lot cuts on the Silang–Tagaytay growth axis. Build now or hold.",
  },
  {
    id: "sierra-verde",
    name: "Sierra Verde Residences",
    location: "Antipolo",
    area: "San Jose, Antipolo City",
    type: "House & Lot",
    badge: "RFO",
    beds: 4,
    baths: 3,
    parking: 2,
    sqm: 180,
    lotNote: "160 sqm lot",
    price: 9_800_000,
    priceNote: "Consultation & site visit on request",
    img: u("photo-1512917774080-9991f1c4c750"),
    tagline: "East-facing family home where the Sierra Madre breeze meets the city view.",
  },
];

export const FEATURED_PROPERTY = PROPERTIES.find((p) => p.id === FEATURED_ID)!;

export const fmtPrice = (n: number) => {
  if (n >= 1_000_000) {
    return `₱${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  }
  return `₱${n.toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

export interface Service {
  icon: string;
  title: string;
  desc: string;
  bullets: string[];
}

export const SERVICES: Service[] = [
  {
    icon: "fa-solid fa-house-chimney",
    title: "Property Buying Assistance",
    desc: "Support through the whole purchase — from choosing a property to understanding what is required of you at each step.",
    bullets: [
      "Shortlisting properties that fit your brief",
      "Walking through what a listing includes",
      "Coordinating with you on requirements and timelines",
      "A single point of contact from inquiry to decision",
    ],
  },
  {
    icon: "fa-solid fa-chart-line",
    title: "Property Investment Guidance",
    desc: "For buyers looking at property as an investment rather than a residence, guidance on how the available options compare.",
    bullets: [
      "Comparing options across the areas we serve",
      "Clarity on payment terms as published by the project",
      "Discussion of what suits your holding plans",
      "Straight answers on what is and is not confirmed",
    ],
  },
  {
    icon: "fa-solid fa-house",
    title: "House & Lot / Residential Property Assistance",
    desc: "Dedicated help for buyers looking at residential house and lot properties in Iloilo, Tagaytay, Antipolo, Cavite and Binondo.",
    bullets: [
      "Residential listings in the areas we serve",
      "Details on layout, features and inclusions",
      "Help comparing units within a project",
      "Support arranging the next step",
    ],
  },
  {
    icon: "fa-solid fa-magnifying-glass-location",
    title: "Property Matching",
    desc: "Rather than sending you everything, we narrow the field to the properties that actually answer your brief.",
    bullets: [
      "Matching on location, type and budget range",
      "Shortlists you can review at your own pace",
      "Adjusting the search as your priorities change",
      "New options flagged as they become available",
    ],
  },
  {
    icon: "fa-solid fa-eye",
    title: "Site Viewing / Consultation",
    desc: "See a property in person, or talk it through first — whichever you prefer, arranged at a time that works for you.",
    bullets: [
      "Site viewing arranged on request",
      "Consultation by call, text or Messenger",
      "Questions answered before you commit to a visit",
      "Follow-up after the viewing",
    ],
  },
  {
    icon: "fa-solid fa-comments",
    title: "Buyer Inquiry Assistance",
    desc: "Every question, from the first one to the last, answered by a real person who knows your file.",
    bullets: [
      "Direct replies by call, text or Messenger",
      "Help understanding documents and terms",
      "Follow-up on outstanding questions",
      "Continuity — the same contact throughout",
    ],
  },
];

export interface ProcessStep {
  step: string;
  title: string;
  desc: string;
}

export const PROCESS_STEPS: ProcessStep[] = [
  {
    step: "1",
    title: "Send your inquiry",
    desc: "Share your preferred location, property type and budget range — or just your questions.",
  },
  {
    step: "2",
    title: "We match and shortlist",
    desc: "We come back with the listings that fit, and what each one actually includes.",
  },
  {
    step: "3",
    title: "View or consult",
    desc: "Arrange a site viewing, or talk it through first by call, text or Messenger.",
  },
  {
    step: "4",
    title: "Decide with support",
    desc: "Follow-up questions, requirements and next steps — handled with the same point of contact.",
  },
];

export interface Testimonial {
  quote: string;
  name: string;
  meta: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "As an OFW in Dubai, I did everything over video call — the site visit, the reservation, even the turnover. They treated my money like their own.",
    name: "Ramil & Cecilia D.",
    meta: "OFW · Dubai — bought in Cavite",
  },
  {
    quote:
      "They negotiated ₱400,000 below asking and flagged a title issue another broker missed entirely. That's the difference a navigator makes.",
    name: "Katrina S.",
    meta: "Homeowner · Iloilo City",
  },
  {
    quote:
      "My Binondo unit was tenanted within six weeks of turnover. Their yield projections weren't sales talk — they were accurate to the peso.",
    name: "Jonathan T.",
    meta: "Investor · Makati City",
  },
];

export interface TeamMember {
  name: string;
  role: string;
  note: string;
  initials: string;
}

export const TEAM: TeamMember[] = [
  { name: "Angelo Remigio", role: "Managing Broker · Founder", note: "Helping People build wealth through smart real estate investments", initials: "AR" },
  { name: "Daniel Reyes", role: "Head of Sales · Visayas", note: "Iloilo market specialist, 400+ closings.", initials: "DR" },
  { name: "Grace Villanueva", role: "Client Success · OFW Desk", note: "Your point person from Dubai to Davao.", initials: "GV" },
  { name: "Paolo Mendoza", role: "Investment Advisory", note: "Yield modeling & portfolio property strategy.", initials: "PM" },
];

export const WHY_US = [
  "Straight information — We work from what is actually documented about a property. Where a detail has not been confirmed, we say so rather than filling the gap with a guess.",
  "Guidance, not pressure — The goal is a property that fits your plans. That means honest answers about what suits you — and what does not.",
  "Available when it matters — Buying property runs on timing. Questions get answered by call, text or Messenger so you are never left waiting.",
  "Focused on five areas — Iloilo, Tagaytay, Antipolo, Cavite and Binondo — we concentrate on the locations we know rather than spreading thin.",
  "Buyers and investors alike — Whether you are looking for a family home or weighing a property as an investment, the assistance is shaped around your goal.",
  "Easy to reach — Call, text or send a message on Messenger. Questions get a direct answer from a real person.",
];

/* Editable site content — seeded into the store & managed from the Owner Console */
export interface ServiceItem extends Service {
  id: string;
}
export const SERVICE_SEED: ServiceItem[] = SERVICES.map((s, i) => ({
  id: `svc-${i + 1}`,
  ...s,
}));

export interface AboutContent {
  kicker: string;
  headline: string;
  paragraph1: string;
  paragraph2: string;
  mission: string;
  vision: string;
  whyUs: string[];
}
export const ABOUT_SEED: AboutContent = {
  kicker: "Our story",
  headline: "Guiding You Home, Building Your Future",
  paragraph1:
    "Buying property is rarely a simple transaction. There are locations to compare, documents to understand, viewings to arrange and questions that are hard to ask a stranger. Dream Home Navigators exists to make that process feel manageable.",
  paragraph2:
    "We work as the point of contact between buyers and the properties available in the areas we serve. That means shortlisting homes that match what you asked for, explaining what each listing actually includes, arranging site viewings, and staying reachable while you decide. Our name is the promise: we navigate, you decide. Whether the property is a first family home or an investment you are weighing carefully, the work is the same — get you accurate information, and give you room to make the call.",
  mission:
    "To help every client find a property that fits their life and their plans — guided by clear information, honest advice and steady support from the first inquiry to the final decision.",
  vision:
    "Guiding You Home, Building Your Future.",
  whyUs: [...WHY_US],
};

export interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
}

export const STATS: Stat[] = [
  { value: 5, label: "Key territories served" },
  { value: 850, suffix: "+", label: "Families & investors guided" },
  { value: 100, suffix: "%", label: "Official materials verified" },
  { value: 24, suffix: "h", label: "Prompt inquiry response" },
];

export const BUDGETS = [
  "Below ₱3M",
  "₱3M – ₱5M",
  "₱5M – ₱10M",
  "₱10M – ₱20M",
  "₱20M and above",
  "Flexible — need guidance",
];

export const CONTACT = {
  phone: "+63 921 603 0693",
  phoneHref: "tel:+639216030693",
  email: CONFIG.EMAIL,
  emailHref: `mailto:${CONFIG.EMAIL}`,
  messenger: CONFIG.MESSENGER_URL,
  facebook: "https://www.facebook.com/dreamhomenavigators01",
  areasServed: "Iloilo · Tagaytay · Antipolo · Cavite · Binondo",
  responseNote: "Inquiries are answered as soon as the team is available.",
  address: "Iloilo, Tagaytay, Antipolo, Cavite & Binondo",
  hours: "Mon – Sat · 9:00 AM – 6:00 PM",
};
