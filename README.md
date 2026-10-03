# Atelier Eliza

A studio site for **Eliza**, an astrologer in Bath: draw an interactive natal chart, book a sitting, keep a family library of wheels, watch recordings of past hours, and read letters from the journal.

## What you can do

- **Draw a natal chart** in four steps (who, when, where, confirm). The wheel is interactive — hover or tap a planet for sign, house, and aspects.
- **Book a sitting** with Eliza from the header, a chart, or `/book`.
- **Members atelier** — saved charts (yourself, partner, child, …), session films, and sitting requests.
- **Journal + studio list** — essays and a newsletter signup (stored locally until a real mailer is connected).

## How charts are calculated

This is a **consultation-grade natal service**, not a toy wheel:

- Tropical zodiac, **Placidus** houses.
- Planetary positions from the **Moshier ephemeris** via [`circular-natal-horoscope-js`](https://github.com/0xStarcat/CircularNatalHoroscopeJS) (the same astronomical model used widely in JS astrology tools; typically well inside a degree for modern dates — natal work cares about degrees, not arcseconds).
- Birth **timezone and historical DST** are derived from the coordinates (`tz-lookup` + `moment-timezone`), not guessed from the city name alone.
- Place search uses [Open-Meteo geocoding](https://open-meteo.com/en/docs/geocoding-api) (no API key).
- Unknown birth times use a **noon chart** and are labelled as estimates for rising/houses.

Each drawn chart shows the timezone, local time, UTC, and coordinates so you can check the input. Professional desktop software (Solar Fire, Janus) uses Swiss Ephemeris files for slightly tighter outer-planet precision; that can be swapped in later on the server. The larger sources of error in real life remain **wrong birth time** and **wrong place**, which the wizard is designed to make obvious.

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

Until then, membership, charts, bookings, and newsletter signups persist in the browser (`localStorage`) so the atelier works without secrets.

## Stack

Next.js (App Router), TypeScript, Tailwind, shadcn/ui.
