import { Page, TEAM, WHY_US } from "../data";
import { CountUp, Reveal, SectionHead } from "../ui";

export default function About({ go, inquire }: { go: (p: Page) => void; inquire: (n: string) => void }) {
  return (
    <>
      {/* Story */}
      <section className="mx-auto max-w-7xl px-5 pt-32 sm:px-8 sm:pt-36">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <div className="relative">
              <div className="glass-panel overflow-hidden rounded-2xl p-2.5">
                <div className="overflow-hidden rounded-xl">
                  <img
                    src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=1000&auto=format&fit=crop"
                    alt="Signing a property agreement"
                    className="h-[420px] w-full object-cover transition-transform duration-[1.4s] hover:scale-105 sm:h-[480px]"
                  />
                </div>
              </div>
              <div className="glass-panel-deep absolute -bottom-6 -right-3 rounded-2xl px-6 py-4 text-center shadow-2xl sm:-right-6">
                <p className="font-display text-3xl font-semibold text-brand-300">
                  <CountUp value={12} suffix="+" />
                </p>
                <p className="mt-0.5 text-[10.5px] font-extrabold uppercase tracking-[0.18em] text-slate-300">
                  Years navigating
                </p>
              </div>
              <div className="glass-chip absolute -top-4 left-6 inline-flex items-center gap-2 !bg-ink-900/70 px-4 py-2 text-[11px] font-extrabold uppercase tracking-[0.18em] text-brand-200">
                <i className="fa-solid fa-compass text-brass-300" />
                Est. 2014 · Metro Manila
              </div>
            </div>
          </Reveal>

          <div className="lg:col-span-7">
            <SectionHead
              kicker="Our story"
              title={<>We don't sell houses. We <span className="text-brand-300">navigate</span> people home.</>}
            />
            <Reveal delay={150}>
              <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-slate-300">
                <p>
                  Dream Home Navigators started in 2014 with one observation: Filipino buyers —
                  especially first-timers and OFWs — were being steered toward whatever earned
                  the agent the biggest commission, not what fit their lives. So we flipped the
                  model. We begin with your budget and your future, then go find the property
                  that answers to them.
                </p>
                <p>
                  Today our licensed team serves five territories —{" "}
                  <strong className="text-slate-100">Iloilo, Tagaytay, Cavite, Antipolo and Binondo</strong>{" "}
                  — with a promise that hasn't changed: verified projects, honest yield numbers,
                  free site visits, and one accountable navigator from reservation to turnover.
                </p>
              </div>
            </Reveal>
            <Reveal delay={250}>
              <div className="mt-8 grid gap-5 sm:grid-cols-2">
                <div className="glass-panel p-6">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-brand-300">
                    <i className="fa-solid fa-bullseye mr-2" />
                    Mission
                  </p>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-slate-200">
                    To make every Filipino property decision an informed one — pairing each
                    family with a home that fits their budget, their roots, and their plans.
                  </p>
                </div>
                <div className="glass-panel p-6">
                  <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-brand-300">
                    <i className="fa-regular fa-eye mr-2" />
                    Vision
                  </p>
                  <p className="mt-3 text-[13.5px] leading-relaxed text-slate-200">
                    A Philippines where buying a home — from Quezon City or Qatar — feels
                    transparent, protected, and genuinely exciting.
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Why choose us */}
      <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8">
        <Reveal>
          <div className="glass-panel-deep rounded-3xl p-7 sm:p-12">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <SectionHead
                  kicker="Why choose us"
                  title={<>The difference between an agent and a <em className="italic text-brass-300">navigator</em></>}
                  sub="Anyone can show you a unit. Very few will tell you which one to walk away from — we do both."
                />
                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={() => go("contact")} className="btn btn-primary">
                    <i className="fa-regular fa-paper-plane" />
                    Start Your Inquiry
                  </button>
                  <button onClick={() => inquire("Pine Deluxe at Emerald Estate")} className="btn btn-ghost">
                    <i className="fa-solid fa-star text-brass-300" />
                    Ask About Pine Deluxe
                  </button>
                </div>
              </div>
              <div className="lg:col-span-7">
                <ul className="grid gap-4 sm:grid-cols-2">
                  {WHY_US.map((w, i) => (
                    <Reveal key={w} delay={i * 80}>
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
          kicker="The crew"
          title={<>Licensed hands on <span className="text-brand-300">your wheel</span></>}
          sub="A small, senior team — you'll know your navigator by name, not by ticket number."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {TEAM.map((m, i) => (
            <Reveal key={m.name} delay={i * 100}>
              <article className="glass-panel group h-full p-6 text-center transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-400/40">
                <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-brand-500 via-brand-700 to-brand-900 font-display text-2xl font-semibold text-white shadow-lg shadow-brand-950/50 ring-2 ring-brand-300/30 transition-transform duration-300 group-hover:scale-105">
                  {m.initials}
                </div>
                <h3 className="font-display mt-5 text-[17px] font-semibold text-white">{m.name}</h3>
                <p className="mt-1 text-[11px] font-extrabold uppercase tracking-[0.16em] text-brand-300">
                  {m.role}
                </p>
                <p className="mt-3 text-[13px] leading-relaxed text-slate-300/85">{m.note}</p>
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
