import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Eliza",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-heading text-5xl tracking-tight">About me</h1>
      <p className="mt-8 text-base leading-[1.75] text-foreground/85 sm:text-lg">
        I arrived here after a long journey with astrology, feeling the pull of the stars for years, feeling the mood change with the moon, feeling the transits, but never really able to reconcile myself with my natal chart. I studied and had readings for years, fascinated, but always a little disappointed. Never feeling like the interpretations reached me.  When my four children were born, it was kind the same.  My prayer is that it won’t be like this for you. Because while I was clearly in denial, I do feel that personality descriptions and assumptions based on astrology are so limiting. What lights me up is tuning into deeper undercurrents, desires, and orientations.  Where can we be nourished, what do we really love, and why is this all so much bigger than us?  Our consultation will be collaborative - I will point things out and the interpretations will emerge from you, and afterwards, the door will always be open for your stars to continue whispering to you..
      </p>
      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild className="rounded-full">
          <Link href="/book">Readings you can book</Link>
        </Button>
        <Button asChild variant="outline" className="rounded-full">
          <Link href="/chart/new">Draw a natal chart</Link>
        </Button>
      </div>
    </article>
  );
}
