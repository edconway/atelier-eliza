"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PaymentNote } from "@/components/site/payment-note";

export function ReadingBlocks({
  readings,
}: {
  readings: { title: string; paragraphs: string[] }[];
}) {
  const [open, setOpen] = useState<string | null>(null);

  return (
    <div className="mx-auto max-w-3xl space-y-12 px-4 py-16 sm:px-6">
      {readings.map((reading) => {
        const shown = open === reading.title;
        return (
          <div key={reading.title} className="space-y-6">
            <h2 className="font-heading text-4xl">{reading.title}</h2>
            {shown ? (
              <div className="space-y-6 text-base leading-[1.75] text-foreground/85 sm:text-lg">
                {reading.paragraphs.map((paragraph) => (
                  <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                ))}
              </div>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <Button asChild className="rounded-full px-6">
                <Link href="/book">Book</Link>
              </Button>
              <Button
                type="button"
                variant="outline"
                className="rounded-full px-6"
                onClick={() => setOpen(shown ? null : reading.title)}
              >
                {shown ? "Hide" : "Read more"}
              </Button>
              <PaymentNote />
            </div>
          </div>
        );
      })}
    </div>
  );
}
