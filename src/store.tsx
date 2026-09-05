import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { v4 as uuid } from "uuid";
import { Property, PROPERTIES } from "./data";

/* ────────────────────────────────────────────────────────────────────────────
   Persistent client-side store.
   - Properties: seeded from src/data.ts; additions/deletions persist in
     localStorage so the Admin Console works immediately, with zero backend.
   - Leads: every submitted inquiry is logged here AND (when configured in
     src/config.ts) posted to the Google Apps Script → Google Sheet CRM.
   ──────────────────────────────────────────────────────────────────────────── */

export interface Lead {
  id: string;
  timestamp: string; // ISO string
  name: string;
  phone: string;
  email: string;
  location: string;
  budget: string;
  propertyInterest: string;
  message: string;
  source: string;
  synced: boolean; // true when imported from (or confirmed sent to) the Sheet
}

const LS_CUSTOM = "dhn_custom_properties_v1";
const LS_DELETED = "dhn_deleted_properties_v1";
const LS_LEADS = "dhn_leads_v1";

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}
function write(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* storage unavailable — run in-memory */
  }
}

interface StoreValue {
  properties: Property[];
  customCount: number;
  deletedCount: number;
  /** ids of default listings that were edited via the console (stored as overrides) */
  editedIds: string[];
  addProperty: (p: Omit<Property, "id">) => void;
  updateProperty: (p: Property) => void;
  deleteProperty: (id: string) => void;
  resetProperties: () => void;
  leads: Lead[];
  addLead: (l: Omit<Lead, "id" | "timestamp">) => void;
  deleteLead: (id: string) => void;
  clearLeads: () => void;
  importLeads: (rows: Omit<Lead, "id">[]) => number;
}

const StoreCtx = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [custom, setCustom] = useState<Property[]>(() => read(LS_CUSTOM, []));
  const [deleted, setDeleted] = useState<string[]>(() => read(LS_DELETED, []));
  const [leads, setLeads] = useState<Lead[]>(() => read(LS_LEADS, []));

  useEffect(() => write(LS_CUSTOM, custom), [custom]);
  useEffect(() => write(LS_DELETED, deleted), [deleted]);
  useEffect(() => write(LS_LEADS, leads), [leads]);

  const properties = useMemo(
    () => [
      ...PROPERTIES.filter((p) => !deleted.includes(p.id)),
      ...custom,
    ],
    [deleted, custom]
  );

  const value: StoreValue = {
    properties,
    customCount: custom.length,
    deletedCount: deleted.length,
    editedIds: useMemo(
      () => custom.filter((p) => !p.id.startsWith("custom-")).map((p) => p.id),
      [custom]
    ),
    addProperty: (p) =>
      setCustom((c) => [{ ...p, id: `custom-${uuid().slice(0, 8)}` }, ...c]),
    updateProperty: (p) => {
      if (p.id.startsWith("custom-")) {
        /* Custom listing → edit in place */
        setCustom((c) => c.map((x) => (x.id === p.id ? p : x)));
      } else {
        /* Default listing → hide the original, store the edited override */
        setDeleted((d) => (d.includes(p.id) ? d : [...d, p.id]));
        setCustom((c) => [...c.filter((x) => x.id !== p.id), p]);
      }
    },
    deleteProperty: (id) => {
      /* Covers custom listings AND edited-default overrides */
      setCustom((c) => c.filter((p) => p.id !== id));
      if (!id.startsWith("custom-")) {
        setDeleted((d) => (d.includes(id) ? d : [...d, id]));
      }
    },
    resetProperties: () => {
      setCustom([]);
      setDeleted([]);
    },
    leads,
    addLead: (l) =>
      setLeads((ls) => [
        { ...l, id: uuid(), timestamp: new Date().toISOString() },
        ...ls,
      ]),
    deleteLead: (id) => setLeads((ls) => ls.filter((l) => l.id !== id)),
    clearLeads: () => setLeads([]),
    importLeads: (rows) => {
      let added = 0;
      setLeads((ls) => {
        const seen = new Set(ls.map((l) => `${l.timestamp}|${l.phone}`));
        const fresh = rows.filter((r) => {
          const k = `${r.timestamp}|${r.phone}`;
          if (seen.has(k)) return false;
          seen.add(k);
          added += 1;
          return true;
        });
        return fresh.length ? [...fresh.map((r) => ({ ...r, id: uuid() })).reverse(), ...ls] : ls;
      });
      return added;
    },
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
