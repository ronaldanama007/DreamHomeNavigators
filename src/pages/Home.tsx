import {
  CONTACT,
  FEATURED_PROPERTY,
  LOCATIONS,
  Page,
  PROPERTIES,
  SERVICES,
  STATS,
  TESTIMONIALS,
  fmtPrice,
} from "../data";
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
  const latest = PROPERTIES.filter((p) => p.id !== "pine-deluxe").slice(0, 3);
  const f = FEATURED_PROPERTY;

  return (
    <>
      {/* ============ HERO ============ */}
      <section className="relative mx-auto max-w-7xl px-5 pb-14 pt-32 sm:px-8 sm:pt-40">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Reveal>
              <span className="glass-chip inline-flex items-center gap-2 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.22em] text-brand-200">
                <i className="fa-solid fa-compass text-brass-300" />
                Licensed Real Estate Brokerage · Philippines
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
                Dream Home Navigators guides families, first-time buyers, investors and OFWs
                to verified homes, condos and lots across five thriving territories — with
                financing, paperwork and site visits handled for you.
              </p>
            </Reveal>
            <Reveal delay={300}>
              <div className="mt-8 flex flex-wrap gap-3.5">
                <button onClick={() => go("properties")} className="btn btn-primary">
                  Browse Properties
                  <i className="fa-solid fa-arrow-right" />
                </button>
                <button onClick={() => go("contact")} className="btn btn-ghost">
                  <i className="fa-solid fa-headset text-brand-300" />
                  Talk to an Advisor
                </button>
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
                    <span><i className="fa-solid fa-bed mr-1.5 text-brand-300" />{f.beds} Beds</span>
                    <span><i className="fa-solid fa-bath mr-1.5 text-brand-300" />{f.baths} Baths</span>
                    <span><i className="fa-solid fa-ruler-combined mr-1.5 text-brand-300" />{f.sqm} sqm</span>
                    <span><i className="fa-solid fa-car mr-1.5 text-brand-300" />{f.parking} Parking</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Starting at</p>
                      <p className="font-display text-3xl font-semibold text-brand-300">
                        {fmtPrice(f.price)}
                      </p>
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

      {/* ============ LATEST LISTINGS ============ */}
      <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <SectionHead
            kicker="Fresh on the market"
            title={<>Handpicked units, <span className="text-brand-300">verified & vetted</span></>}
            sub="Every listing is checked for clean titles, registered developers and honest pricing before it ever reaches you."
          />
          <Reveal delay={150}>
            <button onClick={() => go("properties")} className="btn btn-ghost">
              View all {PROPERTIES.length} listings
              <i className="fa-solid fa-arrow-right" />
            </button>
          </Reveal>
        </div>
        <div className="mt-12 grid gap-7 sm:grid-cols-2 xl:grid-cols-3">
          {latest.map((p, i) => (
            <Reveal key={p.id} delay={i * 120}>
              <PropertyCard p={p} onInquire={inquire} index={i} />
            </Reveal>
          ))}
        </div>
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
            {SERVICES.slice(0, 3).map((s, i) => (
              <Reveal key={s.title} delay={i * 110}>
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
            <p className="kicker justify-center">Set your bearing</p>
            <h2 className="font-display mx-auto mt-4 max-w-2xl text-3xl font-semibold leading-tight text-white sm:text-[2.6rem]">
              Ready to find the home your future deserves?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-slate-300">
              Send an inquiry and a licensed navigator replies within 24 hours — or chat with
              us live on Messenger right now.
            </p>
            <div className="relative mt-9 flex flex-wrap justify-center gap-4">
              <button onClick={() => go("contact")} className="btn btn-primary btn-glow">
                <i className="fa-regular fa-paper-plane" />
                Send an Inquiry
              </button>
              <a href={CONTACT.messenger} target="_blank" rel="noreferrer" className="btn btn-ghost">
                <i className="fa-brands fa-facebook-messenger text-brand-300" />
                Chat on Messenger
              </a>
            </div>
            <p className="relative mt-7 text-sm font-semibold text-slate-400">
              <i className="fa-solid fa-phone mr-2 text-brand-400" />
              <a href={CONTACT.phoneHref} className="transition hover:text-white">{CONTACT.phone}</a>
            </p>
          </div>
        </Reveal>
      </section>
    </>
  );
}
