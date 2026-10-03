"use client";

import { BookingForm } from "@/components/booking/booking-dialog";

export default function BookPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-16 sm:px-6">
      <p className="text-xs uppercase tracking-[0.28em] text-gold-ink">
        The studio
      </p>
      <h1 className="mt-4 font-heading text-4xl">Book a sitting</h1>
      <p className="mt-3 mb-8 text-muted-foreground">
        An hour in Bath, or by video. Eliza draws the chart before you arrive.
      </p>
      <BookingForm />
    </div>
  );
}
