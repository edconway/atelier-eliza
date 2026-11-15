import Link from "next/link";
import { NewsletterForm } from "@/components/journal/newsletter-form";

export function SiteFooter() {
  return (
    <footer className="mt-auto border-t bg-card">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="font-heading text-3xl">Newsletter</p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Occasional emails about readings and new posts. Not a daily
            horoscope.
          </p>
          <div className="mt-5 max-w-md">
            <NewsletterForm />
          </div>
        </div>
        <div className="flex flex-col justify-between gap-8 text-sm text-muted-foreground">
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/about" className="hover:text-rose">
              Eliza
            </Link>
            <Link href="/book" className="hover:text-rose">
              Book
            </Link>
            <Link href="/chart/new" className="hover:text-rose">
              Draw a chart
            </Link>
            <Link href="/members" className="hover:text-rose">
              Account
            </Link>
          </div>
          <p>astrology</p>
        </div>
      </div>
    </footer>
  );
}
