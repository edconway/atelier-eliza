import type { Metadata } from "next";
import { sittings } from "@/lib/sittings";
import { SittingCard } from "@/components/booking/sitting-card";
import { BookingForm } from "@/components/booking/booking-dialog";

export const metadata: Metadata = {
  title: "Book a reading",
};

export default function BookPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="text-xs uppercase tracking-[0.28em] text-rose">
        Readings you can book
      </p>
      <h1 className="mt-4 font-heading text-5xl tracking-tight">
        Sit with Eliza
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        In Bath, or by video. Eliza draws the chart before you arrive. These
        are the hours she offers now.
      </p>
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {sittings.map((sitting) => (
          <SittingCard key={sitting.value} sitting={sitting} />
        ))}
      </div>
      <div className="mx-auto mt-16 max-w-lg rounded-3xl border bg-card p-6 sm:p-8">
        <h2 className="font-heading text-3xl">Request an hour</h2>
        <p className="mt-2 mb-8 text-sm text-muted-foreground">
          Choose the reading, a preferred date, and anything that is alive in
          the family just now. Eliza will confirm by email.
        </p>
        <BookingForm />
      </div>
    </div>
  );
}
