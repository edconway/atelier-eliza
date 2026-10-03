"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatBirthSentence } from "@/lib/astrology";
import { useAtelier } from "@/lib/atelier-store";
import type { BirthInput, Place, Relationship } from "@/lib/types";
import { cn } from "@/lib/utils";

const relations: { value: Relationship; label: string }[] = [
  { value: "self", label: "Myself" },
  { value: "partner", label: "Partner" },
  { value: "child", label: "Child" },
  { value: "parent", label: "Parent" },
  { value: "friend", label: "Friend" },
  { value: "other", label: "Someone else" },
];

const steps = ["Who", "When", "Where", "Draw"];

export function ChartWizard() {
  const router = useRouter();
  const { saveChart } = useAtelier();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [relationship, setRelationship] = useState<Relationship>("self");
  const [date, setDate] = useState<Date | undefined>();
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [unknownTime, setUnknownTime] = useState(false);
  const [query, setQuery] = useState("");
  const [places, setPlaces] = useState<Place[]>([]);
  const [place, setPlace] = useState<Place | null>(null);
  const [searching, setSearching] = useState(false);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) return;
    const handle = window.setTimeout(async () => {
      setSearching(true);
      try {
        const response = await fetch(
          `/api/places?q=${encodeURIComponent(query.trim())}`,
        );
        const data = (await response.json()) as { places?: Place[] };
        setPlaces(data.places ?? []);
      } catch {
        toast.error("Place search could not reach the map just now.");
      } finally {
        setSearching(false);
      }
    }, 280);
    return () => window.clearTimeout(handle);
  }, [query]);

  const shownPlaces = query.trim().length < 2 || place ? [] : places;

  const input = useMemo<BirthInput | null>(() => {
    if (!name.trim() || !date || !place) return null;
    return {
      name: name.trim(),
      relationship,
      year: date.getFullYear(),
      month: date.getMonth() + 1,
      day: date.getDate(),
      hour: Number(hour) || 0,
      minute: Number(minute) || 0,
      unknownTime,
      place,
    };
  }, [date, hour, minute, name, place, relationship, unknownTime]);

  function canNext() {
    if (step === 0) return name.trim().length > 1;
    if (step === 1) return Boolean(date);
    if (step === 2) return Boolean(place);
    return Boolean(input);
  }

  async function drawChart() {
    if (!input) return;
    setPending(true);
    try {
      const response = await fetch("/api/chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      const data = (await response.json()) as {
        chart?: Parameters<typeof saveChart>[0];
        error?: string;
      };
      if (!response.ok || !data.chart) {
        throw new Error(data.error ?? "The chart could not be drawn.");
      }
      saveChart(data.chart);
      toast.success("The wheel is drawn.");
      router.push(`/chart/${data.chart.id}`);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "The chart could not be drawn.",
      );
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <ol className="mb-10 flex gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground">
        {steps.map((label, index) => (
          <li
            key={label}
            className={cn(
              "flex-1 border-b-2 pb-2",
              index <= step ? "border-gold text-foreground" : "border-border",
            )}
          >
            {label}
          </li>
        ))}
      </ol>

      {step === 0 && (
        <section className="space-y-6">
          <h1 className="font-heading text-4xl tracking-tight">
            Who is this chart for?
          </h1>
          <p className="text-muted-foreground">
            Your own sky, or someone you love. You can keep a whole family in
            the atelier.
          </p>
          <div className="space-y-2">
            <Label htmlFor="who">Their name</Label>
            <Input
              id="who"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Maya, Rowan, my father…"
              className="h-12 text-base"
              autoFocus
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {relations.map((item) => (
              <button
                key={item.value}
                type="button"
                onClick={() => setRelationship(item.value)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm transition",
                  relationship === item.value
                    ? "border-ink bg-ink text-cream"
                    : "border-border bg-card hover:border-gold",
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 1 && (
        <section className="space-y-6">
          <h1 className="font-heading text-4xl tracking-tight">
            When did they arrive?
          </h1>
          <p className="text-muted-foreground">
            Date first. Time if you have it — even a parent’s “around four”
            is worth writing down later with Eliza.
          </p>
          <div className="overflow-hidden rounded-2xl border border-border bg-card p-3">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              captionLayout="dropdown"
              startMonth={new Date(1920, 0)}
              endMonth={new Date()}
              disabled={{ after: new Date() }}
              className="mx-auto w-full"
            />
          </div>
          <label className="flex items-center gap-3 text-sm">
            <input
              type="checkbox"
              checked={unknownTime}
              onChange={(event) => setUnknownTime(event.target.checked)}
              className="size-4 accent-[#2a2430]"
            />
            I don’t know the birth time
          </label>
          {!unknownTime && (
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="hour">Hour (0–23)</Label>
                <Input
                  id="hour"
                  inputMode="numeric"
                  value={hour}
                  onChange={(event) => setHour(event.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="minute">Minute</Label>
                <Input
                  id="minute"
                  inputMode="numeric"
                  value={minute}
                  onChange={(event) => setMinute(event.target.value)}
                />
              </div>
            </div>
          )}
          {unknownTime && (
            <p className="rounded-xl bg-gold/15 px-4 py-3 text-sm">
              We’ll draw a noon chart. The Sun and planets still speak; the
              rising sign and houses are estimates until a time is found.
            </p>
          )}
        </section>
      )}

      {step === 2 && (
        <section className="space-y-6">
          <h1 className="font-heading text-4xl tracking-tight">
            Where on Earth?
          </h1>
          <p className="text-muted-foreground">
            City and country. We find coordinates and the timezone that was
            actually in force that day — including old daylight-saving rules.
          </p>
          <div className="space-y-2">
            <Label htmlFor="place">Birthplace</Label>
            <Input
              id="place"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setPlace(null);
              }}
              placeholder="Lisbon, Kyoto, Bath…"
              className="h-12 text-base"
            />
          </div>
          {searching && (
            <p className="text-sm text-muted-foreground">Searching the map…</p>
          )}
          {shownPlaces.length > 0 && (
            <ul className="divide-y rounded-xl border bg-card">
              {shownPlaces.map((item) => (
                <li key={`${item.name}-${item.latitude}`}>
                  <button
                    type="button"
                    onClick={() => {
                      setPlace(item);
                      setQuery(item.name);
                      setPlaces([]);
                    }}
                    className="w-full px-4 py-3 text-left hover:bg-secondary"
                  >
                    <span className="block text-sm">{item.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {item.latitude.toFixed(3)}°, {item.longitude.toFixed(3)}°
                      {item.timezone ? ` · ${item.timezone}` : ""}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          {place && (
            <p className="rounded-xl border border-gold/40 bg-card px-4 py-3 text-sm">
              {place.name}
              <br />
              {place.latitude.toFixed(4)}° N/S · {place.longitude.toFixed(4)}°
              E/W
              {place.timezone ? ` · ${place.timezone}` : ""}
            </p>
          )}
        </section>
      )}

      {step === 3 && input && (
        <section className="space-y-6">
          <h1 className="font-heading text-4xl tracking-tight">
            Does this read true?
          </h1>
          <p className="font-heading text-2xl leading-snug text-ink">
            {formatBirthSentence(input)}
          </p>
          <p className="text-sm text-muted-foreground">
            Tropical zodiac, Placidus houses, timezone taken from the
            coordinates. You can save the wheel for anyone in your family.
          </p>
        </section>
      )}

      <div className="mt-10 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="ghost"
          disabled={step === 0}
          onClick={() => setStep((value) => value - 1)}
        >
          Back
        </Button>
        {step < 3 ? (
          <Button type="button" disabled={!canNext()} onClick={() => setStep((value) => value + 1)}>
            Continue
          </Button>
        ) : (
          <Button type="button" disabled={pending || !input} onClick={drawChart}>
            {pending ? "Drawing…" : "Draw the chart"}
          </Button>
        )}
      </div>
    </div>
  );
}
