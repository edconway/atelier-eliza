"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { sessionFilms } from "@/lib/sessions";
import type {
  Booking,
  Member,
  NatalChart,
  NewsletterSignup,
  SessionFilm,
} from "@/lib/types";

const STORAGE_KEY = "atelier-eliza-v1";

interface AtelierState {
  member: Member | null;
  charts: NatalChart[];
  bookings: Booking[];
  newsletter: NewsletterSignup[];
}

interface AtelierContextValue extends AtelierState {
  ready: boolean;
  films: SessionFilm[];
  bookingOpen: boolean;
  setBookingOpen: (open: boolean) => void;
  signIn: (member: Member) => void;
  signOut: () => void;
  saveChart: (chart: NatalChart) => void;
  deleteChart: (id: string) => void;
  renameChart: (id: string, name: string) => void;
  getChart: (id: string) => NatalChart | undefined;
  addBooking: (booking: Omit<Booking, "id" | "createdAt" | "status">) => Booking;
  addNewsletter: (email: string) => void;
}

const AtelierContext = createContext<AtelierContextValue | null>(null);

const empty: AtelierState = {
  member: null,
  charts: [],
  bookings: [],
  newsletter: [],
};

const listeners = new Set<() => void>();

let memory: AtelierState = empty;
let didHydrate = false;

function emit() {
  listeners.forEach((listener) => listener());
}

function readStore(): AtelierState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return empty;
    return { ...empty, ...(JSON.parse(raw) as AtelierState) };
  } catch {
    return empty;
  }
}

function getSnapshot(): AtelierState {
  if (!didHydrate) {
    memory = readStore();
    didHydrate = true;
  }
  return memory;
}

function getServerSnapshot(): AtelierState {
  return empty;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function write(next: AtelierState) {
  memory = next;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  emit();
}

export function AtelierProvider({ children }: { children: ReactNode }) {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
  const [bookingOpen, setBookingOpen] = useState(false);

  const persist = useCallback((updater: (prev: AtelierState) => AtelierState) => {
    write(updater(memory));
  }, []);

  const value = useMemo<AtelierContextValue>(
    () => ({
      ...state,
      ready,
      films: sessionFilms,
      bookingOpen,
      setBookingOpen,
      signIn: (member) => persist((prev) => ({ ...prev, member })),
      signOut: () => persist((prev) => ({ ...prev, member: null })),
      saveChart: (chart) =>
        persist((prev) => ({
          ...prev,
          charts: [chart, ...prev.charts.filter((item) => item.id !== chart.id)],
        })),
      deleteChart: (id) =>
        persist((prev) => ({
          ...prev,
          charts: prev.charts.filter((chart) => chart.id !== id),
        })),
      renameChart: (id, name) =>
        persist((prev) => ({
          ...prev,
          charts: prev.charts.map((chart) =>
            chart.id === id
              ? { ...chart, input: { ...chart.input, name } }
              : chart,
          ),
        })),
      getChart: (id) => state.charts.find((chart) => chart.id === id),
      addBooking: (booking) => {
        const record: Booking = {
          ...booking,
          id: crypto.randomUUID(),
          createdAt: new Date().toISOString(),
          status: "requested",
        };
        persist((prev) => ({ ...prev, bookings: [record, ...prev.bookings] }));
        return record;
      },
      addNewsletter: (email) =>
        persist((prev) => ({
          ...prev,
          newsletter: prev.newsletter.some((item) => item.email === email)
            ? prev.newsletter
            : [
                { email, createdAt: new Date().toISOString() },
                ...prev.newsletter,
              ],
        })),
    }),
    [bookingOpen, persist, ready, state],
  );

  return (
    <AtelierContext.Provider value={value}>{children}</AtelierContext.Provider>
  );
}

export function useAtelier() {
  const context = useContext(AtelierContext);
  if (!context) {
    throw new Error("useAtelier must be used within AtelierProvider");
  }
  return context;
}
