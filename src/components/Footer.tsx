import { CONTACT, Page } from "../data";
import { Logo } from "../ui";
import { CONFIG } from "../config";

export default function Footer({
  go,
  browseLocation,
}: {
  go: (p: Page) => void;
  browseLocation: (loc: string) => void;
}) {
  const openOwnerPortal = () => {
    window.location.hash = CONFIG.ADMIN_ROUTE_HASH;
  };

  return (
    <footer className="w-full bg-surface-container-lowest pt-space-3xl pb-space-2xl mt-space-3xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] relative z-20 border-t border-surface-container-high/40">
      <div className="max-w-max-width mx-auto px-gutter-mobile md:px-gutter-tablet lg:px-gutter-desktop">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-space-xl pb-space-2xl">
          {/* Brand Col */}
          <div className="lg:col-span-4 space-y-space-md">
            <div className="flex items-center gap-space-sm">
              <Logo size={36} />
              <div className="flex flex-col">
                <span className="font-headline-sm text-headline-sm text-on-surface">
                  Dream Home Navigators
                </span>
                <span className="font-label-overline text-label-overline text-tertiary uppercase">
                  Guiding You Home, Building Your Future
                </span>
              </div>
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
              A client-focused real estate team helping buyers and investors find suitable properties across Iloilo, Tagaytay, Antipolo, Cavite, and Binondo.
            </p>
            <div className="flex items-center gap-space-xs pt-space-xs flex-wrap">
              <span className="inline-flex items-center gap-space-xxs px-space-sm py-space-xxs rounded-full bg-surface-container-low text-secondary font-label-md text-label-md">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                Verified materials
              </span>
              <span className="inline-flex items-center gap-space-xxs px-space-sm py-space-xxs rounded-full bg-surface-container-low text-tertiary font-label-md text-label-md">
                <span className="material-symbols-outlined text-[16px]">compass_calibration</span>
                Direct guidance
              </span>
              <span className="inline-flex items-center gap-space-xxs px-space-sm py-space-xxs rounded-full bg-surface-container-low text-primary font-label-md text-label-md">
                <span className="material-symbols-outlined text-[16px]">key</span>
                Easy tours
              </span>
            </div>
          </div>

          {/* Explore Col */}
          <div className="lg:col-span-2 space-y-space-md">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Explore
            </h3>
            <nav className="flex flex-col space-y-space-xs">
              <button
                onClick={() => go("home")}
                className="text-left font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                Home Overview
              </button>
              <button
                onClick={() => go("properties")}
                className="text-left font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                Featured Estates
              </button>
              <button
                onClick={() => go("services")}
                className="text-left font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                Client Services
              </button>
              <button
                onClick={() => go("about")}
                className="text-left font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                Our Advisors
              </button>
              <button
                onClick={() => go("contact")}
                className="text-left font-body-md text-body-md text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
              >
                Schedule a Tour
              </button>
              <button
                onClick={openOwnerPortal}
                className="text-left font-body-md text-body-md text-on-surface-variant hover:text-tertiary transition-colors cursor-pointer"
              >
                Listing Portal
              </button>
            </nav>
          </div>

          {/* Territories Served */}
          <div className="lg:col-span-3 space-y-space-md">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Territories Served
            </h3>
            <ul className="flex flex-col space-y-space-xs font-body-md text-body-md text-on-surface-variant">
              <li className="flex items-center gap-space-xs hover:text-secondary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                <button onClick={() => browseLocation("Iloilo")} className="cursor-pointer">
                  Iloilo Luxury &amp; Heritage
                </button>
              </li>
              <li className="flex items-center gap-space-xs hover:text-secondary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                <button onClick={() => browseLocation("Tagaytay")} className="cursor-pointer">
                  Tagaytay Scenic Ridges
                </button>
              </li>
              <li className="flex items-center gap-space-xs hover:text-secondary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                <button onClick={() => browseLocation("Cavite")} className="cursor-pointer">
                  Cavite Masterplanned Enclaves
                </button>
              </li>
              <li className="flex items-center gap-space-xs hover:text-secondary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                <button onClick={() => browseLocation("Antipolo")} className="cursor-pointer">
                  Antipolo Hillside Retreats
                </button>
              </li>
              <li className="flex items-center gap-space-xs hover:text-secondary transition-colors cursor-pointer">
                <span className="material-symbols-outlined text-[16px] text-secondary">location_on</span>
                <button onClick={() => browseLocation("Binondo")} className="cursor-pointer">
                  Binondo Prime Commercial &amp; Condo
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Channels */}
          <div className="lg:col-span-3 space-y-space-md">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">
              Contact Channels
            </h3>
            <div className="space-y-space-xs font-body-md text-body-md text-on-surface-variant">
              <div className="flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-[18px] text-primary mt-0.5">phone_iphone</span>
                <div>
                  <div className="font-label-md text-label-md text-on-surface">Direct Hotline</div>
                  <a className="text-secondary hover:underline" href="tel:+639216030693">
                    +63 921 603 0693
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-[18px] text-primary mt-0.5">chat</span>
                <div>
                  <div className="font-label-md text-label-md text-on-surface">Messenger</div>
                  <a
                    className="text-secondary hover:underline"
                    href={CONFIG.MESSENGER_URL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    @dreamhomenavigators01
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-[18px] text-primary mt-0.5">alternate_email</span>
                <div>
                  <div className="font-label-md text-label-md text-on-surface">Email Inquiries</div>
                  <a className="text-on-surface-variant hover:text-primary transition" href={`mailto:${CONFIG.EMAIL}`}>
                    {CONFIG.EMAIL}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-space-xs">
                <span className="material-symbols-outlined text-[18px] text-primary mt-0.5">apartment</span>
                <div>
                  <div className="font-label-md text-label-md text-on-surface">Brokerage Headquarters</div>
                  <span className="text-on-surface-variant">
                    {CONTACT.areasServed}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-space-lg flex flex-col sm:flex-row items-center justify-between gap-space-md text-center sm:text-left border-t border-surface-container-high/40">
          <p className="font-body-sm text-body-sm text-outline">
            © 2026 Dream Home Navigators. All rights reserved. Registered Philippine Real Estate Brokerage.
          </p>
          <div className="flex items-center gap-space-md font-label-md text-label-md text-on-surface-variant">
            <button onClick={() => go("contact")} className="hover:text-on-surface transition-colors cursor-pointer">
              Privacy Policy
            </button>
            <span className="text-outline-variant">•</span>
            <button onClick={() => go("contact")} className="hover:text-on-surface transition-colors cursor-pointer">
              Terms of Brokerage
            </button>
            <span className="text-outline-variant">•</span>
            <button onClick={() => go("contact")} className="hover:text-on-surface transition-colors cursor-pointer">
              PRC Real Estate Compliance
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

