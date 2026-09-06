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
          <div className="bg-surface-container/95 backdrop-blur-2xl w-[calc(100vw-2.5rem)] max-w-[320px] overflow-hidden rounded-2xl shadow-2xl border border-surface-container-high">
            <div className="flex items-center justify-between bg-surface-container-high/80 px-4 py-3.5 border-b border-surface-container-highest/40">
              <div className="flex items-center gap-3">
                <span className="relative grid h-10 w-10 place-items-center rounded-full bg-primary-container text-on-primary-container text-lg">
                  <span className="material-symbols-outlined text-[22px]">forum</span>
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-surface-container-high bg-secondary" />
                </span>
                <div className="leading-tight">
                  <p className="font-label-lg text-label-lg text-on-surface">Dream Home Navigators</p>
                  <p className="font-label-overline text-label-overline text-secondary">Typically replies within minutes</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="grid h-8 w-8 place-items-center rounded-lg text-on-surface-variant hover:text-on-surface hover:bg-surface-container transition cursor-pointer"
                aria-label="Close chat"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>
            <div className="p-4 space-y-3">
              <p className="rounded-xl bg-surface-container-low p-3 font-body-sm text-body-sm text-on-surface-variant">
                Hi! 👋 Looking for a home, an investment unit, or a site visit? Tap a quick
                reply or chat directly on Messenger — an advisor is on standby.
              </p>
              <div className="flex flex-wrap gap-2">
                {QUICK_REPLIES.map((q) => (
                  <a
                    key={q.ref}
                    href={`${MESSENGER_URL}?ref=${q.ref}`}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full border border-surface-container-high bg-surface-container-low hover:bg-surface-container-high px-3 py-1.5 font-label-md text-label-md text-secondary hover:text-primary transition"
                  >
                    {q.label}
                  </a>
                ))}
              </div>
              <a
                href={MESSENGER_URL}
                target="_blank"
                rel="noreferrer"
                className="w-full inline-flex items-center justify-center gap-space-xs px-space-md py-space-xs rounded-full bg-primary-container hover:bg-inverse-primary text-on-primary-container hover:text-on-primary font-label-lg text-label-lg shadow-md transition-all"
              >
                <span className="material-symbols-outlined text-[18px]">chat</span>
                Chat on Messenger
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Tooltip */}
      {!open && (
        <div className="pointer-events-none mr-2 hidden sm:flex items-center gap-space-xs px-space-md py-space-xs rounded-full bg-surface-container-high/90 backdrop-blur-xl text-on-surface font-label-md text-label-md shadow-[0_1px_8px_rgba(0,0,0,0.04)] border border-surface-container-highest/40">
          <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
          Chat with us — we reply fast
        </div>
      )}

      {/* FAB */}
      <div className="relative pointer-events-auto">
        <span
          className="pointer-events-none absolute inset-0 rounded-full bg-primary/40 animate-ring"
          aria-hidden="true"
        />
        <button
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close Messenger chat" : "Open Messenger chat"}
          aria-expanded={open}
          className="relative grid h-12 w-12 sm:h-14 sm:w-14 place-items-center rounded-full bg-primary-container text-on-primary-container shadow-[0_0_24px_rgba(37,99,235,0.45)] hover:bg-inverse-primary hover:text-on-primary transition-all duration-300 hover:scale-105 active:scale-95 touch-manipulation cursor-pointer"
        >
          <span className="material-symbols-outlined text-[24px]">
            {open ? "close" : "forum"}
          </span>
          {!open && (
            <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-tertiary text-[9px] font-bold text-on-tertiary-fixed">
              1
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
