import { Page, TEAM } from "../data";
import { useStore } from "../store";
import { CountUp, Reveal, SectionHead } from "../ui";

export default function About({ go, inquire }: { go: (p: Page) => void; inquire: (n: string) => void }) {
  const founders = TEAM.filter((m) => m.role.includes("Founder"));
  const crew = TEAM.filter((m) => !m.role.includes("Founder"));
  const { about } = useStore();

  return (
    <>
      {/* Story */}
      <section className="mx-auto max-w-7xl px-4 pt-28 sm:px-8 sm:pt-36">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="relative">
              <div className="glass-panel overflow-hidden rounded-2xl p-2.5">
                <div className="overflow-hidden rounded-xl">
                  <img
                    src="/assets/img/pine-deluxe-exterior.jpg"
                    alt="Two-storey Pine Deluxe unit at Emerald Estate with covered carport and roof-deck balcony"
                    className="h-72 sm:h-[480px] w-full object-cover transition-transform duration-[1.4s] hover:scale-105"
                  />
                </div>
              </div>
              <div className="glass-panel-deep absolute bottom-3 right-3 sm:-bottom-6 sm:-right-6 rounded-2xl px-5 py-3 sm:px-6 sm:py-4 text-center shadow-2xl">
                <p className="font-display text-2xl sm:text-3xl font-semibold text-brand-300">
                  <CountUp value={5} />
                </p>
                <p className="mt-0.5 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-slate-300">
                  Key areas served
                </p>
              </div>
              <div className="glass-chip absolute -top-4 left-6 inline-flex items-center gap-2 !bg-ink-900/70 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-200">
                <i className="fa-solid fa-compass text-brass-300" />
                Dream Home Navigators
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <SectionHead kicker={about.kicker} title={about.headline} />
            <Reveal delay={150}>
              <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-slate-300">
                <p>{about.paragraph1}</p>
                <p>{about.paragraph2}</p>
              </div>
            </Reveal>
            <Reveal delay={250}>
              <div className="glass-panel-deep mt-8 rounded-2xl p-7 text-center">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-brand-300">
                  Our Mission
                </p>
                <h3 className="font-display mx-auto mt-3 max-w-2xl text-xl font-semibold leading-snug text-white sm:text-2xl">
                  "{about.mission}"
                </h3>
                <p className="mt-3 text-sm font-bold text-brass-300">
                  {about.vision}
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* How we work / 3 Core Principles */}
      <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8">
        <SectionHead
          align="center"
          kicker="How we work"
          title={<>Trusted, professional <span className="text-brand-300">service</span></>}
          sub="A consistent way of working, so you always know what happens next."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          <Reveal delay={100}>
            <div className="glass-panel h-full rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/40">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-500/20 text-xl text-brand-300">
                <i className="fa-solid fa-shield-halved" />
              </span>
              <h3 className="font-display mt-5 text-xl font-semibold text-white">Straight information</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                We work from what is actually documented about a property. Where a detail has not been confirmed, we say so rather than filling the gap with a guess.
              </p>
            </div>
          </Reveal>
          <Reveal delay={180}>
            <div className="glass-panel h-full rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/40">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-500/20 text-brand-300">
                <i className="fa-solid fa-compass" />
              </span>
              <h3 className="font-display mt-5 text-xl font-semibold text-white">Guidance, not pressure</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                The goal is a property that fits your plans. That means honest answers about what suits you — and what does not.
              </p>
            </div>
          </Reveal>
          <Reveal delay={260}>
            <div className="glass-panel h-full rounded-2xl p-7 transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/40">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-brand-500/20 text-brand-300">
                <i className="fa-solid fa-comments" />
              </span>
              <h3 className="font-display mt-5 text-xl font-semibold text-white">Available when it matters</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-300">
                Buying property runs on timing. Questions get answered by call, text or Messenger so you are never left waiting.
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 4-Step Timeline & Why choose us */}
      <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8">
        <Reveal>
          <div className="glass-panel-deep rounded-3xl p-7 sm:p-12">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <SectionHead
                  kicker="Why choose us"
                  title={<>A straightforward, <em className="italic text-brass-300">client-focused</em> approach</>}
                  sub="We concentrate on the locations we know rather than spreading thin across Luzon and Visayas."
                />
                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={() => go("contact")} className="btn btn-primary">
                    <i className="fa-regular fa-paper-plane" />
                    Send an Inquiry
                  </button>
                  <button onClick={() => go("properties")} className="btn btn-ghost">
                    Browse Properties
                  </button>
                </div>
              </div>
              <div className="lg:col-span-7">
                <ul className="grid gap-4 sm:grid-cols-2">
                  {about.whyUs.map((w, i) => (
                    <Reveal key={`${i}-${w}`} delay={i * 80}>
                      <li className="glass-panel flex h-full items-start gap-3.5 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/40">
                        <i className="fa-solid fa-circle-check mt-0.5 text-lg text-brand-300" />
                        <span className="text-[13.5px] font-semibold leading-relaxed text-slate-100">
                          {w}
                        </span>
                      </li>
                    </Reveal>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Team */}
      <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8">
        <SectionHead
          align="center"
          kicker="The team"
          title={<>The people you will be <span className="text-brand-300">working with</span></>}
          sub="Direct guidance from experienced real estate navigators."
        />

        {/* Official Team Card from Demo */}
        <Reveal delay={150}>
          <div className="glass-panel mx-auto mt-10 max-w-2xl rounded-2xl p-7 text-center">
            <div className="mx-auto grid h-20 w-20 place-items-center rounded-2xl bg-brand-500/20 p-2">
              <img src="/assets/img/logo-mark-light.png" alt="Dream Home Navigators" className="h-10 w-auto" />
            </div>
            <h3 className="font-display mt-4 text-2xl font-semibold text-white">Dream Home Navigators</h3>
            <p className="mt-1 text-xs font-extrabold uppercase tracking-[0.2em] text-brand-300">Real Estate Team</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              A client-focused real estate team helping buyers and investors find suitable properties across Iloilo, Tagaytay, Antipolo, Cavite and Binondo. We work directly with you through inquiry, shortlisting, site viewing and closing.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-slate-400">
              <i className="fa-solid fa-circle-info text-brand-300" />
              <span>PRC &amp; DHSUD Accredited Team</span>
            </div>
          </div>
        </Reveal>

        {/* Leadership members */}
        <div
          className={`mx-auto mt-8 grid gap-6 ${
            founders.length > 1 ? "max-w-3xl sm:grid-cols-2" : "max-w-md"
          }`}
        >
          {founders.map((m, i) => (
            <Reveal key={m.name} delay={i * 120}>
              <article className="glass-panel group relative h-full overflow-hidden p-7 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-brass-300/50">
                <span
                  className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-brass-300/80 to-transparent"
                  aria-hidden="true"
                />
                <div className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-gradient-to-br from-brand-500 via-brand-700 to-brand-900 font-display text-[26px] font-semibold text-white shadow-lg shadow-brand-950/50 ring-2 ring-brass-300/40 transition-transform duration-300 group-hover:scale-105">
                  {m.initials}
                </div>
                <span className="glass-chip mt-5 inline-flex items-center gap-1.5 px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-brass-300">
                  <i className="fa-solid fa-star text-[8px]" />
                  Founding Partner
                </span>
                <h3 className="font-display mt-3 text-xl font-semibold text-white">{m.name}</h3>
                <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-300">
                  {m.role}
                </p>
                <p className="mt-3 text-[13.5px] leading-relaxed text-slate-300/85">{m.note}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Credentials strip */}
      <section className="mx-auto max-w-7xl px-5 pt-16 sm:px-8">
        <Reveal>
          <div className="glass-panel flex flex-col items-center justify-center gap-5 px-6 py-7 sm:flex-row sm:gap-10">
            {[
              { icon: "fa-id-card", label: "PRC-Licensed Brokerage" },
              { icon: "fa-building-shield", label: "DHSUD-Registered Projects" },
              { icon: "fa-building-columns", label: "Accredited Bank Partners" },
            ].map((c) => (
              <span key={c.label} className="inline-flex items-center gap-3 text-sm font-bold text-slate-200">
                <span className="grid h-10 w-10 place-items-center rounded-full border border-brass-300/40 bg-brass-400/10 text-brass-300">
                  <i className={`fa-solid ${c.icon}`} />
                </span>
                {c.label}
              </span>
            ))}
          </div>
        </Reveal>
      </section>
    </>
  );
}
