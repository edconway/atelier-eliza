"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { useAtelier } from "@/lib/atelier-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { titleCase } from "@/lib/glyphs";
import { AafInterchange } from "@/components/chart/aaf-interchange";
import { ViewOnAstroCom } from "@/components/chart/view-on-astro-com";

export default function MembersChartsPage() {
  const router = useRouter();
  const { member, charts, ready, deleteChart, saveChart, renameChart } = useAtelier();
  const [samplePending, setSamplePending] = useState(false);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");

  async function drawSample() {
    setSamplePending(true);
    try {
      const response = await fetch("/api/chart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Eliza",
          relationship: "other",
          year: 1986,
          month: 4,
          day: 12,
          hour: 7,
          minute: 42,
          unknownTime: false,
          place: {
            name: "Bath, England",
            country: "United Kingdom",
            latitude: 51.3811,
            longitude: -2.359,
            timezone: "Europe/London",
          },
        }),
      });
      const data = await response.json();
      if (!response.ok || !data.chart) throw new Error(data.error);
      saveChart(data.chart);
      router.push(`/chart/${data.chart.id}`);
    } catch {
      toast.error("The sample chart could not be drawn.");
    } finally {
      setSamplePending(false);
    }
  }

  if (!ready) return null;
  if (!member) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-muted-foreground">Sign in to see saved charts.</p>
        <Button className="mt-4" asChild>
          <Link href="/sign-in">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <Link href="/members" className="hover:text-gold-ink">
          Library
        </Link>{" "}
        · Charts
      </p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <h1 className="font-heading text-4xl">Saved charts</h1>
        <Button asChild>
          <Link href="/chart/new">Draw a chart</Link>
        </Button>
      </div>
      {charts.length === 0 ? (
        <div className="mt-10 max-w-md space-y-4">
          <p className="text-muted-foreground">
            No wheels yet. Draw one for yourself, a partner, a child — each name
            keeps its own sky.
          </p>
          <Button variant="outline" onClick={drawSample} disabled={samplePending}>
            {samplePending ? "Drawing…" : "Draw Eliza’s sample chart"}
          </Button>
        </div>
      ) : (
        <ul className="mt-10 divide-y rounded-2xl border bg-card">
          {charts.map((chart) => (
            <li
              key={chart.id}
              className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                {renamingId === chart.id ? (
                  <form
                    className="flex gap-2"
                    onSubmit={(event) => {
                      event.preventDefault();
                      if (renameValue.trim()) renameChart(chart.id, renameValue.trim());
                      setRenamingId(null);
                    }}
                  >
                    <Input
                      value={renameValue}
                      onChange={(event) => setRenameValue(event.target.value)}
                      autoFocus
                      className="h-8"
                    />
                    <Button size="sm" type="submit">
                      Save
                    </Button>
                  </form>
                ) : (
                  <>
                    <p className="font-heading text-xl">{chart.input.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {titleCase(chart.input.relationship)} · Sun {chart.summary.sun} ·
                      Moon {chart.summary.moon}
                    </p>
                  </>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" asChild>
                  <Link href={`/chart/${chart.id}`}>Open</Link>
                </Button>
                <ViewOnAstroCom
                  chart={chart}
                  size="sm"
                  variant="ghost"
                  label="Astro.com"
                  className="w-auto"
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setRenamingId(chart.id);
                    setRenameValue(chart.input.name);
                  }}
                >
                  Rename
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => deleteChart(chart.id)}
                >
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
      <AafInterchange />
    </div>
  );
}
