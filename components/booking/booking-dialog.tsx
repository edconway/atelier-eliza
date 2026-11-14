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
import type { SessionType } from "@/lib/types";

const types = sittings.map((sitting) => ({
  value: sitting.value,
  label: sitting.title,
}));

type Slot = { id: string; start: string; end: string };

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
  const { member } = useAtelier();
  const [slots, setSlots] = useState<Slot[]>([]);
  const [unavailable, setUnavailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [eventId, setEventId] = useState("");
  const [name, setName] = useState(member?.name ?? "");
  const [email, setEmail] = useState(member?.email ?? "");
  const [sessionType, setSessionType] = useState<SessionType>("child");
  const [notes, setNotes] = useState("");
  const [pending, setPending] = useState(false);
  const [booked, setBooked] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/bookings")
      .then(async (response) => {
        const body = (await response.json()) as {
          slots?: Slot[];
          unavailable?: boolean;
        };
        if (cancelled) return;
        setUnavailable(!response.ok || Boolean(body.unavailable));
        setSlots(body.slots ?? []);
        setEventId(body.slots?.[0]?.id ?? "");
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
  }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    try {
      const response = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, name, email, sessionType, notes }),
      });
      const body = (await response.json()) as { error?: string };
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
      toast.success("Booked.");
    } catch {
      toast.error("That time could not be booked.");
    } finally {
      setPending(false);
    }
  }

  if (loading) {
    return <p className="text-sm text-muted-foreground">Looking for open times…</p>;
  }

  if (unavailable) {
    return (
      <p className="text-sm text-muted-foreground">Slots are unavailable.</p>
    );
  }

  if (booked) {
    return (
      <div className="space-y-3">
        <h2 className="font-heading text-2xl">You’re booked</h2>
        <p className="text-sm text-muted-foreground">
          {booked} is held for you. Eliza has it on her calendar.
        </p>
        {onDone ? <Button onClick={onDone}>Close</Button> : null}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">No open times right now.</p>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <fieldset className="space-y-2">
        <legend className="text-sm font-medium">Open times</legend>
        {slots.map((slot) => (
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
        ))}
      </fieldset>
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
        {pending ? "Booking…" : "Book"}
      </Button>
    </form>
  );
}

export function BookingDialog() {
  const { bookingOpen, setBookingOpen } = useAtelier();

  return (
    <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Book</DialogTitle>
          <DialogDescription>Choose an open time.</DialogDescription>
        </DialogHeader>
        <BookingForm onDone={() => setBookingOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
