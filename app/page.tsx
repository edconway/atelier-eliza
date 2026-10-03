import Link from "next/link";
import { currentSky } from "@/lib/sky";
import { Button } from "@/components/ui/button";
import { journalPosts } from "@/lib/journal";
import { MoonVeil } from "@/components/site/moon-veil";

export default function HomePage() {
  const sky = currentSky();
  const letters = journalPosts.slice(0, 3);

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-16 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:pb-24">
        <div>
          <p className="text-[0.7rem] uppercase tracking-[0.38em] text-rose">
            Bath · by moonlight
          </p>
          <h1 className="mt-5 max-w-3xl font-heading text-5xl leading-[1.02] sm:text-7xl">
            Your sky,
            <span className="block italic text-rose">held gently.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Eliza draws natal charts as if they were letters — rose-gold on
            midnight paper — then sits with you while they start to speak.
          </p>
          <p className="mt-4 max-w-xl text-sm text-lilac">
            {sky.phase} Moon in {sky.moonSign}, {sky.moonDegree} · Sun in{" "}
            {sky.sunSign} · {sky.placeNote}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full px-6">
              <Link href="/chart/new">Draw a natal chart</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full border-rose/40 bg-white/5 px-6"
            >
              <Link href="/consultations">Sit with Eliza</Link>
            </Button>
          </div>
        </div>
        <MoonVeil />
      </section>

      <section className="border-y border-white/10 bg-white/5">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-3">
          {[
            {
              title: "A wheel like jewellery",
              body: "Hover a planet for sign, house, and aspects. Keep charts for everyone you love — a small constellation of family.",
            },
            {
              title: "An hour in the dark",
              body: "Natal sittings, follow-ups, a child’s chart handled with consent. You leave with a recording in your atelier.",
            },
            {
              title: "Letters, not horoscopes",
              body: "The journal follows the Moon. Bring charts from Astro.com as AAF, or take ours with you — no locked garden.",
            },
          ].map((item) => (
            <article key={item.title}>
              <h2 className="font-heading text-3xl italic">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-heading text-4xl italic">From the journal</h2>
          <Link href="/journal" className="text-sm text-rose hover:underline">
            All letters
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {letters.map((post) => (
            <Link
              key={post.slug}
              href={`/journal/${post.slug}`}
              className="rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-rose/50 hover:bg-white/10"
            >
              <p className="text-[0.7rem] uppercase tracking-[0.22em] text-lilac">
                {post.topic}
              </p>
              <h3 className="mt-3 font-heading text-2xl italic">{post.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
