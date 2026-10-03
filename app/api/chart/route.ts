import { NextResponse } from "next/server";
import { calculateNatalChart } from "@/lib/astrology";
import type { BirthInput } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as BirthInput;
    if (!input?.name || !input.place?.latitude || !input.year) {
      return NextResponse.json(
        { error: "Please give a name, a date, and a birthplace." },
        { status: 400 },
      );
    }
    if (
      input.place.latitude < -90 ||
      input.place.latitude > 90 ||
      input.place.longitude < -180 ||
      input.place.longitude > 180
    ) {
      return NextResponse.json(
        { error: "Those coordinates are outside the Earth we know." },
        { status: 400 },
      );
    }
    const chart = calculateNatalChart(input);
    return NextResponse.json({ chart });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "The chart could not be drawn.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
