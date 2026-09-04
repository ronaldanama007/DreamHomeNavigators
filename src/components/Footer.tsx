import { CONTACT, LOCATIONS, Page } from "../data";
import { Diamond, Logo } from "../ui";

export default function Footer({
  go,
  browseLocation,
}: {
  go: (p: Page) => void;
  browseLocation: (loc: string) => void;
}) {
  return (
    <footer className="relative z-10 mt-24 border-t border-white/10">
      <div className="glass-panel-deep !rounded-none border-x-0 border-b-0">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-8 md:grid-cols-12">
          <div className="md:col-span-4">
            <div className="flex items-center gap-3">
              <Logo size={44} />
              <div className="leading-tight">
                <p className="font-display text-lg font-semibold text-slate-50">Dream Home</p>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.32em] text-brand-300">
                  Navigators
                </p>
              </div>
            </div>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-slate-300/85">
              A licensed Philippine real estate brokerage navigating families, first-time
              buyers, investors and OFWs to the right property across five key territories.
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={CONTACT.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook page"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-slate-200 transition hover:-translate-y-0.5 hover:border-brand-300/60 hover:text-brand-300"
              >
                <i className="fa-brands fa-facebook-f" />
              </a>
              <a
                href={CONTACT.messenger}
                target="_blank"
                rel="noreferrer"
                aria-label="Message us on Messenger"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-slate-200 transition hover:-translate-y-0.5 hover:border-brand-300/60 hover:text-brand-300"
              >
                <i className="fa-brands fa-facebook-messenger" />
              </a>
              <a
                href={CONTACT.phoneHref}
                aria-label="Call us"
                className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/5 text-slate-200 transition hover:-translate-y-0.5 hover:border-brand-300/60 hover:text-brand-300"
              >
                <i className="fa-solid fa-phone" />
              </a>
            </div>
          </div>

          <div className="md:col-span-2">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-brand-300">
              Explore
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              {(
                [
                  ["home", "Home"],
                  ["properties", "Properties"],
                  ["services", "Services"],
                  ["about", "About Us"],
                  ["contact", "Contact"],
                  ["admin", "Admin Console"],
                ] as [Page, string][]
              ).map(([id, label]) => (
                <li key={id}>
                  <button
                    onClick={() => go(id)}
                    className="group inline-flex items-center gap-2 transition hover:text-white"
                  >
                    <span className="h-px w-3 bg-brand-500/50 transition-all group-hover:w-5 group-hover:bg-brand-300" />
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-brand-300">
              Areas Served
            </h4>
            <ul className="mt-5 space-y-3 text-sm text-slate-300">
              {LOCATIONS.map((loc) => (
                <li key={loc}>
                  <button
                    onClick={() => browseLocation(loc)}
                    className="group inline-flex items-center gap-2 transition hover:text-white"
                  >
                    <Diamond className="h-2 w-2 opacity-60 transition group-hover:opacity-100" />
                    {loc} listings
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="md:col-span-3">
            <h4 className="text-[11px] font-extrabold uppercase tracking-[0.24em] text-brand-300">
              Reach Us
            </h4>
            <ul className="mt-5 space-y-4 text-sm text-slate-300">
              <li className="flex gap-3">
                <i className="fa-solid fa-location-dot mt-1 text-brand-400" />
                <span>{CONTACT.address}</span>
              </li>
              <li className="flex gap-3">
                <i className="fa-solid fa-phone mt-1 text-brand-400" />
                <a href={CONTACT.phoneHref} className="transition hover:text-white">
                  {CONTACT.phone}
                </a>
              </li>
              <li className="flex gap-3">
                <i className="fa-solid fa-envelope mt-1 text-brand-400" />
                <a href={CONTACT.emailHref} className="break-all transition hover:text-white">
                  {CONTACT.email}
                </a>
              </li>
              <li className="flex gap-3">
                <i className="fa-regular fa-clock mt-1 text-brand-400" />
                <span>{CONTACT.hours}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-5 py-5 text-xs text-slate-400 sm:flex-row sm:px-8">
            <p>
              © 2026 Dream Home Navigators · Licensed Real Estate Brokerage · Philippines
            </p>
            <p className="inline-flex items-center gap-2">
              <i className="fa-solid fa-shield-halved text-brand-400" />
              Secure inquiries · HTTPS · Leads synced to our CRM
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
