import type { JournalPost } from "./types";

export const journalPosts: JournalPost[] = [
  {
    slug: "how-to-arrive",
    title: "What to bring to a sitting",
    date: "2026-03-12",
    excerpt: "Birth time if you have it, and one question for the hour.",
    minutes: 3,
    topic: "Sittings",
    body: [
      "Bring the birth time if you have it, as it was written down. If you do not know it, say so.",
      "A chart without a birth time is drawn for noon. The rising sign and houses on that chart are estimates, and they are marked as such.",
      "You do not need to have studied the chart before the session.",
      "A recording is saved with your charts afterwards.",
    ],
  },
  {
    slug: "why-birth-time-matters",
    title: "Why birth time matters",
    date: "2026-04-02",
    excerpt:
      "The rising sign and houses depend on the clock. The Sun does not.",
    minutes: 4,
    topic: "Charts",
    body: [
      "The sky moves about one degree every four minutes. That can change the rising sign, and it can move a planet into the next house. It does not move the Sun.",
      "Without a birth time you still have the Sun, the Moon in most cases, the planets, and the aspects between them. You do not have reliable houses or a rising sign.",
      "The Moon moves quickly, so a missing time can also put the Moon in the wrong degree, and occasionally the wrong sign.",
      "Unknown times are labelled on the chart. A noon chart is not shown as a timed chart.",
      "A rough memory, such as “sometime after lunch,” can be kept as a range. Working backwards from life events to estimate a birth time is a separate session.",
    ],
  },
  {
    slug: "charts-for-the-people-you-love",
    title: "Charts for other people",
    date: "2026-05-18",
    excerpt: "You can save a chart for a partner, a parent, or a child.",
    minutes: 3,
    topic: "Family",
    body: [
      "You can save more than your own chart: a partner, a parent, a child.",
      "A chart is not a prediction. Saturn on the Midheaven, for example, does not mean a child is destined to be serious.",
      "When you book, you can choose which saved chart the session is about.",
      "Ask before using someone else’s birth data. That matters especially with a teenager.",
    ],
  },
  {
    slug: "letters-from-the-studio",
    title: "Newsletter",
    date: "2026-06-21",
    excerpt: "Occasional emails. Not a daily horoscope.",
    minutes: 2,
    topic: "Newsletter",
    body: [
      "The newsletter is not a daily horoscope. It is an occasional email when there is a new post or a note about bookings.",
      "The same posts are kept here, so you can read them without joining the list.",
      "You can unsubscribe whenever you want.",
    ],
  },
];

export function getPost(slug: string) {
  return journalPosts.find((post) => post.slug === slug);
}
