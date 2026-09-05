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
}

const u = (id: string, w = 1000) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export const FEATURED_ID = "pine-deluxe";

export const PROPERTIES: Property[] = [
  {
    id: FEATURED_ID,
    name: "Pine Deluxe at Emerald Estate",
    location: "Iloilo",
    area: "Emerald Estate, Iloilo",
    type: "House / Residential",
    badge: "Available",
    beds: 0,
    baths: 2,
    parking: 1,
    sqm: 120,
    lotNote: "Two-storey · Carport · Bedrooms on request",
    price: 18516.86,
    priceLabel: "Price starts at",
    priceNote: "As published on the official project material.",
    img: "/assets/img/pine-deluxe-exterior.jpg",
    gallery: [
      "/assets/img/pine-deluxe-exterior.jpg",
      "/assets/img/pine-deluxe-living.jpg",
    ],
    tagline: "A thoughtfully designed home that blends modern style, comfort and functionality — presented by Dream Home Navigators.",
    highlights: [
      "Two-storey architectural design",
      "Spacious covered carport",
      "Customizable bedroom layouts on request",
      "Emerald Estate 24/7 guarded community",
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
    id: "highland-ridge",
    name: "Highland Ridge Villas",
    location: "Tagaytay",
    area: "Sungay East, Tagaytay City",
    type: "Twin Villa",
    badge: "Pre-selling",
    beds: 3,
    baths: 3,
    parking: 2,
    sqm: 160,
    lotNote: "140 sqm lot",
    price: 11_200_000,
    priceNote: "Consultation & site visit on request",
    img: u("photo-1600596542815-ffad4c1539a9"),
    tagline: "Twin villas on the cool east ridge, five minutes from the skyline road.",
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
  {
    id: "fortune-tower",
    name: "Fortune Tower Residences",
    location: "Binondo",
    area: "Ongpin St., Binondo, Manila",
    type: "Condominium",
    badge: "RFO",
    beds: 1,
    baths: 1,
    parking: 0,
    sqm: 36,
    price: 5_900_000,
    priceNote: "High rental demand",
    img: u("photo-1460317442991-0ec209397118"),
    tagline: "A heritage-district tower at the corner of old-money Manila and Chinatown commerce.",
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
    title: "House & Lot / Residential",
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
    title: "You tell us what you need",
    desc: "Preferred location, property type, budget range and timeline — whatever you already know.",
  },
  {
    step: "2",
    title: "We match properties to it",
    desc: "We shortlist what fits and set out clearly what each listing includes.",
  },
  {
    step: "3",
    title: "You view and compare",
    desc: "Site viewing or a consultation is arranged at a time that works for you.",
  },
  {
    step: "4",
    title: "We stay with you after",
    desc: "Buyer inquiries, follow-up questions and next steps — you keep the same point of contact.",
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
