import { useState } from "react";
import {
  CONTACT,
  FEATURED_PROPERTY,
  Page,
  fmtPrice,
} from "../data";
import { useStore } from "../store";
import { CountUp } from "../ui";
import { CONFIG } from "../config";

interface Props {
  go: (p: Page) => void;
  inquire: (name: string) => void;
  browseLocation: (loc: string) => void;
}

export default function Home({ go, inquire, browseLocation }: Props) {
  const { properties, featuredId, addLead } = useStore();
  const [videoPlaying, setVideoPlaying] = useState(false);

  // Lead form state
  const [formName, setFormName] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formTerritory, setFormTerritory] = useState("Iloilo");
  const [formPropType, setFormPropType] = useState("House and Lot");
  const [formBudget, setFormBudget] = useState("5M - 10M");
  const [formMessage, setFormMessage] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);

  /* Featured on Home: explicit owner pick → first "Featured" badge → first listing */
  const f =
    properties.find((p) => p.id === featuredId) ??
    properties.find((p) => p.badge === "Featured") ??
    properties[0] ??
    FEATURED_PROPERTY;

  // Curated 3 listings for "Properties currently on offer"
  const curatedListings = properties.filter((p) => p.id !== f.id).slice(0, 3);
  const displayCards = curatedListings.length > 0 ? curatedListings : properties.slice(0, 3);

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formPhone) return;
    setFormSubmitting(true);

    const leadPayload = {
      name: formName,
      phone: formPhone,
      email: "",
      location: formTerritory,
      budget: formBudget,
      propertyInterest: `${formPropType} in ${formTerritory}`,
      message: formMessage,
      source: "Home Page Lead Section",
      synced: false,
    };

    // Save locally
    addLead(leadPayload);

    // If Google Script URL is provided, send POST
    if (CONFIG.GOOGLE_SCRIPT_URL) {
      try {
        await fetch(CONFIG.GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({
            ...leadPayload,
            timestamp: new Date().toISOString(),
          }),
        });
      } catch (err) {
        console.warn("CRM submit warning:", err);
      }
    }

    setFormSubmitting(false);
    setFormSubmitted(true);
    setFormName("");
    setFormPhone("");
    setFormMessage("");
  };

  return (
    <div className="flex flex-col w-full">
      {/* Top Subtle Atmospheric Glow Backdrop */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[1000px] h-[480px] bg-gradient-to-b from-primary-container/20 via-secondary/10 to-transparent blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-80 -right-24 w-96 h-96 bg-secondary-container/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* 1. HERO SECTION */}
        <section className="max-w-max-width mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop pt-space-xl md:pt-space-2xl pb-space-3xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center">
            {/* Hero Left Column: Typography & CTAs */}
            <div className="lg:col-span-7 flex flex-col items-start gap-space-md">
              {/* Tagline Pill */}
              <div className="inline-flex items-center gap-space-xs px-space-md py-space-xxs rounded-full bg-surface-container-high/80 backdrop-blur-xl shadow-md border border-primary/20">
                <span className="text-secondary text-[14px]">✨</span>
                <span className="font-label-overline text-label-overline text-secondary tracking-widest uppercase">
                  Guiding You Home, Building Your Future
                </span>
              </div>

              {/* Headline with Editorial Contrast */}
              <h1 className="font-display-hero text-display-hero-mobile md:text-display-hero text-white leading-[1.1] tracking-tight">
                Find the Right Property. <br className="hidden sm:inline" />
                Build the{" "}
                <span className="font-title-editorial italic font-normal text-secondary">
                  Future
                </span>{" "}
                You Envision.
              </h1>

              {/* Subtitle */}
              <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl">
                Discover carefully selected homes and investment opportunities across
                Iloilo, Tagaytay, Antipolo, Cavite, and Binondo — with guidance from first
                inquiry to site viewing.
              </p>

              {/* Dual CTA & Quick Hotline */}
              <div className="flex flex-wrap items-center gap-space-md pt-space-xs w-full sm:w-auto">
                <button
                  onClick={() => go("properties")}
                  className="btn btn-primary !px-7 !py-3 font-bold shadow-[0_4px_24px_rgba(37,99,235,0.45)] group"
                >
                  <span>Explore Properties</span>
                  <span className="material-symbols-outlined text-[18px] group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </button>
                <button
                  onClick={() => go("contact")}
                  className="btn btn-ghost !px-7 !py-3 font-semibold"
                >
                  <span className="material-symbols-outlined text-[18px] text-secondary">
                    mail
                  </span>
                  <span>Send an Inquiry</span>
                </button>
              </div>

              {/* Trust Badges & Contact Info */}
              <div className="flex flex-wrap items-center gap-space-md text-on-surface-variant font-label-md text-label-md pt-space-xs">
                <div className="flex items-center gap-space-xxs">
                  <span className="material-symbols-outlined text-secondary text-[16px]">
                    pin_drop
                  </span>
                  <span>5 areas served</span>
                </div>
                <span className="text-outline-variant">•</span>
                <div className="flex items-center gap-space-xxs">
                  <span className="material-symbols-outlined text-tertiary text-[16px]">
                    calendar_month
                  </span>
                  <span>Site viewing on request</span>
                </div>
                <span className="text-outline-variant">•</span>
                <div className="flex items-center gap-space-xxs text-secondary">
                  <span className="material-symbols-outlined text-[16px]">verified</span>
                  <span>PRC-Licensed Representation</span>
                </div>
              </div>

              {/* Territory quick filters bar */}
              <div className="w-full pt-space-xs">
                <div className="font-label-overline text-label-overline uppercase tracking-wider text-outline mb-space-xxs">
                  Territory Quick Jump
                </div>
                <div className="flex flex-wrap items-center gap-space-xs">
                  <button
                    onClick={() => browseLocation("Iloilo")}
                    className="glass-chip px-space-sm py-space-xxs text-on-surface-variant hover:text-white hover:border-primary/40 font-label-md text-label-md transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px] text-secondary mr-1">
                      location_on
                    </span>
                    <span>Iloilo</span>
                  </button>
                  <button
                    onClick={() => browseLocation("Tagaytay")}
                    className="glass-chip px-space-sm py-space-xxs text-on-surface-variant hover:text-white hover:border-primary/40 font-label-md text-label-md transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px] text-secondary mr-1">
                      location_on
                    </span>
                    <span>Tagaytay</span>
                  </button>
                  <button
                    onClick={() => browseLocation("Cavite")}
                    className="glass-chip px-space-sm py-space-xxs text-on-surface-variant hover:text-white hover:border-primary/40 font-label-md text-label-md transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px] text-secondary mr-1">
                      location_on
                    </span>
                    <span>Cavite</span>
                  </button>
                  <button
                    onClick={() => browseLocation("Antipolo")}
                    className="glass-chip px-space-sm py-space-xxs text-on-surface-variant hover:text-white hover:border-primary/40 font-label-md text-label-md transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px] text-secondary mr-1">
                      location_on
                    </span>
                    <span>Antipolo</span>
                  </button>
                  <button
                    onClick={() => browseLocation("Binondo")}
                    className="glass-chip px-space-sm py-space-xxs text-on-surface-variant hover:text-white hover:border-primary/40 font-label-md text-label-md transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-[14px] text-secondary mr-1">
                      location_on
                    </span>
                    <span>Binondo</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Hero Right Column: Featured Glass Spotlight Card */}
            <div className="lg:col-span-5 relative">
              <div className="glass-panel-deep relative rounded-xl overflow-hidden shadow-2xl border border-[rgba(56,189,248,0.25)]">
                {/* Property Hero Media */}
                <div className="relative h-72 sm:h-80 w-full overflow-hidden bg-surface-container-lowest">
                  {f.videoId && videoPlaying ? (
                    <div className="relative aspect-video w-full h-full bg-surface-container-lowest">
                      <iframe
                        src={`https://www.youtube-nocookie.com/embed/${f.videoId}?autoplay=1&rel=0`}
                        title={`${f.name} Video Tour`}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="h-full w-full border-0"
                      />
                      <button
                        onClick={() => setVideoPlaying(false)}
                        className="absolute top-space-sm left-space-sm z-30 inline-flex items-center gap-space-xxs px-space-sm py-space-xxs rounded-full bg-[#050d23]/90 backdrop-blur-md text-on-surface font-label-md text-label-md border border-surface-container-high cursor-pointer hover:bg-surface-container"
                      >
                        <span className="material-symbols-outlined text-[14px]">close</span>
                        <span>Close Video</span>
                      </button>
                    </div>
                  ) : (
                    <div
                      className="relative w-full h-full cursor-pointer group/media"
                      onClick={() => f.videoId && setVideoPlaying(true)}
                    >
                      <img
                        className="w-full h-full object-cover transform group-hover/media:scale-105 transition-transform duration-700"
                        src={f.img}
                        alt={f.name}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#030712]/95 via-[#030712]/40 to-transparent" />

                      {/* Glass Badges on Media */}
                      <div className="absolute top-space-sm left-space-sm flex items-center gap-space-xs">
                        <span className="inline-flex items-center gap-space-xxs px-space-sm py-space-xxs rounded-full bg-primary-container/90 text-white font-label-overline text-label-overline tracking-wider uppercase border border-primary/30 shadow-md backdrop-blur-md">
                          <span className="w-2 h-2 rounded-full bg-[#38bdf8] animate-pulse" />
                          Featured Spotlight
                        </span>
                      </div>

                      {f.videoId && (
                        <div className="absolute top-space-sm right-space-sm">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setVideoPlaying(true);
                            }}
                            className="inline-flex items-center gap-space-xxs px-space-sm py-space-xxs rounded-full bg-[#050d23]/80 backdrop-blur-md text-secondary font-label-md text-label-md hover:text-white transition-colors border border-surface-container-high/40 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[14px]">videocam</span>
                            <span>Watch Tour</span>
                          </button>
                        </div>
                      )}

                      {/* Location tag floating on bottom of image */}
                      <div className="absolute bottom-space-sm left-space-sm inline-flex items-center gap-space-xxs px-space-sm py-space-xxs rounded-lg bg-[#050d23]/85 backdrop-blur-md text-on-surface font-label-md text-label-md border border-surface-container-high/40">
                        <span className="material-symbols-outlined text-[14px] text-secondary">
                          location_on
                        </span>
                        <span>{f.area || f.location}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Spec Details */}
                <div className="p-space-lg flex flex-col gap-space-md">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <span className="font-label-overline text-label-overline uppercase text-tertiary tracking-widest block">
                        {f.badge || "Signature Unit"}
                      </span>
                      <h3 className="font-headline-md text-headline-md text-white">
                        {f.name}
                      </h3>
                    </div>
                    <div className="text-right">
                      <span className="font-label-overline text-label-overline text-outline block">
                        {f.priceLabel || "VALUATION"}
                      </span>
                      <span className="font-price-xl text-[26px] text-[#38bdf8] font-extrabold drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]">
                        {fmtPrice(f.price)}
                      </span>
                    </div>
                  </div>

                  {/* Architectural Spec Bar */}
                  <div className="architectural-spec-bar justify-around">
                    <div className="architectural-spec-item text-white">
                      <span className="material-symbols-outlined text-secondary text-[18px]">
                        bed
                      </span>
                      <span className="font-semibold text-[13px]">{f.beds} Beds</span>
                    </div>
                    <div className="architectural-spec-divider" />
                    <div className="architectural-spec-item text-white">
                      <span className="material-symbols-outlined text-secondary text-[18px]">
                        bathtub
                      </span>
                      <span className="font-semibold text-[13px]">{f.baths} Baths</span>
                    </div>
                    <div className="architectural-spec-divider" />
                    <div className="architectural-spec-item text-white">
                      <span className="material-symbols-outlined text-secondary text-[18px]">
                        square_foot
                      </span>
                      <span className="font-semibold text-[13px]">{f.sqm} sqm</span>
                    </div>
                  </div>

                  <p className="font-body-sm text-body-sm text-on-surface-variant line-clamp-2">
                    {f.tagline ||
                      (f.developer ? `Developer: ${f.developer}. ` : "") +
                      "A sustainable generational home in a premier location — where heritage meets contemporary luxury."}
                  </p>

                  {/* Footer CTA */}
                  <div className="flex items-center justify-between pt-space-xs">
                    <span className="font-body-sm text-body-sm text-on-surface-variant">
                      {f.lotNote || `${f.type} • ${f.beds} Bedrooms`}
                    </span>
                    <button
                      onClick={() => inquire(f.name)}
                      className="btn btn-primary !px-5 !py-2 text-xs font-bold shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                    >
                      <span>Inquire Now</span>
                      <span className="material-symbols-outlined text-[14px]">
                        arrow_forward
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Floating Metric Stats Row */}
          <div className="mt-space-2xl grid grid-cols-2 md:grid-cols-4 gap-space-md">
            <div className="bg-surface-container/60 backdrop-blur-xl p-space-md rounded-xl text-center shadow-sm border border-surface-container-high/40">
              <div className="font-display-xl-mobile text-display-xl-mobile text-primary font-bold">
                <CountUp value={5} />
              </div>
              <div className="font-label-overline text-label-overline text-on-surface-variant uppercase tracking-wider mt-space-xxs">
                Key Territories Served
              </div>
            </div>
            <div className="bg-surface-container/60 backdrop-blur-xl p-space-md rounded-xl text-center shadow-sm border border-surface-container-high/40">
              <div className="font-display-xl-mobile text-display-xl-mobile text-secondary font-bold">
                <CountUp value={850} suffix="+" />
              </div>
              <div className="font-label-overline text-label-overline text-on-surface-variant uppercase tracking-wider mt-space-xxs">
                Families &amp; Investors Guided
              </div>
            </div>
            <div className="bg-surface-container/60 backdrop-blur-xl p-space-md rounded-xl text-center shadow-sm border border-surface-container-high/40">
              <div className="font-display-xl-mobile text-display-xl-mobile text-tertiary font-bold">
                <CountUp value={100} suffix="%" />
              </div>
              <div className="font-label-overline text-label-overline text-on-surface-variant uppercase tracking-wider mt-space-xxs">
                Official Materials Verified
              </div>
            </div>
            <div className="bg-surface-container/60 backdrop-blur-xl p-space-md rounded-xl text-center shadow-sm border border-surface-container-high/40">
              <div className="font-display-xl-mobile text-display-xl-mobile text-on-surface font-bold">
                <CountUp value={24} suffix="h" />
              </div>
              <div className="font-label-overline text-label-overline text-on-surface-variant uppercase tracking-wider mt-space-xxs">
                Prompt Inquiry Response
              </div>
            </div>
          </div>

          {/* Service Pillars Grid */}
          <div className="mt-space-lg grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-sm">
            <button
              onClick={() => go("services")}
              className="flex items-center gap-space-sm bg-surface-container-low/60 hover:bg-surface-container-high/60 transition-colors p-space-sm rounded-lg backdrop-blur-md text-left cursor-pointer border border-surface-container-high/30"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-primary text-[20px]">
                  real_estate_agent
                </span>
              </div>
              <div>
                <div className="font-label-lg text-label-lg text-on-surface">Buying</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">
                  Purchase assistance &amp; legal checks
                </div>
              </div>
            </button>
            <button
              onClick={() => go("services")}
              className="flex items-center gap-space-sm bg-surface-container-low/60 hover:bg-surface-container-high/60 transition-colors p-space-sm rounded-lg backdrop-blur-md text-left cursor-pointer border border-surface-container-high/30"
            >
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-secondary text-[20px]">
                  trending_up
                </span>
              </div>
              <div>
                <div className="font-label-lg text-label-lg text-on-surface">Investing</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">
                  High-yield portfolio allocation
                </div>
              </div>
            </button>
            <button
              onClick={() => go("services")}
              className="flex items-center gap-space-sm bg-surface-container-low/60 hover:bg-surface-container-high/60 transition-colors p-space-sm rounded-lg backdrop-blur-md text-left cursor-pointer border border-surface-container-high/30"
            >
              <div className="w-10 h-10 rounded-full bg-tertiary/10 flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-tertiary text-[20px]">
                  checklist_rtl
                </span>
              </div>
              <div>
                <div className="font-label-lg text-label-lg text-on-surface">Matching</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">
                  Custom budget and criteria fit
                </div>
              </div>
            </button>
            <button
              onClick={() => go("services")}
              className="flex items-center gap-space-sm bg-surface-container-low/60 hover:bg-surface-container-high/60 transition-colors p-space-sm rounded-lg backdrop-blur-md text-left cursor-pointer border border-surface-container-high/30"
            >
              <div className="w-10 h-10 rounded-full bg-surface-bright flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-on-surface text-[20px]">
                  travel_explore
                </span>
              </div>
              <div>
                <div className="font-label-lg text-label-lg text-on-surface">Viewing</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">
                  Live OFW tours &amp; site visits
                </div>
              </div>
            </button>
          </div>
        </section>
      </div>

      {/* 2. TERRITORY STRIP / MARQUEE */}
      <section className="w-full bg-surface-container-lowest/80 py-space-sm shadow-inner relative overflow-hidden border-y border-surface-container-high/30">
        <div className="max-w-max-width mx-auto px-gutter-mobile flex flex-wrap items-center justify-center sm:justify-between gap-y-space-xs gap-x-space-md text-center">
          <span className="font-label-overline text-label-overline tracking-widest text-outline uppercase">
            Official Brokerage Footprint
          </span>
          <div className="flex items-center flex-wrap justify-center gap-space-md font-label-lg text-label-lg text-on-surface-variant">
            <button
              onClick={() => browseLocation("Binondo")}
              className="text-on-surface hover:text-secondary transition-colors cursor-pointer"
            >
              MANILA
            </button>
            <span className="text-outline-variant">•</span>
            <button
              onClick={() => browseLocation("Iloilo")}
              className="text-on-surface hover:text-secondary transition-colors cursor-pointer"
            >
              VISAYAS
            </button>
            <span className="text-outline-variant">•</span>
            <button
              onClick={() => browseLocation("Iloilo")}
              className="text-on-surface hover:text-secondary transition-colors cursor-pointer"
            >
              ILOILO
            </button>
            <span className="text-outline-variant">•</span>
            <button
              onClick={() => browseLocation("Tagaytay")}
              className="text-on-surface hover:text-secondary transition-colors cursor-pointer"
            >
              TAGAYTAY
            </button>
            <span className="text-outline-variant">•</span>
            <button
              onClick={() => browseLocation("Cavite")}
              className="text-on-surface hover:text-secondary transition-colors cursor-pointer"
            >
              CAVITE
            </button>
            <span className="text-outline-variant">•</span>
            <button
              onClick={() => browseLocation("Antipolo")}
              className="text-on-surface hover:text-secondary transition-colors cursor-pointer"
            >
              ANTIPOLO
            </button>
            <span className="text-outline-variant">•</span>
            <button
              onClick={() => browseLocation("Binondo")}
              className="text-tertiary hover:text-tertiary-fixed transition-colors cursor-pointer font-bold"
            >
              BINONDO
            </button>
          </div>
          <div className="hidden lg:flex items-center gap-space-xxs text-secondary font-label-md text-label-md">
            <span className="w-2 h-2 rounded-full bg-secondary" />
            <span>PRC Registered Advisory</span>
          </div>
        </div>
      </section>

      {/* 3. FEATURED PROPERTIES ON OFFER */}
      <section
        className="max-w-max-width mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop py-space-3xl"
        id="featured-listings"
      >
        {/* Header Block */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-space-md mb-space-2xl">
          <div className="space-y-space-xxs max-w-2xl">
            <div className="flex items-center gap-space-xs">
              <span className="w-8 h-[2px] bg-primary" />
              <span className="font-label-overline text-label-overline uppercase text-primary tracking-widest">
                Verified Portfolio
              </span>
            </div>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
              Properties{" "}
              <span className="font-title-editorial italic font-normal text-secondary">
                currently on offer
              </span>
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              Every listing below comes straight from official Dream Home Navigators material — verified
              titles, authentic price sheets, nothing estimated or embellished.
            </p>
          </div>
          <button
            onClick={() => go("properties")}
            className="inline-flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container hover:bg-surface-container-high text-on-surface font-label-lg text-label-lg self-start md:self-end transition-all cursor-pointer border border-surface-container-high/40"
          >
            <span>View all listings</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>

        {/* 3 High-Fidelity Glass Property Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-space-lg">
          {displayCards.map((p) => (
            <div
              key={p.id}
              className="glass-card-interactive group flex flex-col rounded-xl overflow-hidden shadow-xl"
            >
              <div className="relative h-64 w-full overflow-hidden bg-surface-container-lowest">
                <img
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  src={p.img}
                  alt={p.name}
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#030712]/95 via-[#030712]/40 to-transparent" />
                <div className="absolute top-space-sm left-space-sm flex gap-space-xs">
                  <span className="px-space-sm py-space-xxs rounded-full bg-primary-container/90 text-on-primary-container font-label-overline text-label-overline uppercase tracking-wider font-bold shadow-md backdrop-blur-md border border-primary/25">
                    {p.badge || "Verified Unit"}
                  </span>
                </div>
                <div className="absolute top-space-sm right-space-sm">
                  <span className="glass-chip px-space-sm py-space-xxs text-on-surface font-label-md text-label-md flex items-center gap-space-xxs shadow-sm">
                    <span className="material-symbols-outlined text-secondary text-[14px]">
                      location_on
                    </span>{" "}
                    {p.location}
                  </span>
                </div>
                {p.videoId && (
                  <div className="absolute bottom-space-sm right-space-sm">
                    <button
                      onClick={() => inquire(p.name)}
                      className="px-space-sm py-space-xxs rounded-full bg-surface-container-lowest/80 backdrop-blur-md text-secondary hover:text-primary font-label-md text-label-md flex items-center gap-space-xxs transition-colors border border-surface-container-high/40 cursor-pointer active:scale-95"
                    >
                      <span className="material-symbols-outlined text-[16px]">play_circle</span>
                      <span>Watch Video</span>
                    </button>
                  </div>
                )}
              </div>

              <div className="p-space-lg flex flex-col flex-grow justify-between gap-space-md">
                <div>
                  <div className="font-label-overline text-label-overline text-secondary uppercase tracking-wider mb-space-xxs">
                    {p.type}
                  </div>
                  <h3 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                    {p.name}
                  </h3>
                  <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-xxs line-clamp-2">
                    {p.tagline}
                  </p>

                  {/* Architectural Spec Bar */}
                  <div className="mt-space-md architectural-spec-bar flex-wrap">
                    {p.beds > 0 && (
                      <div className="architectural-spec-item text-white">
                        <span className="material-symbols-outlined text-secondary text-[16px]">bed</span>
                        <span className="font-semibold">{p.beds}</span>
                        <span className="text-on-surface-variant text-[11px]">Beds</span>
                      </div>
                    )}
                    {p.baths > 0 && (
                      <>
                        <div className="architectural-spec-divider" />
                        <div className="architectural-spec-item text-white">
                          <span className="material-symbols-outlined text-secondary text-[16px]">bathtub</span>
                          <span className="font-semibold">{p.baths}</span>
                          <span className="text-on-surface-variant text-[11px]">Baths</span>
                        </div>
                      </>
                    )}
                    {p.sqm > 0 && (
                      <>
                        <div className="architectural-spec-divider" />
                        <div className="architectural-spec-item text-white">
                          <span className="material-symbols-outlined text-secondary text-[16px]">square_foot</span>
                          <span className="font-semibold">{p.sqm}</span>
                          <span className="text-on-surface-variant text-[11px]">sqm</span>
                        </div>
                      </>
                    )}
                  </div>

                  <ul className="mt-space-sm space-y-space-xxs font-body-sm text-body-sm text-on-surface-variant">
                    <li className="flex items-center gap-space-xs">
                      <span className="material-symbols-outlined text-secondary text-[16px]">
                        verified
                      </span>
                      <span>Verified authentic title and developer clearance</span>
                    </li>
                  </ul>
                </div>

                <div className="pt-space-sm bg-surface-container-low/60 p-space-sm rounded-lg flex items-center justify-between border border-surface-container-high/40">
                  <div>
                    <span className="font-label-overline text-label-overline text-outline block uppercase tracking-wider">
                      {p.priceLabel || "Price Starts At"}
                    </span>
                    <span className="font-price-xl text-[24px] text-[#38bdf8] font-extrabold drop-shadow-[0_0_12px_rgba(56,189,248,0.35)]">
                      {fmtPrice(p.price)}
                    </span>
                  </div>
                  <button
                    onClick={() => inquire(p.name)}
                    className="btn btn-primary !px-4 !py-2 text-xs font-bold shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                  >
                    <span>Inquire Now</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. DUAL VALUE PROPOSITION / FEATURE SPOTLIGHT */}
      <section className="max-w-max-width mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop py-space-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-stretch">
          {/* Left Narrative Bento */}
          <div className="lg:col-span-6 bg-surface-container/60 backdrop-blur-2xl p-space-xl rounded-2xl flex flex-col justify-between shadow-xl border border-surface-container-high/40">
            <div>
              <div className="flex items-center gap-space-xs mb-space-xxs">
                <span className="w-2 h-2 rounded-full bg-secondary" />
                <span className="font-label-overline text-label-overline uppercase text-secondary tracking-wider">
                  Buyers &amp; Investors
                </span>
              </div>
              <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface mt-space-xs">
                Whether it is your{" "}
                <span className="font-title-editorial italic font-normal text-tertiary">
                  first home
                </span>{" "}
                or your next investment
              </h2>
              <p className="font-body-md text-body-md text-on-surface-variant mt-space-md">
                Some clients are looking for a place to raise a family. Others are weighing a
                property as a long-term investment. The questions are different, and so is the
                guidance — but both start the same way: a transparent conversation about what you
                actually need.
              </p>
              <div className="mt-space-lg space-y-space-sm">
                <div className="flex items-start gap-space-sm">
                  <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">
                    check_circle
                  </span>
                  <span className="font-body-md text-body-md text-on-surface">
                    Shortlists matched to your preferred location, lifestyle, and exact budget
                  </span>
                </div>
                <div className="flex items-start gap-space-sm">
                  <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">
                    check_circle
                  </span>
                  <span className="font-body-md text-body-md text-on-surface">
                    Clear answers on what a listing includes, financing terms, and what it does not include
                  </span>
                </div>
                <div className="flex items-start gap-space-sm">
                  <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">
                    check_circle
                  </span>
                  <span className="font-body-md text-body-md text-on-surface">
                    Free site viewing and in-depth developer consultation arranged on your schedule
                  </span>
                </div>
                <div className="flex items-start gap-space-sm">
                  <span className="material-symbols-outlined text-primary text-[20px] mt-0.5">
                    check_circle
                  </span>
                  <span className="font-body-md text-body-md text-on-surface">
                    Assistance with bank financing, title transfers, and OFW special powers of attorney
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-space-md pt-space-xl">
              <button
                onClick={() => go("contact")}
                className="px-space-lg py-space-sm rounded-full bg-primary-container text-on-primary-container font-label-lg text-label-lg hover:bg-inverse-primary transition-all shadow-md cursor-pointer"
              >
                Book a Consultation
              </button>
              <button
                onClick={() => go("properties")}
                className="px-space-lg py-space-sm rounded-full bg-surface-container-high text-on-surface font-label-lg text-label-lg hover:bg-surface-bright transition-all cursor-pointer"
              >
                Browse Listings
              </button>
            </div>
          </div>

          {/* Right Visual Feature Showcase */}
          <div className="lg:col-span-6 flex flex-col gap-space-md">
            {/* Spotlight Interior Preview Card */}
            <div className="relative rounded-2xl overflow-hidden bg-surface-container/70 backdrop-blur-xl h-64 md:h-72 shadow-xl border border-surface-container-high/40">
              <img
                className="w-full h-full object-cover"
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80"
                alt="Model Unit Showcase"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-dim via-surface-dim/40 to-transparent" />
              <div className="absolute bottom-space-lg left-space-lg right-space-lg flex items-end justify-between">
                <div>
                  <span className="px-space-sm py-space-xxs rounded-full bg-surface-container-lowest/80 text-secondary font-label-overline text-label-overline uppercase tracking-wider backdrop-blur-md border border-surface-container-high/40">
                    Model Unit Showcase
                  </span>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface mt-space-xxs">
                    Pine Deluxe Interior
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Open-concept living, dining &amp; high-spec European kitchen
                  </p>
                </div>
                <button
                  onClick={() => inquire("Pine Deluxe Interior")}
                  className="px-space-md py-space-xs rounded-full bg-primary-container text-on-primary-container font-label-md text-label-md shrink-0 shadow-md cursor-pointer hover:bg-inverse-primary transition-all"
                >
                  Inquire Unit
                </button>
              </div>
            </div>

            {/* Spotlight Jaro Residence Banner */}
            <div className="bg-surface-container-high/80 rounded-2xl p-space-lg backdrop-blur-xl shadow-xl flex flex-col justify-between border border-surface-container-highest/40">
              <div className="flex items-start justify-between">
                <div>
                  <span className="font-label-overline text-label-overline uppercase text-tertiary tracking-wider">
                    Jaro, Iloilo City Enclave
                  </span>
                  <h4 className="font-headline-md text-headline-md text-on-surface mt-space-xxs">
                    House for Sale in Jaro
                  </h4>
                </div>
                <span className="px-space-sm py-space-xxs rounded-full bg-surface-container-lowest text-secondary font-label-md text-label-md border border-surface-container-high/40">
                  Ready for Occupancy
                </span>
              </div>
              <div className="grid grid-cols-3 gap-space-sm my-space-md bg-surface-container-low/70 p-space-md rounded-xl border border-surface-container-high/30">
                <div>
                  <span className="font-label-overline text-label-overline text-on-surface-variant block uppercase">
                    Monthly Amort.
                  </span>
                  <span className="font-numeric-price text-numeric-price text-tertiary font-bold">
                    ₱37,921.82
                  </span>
                </div>
                <div>
                  <span className="font-label-overline text-label-overline text-on-surface-variant block uppercase">
                    Bedrooms
                  </span>
                  <span className="font-numeric-price text-numeric-price text-on-surface font-bold">
                    3 Beds
                  </span>
                </div>
                <div>
                  <span className="font-label-overline text-label-overline text-on-surface-variant block uppercase">
                    Parking
                  </span>
                  <span className="font-numeric-price text-numeric-price text-secondary font-bold">
                    Covered
                  </span>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-space-sm">
                <button
                  onClick={() => go("properties")}
                  className="px-space-md py-space-xs rounded-full bg-primary-container hover:bg-inverse-primary text-on-primary-container font-label-md text-label-md transition-colors cursor-pointer"
                >
                  View Properties
                </button>
                <a
                  className="px-space-md py-space-xs rounded-full bg-surface-container text-on-surface font-label-md text-label-md hover:bg-surface-bright transition-colors flex items-center gap-space-xxs border border-surface-container-high/40"
                  href={CONTACT.phoneHref}
                >
                  <span className="material-symbols-outlined text-[16px] text-secondary">
                    call
                  </span>
                  <span>Inquire Now</span>
                </a>
                <button
                  onClick={() => inquire("House for Sale in Jaro")}
                  className="px-space-md py-space-xs rounded-full bg-surface-container-low text-on-surface-variant hover:text-on-surface font-label-md text-label-md transition-colors flex items-center gap-space-xxs border border-surface-container-high/30 cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                  <span>Brochure Flyer</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. PROCESS STEP NAVIGATION */}
      <section className="max-w-max-width mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop py-space-3xl">
        <div className="text-center max-w-2xl mx-auto mb-space-2xl">
          <div className="inline-flex items-center gap-space-xxs px-space-sm py-space-xxs rounded-full bg-surface-container-high/60 text-secondary font-label-overline text-label-overline uppercase tracking-widest mb-space-xs border border-surface-container-highest/40">
            How We Work
          </div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            Your route home,{" "}
            <span className="font-title-editorial italic font-normal text-tertiary">
              charted
            </span>{" "}
            in four steps
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
            No pushy agents, no hidden fees. A clear path from first call to key handoff — the exact
            process 850+ families have walked.
          </p>
        </div>

        {/* 4 Step Process Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md relative">
          {/* Step 1 */}
          <div className="bg-surface-container/60 hover:bg-surface-container-high/70 backdrop-blur-xl p-space-lg rounded-2xl transition-all duration-300 relative overflow-hidden shadow-lg border border-surface-container-high/40 group">
            <div className="absolute -top-4 -right-2 font-display-xl text-display-xl text-surface-variant/30 font-bold select-none">
              01
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary-container/20 text-primary flex items-center justify-center mb-space-md">
              <span className="material-symbols-outlined text-[24px]">phone_in_talk</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">
              Discovery Call
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              A free 20-minute call to map your budget, must-haves, preferred province, and
              timeline — zero pressure, no scripts.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-surface-container/60 hover:bg-surface-container-high/70 backdrop-blur-xl p-space-lg rounded-2xl transition-all duration-300 relative overflow-hidden shadow-lg border border-surface-container-high/40 group">
            <div className="absolute -top-4 -right-2 font-display-xl text-display-xl text-surface-variant/30 font-bold select-none">
              02
            </div>
            <div className="w-12 h-12 rounded-xl bg-secondary-container/20 text-secondary flex items-center justify-center mb-space-md">
              <span className="material-symbols-outlined text-[24px]">filter_list</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">
              Curated Shortlist
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Within 48 hours you get 3–5 handpicked units across our territories, compared
              side-by-side with genuine pricing.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-surface-container/60 hover:bg-surface-container-high/70 backdrop-blur-xl p-space-lg rounded-2xl transition-all duration-300 relative overflow-hidden shadow-lg border border-surface-container-high/40 group">
            <div className="absolute -top-4 -right-2 font-display-xl text-display-xl text-surface-variant/30 font-bold select-none">
              03
            </div>
            <div className="w-12 h-12 rounded-xl bg-tertiary-container/30 text-tertiary flex items-center justify-center mb-space-md">
              <span className="material-symbols-outlined text-[24px]">location_searching</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">
              Site Visits
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Free coordinated tours — in person with private transport or via live ultra-HD video if
              you are an OFW based abroad.
            </p>
          </div>

          {/* Step 4 */}
          <div className="bg-surface-container/60 hover:bg-surface-container-high/70 backdrop-blur-xl p-space-lg rounded-2xl transition-all duration-300 relative overflow-hidden shadow-lg border border-surface-container-high/40 group">
            <div className="absolute -top-4 -right-2 font-display-xl text-display-xl text-surface-variant/30 font-bold select-none">
              04
            </div>
            <div className="w-12 h-12 rounded-xl bg-primary/20 text-primary flex items-center justify-center mb-space-md">
              <span className="material-symbols-outlined text-[24px]">vpn_key</span>
            </div>
            <h3 className="font-headline-sm text-headline-sm text-on-surface mb-space-xs">
              Close &amp; Turnover
            </h3>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Reservation, financing, contracts, and unit inspection — we walk every document with
              you until the key handoff.
            </p>
          </div>
        </div>
      </section>

      {/* 6. BROKERAGE ADVANTAGE BENTO (More than a listing) */}
      <section className="max-w-max-width mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop py-space-2xl">
        <div className="bg-surface-container-low/80 rounded-2xl p-space-xl backdrop-blur-2xl shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-space-xl items-center border border-surface-container-high/40">
          <div className="lg:col-span-5 space-y-space-md">
            <span className="font-label-overline text-label-overline text-primary uppercase tracking-widest">
              Full-Service Brokerage
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
              More than a listing — a{" "}
              <span className="font-title-editorial italic font-normal text-secondary">
                navigator
              </span>{" "}
              for the whole journey
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant">
              From matching to mortgage to turnover, one licensed team carries your transaction end to
              end. No bouncing between brokers.
            </p>
            <button
              onClick={() => go("services")}
              className="inline-flex items-center gap-space-xs px-space-lg py-space-sm rounded-full bg-primary-container text-on-primary-container font-label-lg text-label-lg hover:bg-inverse-primary transition-all shadow-md cursor-pointer"
            >
              <span>Explore all services</span>
              <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
            </button>
          </div>

          <div className="lg:col-span-7 space-y-space-sm">
            {/* Service Item 1 */}
            <div
              onClick={() => go("services")}
              className="bg-surface-container/70 p-space-md rounded-xl backdrop-blur-md flex items-center justify-between hover:bg-surface-container-high transition-colors group cursor-pointer border border-surface-container-high/30"
            >
              <div className="flex items-center gap-space-md">
                <div className="w-10 h-10 rounded-lg bg-primary-container/20 text-primary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">home</span>
                </div>
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-primary transition-colors">
                    Property Buying Assistance
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Support through the whole purchase — from choosing a property to understanding what
                    is required at each step.
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline group-hover:text-primary group-hover:translate-x-1 transition-all">
                chevron_right
              </span>
            </div>

            {/* Service Item 2 */}
            <div
              onClick={() => go("services")}
              className="bg-surface-container/70 p-space-md rounded-xl backdrop-blur-md flex items-center justify-between hover:bg-surface-container-high transition-colors group cursor-pointer border border-surface-container-high/30"
            >
              <div className="flex items-center gap-space-md">
                <div className="w-10 h-10 rounded-lg bg-secondary-container/20 text-secondary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">trending_up</span>
                </div>
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-secondary transition-colors">
                    Property Investment Guidance
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    For buyers looking at property as an investment rather than a residence, guidance on
                    yield and capital gain options.
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline group-hover:text-secondary group-hover:translate-x-1 transition-all">
                chevron_right
              </span>
            </div>

            {/* Service Item 3 */}
            <div
              onClick={() => go("services")}
              className="bg-surface-container/70 p-space-md rounded-xl backdrop-blur-md flex items-center justify-between hover:bg-surface-container-high transition-colors group cursor-pointer border border-surface-container-high/30"
            >
              <div className="flex items-center gap-space-md">
                <div className="w-10 h-10 rounded-lg bg-tertiary-container/20 text-tertiary flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[22px]">villa</span>
                </div>
                <div>
                  <h4 className="font-headline-sm text-headline-sm text-on-surface group-hover:text-tertiary transition-colors">
                    House &amp; Lot / Residential Assistance
                  </h4>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Dedicated help for buyers looking at residential house and lot properties in Iloilo,
                    Tagaytay, Antipolo, Cavite and Binondo.
                  </p>
                </div>
              </div>
              <span className="material-symbols-outlined text-outline group-hover:text-tertiary group-hover:translate-x-1 transition-all">
                chevron_right
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 7. CLIENT STORIES & TESTIMONIALS */}
      <section className="max-w-max-width mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop py-space-3xl">
        <div className="text-center max-w-2xl mx-auto mb-space-2xl">
          <span className="font-label-overline text-label-overline uppercase text-tertiary tracking-widest block mb-space-xxs">
            Client Stories
          </span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            Families we've{" "}
            <span className="font-title-editorial italic font-normal text-tertiary">
              navigated
            </span>{" "}
            home
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-space-xs">
            Genuine feedback from buyers, overseas Filipino workers, and commercial investors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg">
          {/* Testimonial 1 */}
          <div className="bg-surface-container/60 backdrop-blur-2xl p-space-lg rounded-2xl flex flex-col justify-between shadow-xl border border-surface-container-high/40">
            <div>
              <div className="flex items-center gap-space-xxs text-tertiary mb-space-sm">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <p className="font-body-md text-body-md text-on-surface italic">
                “As an OFW in Dubai, I did everything over video call — the site visit, the
                reservation, even the turnover. They treated my money like their own.”
              </p>
            </div>
            <div className="pt-space-md mt-space-md border-t-0 flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold">
                RD
              </div>
              <div>
                <div className="font-label-lg text-label-lg text-on-surface">Ramil &amp; Cecilia D.</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">
                  OFW · Dubai — bought in Cavite
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial 2 */}
          <div className="bg-surface-container/60 backdrop-blur-2xl p-space-lg rounded-2xl flex flex-col justify-between shadow-xl border border-surface-container-high/40">
            <div>
              <div className="flex items-center gap-space-xxs text-tertiary mb-space-sm">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <p className="font-body-md text-body-md text-on-surface italic">
                “They negotiated ₱400,000 below asking and flagged a title issue another broker
                missed entirely. That's the difference a navigator makes.”
              </p>
            </div>
            <div className="pt-space-md mt-space-md border-t-0 flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-full bg-secondary/20 text-secondary flex items-center justify-center font-bold">
                KS
              </div>
              <div>
                <div className="font-label-lg text-label-lg text-on-surface">Katrina S.</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">
                  Homeowner · Iloilo City
                </div>
              </div>
            </div>
          </div>

          {/* Testimonial 3 */}
          <div className="bg-surface-container/60 backdrop-blur-2xl p-space-lg rounded-2xl flex flex-col justify-between shadow-xl border border-surface-container-high/40">
            <div>
              <div className="flex items-center gap-space-xxs text-tertiary mb-space-sm">
                {[...Array(5)].map((_, i) => (
                  <span
                    key={i}
                    className="material-symbols-outlined text-[18px]"
                    style={{ fontVariationSettings: "'FILL' 1" }}
                  >
                    star
                  </span>
                ))}
              </div>
              <p className="font-body-md text-body-md text-on-surface italic">
                “My Binondo unit was tenanted within six weeks of turnover. Their yield projections
                weren't sales talk — they were accurate to the peso.”
              </p>
            </div>
            <div className="pt-space-md mt-space-md border-t-0 flex items-center gap-space-sm">
              <div className="w-10 h-10 rounded-full bg-tertiary/20 text-tertiary flex items-center justify-center font-bold">
                JT
              </div>
              <div>
                <div className="font-label-lg text-label-lg text-on-surface">Jonathan T.</div>
                <div className="font-body-sm text-body-sm text-on-surface-variant">
                  Investor · Makati City
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 8. INTERACTIVE CALL TO ACTION / LEAD CAPTURE */}
      <section
        className="max-w-max-width mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop py-space-3xl"
        id="lead-inquiry-box"
      >
        <div className="relative rounded-3xl bg-gradient-to-br from-surface-container-high via-surface-container to-surface-container-low p-space-xl md:p-space-3xl overflow-hidden shadow-2xl border border-surface-container-highest/40">
          {/* Decorative ambient gradient lights */}
          <div className="absolute -top-24 -right-24 w-80 h-80 bg-primary-container/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-secondary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-space-md">
            <span className="font-label-overline text-label-overline uppercase text-tertiary tracking-widest">
              Get Started Today
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
              Ready to find the right property?
            </h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mx-auto">
              Send us your preferred location, property type, and budget range — we will come back
              with a tailored shortlist within 24 hours.
            </p>

            {/* Interactive Lead Submission Form */}
            <form
              className="mt-space-lg text-left bg-[#050d23]/80 p-space-lg rounded-2xl backdrop-blur-2xl shadow-2xl space-y-space-md border border-[rgba(59,130,246,0.25)]"
              id="dhn-lead-form"
              onSubmit={handleLeadSubmit}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-space-xxs">
                    Full Name *
                  </label>
                  <input
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full min-h-[48px] px-space-md py-space-xs rounded-xl bg-[#060c1a]/70 text-white font-body-md placeholder:text-slate-500 focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 transition-all border border-[rgba(59,130,246,0.2)]"
                    placeholder="e.g. Maria Santos"
                    required
                    type="text"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-space-xxs">
                    Phone / WhatsApp / Viber *
                  </label>
                  <input
                    value={formPhone}
                    onChange={(e) => setFormPhone(e.target.value)}
                    className="w-full min-h-[48px] px-space-md py-space-xs rounded-xl bg-[#060c1a]/70 text-white font-body-md placeholder:text-slate-500 focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 transition-all border border-[rgba(59,130,246,0.2)]"
                    placeholder="+63 9XX XXX XXXX"
                    required
                    type="tel"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-space-xxs">
                    Preferred Territory
                  </label>
                  <select
                    value={formTerritory}
                    onChange={(e) => setFormTerritory(e.target.value)}
                    className="w-full min-h-[48px] px-space-md py-space-xs rounded-xl bg-[#060c1a]/70 text-white font-body-md focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 transition-all border border-[rgba(59,130,246,0.2)] cursor-pointer"
                  >
                    <option value="Iloilo" className="bg-[#121b31] text-white">
                      Iloilo (Estate &amp; City)
                    </option>
                    <option value="Binondo" className="bg-[#121b31] text-white">
                      Binondo, Manila
                    </option>
                    <option value="Tagaytay" className="bg-[#121b31] text-white">
                      Tagaytay Ridges
                    </option>
                    <option value="Cavite" className="bg-[#121b31] text-white">
                      Cavite Subdivisions
                    </option>
                    <option value="Antipolo" className="bg-[#121b31] text-white">
                      Antipolo Retreats
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-space-xxs">
                    Property Type
                  </label>
                  <select
                    value={formPropType}
                    onChange={(e) => setFormPropType(e.target.value)}
                    className="w-full min-h-[48px] px-space-md py-space-xs rounded-xl bg-[#060c1a]/70 text-white font-body-md focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 transition-all border border-[rgba(59,130,246,0.2)] cursor-pointer"
                  >
                    <option value="House and Lot" className="bg-[#121b31] text-white">
                      House and Lot
                    </option>
                    <option value="Condominium" className="bg-[#121b31] text-white">
                      High-Rise Condominium
                    </option>
                    <option value="Lot Only" className="bg-[#121b31] text-white">
                      Lot Only / Land
                    </option>
                    <option value="Commercial" className="bg-[#121b31] text-white">
                      Commercial / Rental Asset
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-space-xxs">
                    Target Budget Range
                  </label>
                  <select
                    value={formBudget}
                    onChange={(e) => setFormBudget(e.target.value)}
                    className="w-full min-h-[48px] px-space-md py-space-xs rounded-xl bg-[#060c1a]/70 text-white font-body-md focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 transition-all border border-[rgba(59,130,246,0.2)] cursor-pointer"
                  >
                    <option value="2.5M - 5M" className="bg-[#121b31] text-white">
                      ₱2.5M – ₱5M
                    </option>
                    <option value="5M - 10M" className="bg-[#121b31] text-white">
                      ₱5M – ₱10M
                    </option>
                    <option value="10M - 20M" className="bg-[#121b31] text-white">
                      ₱10M – ₱20M
                    </option>
                    <option value="20M+" className="bg-[#121b31] text-white">
                      ₱20M+ (Luxury &amp; Estate)
                    </option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-label-md text-label-md text-on-surface-variant mb-space-xxs">
                  Message or Specific Requests
                </label>
                <textarea
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  className="w-full px-space-md py-space-xs rounded-xl bg-[#060c1a]/70 text-white font-body-md placeholder:text-slate-500 focus:outline-none focus:border-[#38bdf8] focus:ring-2 focus:ring-[#38bdf8]/20 transition-all border border-[rgba(59,130,246,0.2)]"
                  placeholder="Tell us if you're an OFW, your preferred move-in date, or questions about title &amp; financing..."
                  rows={3}
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-space-md pt-space-xs">
                <div className="flex items-center gap-space-xs text-on-surface-variant font-body-sm text-body-sm">
                  <span className="material-symbols-outlined text-secondary text-[18px]">
                    verified_user
                  </span>
                  <span>Your information is strictly protected by PRC brokerage rules.</span>
                </div>
                <button
                  disabled={formSubmitting}
                  className="btn btn-primary !px-8 !py-3 w-full sm:w-auto font-bold shadow-[0_0_24px_rgba(37,99,235,0.45)] disabled:opacity-50"
                  type="submit"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  <span>{formSubmitting ? "Sending..." : "Send Inquiry to Advisors"}</span>
                </button>
              </div>
            </form>

            {/* Feedback message container */}
            {formSubmitted && (
              <div className="p-space-md rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md text-center border border-secondary/40 animate-card-in">
                <div className="flex items-center justify-center gap-space-xs text-secondary">
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>
                    Thank you! Your request has been logged into our advisory queue. An advisor will reach
                    out within 24 hours.
                  </span>
                </div>
              </div>
            )}

            {/* Quick Channel Fallbacks */}
            <div className="flex flex-wrap items-center justify-center gap-space-md pt-space-sm font-label-md text-label-md">
              <a
                className="inline-flex items-center gap-space-xxs text-secondary hover:underline"
                href={CONFIG.MESSENGER_URL}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span className="material-symbols-outlined text-[18px]">forum</span>
                <span>Message on Messenger</span>
              </a>
              <span className="text-outline-variant">•</span>
              <a
                className="inline-flex items-center gap-space-xxs text-primary hover:underline"
                href={CONTACT.phoneHref}
              >
                <span className="material-symbols-outlined text-[18px]">phone</span>
                <span>Call {CONTACT.phone}</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
