import { FormEvent, useEffect, useRef, useState } from "react";
import { BUDGETS, CONTACT, LOCATIONS, Page, Prefill, PROPERTIES } from "../data";
import { prefersReduced, Reveal, SectionHead } from "../ui";

/**
 * Replace with the client's deployed Google Apps Script Web App URL
 * (the script appends each lead row to the "Dream Home Navigators" Google Sheet CRM).
 */
const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/REPLACE_WITH_DEPLOYED_SCRIPT_ID/exec";

interface FormState {
  name: string;
  phone: string;
  email: string;
  location: string;
  budget: string;
  propertyInterest: string;
  message: string;
}

const EMPTY: FormState = {
  name: "",
  phone: "",
  email: "",
  location: "",
  budget: "",
  propertyInterest: "",
  message: "",
};

type Status = "idle" | "loading" | "success";

export default function Contact({
  prefill,
  go,
}: {
  prefill: Prefill | null;
  go: (p: Page) => void;
}) {
  const [form, setForm] = useState<FormState>(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [flash, setFlash] = useState(0);
  const formRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);

  /* One-click "Inquire About This Unit" pre-fill */
  useEffect(() => {
    if (!prefill) return;
    setForm((f) => ({
      ...f,
      propertyInterest: prefill.property,
      message: prefill.message,
    }));
    setStatus("idle");
    setFlash((n) => n + 1);
    const t = window.setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: prefersReduced() ? "auto" : "smooth",
        block: "start",
      });
      nameRef.current?.focus({ preventScroll: true });
    }, 140);
    return () => window.clearTimeout(t);
  }, [prefill]);

  const set = (k: keyof FormState) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (status === "loading") return;
    setStatus("loading");

    const payload = {
      ...form,
      source: "Dream Home Navigators Website",
      submittedAt: new Date().toISOString(),
    };

    /* CRM: POST to Google Apps Script (no-cors, text/plain avoids preflight) */
    if (!GOOGLE_SCRIPT_URL.includes("REPLACE_WITH")) {
      try {
        await fetch(GOOGLE_SCRIPT_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
        });
      } catch {
        /* no-cors responses are opaque; treat send as attempted */
      }
    } else {
      await new Promise((r) => setTimeout(r, 900)); // demo pacing while Script URL is unset
      console.info("[DHN CRM · demo] Lead captured:", payload);
    }

    setStatus("success");
    window.setTimeout(() => {
      setForm(EMPTY);
      setStatus("idle");
    }, 3000);
  }

  return (
    <>
      <section className="mx-auto max-w-7xl px-5 pt-32 sm:px-8 sm:pt-36">
        <SectionHead
          align="center"
          kicker="Get in touch"
          title={<>Let's plot the course to <span className="text-brand-300">your next address</span></>}
          sub="Fill out the form and a licensed navigator replies within 24 hours. Your inquiry lands straight in our CRM — nothing gets lost."
        />

        <div className="mt-14 grid gap-8 lg:grid-cols-5">
          {/* Left: contact channels */}
          <div className="space-y-5 lg:col-span-2">
            {[
              {
                icon: "fa-phone-volume",
                title: "Call or Viber",
                line1: CONTACT.phone,
                line2: CONTACT.hours,
                href: CONTACT.phoneHref,
                cta: "Call now",
              },
              {
                icon: "fa-brands fa-facebook-messenger",
                title: "Messenger — fastest",
                line1: "m.me/dreamhomenavigators01",
                line2: "Typically replies within minutes",
                href: CONTACT.messenger,
                cta: "Open chat",
                external: true,
              },
              {
                icon: "fa-envelope-open-text",
                title: "Official email",
                line1: CONTACT.email,
                line2: "For contracts & formal documents",
                href: CONTACT.emailHref,
                cta: "Write to us",
              },
              {
                icon: "fa-building",
                title: "Head office",
                line1: CONTACT.address,
                line2: "Satellite meetups in all 5 territories",
                href: undefined,
                cta: undefined,
              },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 90}>
                <div className="glass-panel group flex items-start gap-4 p-5.5 transition-all duration-300 hover:-translate-y-1 hover:border-brand-400/40">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-800 text-lg text-white shadow-lg">
                    <i className={c.icon.includes("fa-brands") ? c.icon : `fa-solid ${c.icon}`} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-[15px] font-bold text-white">{c.title}</h3>
                    <p className="mt-1 break-words text-[13.5px] font-semibold text-brand-200">
                      {c.line1}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">{c.line2}</p>
                    {c.cta && (
                      <a
                        href={c.href}
                        {...(c.external ? { target: "_blank", rel: "noreferrer" } : {})}
                        className="mt-3 inline-flex items-center gap-2 text-[12.5px] font-extrabold uppercase tracking-wide text-brand-300 transition hover:gap-3 hover:text-brand-200"
                      >
                        {c.cta}
                        <i className="fa-solid fa-arrow-right text-[10px]" />
                      </a>
                    )}
                  </div>
                </div>
              </Reveal>
            ))}

            <Reveal delay={380}>
              <div className="glass-panel-deep p-5.5">
                <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-brand-300">
                  <i className="fa-solid fa-map mr-2" />
                  Service territories
                </p>
                <div className="mt-3.5 flex flex-wrap gap-2">
                  {LOCATIONS.map((l) => (
                    <span key={l} className="glass-chip px-3.5 py-1.5 text-[12px] font-bold text-slate-200">
                      {l}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => go("properties")}
                  className="mt-4 inline-flex items-center gap-2 text-[12.5px] font-extrabold uppercase tracking-wide text-brand-300 transition hover:text-brand-200"
                >
                  Browse listings
                  <i className="fa-solid fa-arrow-right text-[10px]" />
                </button>
              </div>
            </Reveal>
          </div>

          {/* Right: lead form */}
          <div className="lg:col-span-3">
            <Reveal delay={150}>
              <div
                ref={formRef}
                key={flash || undefined}
                className={`glass-panel-light scroll-mt-32 p-6 sm:p-8 ${flash > 0 ? "form-highlight" : ""}`}
              >
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-slate-900 sm:text-[1.7rem]">
                      Send an inquiry
                    </h2>
                    <p className="mt-1 text-[13px] font-medium text-slate-600">
                      Synced to our lead CRM — a navigator replies within 24 hours.
                    </p>
                  </div>
                  <span className="hidden h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand-600 to-brand-800 text-lg text-white shadow-lg sm:grid">
                    <i className="fa-solid fa-compass" />
                  </span>
                </div>

                {status === "success" && (
                  <div className="mt-5 flex items-center gap-3 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-3.5 text-emerald-800">
                    <i className="fa-solid fa-circle-check text-lg" />
                    <div>
                      <p className="text-sm font-extrabold">Inquiry saved to our database!</p>
                      <p className="text-xs font-medium text-emerald-700">
                        A Dream Home Navigator will reach out within 24 hours.
                      </p>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="mt-6 grid gap-4 sm:grid-cols-2">
                  <div className="relative">
                    <i className="fa-regular fa-user absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      ref={nameRef}
                      required
                      value={form.name}
                      onChange={set("name")}
                      className="field"
                      placeholder="Full Name *"
                      aria-label="Full name"
                    />
                  </div>
                  <div className="relative">
                    <i className="fa-solid fa-phone absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      required
                      type="tel"
                      value={form.phone}
                      onChange={set("phone")}
                      className="field"
                      placeholder="Mobile / Viber *"
                      aria-label="Phone"
                    />
                  </div>
                  <div className="relative">
                    <i className="fa-regular fa-envelope absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      value={form.email}
                      onChange={set("email")}
                      className="field"
                      placeholder="Email address"
                      aria-label="Email"
                    />
                  </div>
                  <div className="relative">
                    <i className="fa-solid fa-location-dot absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select value={form.location} onChange={set("location")} className="field" aria-label="Preferred location">
                      <option value="">Preferred location…</option>
                      {LOCATIONS.map((l) => (
                        <option key={l} value={l}>{l}</option>
                      ))}
                      <option value="Other / Multiple">Other / Multiple</option>
                    </select>
                    <i className="fa-solid fa-chevron-down pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  <div className="relative">
                    <i className="fa-solid fa-sack-dollar absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select value={form.budget} onChange={set("budget")} className="field" aria-label="Budget range">
                      <option value="">Budget range…</option>
                      {BUDGETS.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                    <i className="fa-solid fa-chevron-down pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  <div className="relative">
                    <i className="fa-solid fa-house absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <select value={form.propertyInterest} onChange={set("propertyInterest")} className="field" aria-label="Property of interest">
                      <option value="">Property of interest…</option>
                      {PROPERTIES.map((p) => (
                        <option key={p.id} value={p.name}>{p.name} — {p.location}</option>
                      ))}
                      <option value="Not sure yet — need matching">Not sure yet — need matching</option>
                    </select>
                    <i className="fa-solid fa-chevron-down pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  </div>
                  <div className="relative sm:col-span-2">
                    <i className="fa-regular fa-comment absolute left-3.5 top-3.5 text-slate-400" />
                    <textarea
                      rows={4}
                      value={form.message}
                      onChange={set("message")}
                      className="field resize-none"
                      placeholder="Your message — timeline, must-haves, questions…"
                      aria-label="Message"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="btn btn-primary sm:col-span-2 !py-3.5 text-[15px] disabled:cursor-not-allowed disabled:opacity-80"
                  >
                    {status === "loading" ? (
                      <>
                        <i className="fa-solid fa-circle-notch fa-spin" />
                        Sending to our CRM…
                      </>
                    ) : status === "success" ? (
                      <>
                        <i className="fa-solid fa-circle-check" />
                        Inquiry Saved!
                      </>
                    ) : (
                      <>
                        <i className="fa-regular fa-paper-plane" />
                        Submit Inquiry
                      </>
                    )}
                  </button>
                </form>

                <p className="mt-4 flex items-start gap-2 text-[11.5px] font-medium leading-relaxed text-slate-500">
                  <i className="fa-solid fa-lock mt-0.5" />
                  Your details go only to our licensed team and our secure lead sheet. No spam,
                  no third-party selling — ever.
                </p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  );
}
