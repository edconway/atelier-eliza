"use client";

import { useMemo, useState } from "react";
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

export function BookingForm({ onDone }: { onDone?: () => void }) {
  const { charts, member, addBooking } = useAtelier();
  const [name, setName] = useState(member?.name ?? "");
  const [email, setEmail] = useState(member?.email ?? "");
  const [sessionType, setSessionType] = useState<SessionType>("child");
  const [preferredDate, setPreferredDate] = useState("");
  const [chartId, setChartId] = useState("none");
  const [notes, setNotes] = useState("");
  const [sent, setSent] = useState(false);

  const chartOptions = useMemo(
    () => charts.map((chart) => ({ id: chart.id, name: chart.input.name })),
    [charts],
  );

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    addBooking({
      name,
      email,
      sessionType,
      preferredDate,
      chartId: chartId === "none" ? undefined : chartId,
      notes,
    });
    setSent(true);
    toast.success("The studio has your request. Eliza will confirm by email.");
  }

  if (sent) {
    return (
      <div className="space-y-3">
        <h2 className="font-heading text-2xl">Held for you</h2>
        <p className="text-sm text-muted-foreground">
          Eliza will write within a few days with a time. Your request is also
          kept with your saved charts.
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
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="bk-sitting">Sitting</Label>
          <select
            id="bk-sitting"
            required
            value={sessionType}
            onChange={(event) =>
              setSessionType(event.target.value as SessionType)
            }
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
          <Label htmlFor="bk-date">Preferred date</Label>
          <Input
            id="bk-date"
            type="date"
            required
            value={preferredDate}
            onChange={(event) => setPreferredDate(event.target.value)}
          />
        </div>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="bk-chart">Chart to discuss</Label>
        <select
          id="bk-chart"
          value={chartId}
          onChange={(event) => setChartId(event.target.value)}
          className="h-9 w-full rounded-lg border border-input bg-transparent px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <option value="none">I’ll cast one with Eliza</option>
          {chartOptions.map((chart) => (
            <option key={chart.id} value={chart.id}>
              {chart.name}
            </option>
          ))}
        </select>
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="bk-notes">What is living in you just now?</Label>
        <Textarea
          id="bk-notes"
          value={notes}
          onChange={(event) => setNotes(event.target.value)}
          rows={3}
          placeholder="A question you can sit with for an hour."
        />
      </div>
      <Button type="submit" className="w-full">
        Request the hour
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
          <DialogTitle className="font-heading text-2xl">
            Book a sitting
          </DialogTitle>
          <DialogDescription>
            An hour in Bath, or by video. Eliza draws the chart before you
            arrive.
          </DialogDescription>
        </DialogHeader>
        <BookingForm onDone={() => setBookingOpen(false)} />
      </DialogContent>
    </Dialog>
  );
}
