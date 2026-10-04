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
          Library
        </Link>{" "}
        · Films
      </p>
      <h1 className="mt-3 font-heading text-4xl">Recordings</h1>
      <p className="mt-3 max-w-2xl text-muted-foreground">
        Recordings of your readings are kept here.
      </p>
      {film && (
        <div className="mt-10 overflow-hidden rounded-2xl border bg-foreground">
          <video
            key={film.id}
            className="aspect-video w-full bg-foreground"
            controls
            poster=""
            src={film.videoSrc}
          >
            Your browser cannot play this film.
          </video>
          <div className="p-5 text-background">
            <p className="text-xs uppercase tracking-[0.16em] text-background/60">
              {film.date} · {film.duration}
            </p>
            <h2 className="mt-1 font-heading text-2xl">{film.title}</h2>
            <p className="mt-2 text-sm text-background/75">{film.synopsis}</p>
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
