import { CONFIG } from "./config";

export type Page = "home" | "properties" | "rentals" | "services" | "about" | "contact";

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
  category?: "sale" | "rental";
  isRental?: boolean;
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
    id: "janella-welford",
    name: "Janella House Model at Welford Estate",
    location: "Iloilo",
    area: "Jaro, Iloilo City",
    type: "Single Detached 2-Storey House & Lot",
    badge: "Available",
    beds: 2,
    baths: 2,
    parking: 1,
    sqm: 63,
    lotNote: "120 sqm lot · 63 sqm floor area",
    price: 3_800_000,
    priceLabel: "Price starts at",
    priceNote: "2 Bedrooms + Family Room · 2 T&B · Storage/Maid's Room · Cemented Carport",
    img: "/assets/img/janella/janella-actual-facade.jpg",
    gallery: [
      "/assets/img/janella/janella-actual-facade.jpg",
      "/assets/img/janella/janella-floor-plans-complete.png",
      "/assets/img/janella/floor-plan-ground.png",
      "/assets/img/janella/floor-plan-second.png",
    ],
    tagline: "Two-storey single detached residence featuring 2 bedrooms, family room, 2 toilet & baths, storage/maid's room, and cemented carport in Jaro, Iloilo City.",
    highlights: [
      "120 sqm Lot Area with spacious private lawn",
      "63 sqm Floor Area across two functional storeys",
      "2 bedrooms plus dedicated 2nd-floor family room",
      "2 complete toilets & baths",
      "Dedicated storage / maid's room on ground floor",
      "Cemented car port area and driveway entry",
      "Gated master-planned township living in Jaro, Iloilo City",
    ],
  },
  {
    id: "natalia-welford",
    name: "Natalia House Model at Welford Estate",
    location: "Iloilo",
    area: "Jaro, Iloilo City",
    type: "Single Detached 2-Storey House & Lot",
    badge: "Available",
    beds: 3,
    baths: 2,
    parking: 1,
    sqm: 73,
    lotNote: "120 sqm lot · 73 sqm floor area",
    price: 4_200_000,
    priceLabel: "Price starts at",
    priceNote: "3 Bedrooms · 2 T&B · Cemented Carport · Balcony · Storage/Maid's Room",
    img: "/assets/img/natalia/natalia-actual-facade.jpg",
    gallery: [
      "/assets/img/natalia/natalia-actual-facade.jpg",
      "/assets/img/natalia/natalia-floor-plans-complete.png",
      "/assets/img/natalia/floor-plan-ground.png",
      "/assets/img/natalia/floor-plan-second.png",
    ],
    tagline: "Two-storey modern home with 3 bedrooms, 2 toilet & baths, cemented carport, storage/maid's room, and private balcony in Jaro, Iloilo City.",
    highlights: [
      "120 sqm Lot Area with private green lawn",
      "73 sqm Floor Area thoughtfully laid out across two levels",
      "3 comfortable bedrooms (Master's bedroom + 2 bedrooms)",
      "2 complete toilets and baths",
      "Private second-floor balcony overlooking front grounds",
      "Dedicated ground-floor storage / maid's room",
      "Cemented car port area with easy vehicle access",
      "Prime township community setting in Jaro, Iloilo City",
    ],
  },
  {
    id: "rosanna-welford",
    name: "Rosanna House Model at Welford Estate",
    location: "Iloilo",
    area: "Jaro, Iloilo City",
    type: "Single Detached 2-Storey House & Lot",
    badge: "Available",
    beds: 4,
    baths: 3,
    parking: 1,
    sqm: 117,
    lotNote: "144 sqm lot · 117 sqm floor area",
    price: 5_600_000,
    priceLabel: "Price starts at",
    priceNote: "4 Bedrooms · 3 T&B · 144 sqm Lot · Large Balcony · Storage & Maid's Room",
    img: "/assets/img/rosanna/rosanna-actual-facade.jpg",
    gallery: [
      "/assets/img/rosanna/rosanna-actual-facade.jpg",
      "/assets/img/rosanna/rosanna-floor-plans-complete.png",
      "/assets/img/rosanna/floor-plan-ground.png",
      "/assets/img/rosanna/floor-plan-second.png",
    ],
    tagline: "Spacious two-storey executive residence with 144 sqm lot, 117 sqm floor area, 4 bedrooms, 3 toilet & baths, cemented carport, storage room, and wide balcony.",
    highlights: [
      "Expansive 144 sqm Lot Area with generous garden & service space",
      "117 sqm Floor Area providing ample living and dining spaces",
      "4 full bedrooms including master's suite & maid's quarters",
      "3 complete toilets and baths",
      "Large second-floor outdoor balcony",
      "Dedicated storage room and ground-floor utility room",
      "Covered cemented carport area and wide driveway",
      "Premier master-planned community in Jaro, Iloilo City",
    ],
  },
];

export const FEATURED_PROPERTY = PROPERTIES.find((p) => p.id === FEATURED_ID)!;

export const RENTAL_PROPERTIES: Property[] = [
  {
    id: "rent-avida-tower3-iloilo",
    name: "Avida Tower 3 at Iloilo",
    location: "Iloilo",
    area: "Atria Park District, San Rafael, Mandurriao, Iloilo City",
    type: "Condominium Staycation / Suite",
    badge: "Daily Stay",
    beds: 1,
    baths: 1,
    parking: 1,
    sqm: 23,
    lotNote: "Modern Home Away From Home · Air Conditioned",
    price: 2_000,
    priceLabel: "Daily Stay Rate",
    priceNote: "PHP 2,000 Daily · Book Family Stay & Transient Vacation",
    img: "/assets/img/avida-tower3/avida-banner.jpg",
    gallery: [
      "/assets/img/avida-tower3/avida-banner.jpg",
      "/assets/img/avida-tower3/avida-pool-day.jpg",
      "/assets/img/avida-tower3/avida-sunset-amenities.jpg",
      "/assets/img/avida-tower3/avida-towers-exterior.jpg",
    ],
    tagline: "More space for shared memories. A modern home away from home with resort-style swimming pools and prime Atria Park District lifestyle.",
    highlights: [
      "Comfortable queen-size bed setup with fresh linens & towels provided",
      "Split-type air conditioning, ambient lighting & dining table suite",
      "Access to expansive resort-style lap pool, kiddie pool & landscaped open courtyards",
      "Prime location inside Atria Park District — walking distance to QualiMed Hospital, Ateneo de Iloilo, and Shops at Atria",
      "24/7 security lobby, biometric RFID access, and high-speed elevators",
      "Ideal for family staycations, weekend getaways, medical visits, and executive business trips",
    ],
    developer: "Avida Land (Ayala Land)",
    category: "rental",
    isRental: true,
  },
  {
    id: "rent-iloilo-mandurriao",
    name: "Courtyard Executive Suite at Iloilo Business Park",
    location: "Iloilo",
    area: "Mandurriao, Iloilo City",
    type: "Executive Condominium Unit",
    badge: "Fully Furnished",
    beds: 2,
    baths: 2,
    parking: 1,
    sqm: 68,
    lotNote: "Corner Unit · High Floor · City Skyline View",
    price: 38_000,
    priceLabel: "Monthly Rental Rate",
    priceNote: "Inclusive of monthly condominium association dues. Min. 1-year contract.",
    img: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=1200&auto=format&fit=crop",
    ],
    tagline: "Move-in ready premium 2-bedroom suite directly fronting Megaworld Festive Walk Mall with dedicated high-speed fiber provision.",
    highlights: [
      "Fully furnished with designer Scandinavian-modern furniture",
      "Corner master suite with floor-to-ceiling panoramic glass windows",
      "Direct walking access to Festive Walk Mall, transport hub & dining strip",
      "Building infinity pool, 24/7 biometric security and fitness gym access",
      "Dedicated basement parking slot included",
    ],
    developer: "Megaworld Corporation",
    category: "rental",
    isRental: true,
  },
  {
    id: "rent-tagaytay-ridge",
    name: "Pinecrest Ridge Villa & Loft",
    location: "Tagaytay",
    area: "Silang Junction South, Tagaytay City",
    type: "Scenic Vacation Villa / Loft",
    badge: "Long-term Lease",
    beds: 3,
    baths: 3,
    parking: 2,
    sqm: 142,
    lotNote: "Private Garden Terrace · Cool Tagaytay Breeze",
    price: 65_000,
    priceLabel: "Monthly Lease Rate",
    priceNote: "Ideal for remote executives, expatriates, and sabbatical retreats.",
    img: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200&auto=format&fit=crop",
    ],
    tagline: "Tranquil two-level mountain villa with double-height fireplace lounge, pine tree views, and wraparound veranda.",
    highlights: [
      "Cool Tagaytay mountain climate all year round",
      "Spacious outdoor entertaining deck with garden grill area",
      "Cathedral ceiling living room with stone accents and natural pine finishes",
      "High-speed dual broadband connectivity for executive work-from-home",
      "Gated sanctuary with 24-hour perimeter security patrol",
    ],
    category: "rental",
    isRental: true,
  },
  {
    id: "rent-cavite-general-trias",
    name: "Verdana Crest Modern Family Residence",
    location: "Cavite",
    area: "General Trias / Daang Hari Ext., Cavite",
    type: "Two-Storey Single Detached Home",
    badge: "Ready for Occupancy",
    beds: 4,
    baths: 3,
    parking: 2,
    sqm: 125,
    lotNote: "150 sqm lot · Semi-Furnished · Gated Community",
    price: 32_000,
    priceLabel: "Monthly Rental Rate",
    priceNote: "Semi-furnished with inverter air conditioners, modular kitchen & built-in closets.",
    img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=1200&auto=format&fit=crop",
    ],
    tagline: "Comfortable, master-planned family home near major Cavite expressways (CALAX, MCX, and CAVITEX).",
    highlights: [
      "Energy-efficient inverter AC units installed in all bedrooms and living hall",
      "Spacious covered 2-car garage with gated driveway",
      "Pet-friendly private backyard lawn with utility area",
      "Village amenities: resort-type swimming pool, basketball court and children's park",
      "10 minutes to Vista Mall, district hospitals, and international schools",
    ],
    category: "rental",
    isRental: true,
  },
  {
    id: "rent-antipolo-valley",
    name: "The Heights Skyview Residence",
    location: "Antipolo",
    area: "Mambugan / Valley Golf Road, Antipolo",
    type: "Modern Multi-Level Hillside Home",
    badge: "Executive Suite",
    beds: 3,
    baths: 3,
    parking: 2,
    sqm: 160,
    lotNote: "Overlooking Metro Skyline · Fresh Mountain Air",
    price: 45_000,
    priceLabel: "Monthly Rental Rate",
    priceNote: "Long-term lease preferred (1-2 years). Security deposit: 2 months.",
    img: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?q=80&w=1200&auto=format&fit=crop",
    ],
    tagline: "Hillside sanctuary with sweeping sunset views of the Ortigas and BGC skylines, minutes from Sumulong Highway.",
    highlights: [
      "Unobstructed panoramic valley and metropolitan skyline views",
      "Expansive rooftop terrace perfect for stargazing and sunset leisure",
      "Master suite with walk-in closet and ensuite bathroom with glass enclosure",
      "Flood-free elevated elevation with peaceful neighborhood ambiance",
      "Convenient access to LRT-2 Antipolo Station and Marikina-Infanta Highway",
    ],
    category: "rental",
    isRental: true,
  },
  {
    id: "rent-binondo-chinatown",
    name: "Chinatown Commercial & Residential Mezzanine Suite",
    location: "Binondo",
    area: "Quintin Paredes / Dasmariñas St., Binondo, Manila",
    type: "Mixed Commercial / Residential Suite",
    badge: "Commercial Space",
    beds: 2,
    baths: 2,
    parking: 1,
    sqm: 110,
    lotNote: "High Foot Traffic · Prime Chinatown Commercial Hub",
    price: 55_000,
    priceLabel: "Monthly Lease Rate",
    priceNote: "Ideal for trading firm headquarters, showroom, or live-work executive base.",
    img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?q=80&w=1200&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=1200&auto=format&fit=crop",
    ],
    tagline: "Prime live-work property in Binondo's bustling commerce district, walking distance to major Chinese banking headquarters.",
    highlights: [
      "Strategic downtown Binondo location with prominent ground-floor elevator lobby",
      "Multi-purpose open layout suitable for office desks, conference, and residential stay",
      "Equipped with secure access card controls and commercial-grade fiber internet",
      "Walking distance to Lucky Chinatown, Escolta, Jones Bridge & historic landmarks",
      "Dedicated basement parking slot available",
    ],
    category: "rental",
    isRental: true,
  },
];

export const fmtPrice = (n: number, isRental?: boolean, suffix?: string) => {
  if (suffix) {
    return `₱${n.toLocaleString("en-PH")}${suffix}`;
  }
  if (isRental) {
    return `₱${n.toLocaleString("en-PH")}/mo`;
  }
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
