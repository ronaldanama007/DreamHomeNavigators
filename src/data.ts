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
  img: string;
  tagline: string;
}

const u = (id: string, w = 1000) =>
  `https://images.unsplash.com/${id}?q=80&w=${w}&auto=format&fit=crop`;

export const FEATURED_ID = "pine-deluxe";

export const PROPERTIES: Property[] = [
  {
    id: FEATURED_ID,
    name: "Pine Deluxe at Emerald Estate",
    location: "Tagaytay",
    area: "Kaybagay, Tagaytay City",
    type: "House & Lot",
    badge: "Featured",
    beds: 4,
    baths: 3,
    parking: 2,
    sqm: 210,
    lotNote: "180 sqm lot",
    price: 14_500_000,
    img: u("photo-1470770841072-f978cf4d019e"),
    tagline: "A pine-shaded sanctuary above the ridge — cool mornings, mist over Taal, and a lanai built for slow weekends.",
  },
  {
    id: "casa-alona",
    name: "Casa Alona Residences",
    location: "Iloilo",
    area: "Diversion Road, Iloilo City",
    type: "Condominium",
    badge: "Pre-selling",
    beds: 2,
    baths: 1,
    parking: 1,
    sqm: 48,
    price: 4_200_000,
    priceNote: "Flexible equity terms",
    img: u("photo-1545324418-cc1a3fa10c00"),
    tagline: "Smart-cut units in the heart of the Diversion Road growth corridor.",
  },
  {
    id: "rivera-park",
    name: "Rivera Park Homes",
    location: "Iloilo",
    area: "Mandurriao, Iloilo City",
    type: "House & Lot",
    badge: "RFO",
    beds: 3,
    baths: 2,
    parking: 1,
    sqm: 120,
    lotNote: "150 sqm lot",
    price: 6_800_000,
    img: u("photo-1568605114967-8130f3a36994"),
    tagline: "Move-in-ready family home beside Mandurriao's schools and esplanade.",
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
    img: u("photo-1512917774080-9991f1c4c750"),
    tagline: "East-facing family home where the Sierra Madre breeze meets the city view.",
  },
  {
    id: "cloud-nine",
    name: "Cloud Nine Townhomes",
    location: "Antipolo",
    area: "San Roque, Antipolo City",
    type: "Townhouse",
    badge: "Pre-selling",
    beds: 2,
    baths: 2,
    parking: 1,
    sqm: 78,
    price: 4_600_000,
    priceNote: "Low monthly amortization",
    img: u("photo-1600585154526-990dced4db0d"),
    tagline: "Compact two-storey homes above the clouds, minutes from Masinag.",
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
  {
    id: "escolta-lofts",
    name: "Escolta Bay Lofts",
    location: "Binondo",
    area: "Escolta, Binondo, Manila",
    type: "Loft Unit",
    badge: "New Launch",
    beds: 1,
    baths: 1,
    parking: 1,
    sqm: 42,
    price: 6_400_000,
    img: u("photo-1502672260266-1c1ef2d93688"),
    tagline: "Double-height lofts in the creative corridor, walking distance to Escolta's revival.",
  },
];

export const FEATURED_PROPERTY = PROPERTIES.find((p) => p.id === FEATURED_ID)!;

export const fmtPrice = (n: number) =>
  n >= 1_000_000 ? `₱${(n / 1_000_000).toFixed(1).replace(/\.0$/, "")}M` : `₱${n.toLocaleString()}`;

export interface Service {
  icon: string;
  title: string;
  desc: string;
  bullets: string[];
}

export const SERVICES: Service[] = [
  {
    icon: "fa-house-chimney",
    title: "Buying Assistance",
    desc: "End-to-end guidance from first shortlist to turnover — reservation, contracts, and closing handled with you, step by step.",
    bullets: ["Document review & negotiation", "Reservation & SPA handling", "Turnover & punch-list support"],
  },
  {
    icon: "fa-magnifying-glass-location",
    title: "Property Matching",
    desc: "We filter hundreds of listings down to a curated shortlist that fits your budget, lifestyle, and long-term plans — not the other way around.",
    bullets: ["Needs & budget discovery call", "Curated shortlist in 48 hours", "Side-by-side unit comparisons"],
  },
  {
    icon: "fa-chart-line",
    title: "Investment Guidance",
    desc: "Rental yield, appreciation corridors, and exit timing — straight talk on which assets actually perform in each of our five territories.",
    bullets: ["Yield & appreciation analysis", "OFW investment structuring", "Exit & resale strategy"],
  },
  {
    icon: "fa-route",
    title: "Site Viewing Coordination",
    desc: "Free, no-pressure site visits — scheduled, chauffeured if needed, and consolidated into efficient multi-project tours per location.",
    bullets: ["Free scheduled viewings", "Consolidated project tours", "Live video visits for OFWs"],
  },
  {
    icon: "fa-file-signature",
    title: "Loan & Documentation",
    desc: "Bank pre-qualification, Pag-IBIG processing, and title paperwork — we run the document chase so you don't have to.",
    bullets: ["Bank & Pag-IBIG pre-qualification", "Title & tax document processing", "Notarial & transfer assistance"],
  },
  {
    icon: "fa-plane-departure",
    title: "OFW Remote Buying",
    desc: "A dedicated desk for Filipinos abroad: video tours, SPA via consulate, and a trusted point person from reservation to turnover.",
    bullets: ["Video-call site inspections", "SPA signing via consulate", "Progress updates every milestone"],
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
  { name: "Maria Luisa Fernandez", role: "Managing Broker · Founder", note: "15 years across primary & secondary markets.", initials: "MF" },
  { name: "Daniel Reyes", role: "Head of Sales · Visayas", note: "Iloilo market specialist, 400+ closings.", initials: "DR" },
  { name: "Grace Villanueva", role: "Client Success · OFW Desk", note: "Your point person from Dubai to Davao.", initials: "GV" },
  { name: "Paolo Mendoza", role: "Investment Advisory", note: "Yield modeling & portfolio property strategy.", initials: "PM" },
];

export const WHY_US = [
  "PRC-licensed brokerage — every transaction under a licensed broker's name",
  "Verified, DHSUD-registered projects only — no fly-by-night developers",
  "Free site visit coordination across all five territories",
  "Bank, Pag-IBIG & in-house financing assistance included",
  "After-sales support through turnover, punch-list and titling",
  "Dedicated OFW desk with video tours and consulate-signed SPAs",
];

export interface Stat {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  label: string;
}

export const STATS: Stat[] = [
  { value: 850, suffix: "+", label: "Families housed" },
  { value: 3.2, decimals: 1, prefix: "₱", suffix: "B", label: "In property sales closed" },
  { value: 5, label: "Key territories served" },
  { value: 12, suffix: " yrs", label: "Navigating Filipinos home" },
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
  phone: "+63 917 555 0123",
  phoneHref: "tel:+639175550123",
  email: "inquiries@dreamhomenavigators.com",
  emailHref: "mailto:inquiries@dreamhomenavigators.com",
  messenger: "https://m.me/dreamhomenavigators01",
  facebook: "https://www.facebook.com/dreamhomenavigators01",
  address: "Unit 1204, Pioneer Heights, Pioneer St., Mandaluyong City, Metro Manila",
  hours: "Mon – Sat · 9:00 AM – 6:00 PM",
};
