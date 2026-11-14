import Link from "next/link";
import { currentSky, moonViewSky } from "@/lib/sky";
import { Button } from "@/components/ui/button";
import { MoonVeil } from "@/components/site/moon-veil";

export const dynamic = "force-dynamic";

const BAND_STARS = [
  [7, 16],
  [14, 48],
  [22, 78],
  [31, 24],
  [38, 62],
  [47, 12],
  [54, 84],
  [63, 34],
  [71, 58],
  [79, 18],
  [86, 74],
  [93, 40],
  [18, 90],
  [58, 8],
];

const quotes = [
  [
    "I have worked with Eliza for both my sons & what she has shared has been so deeply insightful & transformational in how I best support them as our relationships evolve & spiral through our family web. I highly recommend her to any parents who are curious how to thrive within our imprints, interactions & all their many energetic threads & possibilities; & have personally experienced really significant shifts in my capacity to hold & respond to certain situations & dynamics. We’re so grateful, thank you Eliza.",
  ],
  [
    "A week before my astrology reading with Eliza, I I told myself I felt the call to specifically have a tropical astrogeology reading and low and behold without any effort Eliza came through as though the energies heard and connected us seamlessly.",
    "Eliza's knowledge blew my mind and heart wide open.",
    "Her tactfulness, her grace and empathy in delivering the information felt like a warm hug.",
    "The accuracy of what she explained was relatable and perfectly spot on.",
    "I cried. I laughed. I felt the joy. I felt relief.",
    "I slept the best have in a very long time post session, I believe that's purely from the wholeness that Eliza delivered through her knowledge, wisdom and ability to connect things so precisely.",
    "What Eliza creates in a session is one of a kind. She connected my chart with my son's and spoke of how I can support him, where we may have struggles, how we can overcome those, where and how we can support one another - it was spectacular and left me feeling like I am not alone, that I am held and that it is all for us. Eliza felt like the hand rail I had been searching for in the dark, well the lights are on now and I can see and I have the tools to get through anything.",
    "I think I speak, not only, for myself but the majority of mothers when I say that we feel like a failure at times and what I came to realise through Eliza's work is that I am in dance with my son, sometimes we will trip up, step on each others feet, and those aren't failures they are lessons to be learnt , bringing us closer despite the discomfort.",
    "Astrology is the map and Eliza is the guide on the best routes to take. We individually decide the steps we take.",
    "Thank you Eliza from the very bottom of my soul 🙏🏽",
  ],
  [
    "The insights I gained from Eliza’s session gave me a perspective into my daughter’s world I hadn’t yet considered, and consequently had an immediate positive effect on my ability to parent with compassionate understanding.",
    "It was invaluable and I highly recommend her!",
  ],
];

const readings = [
  {
    title: "Natal chart readings for parents",
    paragraphs: [
      "Why look at your child’s chart?",
      "Because being a parent is hard. Often under rested and overwhelmed, we ask ourselves to nurture and nourish our children on all levels, day and night, for years. Breaking family wound patterns in real time, unhooking from social conditioning, and handling all the grown up stuff at the same time.  The pressure to be perfect is constant.  Seeing our children struggling in ways that the logic of trauma-informed parenting promised they would not. Trying to absorb all the pain and blame ourselves so they can be free, and then watching them traumatise each other anyway. And then losing our shit and making it worse. The list of what I think I can control is shrinking all the time.",
      "But when we take a look at our child’s horoscope, we get some space. We realise not all of our child’s struggles are necessarily a reflection of our own failures. We understand that our urge to protect our children and perfect the world for them is as pointless as trying to rearrange the stars.",
      "The child is a sovereign soul on their own unique and novel hero’s journey, using the dynamics of their childhood to write a new universe into Consiousness.",
      "In a reading, we learn what truly makes our child feel loved. How her mind works, and how to support it. Where the inner conflict might be, and how to hold her through it.  How she is wired to perceive her parents, and how to hold the higher octave of this quality.  The day to day of parenting becomes lighter when we can focus our efforts on what really matters, instead of striving for all-round perfection.",
      "Even if nothing surprises you, there is a softening that comes with having it confirmed, objectively, in a reading. It’s easier to have allowance for their journey when we see the depth of what they are grappling with. And our children really blossom when they feel we honour them truly in their uniqueness.",
    ],
  },
  {
    title: "Synastry reading",
    paragraphs: [
      "All of the above, but with the added benefit of precise insights on how the child’s chart interacts with somebody else’s (eg parent or sibling). We understand, cognitively and experientially,  that our children are here to teach us.  As Ram Das said, “we are all just walking each other home”.  Nowhere is it clearer to see than in the synastry chart of two people whose lives are deeply interwoven. It’s particularly magical seeing how deliberate and magical this relationship is between a child and their parent or sibling.  Seeing the dynamics of the relationship mapped out on the chart opens the heart irreversibly and gives strength and devotion for the journey, demanding as it can be.",
    ],
  },
  {
    title: "For you",
    paragraphs: [
      "Would you like to explore your own hero’s journey? It’s always helpful to be reminded of the plan. Let’s explore the unique and magical energies that you bring to the world. Acknowledge your gifts and challenges.  The planets live and breathe uniquely through you; in your own unique tones. You are truly a cosmic work of art!  We will tune into the powerful energies woven through your life, and pay attention to whatever cycles are currently or imminently active.",
    ],
  },
];

export default function HomePage() {
  const sky = currentSky();
  const view = moonViewSky(sky.elongation);
  const lit = Math.round(sky.illumination * 100);

  return (
    <div>
      <section
        className={`relative overflow-hidden ${view.lightText ? "text-[#f4f1ea]" : ""}`}
        style={{
          background: `linear-gradient(180deg, ${view.top} 0%, ${view.bottom} 100%)`,
        }}
      >
        <div className="pointer-events-none absolute inset-0" aria-hidden>
          {BAND_STARS.map(([left, top], index) => (
            <span
              key={`${left}-${top}`}
              className="absolute size-[3px] rounded-full bg-white"
              style={{
                left: `${left}%`,
                top: `${top}%`,
                opacity: view.night * (index % 3 === 0 ? 0.9 : 0.4),
              }}
            />
          ))}
        </div>
        <div className="relative mx-auto grid max-w-6xl items-center gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <h1 className="max-w-3xl font-heading text-5xl leading-[1.05] sm:text-6xl">
              Natal charts for Children
            </h1>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-6">
                <Link href="/book">Book</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full bg-background px-6 text-foreground hover:bg-background hover:text-foreground"
              >
                <Link href="/chart/new">Draw a natal chart</Link>
              </Button>
            </div>
          </div>
          <figure className="mx-auto w-full max-w-[9rem] text-center sm:max-w-[11rem]">
            <MoonVeil elongation={sky.elongation} />
            <figcaption className="mt-2">
              <p className="font-heading text-3xl">{sky.phase} Moon</p>
              <p
                className={`mt-1 text-sm ${view.lightText ? "text-[#f4f1ea]/75" : "text-muted-foreground"}`}
              >
                {sky.waxing ? "Waxing" : "Waning"} · {lit}% illuminated
              </p>
              <p className="mt-3 text-sm">
                Moon {sky.moonDegree} {sky.moonSign}
              </p>
              <p
                className={`text-sm ${view.lightText ? "text-[#f4f1ea]/75" : "text-muted-foreground"}`}
              >
                Sun {sky.sunDegree} {sky.sunSign}
              </p>
              <p
                className={`mt-3 text-xs leading-relaxed ${view.lightText ? "text-[#f4f1ea]/75" : "text-muted-foreground"}`}
              >
                {view.when}. Tropical zodiac, for this moment.
              </p>
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="border-y bg-card/70">
        <div className="mx-auto max-w-3xl space-y-12 px-4 py-16 sm:px-6">
          {readings.map((reading) => (
            <div key={reading.title} className="space-y-6">
              <h2 className="font-heading text-4xl">{reading.title}</h2>
              <div className="space-y-6 text-base leading-[1.75] text-foreground/85 sm:text-lg">
                {reading.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
              <div>
                <Button asChild className="rounded-full px-6">
                  <Link href="/book">Book</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <h2 className="font-heading text-4xl">From parents</h2>
        <div className="mt-8 grid gap-6">
          {quotes.map((paragraphs) => (
            <figure
              key={paragraphs[0]}
              className="rounded-3xl border bg-card p-6"
            >
              <blockquote className="space-y-4 text-base leading-[1.75] text-foreground/85">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </blockquote>
            </figure>
          ))}
        </div>
      </section>

    </div>
  );
}
