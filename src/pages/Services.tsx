import { CONTACT, Page, SERVICES } from "../data";
import { Reveal, SectionHead } from "../ui";

const OFW_POINTS = [
  { icon: "fa-video", title: "Live video site visits", copy: "Walk the unit in real time with an advisor on camera — corners, water pressure, view and all." },
  { icon: "fa-file-signature", title: "Consulate-signed SPAs", copy: "We prepare documents for signing at the nearest Philippine consulate or embassy." },
  { icon: "fa-tower-broadcast", title: "Milestone updates", copy: "Photo + video progress reports at every stage, from groundbreaking to turnover day." },
  { icon: "fa-building-columns", title: "OFW loan assistance", copy: "Pre-qualification with partner banks for housing loans built for overseas income." },
];

export default function Services({ go }: { go: (p: Page) => void }) {
  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pt-32 sm:px-8 sm:pt-36">
        <SectionHead
          align="center"
          kicker="What we do"
          title={<>One licensed team. <span className="text-brand-300">Every mile</span> of the journey.</>}
          sub="Buying property in the Philippines involves brokers, banks, developers and bureaucracy. We consolidate all of it behind one point of contact — you."
        />

        <div className="mt-14 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.title} delay={(i % 3) * 110}>
              <article className="glass-panel group flex h-full flex-col p-6.5 transition-all duration-300 hover:-translate-y-1.5 hover:border-brand-400/40 hover:bg-white/[0.11]">
                <div className="flex items-center gap-4">
                  <span className="grid h-13 w-13 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 text-xl text-white shadow-lg shadow-brand-950/60 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <i className={`fa-solid ${s.icon}`} />
                  </span>
                  <h3 className="font-display text-[19px] font-semibold leading-snug text-white">
                    {s.title}
                  </h3>
                </div>
                <p className="mt-4 flex-1 text-[13.5px] leading-relaxed text-slate-300/90">
                  {s.desc}
                </p>
                <ul className="mt-5 space-y-2.5 border-t border-white/10 pt-5">
                  {s.bullets.map((b) => (
                    <li key={b} className="flex items-start gap-2.5 text-[13px] font-semibold text-slate-200">
                      <i className="fa-solid fa-circle-check mt-0.5 text-brand-300" />
                      {b}
                    </li>
                  ))}
                </ul>
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      {/* OFW spotlight */}
      <section className="mx-auto max-w-7xl px-5 pt-24 sm:px-8">
        <Reveal>
          <div className="glass-panel-deep relative overflow-hidden rounded-3xl">
            <div
              className="pointer-events-none absolute inset-0 opacity-70"
              style={{ background: "radial-gradient(50% 100% at 100% 0%, rgba(30,64,175,0.55), transparent 65%)" }}
            />
            <div className="relative grid gap-10 p-7 sm:p-10 lg:grid-cols-2 lg:p-14">
              <div>
                <span className="kicker">For Kabayans abroad</span>
                <h2 className="font-display mt-4 text-3xl font-semibold leading-tight text-white sm:text-4xl">
                  Buying from abroad? We built a desk <em className="italic text-brass-300">just for you.</em>
                </h2>
                <p className="mt-5 max-w-md text-[14.5px] leading-relaxed text-slate-300">
                  Over 40% of our closings are for OFWs who never set foot in the unit before
                  turnover. Our remote-buying program exists so distance never costs you
                  clarity — or your hard-earned money.
                </p>
                <div className="mt-8 flex flex-wrap gap-3">
                  <button onClick={() => go("contact")} className="btn btn-primary">
                    <i className="fa-solid fa-earth-asia" />
                    Start a Remote Inquiry
                  </button>
                  <a href={CONTACT.messenger} target="_blank" rel="noreferrer" className="btn btn-ghost">
                    <i className="fa-brands fa-facebook-messenger text-brand-300" />
                    Message the OFW Desk
                  </a>
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {OFW_POINTS.map((o, i) => (
                  <Reveal key={o.title} delay={i * 100}>
                    <div className="glass-panel h-full p-5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/40">
                      <span className="grid h-10 w-10 place-items-center rounded-lg bg-brand-500/20 text-brand-300">
                        <i className={`fa-solid ${o.icon}`} />
                      </span>
                      <h3 className="mt-3.5 text-[15px] font-bold text-white">{o.title}</h3>
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-slate-300/85">{o.copy}</p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </section>

      {/* Promise strip */}
      <section className="mx-auto max-w-7xl px-5 pt-20 sm:px-8">
        <div className="grid gap-5 md:grid-cols-3">
          {[
            { icon: "fa-hand-holding-dollar", title: "No buyer-side fees", copy: "Our compensation comes from developers and sellers — guidance is free for you." },
            { icon: "fa-shield-halved", title: "Licensed & accountable", copy: "Every transaction runs under a PRC-licensed broker, with receipts for everything." },
            { icon: "fa-headset", title: "After-sales, for real", copy: "Turnover snags, titling follow-ups, tenant finding — we stay on after the key handoff." },
          ].map((c, i) => (
            <Reveal key={c.title} delay={i * 110}>
              <div className="glass-panel flex h-full items-start gap-4 p-6">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-brand-400/40 bg-brand-500/15 text-brand-300">
                  <i className={`fa-solid ${c.icon}`} />
                </span>
                <div>
                  <h3 className="font-display text-[16.5px] font-semibold text-white">{c.title}</h3>
                  <p className="mt-1.5 text-[13px] leading-relaxed text-slate-300/85">{c.copy}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </>
  );
}
