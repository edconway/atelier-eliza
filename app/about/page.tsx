import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Eliza",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <p className="text-xs uppercase tracking-[0.28em] text-rose">
        The studio
      </p>
      <h1 className="mt-4 font-heading text-5xl italic tracking-tight">Eliza</h1>
      <p className="mt-6 text-lg leading-relaxed text-muted-foreground">
        Eliza has read charts in a small room above a bookshop in Bath for
        twelve years. Before that she trained in the traditional craft —
        tropical, whole-sign for some teachers, Placidus for the wheel she
        draws here — and in the slower art of sitting still while someone
        decides whether to tell the truth.
      </p>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        She does not predict lottery numbers. She will talk about work, love,
        grief, and the particular weather of a childhood. She prefers questions
        that can last an hour. She will say when she does not know.
      </p>
      <p className="mt-4 leading-relaxed text-muted-foreground">
        The site draws a reliable natal wheel so you can arrive already
        acquainted with your sky. The sitting is still the point. Charts are
        maps. Eliza is the person who walks them with you.
      </p>
      <blockquote className="my-10 border-l-2 border-rose pl-5 font-heading text-2xl italic leading-snug">
        “Bring the minute if you have it. Bring the uncertainty if you don’t.
        Both are honest.”
      </blockquote>
      <div className="flex flex-wrap gap-3">
        <Button asChild className="rounded-full">
          <Link href="/consultations">How a sitting works</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/chart/new">Draw your chart first</Link>
        </Button>
      </div>
    </article>
  );
}
