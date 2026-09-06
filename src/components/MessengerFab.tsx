import { useState } from "react";
import { CONFIG } from "../config";

const MESSENGER_URL = CONFIG.MESSENGER_URL;
const QUICK_REPLIES = CONFIG.MESSENGER_QUICK_REPLIES.map((label, i) => ({
  label,
  ref: `qr_${i + 1}`,
}));

export default function MessengerFab() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[60] flex flex-col items-end gap-3 pointer-events-none">
      {/* Tap-outside dismiss backdrop when open */}
      {open && (
        <div
          className="fixed inset-0 -z-10 bg-black/50 backdrop-blur-sm pointer-events-auto cursor-pointer transition-opacity duration-300"
          onClick={() => setOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Chat card: only mounted in DOM when open */}
      {open && (
        <div className="origin-bottom-right pointer-events-auto animate-card-in">
          <div className="glass-panel-deep w-[calc(100vw-2.5rem)] max-w-[310px] overflow-hidden rounded-2xl shadow-2xl border border-brand-400/20">
            <div className="flex items-center justify-between bg-gradient-to-r from-brand-800 to-brand-600 px-4 py-3.5">
              <div className="flex items-center gap-3">
                <span className="relative grid h-10 w-10 place-items-center rounded-full bg-white/15 text-lg text-white">
                  <i className="fa-brands fa-facebook-messenger" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-brand-700 bg-emerald-400" />
                </span>
                <div className="leading-tight">
                  <p className="text-sm font-bold text-white">Dream Home Navigators</p>
                  <p className="text-[11px] text-brand-100/90">Typically replies within minutes</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-white/80 transition hover:bg-white/15 hover:text-white cursor-pointer"
                aria-label="Close chat"
              >
                <i className="fa-solid fa-xmark text-sm" />
              </button>
            </div>
            <div className="p-4">
              <p className="rounded-xl rounded-tl-sm bg-white/10 px-3.5 py-2.5 text-[13px] leading-relaxed text-slate-200">
                Hi! 👋 Looking for a home, an investment unit, or a site visit? Tap a quick
                reply or open Messenger — an advisor is on standby.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {QUICK_REPLIES.map((q) => (
                  <a
                    key={q.ref}
                    href={`${MESSENGER_URL}?ref=${q.ref}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-brand-400/40 bg-brand-500/10 px-3 py-1.5 text-[12px] font-semibold text-brand-200 transition hover:-translate-y-0.5 hover:border-brand-300 hover:bg-brand-500/25 hover:text-white"
                  >
                    {q.label}
                  </a>
                ))}
              </div>
              <a
                href={MESSENGER_URL}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary mt-4 w-full justify-center !py-2.5 text-[13px]"
              >
                <i className="fa-brands fa-facebook-messenger" />
                Chat on Messenger
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tooltip */}
      {!open && (
        <div className="pointer-events-none mr-2 hidden sm:block">
          <p className="glass-chip whitespace-nowrap px-3.5 py-2 text-xs font-semibold text-slate-100 shadow-lg">
            Chat with us — we reply fast 💬
          </p>
        </div>
      )}

      {/* FAB */}
      <div className="relative pointer-events-auto">
        <span
          className="pointer-events-none absolute inset-0 rounded-full bg-brand-500/70 animate-ring"
          aria-hidden="true"
        />
        <span
          className="pointer-events-none absolute inset-0 rounded-full bg-brand-400/50 animate-ring [animation-delay:0.9s]"
          aria-hidden="true"
        />
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close Messenger chat" : "Open Messenger chat"}
          aria-expanded={open}
          className="relative grid h-14 w-14 sm:h-16 sm:w-16 place-items-center rounded-full bg-gradient-to-br from-brand-500 to-brand-800 text-[22px] sm:text-[26px] text-white shadow-[0_12px_36px_-6px_rgba(37,99,235,0.75)] transition-transform duration-300 hover:scale-105 active:scale-95 touch-manipulation cursor-pointer"
        >
          <i
            className={`transition-transform duration-300 ${
              open ? "fa-solid fa-xmark" : "fa-brands fa-facebook-messenger"
            }`}
          />
          {!open && (
            <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full border-2 border-ink-950 bg-brand-300 text-[9px] font-extrabold text-ink-950">
              1
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
