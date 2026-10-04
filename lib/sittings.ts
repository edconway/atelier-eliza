import type { SessionType } from "@/lib/types";

export const sittings: {
  value: SessionType;
  title: string;
  time: string;
  price: string;
  body: string;
}[] = [
  {
    value: "child",
    title: "One child, one hour",
    time: "60 minutes",
    price: "£120",
    body: "The child’s chart is the whole of the hour. What they are grappling with this lifetime, how they might be wired to perceive you, and how to nourish them beyond the parenting advice.",
  },
  {
    value: "child-with-other",
    title: "One child, with one other person",
    time: "75 minutes",
    price: "£150",
    body: "One child as the primary focus, with one other person — child or adult — brought in to see how their planets interact with that child. A little more expensive, and often the sitting that unlocks a family dynamic.",
  },
  {
    value: "adult",
    title: "Your own hero’s journey",
    time: "75 minutes",
    price: "£140",
    body: "Would you like to explore your own hero’s journey first? One adult, seventy-five minutes. Then a reduced rate for the child’s sitting that follows.",
  },
];

export const sessionLabels: Record<SessionType, string> = {
  child: "One child, one hour",
  "child-with-other": "One child, with one other person",
  adult: "Your own hero’s journey",
  natal: "Natal sitting",
  "follow-up": "Follow-up",
  family: "Family / child’s chart",
  "year-ahead": "Year ahead",
};
