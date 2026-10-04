import type { JournalPost } from "./types";

export const journalPosts: JournalPost[] = [
  {
    slug: "how-to-arrive",
    title: "How to arrive at a sitting",
    date: "2026-03-12",
    excerpt:
      "Bring a question you can live inside for an hour. Leave the performance at the door.",
    minutes: 4,
    topic: "Sittings",
    body: [
      "People often ask what they should prepare. The honest answer is: a night of ordinary sleep, a glass of water, and one question that still matters in the morning.",
    "A natal sitting is not a test of how well you know your chart. Eliza will have drawn it already. What she cannot bring is the weather of your week, the conversation you keep postponing, the name of the person you keep almost mentioning.",
      "If you know your birth time, bring it as it was written — hospital notes, a family bible, a parent’s memory with its uncertainties attached. If you do not know it, say so. We will not pretend a noon chart is a timed one.",
      "Wear whatever lets you stay in the chair. The studio is warm. There is tea. You may cry. You may laugh at how accurately a dead language describes your kitchen.",
      "Afterward, a recording is kept with your saved charts so you can return to a sentence that only makes sense three weeks later. That is often when the sitting actually finishes.",
    ],
  },
  {
    slug: "why-birth-time-matters",
    title: "Why the minute matters, and when it doesn’t",
    date: "2026-04-02",
    excerpt:
      "Houses and the rising sign turn on the clock. The Sun does not. Both facts can be true at once.",
    minutes: 6,
    topic: "Charts",
    body: [
      "The sky moves about one degree every four minutes. That is enough to change a rising sign, and enough to slide a planet into the next house. It is not enough to move the Sun.",
      "So if your birth time is missing, we still have a great deal: the Sun, the Moon (which needs a time to be truly precise, but will rarely jump a sign in a day), Mercury through Pluto, the aspects between them. What we do not have is the architecture — the houses — that tells us where in life those planets act.",
      "Eliza would rather read a noon chart honestly than invent a time to make the wheel look complete. In your library, an unknown time is marked on the chart so you are never reading an estimate as a fact.",
      "If a parent says “sometime after lunch,” we can talk about a range. Rectification — working backward from life events toward a likely time — is a sitting of its own, and only worth doing if you want to live with that chart.",
    ],
  },
  {
    slug: "charts-for-the-people-you-love",
    title: "Charts for the people you love",
    date: "2026-05-18",
    excerpt:
      "A child’s chart is not a verdict. A partner’s chart is not a verdict. They are maps you are invited to hold gently.",
    minutes: 5,
    topic: "Family",
    body: [
      "Members often save more than their own wheel. A partner. A parent who has died. A child who cannot yet sit for an hour.",
      "Eliza reads those charts as invitations, not diagnoses. A five-year-old with Saturn on the Midheaven is not “destined to be serious.” They are a person whose sense of time and duty will need room, later, to become their own.",
      "You are welcome to keep a family library here. When you book, you can point to the chart you wish to discuss. Bring consent where you can: a partner who knows you are bringing their sky into the room; a teenager who would rather not be interpreted in absentia.",
      "The chart is never the person. It is a way of paying attention to them.",
    ],
  },
  {
    slug: "letters-from-the-studio",
    title: "Letters from the studio",
    date: "2026-06-21",
    excerpt:
      "Once or twice a moon, Eliza writes to the list: a season, a sky, a sentence to take walking.",
    minutes: 3,
    topic: "Studio",
    body: [
      "The newsletter is not a daily horoscope. It is a letter. Sometimes it is about a lunation. Sometimes it is about why she has been thinking of the 12th house while washing cups.",
      "If you join the list, you will receive studio notes, sitting dates, and the occasional essay that began as something said in the room and needed a quieter page.",
      "You can leave whenever you like. The letters are also archived here in the journal, so you need not be on the list to read them later.",
      "This month’s sky, in brief: the Moon is doing what the Moon always does — changing, and asking whether you will change with it or simply watch.",
    ],
  },
];

export function getPost(slug: string) {
  return journalPosts.find((post) => post.slug === slug);
}
