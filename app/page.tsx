import Link from "next/link";
import { currentSky } from "@/lib/sky";
import { Button } from "@/components/ui/button";
import { journalPosts } from "@/lib/journal";

export default function HomePage() {
  const sky = currentSky();
  const letters = journalPosts.slice(0, 3);

  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
        <p className="text-xs uppercase tracking-[0.28em] text-gold-ink">
          Bath · by appointment
        </p>
        <h1 className="mt-5 max-w-3xl font-heading text-5xl leading-[1.05] tracking-tight sm:text-7xl">
          Charts drawn with care.
          <span className="block italic text-gold-ink">
            Conversations that last.
          </span>
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
          Eliza reads natal charts the way some people read letters — slowly,
          out loud, and with the person who received them in the room.
        </p>
        <p className="mt-4 max-w-xl text-sm text-gold-ink">
          {sky.phase} Moon in {sky.moonSign}, {sky.moonDegree} · Sun in{" "}
          {sky.sunSign} · {sky.placeNote}
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/chart/new">Draw a natal chart</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/consultations">Sit with Eliza</Link>
          </Button>
        </div>
      </section>

      <section className="border-y border-border/70 bg-card/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-3">
          {[
            {
              title: "A wheel you can actually read",
              body: "Hover a planet for sign, house, and aspects. No black-box screenshot — the chart is yours to keep for family as well as for yourself.",
            },
            {
              title: "An hour in the studio",
              body: "Natal sittings, follow-ups, a child’s chart handled with consent. You leave with a recording in your atelier.",
            },
            {
              title: "Letters, not horoscopes",
              body: "The journal and studio list follow the Moon, not the click. Essays on arriving, birth time, and the people you love.",
            },
          ].map((item) => (
            <article key={item.title}>
              <h2 className="font-heading text-2xl">{item.title}</h2>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {item.body}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-heading text-3xl">From the journal</h2>
          <Link href="/journal" className="text-sm text-gold-ink hover:underline">
            All letters
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {letters.map((post) => (
            <Link
              key={post.slug}
              href={`/journal/${post.slug}`}
              className="rounded-2xl border bg-card p-5 transition hover:border-gold"
            >
              <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {post.topic}
              </p>
              <h3 className="mt-2 font-heading text-xl">{post.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
