import {
  CONTACT,
  FEATURED_PROPERTY,
  LOCATIONS,
  Page,
  STATS,
  TESTIMONIALS,
  fmtPrice,
} from "../data";
import { useStore } from "../store";
import { CountUp, Diamond, Reveal, SectionHead } from "../ui";
import PropertyCard from "../components/PropertyCard";

interface Props {
  go: (p: Page) => void;
  inquire: (name: string) => void;
  browseLocation: (loc: string) => void;
}

const STEPS = [
  { icon: "fa-phone-volume", title: "Discovery Call", copy: "A free 20-minute call to map your budget, must-haves, and timeline — no pressure, no scripts." },
  { icon: "fa-list-check", title: "Curated Shortlist", copy: "Within 48 hours you get 3–5 hand-picked units across our territories, compared side by side." },
  { icon: "fa-location-dot", title: "Site Visits", copy: "Free coordinated tours — in person or via live video if you're abroad. See everything, ask anything." },
  { icon: "fa-key", title: "Close & Turnover", copy: "Reservation, financing, contracts, and turnover — we walk every document with you to the key handoff." },
];

export default function Home({ go, inquire, browseLocation }: Props) {
  const { properties, featuredId, services } = useStore();
  /* Featured on Home: explicit owner pick → first "Featured" badge → first listing */
  const f =
    properties.find((p) => p.id === featuredId) ??
    properties.find((p) => p.badge === "Featured") ??
    properties[0] ??
    FEATURED_PROPERTY;
  const latest = properties.filter((p) => p.id !== f.id).slice(0, 3);

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative mx-auto max-w-7xl px-5 pb-14 pt-32 sm:px-8 sm:pt-40">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="glass-chip inline-flex items-center gap-2 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-brand-200">
                <i className="fa-solid fa-compass text-brass-300" />
                Guiding You Home, Building Your Future
              </span>
            </Reveal>
            <Reveal delay={100}>
              <h1 className="font-display mt-7 text-[2.6rem] font-semibold leading-[1.06] text-slate-50 sm:text-6xl xl:text-[4.4rem]">
                Find the Right Property.
                <span className="mt-2 block text-brand-300">
                  Build the <em className="font-display italic text-brass-300">Future</em> You Envision.
                </span>
              </h1>
            </Reveal>
            <Reveal delay={200}>
              <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-slate-300 sm:text-lg">
                Discover carefully selected homes and investment opportunities across
                Iloilo, Tagaytay, Antipolo, Cavite, and Binondo — with guidance from first
                inquiry to site viewing.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-8 flex flex-wrap gap-3.5">
                <button onClick={() => go("properties")} className="btn btn-primary">
                  Explore Properties
                  <i className="fa-solid fa-arrow-right" />
                </button>
                <button onClick={() => go("contact")} className="btn btn-ghost">
                  <i className="fa-regular fa-paper-plane text-brand-300" />
                  Send an Inquiry
                </button>
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-semibold text-slate-300/80">
                <span className="inline-flex items-center gap-2">
                  <i className="fa-solid fa-location-dot text-brand-400" />
                  5 areas served
                </span>
                <span className="inline-flex items-center gap-2">
                  <i className="fa-solid fa-eye text-brand-400" />
                  Site viewing on request
                </span>
                <a href={CONTACT.phoneHref} className="inline-flex items-center gap-2 transition hover:text-white">
                  <i className="fa-solid fa-phone text-brand-400" />
                  {CONTACT.phone}
                </a>
              </div>
            </Reveal>
            <Reveal delay={400}>
              <div className="mt-10">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.26em] text-slate-400">
                  Areas we navigate
                </p>
                <div className="mt-3.5 flex flex-wrap gap-2.5">
                  {LOCATIONS.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => browseLocation(loc)}
                      className="glass-chip group inline-flex items-center gap-2 px-4 py-2 text-[13px] font-bold text-slate-100 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300/70 hover:bg-brand-500/20 hover:text-white"
                    >
                      <i className="fa-solid fa-location-dot text-[11px] text-brand-400 transition group-hover:text-brand-200" />
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>

          {/* Featured property card */}
          <div className="lg:col-span-5">
            <Reveal delay={250}>
              <div className="glass-panel group relative overflow-hidden rounded-2xl">
                <div className="absolute right-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-brass-400 px-3 py-1 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-brand-950 shadow-lg">
                  <i className="fa-solid fa-star text-[9px]" />
                  Featured Listing
                </div>
                <div className="relative h-60 overflow-hidden sm:h-72">
                  <img
                    src={f.img}
                    alt={f.name}
                    className="h-full w-full object-cover animate-kenburns"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/15 to-transparent" />
                  <div className="absolute bottom-4 left-5 right-5">
                    <p className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-200">
                      <i className="fa-solid fa-location-dot" />
                      {f.area}
                    </p>
                    <h2 className="font-display mt-1.5 text-2xl font-semibold text-white">
                      {f.name}
                    </h2>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[13px] font-semibold text-slate-200">
                    {f.beds > 0 ? (
                      <>
                        <span><i className="fa-solid fa-bed mr-1.5 text-brand-300" />{f.beds} Beds</span>
                        <span><i className="fa-solid fa-bath mr-1.5 text-brand-300" />{f.baths} Baths</span>
                        <span><i className="fa-solid fa-ruler-combined mr-1.5 text-brand-300" />{f.sqm} sqm</span>
                      </>
                    ) : (
                      <span><i className="fa-solid fa-house mr-1.5 text-brand-300" />{f.lotNote ?? "House / Residential"}</span>
                    )}
                    {f.parking > 0 && (
                      <span><i className="fa-solid fa-car mr-1.5 text-brand-300" />Carport</span>
                    )}
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {f.price < 100_000 ? "Price starts at" : "Starting at"}
                      </p>
                      <p className="font-display text-3xl font-semibold text-brand-300">
                        {fmtPrice(f.price)}
                      </p>
                      {f.priceNote && (
                        <p className="mt-0.5 text-[10.5px] italic text-slate-400">
                          {f.priceNote}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => inquire(f.name)}
                      className="btn btn-primary btn-glow !px-5"
                    >
                      Inquire
                      <i className="fa-solid fa-arrow-right" />
                    </button>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        {/* Stats strip */}
        <Reveal delay={150}>
          <div className="glass-panel-deep mt-14 grid grid-cols-2 divide-white/10 rounded-2xl px-2 py-7 sm:px-6 md:grid-cols-4 md:divide-x">
            {STATS.map((s) => (
              <div key={s.label} className="px-4 py-3 text-center md:py-0">
                <p className="font-display text-3xl font-semibold text-white sm:text-4xl">
                  <CountUp
                    value={s.value}
                    prefix={s.prefix ?? ""}
                    suffix={s.suffix ?? ""}
                    decimals={s.decimals ?? 0}
                  />
                </p>
                <p className="mt-1.5 text-[11.5px] font-bold uppercase tracking-[0.14em] text-slate-400">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </Reveal>

        {/* Quick service strip */}
        <Reveal delay={200}>
          <div className="glass-panel mt-6 grid grid-cols-2 gap-4 rounded-2xl p-4 sm:grid-cols-4 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/20 text-brand-300">
                <i className="fa-solid fa-key text-sm" />
              </div>
              <div className="leading-tight">
                <strong className="block text-sm text-white">Buying</strong>
                <span className="text-xs text-slate-400">Purchase assistance</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/20 text-brand-300">
                <i className="fa-solid fa-chart-line text-sm" />
              </div>
              <div className="leading-tight">
                <strong className="block text-sm text-white">Investing</strong>
                <span className="text-xs text-slate-400">Investment guidance</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/20 text-brand-300">
                <i className="fa-solid fa-magnifying-glass-location text-sm" />
              </div>
              <div className="leading-tight">
                <strong className="block text-sm text-white">Matching</strong>
                <span className="text-xs text-slate-400">Property matching</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-brand-500/20 text-brand-300">
                <i className="fa-solid fa-eye text-sm" />
              </div>
              <div className="leading-tight">
                <strong className="block text-sm text-white">Viewing</strong>
                <span className="text-xs text-slate-400">Site viewing &amp; consultation</span>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============ LOCATION TICKER ============ */}
      <section className="marquee-mask overflow-hidden border-y border-white/10 bg-white/[0.03] py-5">
        <div className="marquee-track flex w-max items-center gap-10 pr-10">
          {[0, 1].map((dup) => (
            <div key={dup} className="flex items-center gap-10" aria-hidden={dup === 1}>
              {[...LOCATIONS, "Metro Manila", "Visayas"].map((loc) => (
                <span key={`${dup}-${loc}`} className="flex items-center gap-10">
                  <button
                    onClick={() => ((LOCATIONS as readonly string[]).includes(loc) ? browseLocation(loc) : go("properties"))}
                    className="font-display text-xl font-medium uppercase tracking-[0.18em] text-slate-300 transition hover:text-brand-300 sm:text-2xl"
                  >
                    {loc}
                  </button>
                  <Diamond />
                </span>
              ))}
            </div>
          ))}
        </div>
      </section>

      {/* ============ FEATURED LISTINGS ============ */}
      <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            kicker="Featured listings"
            title={<>Properties <span className="text-brand-300">currently on offer</span></>}
            sub="Every listing below comes straight from official Dream Home Navigators material — nothing is estimated or embellished."
          />
          <Reveal delay={150}>
            <button onClick={() => go("properties")} className="btn btn-ghost">
              View all listings
              <i className="fa-solid fa-arrow-right" />
            </button>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {properties.slice(0, 3).map((p, i) => (
            <Reveal key={p.id} delay={i * 120}>
              <PropertyCard p={p} onInquire={inquire} index={i} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ BUYERS & INVESTORS ============ */}
      <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="order-2 lg:order-1 lg:col-span-6">
            <Reveal>
              <div className="relative overflow-hidden rounded-2xl glass-panel p-2">
                <img
                  src="/assets/img/pine-deluxe-living.jpg"
                  alt="Living area of the Pine Deluxe unit with sofa, centre table and dining space beyond"
                  className="w-full rounded-xl object-cover shadow-2xl"
                />
              </div>
            </Reveal>
          </div>
          <div className="order-1 lg:order-2 lg:col-span-6">
            <Reveal delay={150}>
              <p className="kicker">Buyers &amp; investors</p>
              <h2 className="font-display mt-3 text-3xl font-semibold text-white sm:text-4xl">
                Whether it is your first home or your next investment
              </h2>
              <p className="mt-4 text-[14.5px] leading-relaxed text-slate-300">
                Some clients are looking for a place to raise a family. Others are
                weighing a property as a long-term investment. The questions are different, and so is the
                guidance — but both start the same way: a conversation about what you actually need.
              </p>
              <ul className="mt-6 space-y-3 text-sm text-slate-200">
                <li className="flex items-center gap-3">
                  <i className="fa-solid fa-check text-brand-300" />
                  Shortlists matched to your preferred location and budget
                </li>
                <li className="flex items-center gap-3">
                  <i className="fa-solid fa-check text-brand-300" />
                  Clear answers on what a listing does and does not include
                </li>
                <li className="flex items-center gap-3">
                  <i className="fa-solid fa-check text-brand-300" />
                  Site viewing and consultation arranged on request
                </li>
                <li className="flex items-center gap-3">
                  <i className="fa-solid fa-check text-brand-300" />
                  Assistance with buyer inquiries throughout the process
                </li>
              </ul>
              <div className="mt-8 flex flex-wrap gap-4">
                <button onClick={() => go("contact")} className="btn btn-primary">
                  Book a consultation
                </button>
                <button onClick={() => go("properties")} className="btn btn-ghost">
                  Browse listings
                </button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ============ SPOTLIGHT: JARO HOUSE ============ */}
      <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8">
        <Reveal>
          <div className="glass-panel-deep relative overflow-hidden rounded-3xl p-6 sm:p-10">
            <div className="grid items-center gap-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="relative overflow-hidden rounded-2xl">
                  <span className="absolute left-3 top-3 z-10 rounded-full bg-brand-600 px-3 py-1 text-[11px] font-extrabold uppercase tracking-wider text-white shadow-lg">
                    Property Spotlight
                  </span>
                  <img
                    src="/assets/img/jaro-house-exterior.jpg"
                    alt="Facade of the two-storey house for sale in Jaro, Iloilo City with balcony"
                    className="h-80 w-full object-cover sm:h-96"
                  />
                </div>
              </div>
              <div className="lg:col-span-5">
                <p className="kicker">Jaro, Iloilo City</p>
                <h3 className="font-display mt-2 text-2xl font-semibold text-white sm:text-3xl">
                  House for Sale in Jaro, Iloilo City
                </h3>
                <p className="mt-3 text-[14px] leading-relaxed text-slate-300">
                  A two-storey residence with a spacious living room, modern kitchen and dining area, three bedrooms, two toilet &amp; bath, and a carport.
                </p>
                <div className="mt-6 grid grid-cols-2 gap-3 border-y border-white/10 py-4 text-xs">
                  <div>
                    <span className="block text-slate-400">Monthly amortization</span>
                    <span className="text-base font-bold text-brand-300">₱37,921.82</span>
                  </div>
                  <div>
                    <span className="block text-slate-400">Bedrooms</span>
                    <span className="text-base font-bold text-white">3 Bedrooms</span>
                  </div>
                  <div>
                    <span className="block text-slate-400">Toilet &amp; bath</span>
                    <span className="text-base font-bold text-white">2 Toilet &amp; Bath</span>
                  </div>
                  <div>
                    <span className="block text-slate-400">Parking</span>
                    <span className="text-base font-bold text-white">Carport</span>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  <button onClick={() => go("properties")} className="btn btn-primary">
                    View Properties
                  </button>
                  <button onClick={() => inquire("House for Sale in Jaro, Iloilo City")} className="btn btn-ghost">
                    Inquire now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ============ PROCESS ============ */}
      <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8">
        <SectionHead
          align="center"
          kicker="How we work"
          title={<>Your route home, <em className="italic text-brass-300">charted</em> in four steps</>}
          sub="No pushy agents, no hidden fees. A clear path from first call to key handoff — the same one 850+ families have walked."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.title} delay={i * 110}>
              <div className="glass-panel group relative h-full overflow-hidden p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-400/40">
                <span className="font-display absolute -right-2 -top-5 text-[84px] font-bold leading-none text-white/[0.05] transition-colors duration-300 group-hover:text-brand-400/10">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 text-lg text-white shadow-lg shadow-brand-900/50">
                  <i className={`fa-solid ${s.icon}`} />
                </span>
                <h3 className="font-display mt-5 text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-2.5 text-[13.5px] leading-relaxed text-slate-300/90">{s.copy}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ SERVICES PREVIEW ============ */}
      <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHead
              kicker="Full-service brokerage"
              title={<>More than a listing — a <span className="text-brand-300">navigator</span> for the whole journey</>}
              sub="From matching to mortgage to turnover, one licensed team carries your transaction end to end."
            />
            <Reveal delay={200}>
              <button onClick={() => go("services")} className="btn btn-primary mt-8">
                Explore all services
                <i className="fa-solid fa-arrow-right" />
              </button>
            </Reveal>
          </div>
          <div className="grid gap-5 lg:col-span-7">
            {services.slice(0, 3).map((s, i) => (
              <Reveal key={s.id} delay={i * 110}>
                <button
                  onClick={() => go("services")}
                  className="glass-panel group flex w-full items-center gap-5 p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/40 hover:bg-white/[0.11]"
                >
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 text-lg text-white shadow-lg">
                    <i className={`fa-solid ${s.icon}`} />
                  </span>
                  <span className="flex-1">
                    <span className="font-display block text-[17px] font-semibold text-white">{s.title}</span>
                    <span className="mt-1 line-clamp-2 block text-[13px] leading-relaxed text-slate-300/85">{s.desc}</span>
                  </span>
                  <i className="fa-solid fa-arrow-right text-brand-300 transition-transform duration-300 group-hover:translate-x-1.5" />
                </button>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ TESTIMONIALS ============ */}
      <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8">
        <SectionHead
          align="center"
          kicker="Client stories"
          title={<>Families we've <em className="italic text-brass-300">navigated</em> home</>}
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 120}>
              <figure className="glass-panel flex h-full flex-col p-6 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-400/35">
                <i className="fa-solid fa-quote-left text-2xl text-brand-400/70" />
                <div className="mt-4 flex gap-1 text-brass-300">
                  {[...Array(5)].map((_, s) => (
                    <i key={s} className="fa-solid fa-star text-xs" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-[14px] leading-relaxed text-slate-200">
                  "{t.quote}"
                </blockquote>
                <figcaption className="mt-6 border-t border-white/10 pt-4">
                  <p className="text-sm font-bold text-white">{t.name}</p>
                  <p className="mt-0.5 text-xs font-semibold text-brand-300">{t.meta}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ CTA BAND ============ */}
      <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8">
        <Reveal>
          <div className="glass-panel-deep relative overflow-hidden rounded-3xl px-6 py-14 text-center sm:px-12">
            <div
              className="pointer-events-none absolute inset-0 opacity-60"
              style={{ background: "radial-gradient(60% 90% at 50% 110%, rgba(37,99,235,0.4), transparent 70%)" }}
            />
            <p className="kicker justify-center">Get started</p>
            <h2 className="font-display mx-auto mt-4 max-w-2xl text-3xl font-semibold leading-tight text-white sm:text-[2.6rem]">
              Ready to find the right property?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-slate-300">
              Send us your preferred location, property type and budget range — we will come back to you with the options that actually fit.
            </p>
            <div className="relative mt-9 flex flex-wrap justify-center gap-4">
              <button onClick={() => go("contact")} className="btn btn-primary btn-glow">
                <i className="fa-regular fa-paper-plane" />
                Send an Inquiry
              </button>
              <a href={CONTACT.messenger} target="_blank" rel="noreferrer" className="btn btn-ghost">
                <i className="fa-brands fa-facebook-messenger text-brand-300" />
                Message on Messenger
              </a>
            </div>
            <p className="relative mt-7 text-sm font-semibold text-slate-400">
              <i className="fa-solid fa-phone mr-2 text-brand-400" />
              <a href={CONTACT.phoneHref} className="transition hover:text-white">Call {CONTACT.phone}</a>
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
