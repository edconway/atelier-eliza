import { NextResponse } from "next/server";
import {
  bookSlot,
  CalendarUnavailable,
  listOpenSlots,
} from "@/lib/google-calendar";
import { sittings } from "@/lib/sittings";

export async function GET() {
  try {
    const slots = await listOpenSlots();
    return NextResponse.json({ slots });
  } catch (error) {
    const message =
      error instanceof CalendarUnavailable
        ? error.message
        : "Slots are unavailable.";
    return NextResponse.json({ slots: [], unavailable: true, message }, { status: 503 });
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as {
      eventId?: string;
      name?: string;
      email?: string;
      sessionType?: string;
      notes?: string;
    };
    const name = body.name?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const reading = sittings.find((sitting) => sitting.value === body.sessionType);
    if (!body.eventId || !name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !reading) {
      return NextResponse.json(
        { error: "Choose a time, and give your name, email, and reading." },
        { status: 400 },
      );
    }
    const result = await bookSlot({
      eventId: body.eventId,
      name,
      email,
      reading: reading.title,
      notes: body.notes,
    });
    return NextResponse.json({
      ok: true,
      emailed: result.emailed,
      reading: reading.title,
    });
  } catch (error) {
    const message =
      error instanceof CalendarUnavailable
        ? error.message
        : "That time could not be booked.";
    const status = message.includes("taken") ? 409 : 503;
    return NextResponse.json({ error: message }, { status });
  }
}
