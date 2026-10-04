import { BookButton } from "@/components/booking/book-button";
import type { sittings } from "@/lib/sittings";

export function SittingCard({
  sitting,
}: {
  sitting: (typeof sittings)[number];
}) {
  return (
    <article className="flex flex-col rounded-3xl border bg-card p-6 shadow-sm">
      <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
        {sitting.time}
      </p>
      <h2 className="mt-2 font-heading text-2xl leading-snug">{sitting.title}</h2>
      <p className="mt-1 text-sm text-rose">{sitting.price}</p>
      <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
        {sitting.body}
      </p>
      <div className="mt-6">
        <BookButton label="Request this reading" />
      </div>
    </article>
  );
}
