"use client";

import Link from "next/link";
import { useState } from "react";
import { useAtelier } from "@/lib/atelier-store";
import { Button } from "@/components/ui/button";
import type { SessionFilm } from "@/lib/types";

export default function MembersSessionsPage() {
  const { member, films, ready } = useAtelier();
  const [current, setCurrent] = useState<SessionFilm | null>(null);

  if (!ready) return null;
  if (!member) {
    return (
      <div className="mx-auto max-w-lg px-4 py-24 text-center">
        <p className="text-muted-foreground">Sign in to watch your sittings.</p>
        <Button className="mt-4" asChild>
          <Link href="/sign-in">Sign in</Link>
        </Button>
      </div>
    );
  }

  const film = current ?? films[0];

  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        <Link href="/members" className="hover:text-gold-ink">
          Atelier
        </Link>{" "}
        · Films
      </p>
      <h1 className="mt-3 font-heading text-4xl">Sittings with Eliza</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        After each hour, the recording is kept here. These studio films are
        placeholders until Eliza uploads your own.
      </p>
      {film && (
        <div className="mt-10 overflow-hidden rounded-2xl border bg-ink">
          <video
            key={film.id}
            className="aspect-video w-full bg-ink"
            controls
            poster=""
            src={film.videoSrc}
          >
            Your browser cannot play this film.
          </video>
          <div className="p-5 text-cream">
            <p className="text-xs uppercase tracking-[0.16em] text-cream/60">
              {film.date} · {film.duration}
            </p>
            <h2 className="mt-1 font-heading text-2xl">{film.title}</h2>
            <p className="mt-2 text-sm text-cream/75">{film.synopsis}</p>
          </div>
        </div>
      )}
      <ul className="mt-8 grid gap-4 md:grid-cols-3">
        {films.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setCurrent(item)}
              className="h-full w-full rounded-2xl border bg-card p-4 text-left hover:border-gold"
            >
              <p className="text-xs text-muted-foreground">{item.date}</p>
              <p className="mt-1 font-heading text-lg">{item.title}</p>
              <p className="mt-2 text-sm text-muted-foreground">{item.duration}</p>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
