"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAtelier } from "@/lib/atelier-store";
import { sittings } from "@/lib/sittings";
import type { NatalChart, Place, SessionType } from "@/lib/types";

const types = sittings.map((sitting) => ({
  value: sitting.value,
  label: `${sitting.title} (${sitting.time})`,
  minutes: sitting.minutes,
}));

type Slot = { id: string; start: string; end: string };

type BirthDraft = {
  source: "saved" | "new";
  chartId: string;
  personName: string;
  date: string;
  hour: string;
  minute: string;
  unknownTime: boolean;
  query: string;
  place: Place | null;
};

function emptyBirth(chartId = ""): BirthDraft {
  return {
    source: chartId ? "saved" : "new",
    chartId,
    personName: "",
    date: "",
    hour: "12",
    minute: "00",
    unknownTime: false,
    query: "",
    place: null,
  };
}

function birthPayload(draft: BirthDraft, charts: NatalChart[]) {
  if (draft.source === "saved") {
    const chart = charts.find((item) => item.id === draft.chartId);
    if (!chart) return null;
    const input = chart.input;
    return {
      name: input.name,
      year: input.year,
      month: input.month,
      day: input.day,
      hour: input.hour,
      minute: input.minute,
      unknownTime: input.unknownTime,
      placeName: input.place.name,
      latitude: input.place.latitude,
      longitude: input.place.longitude,
    };
  }
  const [year, month, day] = draft.date.split("-").map(Number);
  if (!draft.place) return null;
  return {
    name: draft.personName.trim(),
    year,
    month,
    day,
    hour: Number(draft.hour),
    minute: Number(draft.minute),
    unknownTime: draft.unknownTime,
    placeName: draft.place.name,
    latitude: draft.place.latitude,
    longitude: draft.place.longitude,
  };
}

function BirthFields({
  idPrefix,
  label,
  charts,
  draft,
  onChange,
}: {
  idPrefix: string;
  label: string;
  charts: NatalChart[];
  draft: BirthDraft;
  onChange: (next: BirthDraft) => void;
}) {
  const [places, setPlaces] = useState<Place[]>([]);

  useEffect(() => {
    if (draft.source !== "new" || draft.place || draft.query.trim().length < 2) {
      return;
    }
    const handle = window.setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/places?q=${encodeURIComponent(draft.query.trim())}`,
        );
        const data = (await response.json()) as { places?: Place[] };
        setPlaces(data.places ?? []);
      } catch {
        setPlaces([]);
      }
    }, 280);
    return () => window.clearTimeout(handle);
  }, [draft.place, draft.query, draft.source]);

  return (
    <fieldset className="space-y-3 rounded-2xl border p-3">
      <legend className="px-1 text-sm font-medium">{label}</legend>
      {charts.length > 0 ? (
        <div className="flex gap-3 text-sm">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name={`${idPrefix}-source`}
              checked={draft.source === "saved"}
              onChange={() =>
                onChange({
                  ...draft,
                  source: "saved",
                  chartId: draft.chartId || charts[0]?.id || "",
                })
              }
            />
            Saved profile
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name={`${idPrefix}-source`}
              checked={draft.source === "new"}
              onChange={() => onChange({ ...draft, source: "new" })}
            />
            Enter birth details
          </label>
        </div>
      ) : null}
      {draft.source === "saved" && charts.length > 0 ? (
        <select
          required
          value={draft.chartId}
          onChange={(event) => onChange({ ...draft, chartId: event.target.value })}
          className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {charts.map((chart) => (
            <option key={chart.id} value={chart.id}>
              {chart.input.name}, {chart.input.day}/{chart.input.month}/{chart.input.year}
            </option>
          ))}
        </select>
      ) : (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor={`${idPrefix}-person`}>Name on the chart</Label>
            <Input
              id={`${idPrefix}-person`}
              required
              value={draft.personName}
              onChange={(event) =>
                onChange({ ...draft, personName: event.target.value })
              }
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor={`${idPrefix}-date`}>Date of birth</Label>
            <Input
              id={`${idPrefix}-date`}
              type="date"
              required
              value={draft.date}
              onChange={(event) => onChange({ ...draft, date: event.target.value })}
            />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={draft.unknownTime}
              onChange={(event) =>
                onChange({ ...draft, unknownTime: event.target.checked })
              }
            />
            Birth time unknown
          </label>
          {!draft.unknownTime ? (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor={`${idPrefix}-hour`}>Hour (0–23)</Label>
                <Input
                  id={`${idPrefix}-hour`}
                  inputMode="numeric"
                  required
                  value={draft.hour}
                  onChange={(event) => onChange({ ...draft, hour: event.target.value })}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor={`${idPrefix}-minute`}>Minute</Label>
                <Input
                  id={`${idPrefix}-minute`}
                  inputMode="numeric"
                  required
                  value={draft.minute}
                  onChange={(event) =>
                    onChange({ ...draft, minute: event.target.value })
                  }
                />
              </div>
            </div>
          ) : null}
          <div className="space-y-1.5">
            <Label htmlFor={`${idPrefix}-place`}>Place of birth</Label>
            <Input
              id={`${idPrefix}-place`}
              required={!draft.place}
              value={draft.place?.name ?? draft.query}
              placeholder="City or town"
              onChange={(event) =>
                onChange({ ...draft, query: event.target.value, place: null })
              }
            />
            {draft.place ? (
              <p className="text-xs text-muted-foreground">{draft.place.name}</p>
            ) : null}
            {!draft.place && places.length > 0 ? (
              <ul className="overflow-hidden rounded-lg border">
                {places.slice(0, 5).map((place) => (
                  <li key={`${place.name}-${place.latitude}`}>
                    <button
                      type="button"
                      className="w-full px-3 py-2 text-left text-sm hover:bg-muted"
                      onClick={() => onChange({ ...draft, place, query: place.name })}
                    >
                      {place.name}
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
          </div>
        </div>
      )}
    </fieldset>
  );
}

function formatSlot(slot: Slot) {
  const start = new Date(slot.start);
  const end = new Date(slot.end);
  const day = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(start);
  const time = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    hour: "2-digit",
    minute: "2-digit",
  });
  return `${day}, ${time.format(start)}–${time.format(end)}`;
}

export function BookingForm({ onDone }: { onDone?: () => void }) {
  const { member, charts } = useAtelier();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [unavailable, setUnavailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [eventId, setEventId] = useState("");
  const [name, setName] = useState(member?.name ?? "");
  const [email, setEmail] = useState(member?.email ?? "");
  const [sessionType, setSessionType] = useState<SessionType>("child");
  const [notes, setNotes] = useState("");
  const [birth, setBirth] = useState<BirthDraft>(() => emptyBirth());
  const [otherBirth, setOtherBirth] = useState<BirthDraft>(() => emptyBirth());
  const [pending, setPending] = useState(false);
  const [booked, setBooked] = useState<string | null>(null);
  const [emailed, setEmailed] = useState(false);

  useEffect(() => {
    const minutes = types.find((type) => type.value === sessionType)?.minutes ?? 60;
    let cancelled = false;
    setLoading(true);
    fetch(`/api/bookings?minutes=${minutes}`)
      .then(async (response) => {
        const body = (await response.json()) as {
          slots?: Slot[];
          unavailable?: boolean;
        };
        if (cancelled) return;
        setUnavailable(!response.ok || Boolean(body.unavailable));
        const next = body.slots ?? [];
        setSlots(next);
        setEventId(next[0]?.id ?? "");
      })
      .catch(() => {
        if (!cancelled) setUnavailable(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [sessionType]);

  useEffect(() => {
    const first = charts[0];
    if (!first) return;
    setBirth((current) =>
      current.chartId ? current : { ...current, source: "saved", chartId: first.id },
    );
    setOtherBirth((current) =>
      current.chartId ? current : { ...current, source: "saved", chartId: first.id },
    );
  }, [charts]);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const chart = birthPayload(birth, charts);
    const other =
      sessionType === "child-with-other" ? birthPayload(otherBirth, charts) : undefined;
    if (!chart || (sessionType === "child-with-other" && !other)) {
      toast.error("Add the birth details, including a place from the list.");
      return;
    }
    setPending(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: eventId.split("|")[0],
          start: eventId.split("|")[1],
          name,
          email,
          sessionType,
          notes,
          birth: chart,
          otherBirth: other,
        }),
      });
      const body = (await response.json()) as { error?: string; emailed?: boolean };
      if (!response.ok) {
        toast.error(body.error ?? "That time could not be booked.");
        if (response.status === 409) {
          setSlots((current) => current.filter((slot) => slot.id !== eventId));
          setEventId("");
        }
        return;
      }
      const chosen = slots.find((slot) => slot.id === eventId);
      setBooked(chosen ? formatSlot(chosen) : "that time");
      setEmailed(Boolean(body.emailed));
      toast.success("Request sent.");
    } catch {
      toast.error("That time could not be booked.");
    } finally {
      setPending(false);
    }
  }

  if (unavailable) {
    return (
      <p className="text-sm text-muted-foreground">Slots are unavailable.</p>
    );
  }

  if (booked) {
    return (
      <div className="space-y-3">
        <h2 className="font-heading text-2xl">Request sent</h2>
        <p className="text-sm text-muted-foreground">
          {booked} is on Eliza’s calendar as a request. She can keep it or delete it.
          {emailed ? " A confirmation email is on its way." : ""}
        </p>
        {onDone ? <Button onClick={onDone}>Close</Button> : null}
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="bk-name">Name</Label>
          <Input
            id="bk-name"
            required
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="bk-email">Email</Label>
          <Input
            id="bk-email"
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="bk-reading">Reading</Label>
        <select
          id="bk-reading"
          required
          value={sessionType}
          onChange={(event) => setSessionType(event.target.value as SessionType)}
          className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {types.map((type) => (
            <option key={type.value} value={type.value}>
              {type.label}
            </option>
          ))}
        </select>
      </div>
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Times that fit this reading</legend>
        {loading ? (
          <p className="text-sm text-muted-foreground">Looking for open times…</p>
        ) : slots.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No opening long enough for this reading.
          </p>
        ) : (
          slots.map((slot) => (
            <label key={slot.id} className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="slot"
                value={slot.id}
                checked={eventId === slot.id}
                onChange={() => setEventId(slot.id)}
                required
              />
              {formatSlot(slot)}
            </label>
          ))
        )}
      </fieldset>
      <BirthFields
        idPrefix="bk-birth"
        label="Birth details"
        charts={charts}
        draft={birth}
        onChange={setBirth}
      />
      {sessionType === "child-with-other" ? (
        <BirthFields
          idPrefix="bk-other"
          label="The other person’s birth details"
          charts={charts}
          draft={otherBirth}
          onChange={setOtherBirth}
        />
      ) : null}
      <div className="space-y-1.5">
        <Label htmlFor="bk-notes">Notes</Label>
        <Textarea
          id="bk-notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={3}
          placeholder="Optional."
        />
      </div>
      <Button type="submit" className="w-full" disabled={pending || !eventId}>
        {pending ? "Sending…" : "Request this time"}
      </Button>
    </form>
  );
}

export function BookingDialog() {
  const { bookingOpen, setBookingOpen } = useAtelier();

  return (
    <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
      <DialogContent className="max-h-[min(40rem,90vh)] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Book</DialogTitle>
          <DialogDescription>
            Choose a time that fits the reading. Eliza can accept or decline it.
          </DialogDescription>
        </DialogHeader>
        <BookingForm onDone={() => setBookingOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
