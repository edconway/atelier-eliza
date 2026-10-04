import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "Eliza",
};

export default function AboutPage() {
  return (
    <article className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="font-heading text-5xl tracking-tight">Eliza</h1>
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
