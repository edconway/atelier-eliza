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
        Book a reading
      </h1>
      <div className="mt-12 grid gap-5 lg:grid-cols-3">
        {sittings.map((sitting) => (
          <SittingCard key={sitting.value} sitting={sitting} />
        ))}
      </div>
      <div className="mx-auto mt-16 max-w-lg rounded-3xl border bg-card p-6 sm:p-8">
        <h2 className="font-heading text-3xl">Request a time</h2>
        <div className="mt-8">
          <BookingForm />
        </div>
      </div>
    </div>
  );
}
