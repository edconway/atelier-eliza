"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ChartView } from "@/components/chart/chart-view";
import { Button } from "@/components/ui/button";
import { useAtelier } from "@/lib/atelier-store";

export default function ChartPage() {
  const params = useParams<{ id: string }>();
  const { getChart, ready } = useAtelier();
  const chart = getChart(params.id);

  if (!ready) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-24 text-muted-foreground">
        Opening the wheel…
      </div>
    );
  }

  if (!chart) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-heading text-3xl">This chart is not in this atelier</h1>
        <p className="mt-3 text-muted-foreground">
          Charts are kept in your browser. Draw a new one, or sign in on this
          device where you saved it.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/chart/new">Draw a natal chart</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <ChartView chart={chart} />
    </div>
  );
}
