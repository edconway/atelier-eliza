import { NextResponse } from "next/server";

interface OpenMeteoResult {
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.trim() ?? "";
  if (q.length < 2) {
    return NextResponse.json({ places: [] });
  }

  const url = new URL("https://geocoding-api.open-meteo.com/v1/search");
  url.searchParams.set("name", q);
  url.searchParams.set("count", "7");
  url.searchParams.set("language", "en");
  url.searchParams.set("format", "json");

  const response = await fetch(url, { next: { revalidate: 86400 } });
  if (!response.ok) {
    return NextResponse.json(
      { error: "Place search is briefly unavailable." },
      { status: 502 },
    );
  }

  const data = (await response.json()) as { results?: OpenMeteoResult[] };
  const places = (data.results ?? []).map((place) => ({
    name: [place.name, place.admin1, place.country].filter(Boolean).join(", "),
    country: place.country,
    admin1: place.admin1,
    latitude: place.latitude,
    longitude: place.longitude,
    timezone: place.timezone,
  }));

  return NextResponse.json({ places });
}
