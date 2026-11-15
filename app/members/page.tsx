"use client";

import Link from "next/link";
import { useAtelier } from "@/lib/atelier-store";
import { Button } from "@/components/ui/button";
import { BookButton } from "@/components/booking/book-button";

export default function MembersPage() {
  const { member, charts, films, bookings, ready, signOut } = useAtelier();

  if (!ready) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-24 text-muted-foreground">
        Opening the account…
      </div>
    );
  }

  if (!member) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="font-heading text-4xl">This account is private</h1>
        <p className="mt-3 text-muted-foreground">
          Sign in to see saved charts, session films, and consultation requests.
        </p>
        <Button className="mt-6" asChild>
          <Link href="/sign-in">Sign in</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-gold-ink">
            Members
          </p>
          <h1 className="mt-3 font-heading text-4xl">Hello, {member.name}</h1>
          <p className="mt-2 text-muted-foreground">
            Saved charts, recordings, and reading requests.
          </p>
        </div>
        <Button variant="ghost" onClick={signOut}>
          Sign out
        </Button>
      </div>

      <div className="mt-12 grid gap-6 md:grid-cols-3">
        <Link
          href="/members/charts"
          className="rounded-2xl border bg-card p-6 hover:border-gold"
        >
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Account
          </p>
          <p className="mt-2 font-heading text-3xl">{charts.length}</p>
          <p className="text-sm text-muted-foreground">saved charts</p>
        </Link>
        <Link
          href="/members/sessions"
          className="rounded-2xl border bg-card p-6 hover:border-gold"
        >
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Films
          </p>
          <p className="mt-2 font-heading text-3xl">{films.length}</p>
          <p className="text-sm text-muted-foreground">session recordings</p>
        </Link>
        <div className="rounded-2xl border bg-card p-6">
          <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">
            Requests
          </p>
          <p className="mt-2 font-heading text-3xl">{bookings.length}</p>
          <p className="text-sm text-muted-foreground">reading requests</p>
          <div className="mt-4">
            <BookButton label="Book a reading" />
          </div>
        </div>
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/chart/new">Draw another chart</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/members/charts">Open the account</Link>
        </Button>
      </div>
    </div>
  );
}
