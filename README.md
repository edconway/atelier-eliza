# Eliza

A site for Eliza: natal charts for children, bookings, a library of saved charts, session recordings, and a short journal.

## What you can do

- **Draw a natal chart** in four steps (who, when, where, confirm). The wheel is interactive — hover or tap a planet for sign, house, and aspects.
- **Book** an open time from the header, a chart, or `/book`. Eliza keeps those openings on a Google Calendar she edits.
- **Members library** — saved charts (yourself, partner, child, …), session films, and sitting requests.
- **Journal + studio list** — essays and a newsletter signup (stored locally until a real mailer is connected).
- **AAF interchange** — paste Astro.com exports; download the library for other software.

## How charts are calculated

This is a **consultation-grade natal service**, not a toy wheel:

- Tropical zodiac, **Placidus** houses.
- Planetary positions from the **Moshier ephemeris** via [`circular-natal-horoscope-js`](https://github.com/0xStarcat/CircularNatalHoroscopeJS) (the same astronomical model used widely in JS astrology tools; typically well inside a degree for modern dates — natal work cares about degrees, not arcseconds).
- Birth **timezone and historical DST** are derived from the coordinates (`tz-lookup` + `moment-timezone`), not guessed from the city name alone.
- Place search uses [Open-Meteo geocoding](https://open-meteo.com/en/docs/geocoding-api) (no API key).
- Unknown birth times use a **noon chart** and are labelled as estimates for rising/houses.

Each drawn chart shows the timezone, local time, UTC, and coordinates so you can check the input. Professional desktop software (Solar Fire, Janus, **astro.com**) uses **Swiss Ephemeris**. That library can be licensed from Astrodienst (AGPL, or a paid professional license for a closed-source studio site) if Eliza wants their exact engine. The larger sources of error in real life remain **wrong birth time** and **wrong place**.

## This is not astro.com — and there is no API to plug into it

[Astrodienst](https://www.astro.com) is a decades-deep research desk: natal, transits, progressions, solar/lunar returns, synastry, composites, dozens of house systems, asteroids, PDFs, AstroClick. Rebuilding that inside a consultation studio would be a second product, not a prettier natal wheel.

They also **do not offer a public REST API** for two-way chart sync. What they publish is:

1. The **Swiss Ephemeris** C library (calculation engine), not a hosted chart API.
2. Manual **AAF** export from *My Astro* (the `aaf` button appears only if a member has more than ten saved charts).

The site therefore:

- Draws consultation natal wheels here (interactive, family library, sittings).
- **Imports and exports AAF** in the members library so people can carry birth data to and from astro.com and other software.
- Links out to astro.com for research they already love.

Do not scrape their chart CGI. AAF + honest linking is the durable bridge.

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:4327](http://localhost:4327).

## Host it later

1. Push this repo and import it on **Vercel** (Next.js is native there).
2. Add **Clerk** (or similar) when you want true cross-device accounts.
3. Store charts and bookings in **Neon Postgres**.
4. Put real session films on **Vercel Blob** or Mux.
5. Connect **Cal.com** + **Stripe** when Eliza’s calendar should take payment.
6. Send the studio letters with **Resend**.

Until then, membership, charts, and newsletter signups persist in the browser (`localStorage`). Bookings do not: they write to Eliza’s Google Calendar, and the Book page says slots are unavailable until these environment variables are set.

- `GOOGLE_CALENDAR_ID` — the calendar Eliza edits.
- `GOOGLE_SERVICE_ACCOUNT_JSON` — the service-account key JSON. Share that calendar with the service account’s `client_email` so it can change events.

Eliza creates one event per opening. A summary of `Open` (any case), or an event with no attendees, is a bookable slot. A booking renames the event to the reading and the visitor’s name, and adds their email.

## Stack

Next.js (App Router), TypeScript, Tailwind, shadcn/ui.
