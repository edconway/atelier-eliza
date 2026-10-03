import { NextResponse } from "next/server";
import { createAstroComChartUrl } from "@/lib/astro-com";
import type { BirthInput } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const input = (await request.json()) as BirthInput;
    if (!input?.name || !input.place?.name || !input.year) {
      return NextResponse.json(
        { error: "This chart is missing birth data." },
        { status: 400 },
      );
    }
    const url = await createAstroComChartUrl(input);
    return NextResponse.json({ url });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Astro.com could not open this chart.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
