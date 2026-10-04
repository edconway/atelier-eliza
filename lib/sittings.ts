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
    body: "One child’s chart. One hour.",
  },
  {
    value: "child-with-other",
    title: "One child, with one other person",
    time: "75 minutes",
    price: "£150",
    body: "One child as the main focus, with one other person — child or adult — included to see how their planets interact with that child. A bit more expensive.",
  },
  {
    value: "adult",
    title: "Your own hero’s journey",
    time: "75 minutes",
    price: "£140",
    body: "One adult, 75 minutes. Then a reduced rate for the child.",
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
