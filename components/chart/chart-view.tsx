"use client";

import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { NatalWheel } from "@/components/chart/natal-wheel";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAtelier } from "@/lib/atelier-store";
import { formatBirthSentence } from "@/lib/astrology";
import { PLANET_GLYPHS, titleCase } from "@/lib/glyphs";
import type { NatalChart } from "@/lib/types";
import { cn } from "@/lib/utils";

export function ChartView({ chart }: { chart: NatalChart }) {
  const { setBookingOpen, saveChart, member } = useAtelier();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = chart.bodies.find((body) => body.id === selectedId);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(280px,0.85fr)]">
      <div>
        <p className="text-xs uppercase tracking-[0.22em] text-gold-ink">
          Natal chart
        </p>
        <h1 className="mt-2 font-heading text-4xl tracking-tight">
          {chart.input.name}
        </h1>
        <p className="mt-3 max-w-xl text-muted-foreground">
          {formatBirthSentence(chart.input)}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Badge variant="secondary">Sun {chart.summary.sun}</Badge>
          <Badge variant="secondary">Moon {chart.summary.moon}</Badge>
          <Badge variant="secondary">Rising {chart.summary.rising}</Badge>
        </div>
        {chart.unknownTime && (
          <p className="mt-4 rounded-xl bg-rose/15 px-4 py-3 text-sm">
            Birth time unknown — houses and rising are a noon estimate.
          </p>
        )}
        <div className="mt-6">
          <NatalWheel
            chart={chart}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
        </div>
      </div>
      <aside className="space-y-6">
        <div className="rounded-2xl border bg-card p-5">
          <h2 className="font-heading text-2xl">A first look</h2>
          <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
            {chart.firstLook.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
        <BalanceMeter
          title="Elements"
          items={[
            ["Fire", chart.elements.fire],
            ["Earth", chart.elements.earth],
            ["Air", chart.elements.air],
            ["Water", chart.elements.water],
          ]}
        />
        <BalanceMeter
          title="Modalities"
          items={[
            ["Cardinal", chart.modalities.cardinal],
            ["Fixed", chart.modalities.fixed],
            ["Mutable", chart.modalities.mutable],
          ]}
        />
        <div className="rounded-2xl border bg-card p-5">
          <h2 className="font-heading text-xl">Planets</h2>
          <ul className="mt-3 divide-y">
            {chart.bodies
              .filter((body) => body.kind !== "angle")
              .map((body) => (
                <li key={body.id}>
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedId(selectedId === body.id ? null : body.id)
                    }
                    className={cn(
                      "flex w-full items-start justify-between gap-3 py-2 text-left text-sm",
                      selectedId === body.id && "text-gold-ink",
                    )}
                  >
                    <span>
                      <span className="font-glyph mr-2">
                        {PLANET_GLYPHS[body.id]}
                      </span>
                      {body.name}
                    </span>
                    <span className="text-muted-foreground">
                      {body.signDegree} {titleCase(body.sign)}
                      {body.house ? ` · H${body.house}` : ""}
                    </span>
                  </button>
                </li>
              ))}
          </ul>
          {selected && (
            <p className="mt-3 text-sm text-muted-foreground">
              {selected.name} in {titleCase(selected.sign)}
              {selected.house ? `, house ${selected.house}` : ""}.{" "}
              {selected.dignity ? `Traditionally ${selected.dignity}.` : ""}
            </p>
          )}
        </div>
        <div className="rounded-2xl border bg-card p-5 text-xs leading-relaxed text-muted-foreground">
          <p className="font-heading text-sm text-foreground">How this was calculated</p>
          <p className="mt-2">
            {chart.ephemeris}. Timezone {chart.timezoneName}. Local{" "}
            {chart.localTime}; UTC {chart.utcTime}. Coordinates{" "}
            {chart.input.place.latitude.toFixed(4)},{" "}
            {chart.input.place.longitude.toFixed(4)}.
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <Button className="rounded-full" onClick={() => setBookingOpen(true)}>
            Sit with Eliza over this chart
          </Button>
          <Button variant="outline" className="rounded-full" asChild>
            <Link href="/members">
              {member ? "Open in your atelier" : "Save in your atelier"}
            </Link>
          </Button>
          <Button
            variant="ghost"
            className="rounded-full"
            onClick={() => {
              saveChart(chart);
              toast.success("This wheel is in your atelier.");
            }}
          >
            Keep this wheel
          </Button>
          <Button
            variant="ghost"
            className="rounded-full"
            onClick={() => window.print()}
          >
            Print
          </Button>
        </div>
      </aside>
    </div>
  );
}

function BalanceMeter({
  title,
  items,
}: {
  title: string;
  items: [string, number][];
}) {
  const max = Math.max(...items.map((item) => item[1]), 1);
  return (
    <div className="rounded-2xl border bg-card p-5">
      <h2 className="font-heading text-xl">{title}</h2>
      <ul className="mt-4 space-y-2">
        {items.map(([label, value]) => (
          <li key={label} className="text-sm">
            <div className="mb-1 flex justify-between">
              <span>{label}</span>
              <span className="text-muted-foreground">{value}</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-rose"
                style={{ width: `${(value / max) * 100}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
