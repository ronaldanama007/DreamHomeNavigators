import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { v4 as uuid } from "uuid";
import {
  AboutContent,
  ABOUT_SEED,
  Property,
  PROPERTIES,
  RENTAL_PROPERTIES,
  ServiceItem,
  SERVICE_SEED,
} from "./data";
import { supabase } from "./supabase";

/* ────────────────────────────────────────────────────────────────────────────
   Persistent client-side store.
   - Properties: seeded from src/data.ts; additions/deletions persist in
     localStorage so the Admin Console works immediately, with zero backend.
   - Leads: every submitted inquiry is logged here AND (when configured in
     src/config.ts) posted to the Google Apps Script → Google Sheet CRM.
   ──────────────────────────────────────────────────────────────────────────── */

export interface Lead {
  id: string;
  timestamp: string; // ISO string, mapped from Supabase created_at
  name: string;
  phone: string;
  email: string;
  location: string;
  budget: string;
  propertyInterest: string;
  message: string;
  source: string;
}

const LS_CUSTOM = "dhn_custom_properties_v3";
const LS_DELETED = "dhn_deleted_properties_v3";
const LS_CUSTOM_RENTALS = "dhn_custom_rentals_v1";
const LS_DELETED_RENTALS = "dhn_deleted_rentals_v1";
const LS_LEADS = "dhn_leads_v1";
const LS_SERVICES = "dhn_services_v2";
const LS_ABOUT = "dhn_about_v1";
const LS_FEATURED = "dhn_featured_v1";

export interface SiteBackupData {
  version: string;
  exportedAt: string;
  source: string;
  customProperties: Property[];
  deletedProperties: string[];
  customRentals: Property[];
  deletedRentals: string[];
  leads: Lead[];
  services: ServiceItem[];
  about: AboutContent;
  featuredId: string | null;
}

interface LeadRow {
  id: string;
  created_at: string;
  name: string;
  phone: string;
  email: string;
  location: string;
  budget: string;
  property_interest: string;
  message: string;
  source: string;
}

function rowToLead(r: LeadRow): Lead {
  return {
    id: r.id,
    timestamp: r.created_at,
    name: r.name ?? "",
    phone: r.phone ?? "",
    email: r.email ?? "",
    location: r.location ?? "",
    budget: r.budget ?? "",
    propertyInterest: r.property_interest ?? "",
    message: r.message ?? "",
    source: r.source ?? "",
  };
}

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
  rentalProperties: Property[];
  customCount: number;
  deletedCount: number;
  rentalCustomCount: number;
  rentalDeletedCount: number;
  /** ids of default listings that were edited via the console (stored as overrides) */
  editedIds: string[];
  rentalEditedIds: string[];
  addProperty: (p: Omit<Property, "id">) => Property;
  updateProperty: (p: Property) => void;
  deleteProperty: (id: string) => void;
  resetProperties: () => void;
  addRentalProperty: (p: Omit<Property, "id">) => Property;
  updateRentalProperty: (p: Property) => void;
  deleteRentalProperty: (id: string) => void;
  resetRentalProperties: () => void;
  featuredId: string | null;
  setFeatured: (id: string | null) => void;
  leads: Lead[];
  refreshLeads: () => Promise<{ ok: boolean; error?: string }>;
  addLead: (l: Omit<Lead, "id" | "timestamp">) => Promise<{ ok: boolean }>;
  deleteLead: (id: string) => Promise<void>;
  clearLeads: () => Promise<void>;
  services: ServiceItem[];
  addService: (s: Omit<ServiceItem, "id">) => void;
  updateService: (s: ServiceItem) => void;
  deleteService: (id: string) => void;
  resetServices: () => void;
  about: AboutContent;
  updateAbout: (a: AboutContent) => void;
  resetAbout: () => void;
  createBackup: () => SiteBackupData;
  restoreBackup: (data: SiteBackupData) => { ok: boolean; message: string };
  resetAllToFactory: () => void;
}

const StoreCtx = createContext<StoreValue | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [custom, setCustom] = useState<Property[]>(() => read(LS_CUSTOM, []));
  const [deleted, setDeleted] = useState<string[]>(() => read(LS_DELETED, []));
  const [customRentals, setCustomRentals] = useState<Property[]>(() => read(LS_CUSTOM_RENTALS, []));
  const [deletedRentals, setDeletedRentals] = useState<string[]>(() => read(LS_DELETED_RENTALS, []));
  // Leads live in Supabase. This in-memory list is populated by refreshLeads()
  // for authenticated admins. LS_LEADS is only a fallback for inserts that fail
  // while offline, so a submitted lead is never lost.
  const [leads, setLeads] = useState<Lead[]>([]);
  const [services, setServices] = useState<ServiceItem[]>(() =>
    read(LS_SERVICES, SERVICE_SEED)
  );
  const [about, setAbout] = useState<AboutContent>(() => read(LS_ABOUT, ABOUT_SEED));
  const [featuredId, setFeaturedId] = useState<string | null>(() =>
    read<string | null>(LS_FEATURED, null)
  );

  useEffect(() => write(LS_CUSTOM, custom), [custom]);
  useEffect(() => write(LS_DELETED, deleted), [deleted]);
  useEffect(() => write(LS_CUSTOM_RENTALS, customRentals), [customRentals]);
  useEffect(() => write(LS_DELETED_RENTALS, deletedRentals), [deletedRentals]);
  useEffect(() => write(LS_SERVICES, services), [services]);
  useEffect(() => write(LS_ABOUT, about), [about]);
  useEffect(() => write(LS_FEATURED, featuredId), [featuredId]);

  const properties = useMemo(
    () => [
      ...PROPERTIES.filter((p) => !deleted.includes(p.id)),
      ...custom,
    ],
    [deleted, custom]
  );

  const rentalProperties = useMemo(
    () => [
      ...RENTAL_PROPERTIES.filter((p) => !deletedRentals.includes(p.id)),
      ...customRentals,
    ],
    [deletedRentals, customRentals]
  );

  const value: StoreValue = {
    properties,
    rentalProperties,
    customCount: custom.length,
    deletedCount: deleted.length,
    rentalCustomCount: customRentals.length,
    rentalDeletedCount: deletedRentals.length,
    editedIds: useMemo(
      () => custom.filter((p) => !p.id.startsWith("custom-")).map((p) => p.id),
      [custom]
    ),
    rentalEditedIds: useMemo(
      () => customRentals.filter((p) => !p.id.startsWith("custom-rent-")).map((p) => p.id),
      [customRentals]
    ),
    addProperty: (p) => {
      const created: Property = { ...p, id: `custom-${uuid().slice(0, 8)}`, category: "sale" };
      setCustom((c) => [created, ...c]);
      return created;
    },
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
      setFeaturedId(null);
    },
    addRentalProperty: (p) => {
      const created: Property = {
        ...p,
        id: `custom-rent-${uuid().slice(0, 8)}`,
        category: "rental",
        isRental: true,
      };
      setCustomRentals((c) => [created, ...c]);
      return created;
    },
    updateRentalProperty: (p) => {
      const enriched: Property = { ...p, category: "rental", isRental: true };
      if (p.id.startsWith("custom-rent-")) {
        setCustomRentals((c) => c.map((x) => (x.id === p.id ? enriched : x)));
      } else {
        setDeletedRentals((d) => (d.includes(p.id) ? d : [...d, p.id]));
        setCustomRentals((c) => [...c.filter((x) => x.id !== p.id), enriched]);
      }
    },
    deleteRentalProperty: (id) => {
      setCustomRentals((c) => c.filter((p) => p.id !== id));
      if (!id.startsWith("custom-rent-")) {
        setDeletedRentals((d) => (d.includes(id) ? d : [...d, id]));
      }
    },
    resetRentalProperties: () => {
      setCustomRentals([]);
      setDeletedRentals([]);
    },
    featuredId,
    setFeatured: (id) => setFeaturedId(id),
    leads,
    refreshLeads: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) return { ok: false, error: error.message };
      setLeads((data as LeadRow[]).map(rowToLead));
      return { ok: true };
    },
    addLead: async (l) => {
      const row = {
        name: l.name,
        phone: l.phone,
        email: l.email,
        location: l.location,
        budget: l.budget,
        property_interest: l.propertyInterest,
        message: l.message,
        source: l.source,
      };
      const { error } = await supabase.from("leads").insert(row);
      if (error) {
        // Never lose a lead: queue it locally so it can be recovered.
        const pending = read<Lead[]>(LS_LEADS, []);
        const fallback: Lead = {
          ...l,
          id: uuid(),
          timestamp: new Date().toISOString(),
        };
        write(LS_LEADS, [fallback, ...pending]);
        return { ok: false };
      }
      return { ok: true };
    },
    deleteLead: async (id) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (!error) setLeads((ls) => ls.filter((l) => l.id !== id));
    },
    clearLeads: async () => {
      const { error } = await supabase
        .from("leads")
        .delete()
        .neq("id", "00000000-0000-0000-0000-000000000000");
      if (!error) setLeads([]);
    },
    /* ── Services page content ── */
    services,
    addService: (s) =>
      setServices((sv) => [...sv, { ...s, id: `svc-${uuid().slice(0, 8)}` }]),
    updateService: (s) =>
      setServices((sv) => sv.map((x) => (x.id === s.id ? s : x))),
    deleteService: (id) => setServices((sv) => sv.filter((x) => x.id !== id)),
    resetServices: () => setServices(SERVICE_SEED),
    /* ── About page content ── */
    about,
    updateAbout: (a) => setAbout(a),
    resetAbout: () => setAbout(ABOUT_SEED),
    /* ── Global Website Auth Backup & Restore ── */
    createBackup: (): SiteBackupData => ({
      version: "1.0",
      exportedAt: new Date().toISOString(),
      source: "Dream Home Navigators Owner Console",
      customProperties: custom,
      deletedProperties: deleted,
      customRentals: customRentals,
      deletedRentals: deletedRentals,
      leads,
      services,
      about,
      featuredId,
    }),
    restoreBackup: (data: SiteBackupData) => {
      try {
        if (!data || typeof data !== "object") {
          return { ok: false, message: "Invalid backup data format." };
        }
        if (Array.isArray(data.customProperties)) setCustom(data.customProperties);
        if (Array.isArray(data.deletedProperties)) setDeleted(data.deletedProperties);
        if (Array.isArray(data.customRentals)) setCustomRentals(data.customRentals);
        if (Array.isArray(data.deletedRentals)) setDeletedRentals(data.deletedRentals);
        // Leads are NOT restored from backup — they live in Supabase.
        if (Array.isArray(data.services)) setServices(data.services);
        if (data.about && typeof data.about === "object") setAbout(data.about);
        if (data.featuredId !== undefined) setFeaturedId(data.featuredId);

        return {
          ok: true,
          message: `Backup restored successfully (exported: ${new Date(data.exportedAt || Date.now()).toLocaleDateString()}).`,
        };
      } catch (err) {
        return {
          ok: false,
          message: err instanceof Error ? err.message : "Failed to restore backup.",
        };
      }
    },
    resetAllToFactory: () => {
      setCustom([]);
      setDeleted([]);
      setCustomRentals([]);
      setDeletedRentals([]);
      // Leads are NOT reset here — they live in Supabase, not local content.
      setServices(SERVICE_SEED);
      setAbout(ABOUT_SEED);
      setFeaturedId(null);
    },
  };

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore(): StoreValue {
  const ctx = useContext(StoreCtx);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}
