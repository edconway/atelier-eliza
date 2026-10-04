import type { Metadata } from "next";
import Link from "next/link";
import { sittings } from "@/lib/sittings";
import { SittingCard } from "@/components/booking/sitting-card";

export const metadata: Metadata = {
  title: "Sittings",
};

export default function ConsultationsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="text-xs uppercase tracking-[0.28em] text-rose">
        Readings you can book
      </p>
      <h1 className="mt-4 font-heading text-5xl tracking-tight">Sittings</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        In the Bath studio, or by video. Eliza draws the chart before you
        arrive. Tea is provided; recordings are kept for you.
      </p>
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {sittings.map((sitting) => (
          <SittingCard key={sitting.value} sitting={sitting} />
        ))}
      </div>
      <p className="mt-12 text-sm text-muted-foreground">
        Prefer to meet the sky first?{" "}
        <Link href="/chart/new" className="text-rose underline">
          Draw a natal chart
        </Link>{" "}
        and bring it to the hour. Or{" "}
        <Link href="/book" className="text-rose underline">
          request a reading
        </Link>
        .
      </p>
    </div>
  );
}
