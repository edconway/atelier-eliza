import type { Metadata } from "next";
import Link from "next/link";
import { BookButton } from "@/components/booking/book-button";

export const metadata: Metadata = {
  title: "Sittings",
};

const sittings = [
  {
    title: "Natal sitting",
    time: "75 minutes",
    price: "£120",
    body: "The first hour. We walk Sun, Moon, and rising, then follow what is alive. You leave with a recording in your atelier.",
  },
  {
    title: "Follow-up",
    time: "50 minutes",
    price: "£90",
    body: "For returning clients. Transits of the season, a decision, or a house we did not finish.",
  },
  {
    title: "Family / child’s chart",
    time: "60 minutes",
    price: "£110",
    body: "Read with care and consent. A map for a parent, not a verdict on a child. The chart is saved under their name in your library.",
  },
  {
    title: "Year ahead",
    time: "80 minutes",
    price: "£140",
    body: "Solar return and the weather of the next twelve months, spoken as a calendar rather than a fate.",
  },
];

export default function ConsultationsPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <p className="text-xs uppercase tracking-[0.28em] text-rose">
        The hour
      </p>
      <h1 className="mt-4 font-heading text-5xl tracking-tight">Sittings</h1>
      <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
        In the Bath studio, or by video. Eliza draws the chart before you
        arrive. Tea is provided; recordings are kept for you.
      </p>
      <div className="mt-12 grid gap-5 md:grid-cols-2">
        {sittings.map((sitting) => (
          <article
            key={sitting.title}
            className="flex flex-col rounded-2xl border bg-card p-6"
          >
            <div className="flex items-baseline justify-between gap-3">
              <h2 className="font-heading text-2xl">{sitting.title}</h2>
              <span className="text-sm text-rose">{sitting.price}</span>
            </div>
            <p className="mt-1 text-xs uppercase tracking-[0.16em] text-muted-foreground">
              {sitting.time}
            </p>
            <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
              {sitting.body}
            </p>
            <div className="mt-6">
              <BookButton />
            </div>
          </article>
        ))}
      </div>
      <p className="mt-12 text-sm text-muted-foreground">
        Prefer to meet the sky first?{" "}
        <Link href="/chart/new" className="text-rose underline">
          Draw a natal chart
        </Link>{" "}
        and bring it to the hour.
      </p>
    </div>
  );
}
