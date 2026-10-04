import Link from "next/link";
import { currentSky } from "@/lib/sky";
import { Button } from "@/components/ui/button";
import { journalPosts } from "@/lib/journal";
import { MoonVeil } from "@/components/site/moon-veil";

export const dynamic = "force-dynamic";

const essay = [
  "Let’s face it — we ask a lot of ourselves as ‘conscious parents’. To nourish their childhood as best we can, to do our best, sometimes burnt out and with gritted teeth, to “break the cycle”, to heal our own childhood wounds and climb out of social conditioning in real time whilst juggling mental admin, cooking, everyone’s emotions, physical fights and… oh so much more. We so often feel we’re living in some kind of parallel version of life, a muted, imperfect version, where nothing seems to quite come together the way we feel it should. We see our children struggling in ways that we were led to believe they would not, as long as we followed the conscious parenting advice. Some of us hear siblings saying horrifically cruel things to each other, instilling the traumas we sacrificed years worth of sleep (maybe spent a fortune on therapy) to avoid. Sometimes we even hear such things coming out of our own mouths. And slowly, the list of things we think we can control shrinks. And we do trust in the Mystery. When we don’t feel it, we still say it, as a conclusion to circular discussions about whatever unsolvable situation is currently alive in our family dynamic. And we believe it, we do. But then there’s the biology of being a mother, we do just want everything to be perfect for our babies. Of course we do. So we put it all on ourselves, get more burnt out, keep trying because we care so much. But somehow it feels like we could do better.",
  "And then we take a look at our child’s horoscope. We come face to face with a unique and marvellous Soul on a hero’s journey. We see awesome gigantic heavenly bodies working out fundamental questions of existence through the Being of the small person smearing peanut butter on the kitchen floor. And then it really lands — their path is a new one; the planets will express through them in uncharted ways. And the conflict, as well as the nourishment, we are giving them, are the medium in which they will write a new universe into Consciousness.",
  "So while we can’t make everything perfect for them, we can nourish them more effectively by understanding what they, specifically, need to feel nurtured, beyond what the parenting psychology says. We can see from the birth chart how our children might be wired to perceive us as parents. It is very likely not to be how we perceive ourselves. But when we see what they have come to us for, we can work to make sure we give them the highest possible expression of that quality.",
  "By having a sense of what they are grappling with this lifetime, it’s so much easier to have allowance for their journey. Our children can feel when we honour them and they blossom. And we can give ourselves a break, and really, truly relax into the role they have given us.",
];

export default function HomePage() {
  const sky = currentSky();
  const letters = journalPosts.slice(0, 3);
  const lit = Math.round(sky.illumination * 100);

  return (
    <div>
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 pb-12 pt-12 sm:px-6 sm:pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:pb-16">
        <div>
          <h1 className="max-w-3xl font-heading text-5xl leading-[1.05] sm:text-6xl">
            Natal charts for Children
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full px-6">
              <Link href="/book">Readings you can book</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-6"
            >
              <Link href="/chart/new">Draw a natal chart</Link>
            </Button>
          </div>
        </div>
        <figure className="mx-auto w-full max-w-sm text-center">
          <MoonVeil elongation={sky.elongation} />
          <figcaption className="mt-2">
            <p className="font-heading text-3xl">{sky.phase} Moon</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {sky.waxing ? "Waxing" : "Waning"} · {lit}% illuminated
            </p>
            <p className="mt-3 text-sm">
              Moon {sky.moonDegree} {sky.moonSign}
            </p>
            <p className="text-sm text-muted-foreground">
              Sun {sky.sunDegree} {sky.sunSign}
            </p>
            <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
              The Moon right now, tropical zodiac. It moves about half a degree
              an hour, and changes sign every two or three days.
            </p>
          </figcaption>
        </figure>
      </section>

      <section className="border-y bg-card/70">
        <div className="mx-auto max-w-3xl space-y-6 px-4 py-16 text-base leading-[1.75] text-foreground/85 sm:px-6 sm:text-lg">
          {essay.map((paragraph) => (
            <p key={paragraph.slice(0, 48)}>{paragraph}</p>
          ))}
          <div className="pt-2">
            <Button asChild className="rounded-full px-6">
              <Link href="/book">Book a reading</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="font-heading text-4xl">Journal</h2>
          <Link href="/journal" className="text-sm text-rose hover:underline">
            All posts
          </Link>
        </div>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {letters.map((post) => (
            <Link
              key={post.slug}
              href={`/journal/${post.slug}`}
              className="rounded-3xl border bg-card p-6 transition hover:border-rose/50"
            >
              <p className="text-[0.7rem] uppercase tracking-[0.22em] text-lilac">
                {post.topic}
              </p>
              <h3 className="mt-3 font-heading text-2xl">{post.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
