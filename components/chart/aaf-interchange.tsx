"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAtelier } from "@/lib/atelier-store";
import {
  chartsToAaf,
  nativeToBirthInput,
  parseAaf,
  type AafNative,
} from "@/lib/aaf";
import type { Place } from "@/lib/types";

async function resolvePlace(native: AafNative): Promise<Place | null> {
  if (
    native.latitude !== undefined &&
    native.longitude !== undefined &&
    !Number.isNaN(native.latitude) &&
    !Number.isNaN(native.longitude)
  ) {
    return {
      name: native.country
        ? `${native.placeName}, ${native.country}`
        : native.placeName,
      country: native.country,
      latitude: native.latitude,
      longitude: native.longitude,
    };
  }
  const response = await fetch(
    `/api/places?q=${encodeURIComponent(native.placeName)}`,
  );
  const data = (await response.json()) as { places?: Place[] };
  return data.places?.[0] ?? null;
}

export function AafInterchange() {
  const { charts, saveChart } = useAtelier();
  const [paste, setPaste] = useState("");
  const [pending, setPending] = useState(false);

  async function importAaf() {
    const natives = parseAaf(paste);
    if (natives.length === 0) {
      toast.error("No AAF natal records found. Look for lines starting with #A93:");
      return;
    }
    setPending(true);
    let imported = 0;
    try {
      for (const native of natives) {
        const place = await resolvePlace(native);
        const input = nativeToBirthInput({
          ...native,
          latitude: place?.latitude,
          longitude: place?.longitude,
        });
        if (!input || !place) continue;
        input.place = place;
        const response = await fetch("/api/chart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(input),
        });
        const data = await response.json();
        if (response.ok && data.chart) {
          saveChart(data.chart);
          imported += 1;
        }
      }
      if (imported === 0) {
        toast.error("Those records could not be drawn. Check coordinates in the B93 lines.");
      } else {
        toast.success(
          imported === 1
            ? "Imported 1 chart."
            : `Imported ${imported} charts.`,
        );
        setPaste("");
      }
    } finally {
      setPending(false);
    }
  }

  function exportAaf() {
    if (charts.length === 0) {
      toast.error("Save a chart first, then export.");
      return;
    }
    const text = chartsToAaf(charts);
    void navigator.clipboard.writeText(text);
    const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "eliza-charts.aaf";
    link.click();
    URL.revokeObjectURL(url);
    toast.success("AAF copied and downloaded.");
  }

  return (
    <section className="mt-12 rounded-3xl border border-rose/25 bg-rose/5 p-6">
      <p className="text-[0.7rem] uppercase tracking-[0.28em] text-rose">
        Chart interchange
      </p>
      <h2 className="mt-2 font-heading text-3xl">Astro.com and other software</h2>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
        Astro.com does not offer an API. Paste an AAF export from My Astro
        (the aaf button appears if you have more than ten saved charts) to add
        those charts here. You can also export this library as AAF.
      </p>
      <Textarea
        className="mt-5 min-h-32 font-mono text-xs"
        placeholder="#A93:Last,First,,12.4.1986,7:42,Lisbon,PT"
        value={paste}
        onChange={(event) => setPaste(event.target.value)}
      />
      <div className="mt-4 flex flex-wrap gap-2">
        <Button
          className="rounded-full"
          onClick={importAaf}
          disabled={pending}
        >
          {pending ? "Drawing…" : "Import AAF"}
        </Button>
        <Button variant="outline" className="rounded-full" onClick={exportAaf}>
          Export my library
        </Button>
        <Button variant="ghost" className="rounded-full" asChild>
          <a href="https://www.astro.com/cgi/h.cgi" target="_blank" rel="noreferrer">
            Open Astro.com
          </a>
        </Button>
      </div>
    </section>
  );
}
