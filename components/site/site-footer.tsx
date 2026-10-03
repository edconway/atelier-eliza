import Link from "next/link";
import { NewsletterForm } from "@/components/journal/newsletter-form";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#110814]/80 text-cream">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="font-heading text-3xl italic">Letters from the studio</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-cream/70">
            A note with the Moon — sittings, essays, and the weather of the
            season. Not a daily horoscope.
          </p>
          <div className="mt-5 max-w-md">
            <NewsletterForm />
          </div>
        </div>
        <div className="flex flex-col justify-between gap-8 text-sm text-cream/70">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/about" className="hover:text-rose">
              Eliza
            </Link>
            <Link href="/consultations" className="hover:text-rose">
              Sittings
            </Link>
            <Link href="/journal" className="hover:text-rose">
              Journal
            </Link>
            <Link href="/chart/new" className="hover:text-rose">
              Draw a chart
            </Link>
            <Link href="/members" className="hover:text-rose">
              Your atelier
            </Link>
          </div>
          <p>
            Atelier Eliza · Bath
            <br />
            A little night studio for the sky you were born under.
          </p>
        </div>
      </div>
    </footer>
  );
}
