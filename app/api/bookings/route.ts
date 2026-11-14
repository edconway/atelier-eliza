import { NextResponse } from "next/server";
import {
  bookSlot,
  CalendarUnavailable,
  listOpenSlots,
} from "@/lib/google-calendar";
import { sittings } from "@/lib/sittings";

type BirthBody = {
  name?: string;
  year?: number;
  month?: number;
  day?: number;
  hour?: number;
  minute?: number;
  unknownTime?: boolean;
  placeName?: string;
  latitude?: number;
  longitude?: number;
};

function birthLine(label: string, birth: BirthBody | undefined) {
  const name = birth?.name?.trim() ?? "";
  const placeName = birth?.placeName?.trim() ?? "";
  const year = Number(birth?.year);
  const month = Number(birth?.month);
  const day = Number(birth?.day);
  const latitude = Number(birth?.latitude);
  const longitude = Number(birth?.longitude);
  const unknownTime = Boolean(birth?.unknownTime);
  const hour = Number(birth?.hour);
  const minute = Number(birth?.minute);
  const date = new Date(Date.UTC(year, month - 1, day));
  const realDate =
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day;
  if (
    !name ||
    !placeName ||
    !realDate ||
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90 ||
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180 ||
    (!unknownTime &&
      (!Number.isInteger(hour) ||
        hour < 0 ||
        hour > 23 ||
        !Number.isInteger(minute) ||
        minute < 0 ||
        minute > 59))
  ) {
    return null;
  }
  const pretty = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const time = unknownTime
    ? "time unknown"
    : `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  return `${label}: ${name}, born ${pretty}, ${time}, in ${placeName} (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
}

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
      birth?: BirthBody;
      otherBirth?: BirthBody;
    };
    const name = body.name?.trim() ?? "";
    const email = body.email?.trim() ?? "";
    const reading = sittings.find((sitting) => sitting.value === body.sessionType);
    const birth = birthLine("Chart", body.birth);
    const otherBirth =
      body.sessionType === "child-with-other"
        ? birthLine("Other chart", body.otherBirth)
        : null;
    if (
      !body.eventId ||
      !name ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      !reading ||
      !birth ||
      (body.sessionType === "child-with-other" && !otherBirth)
    ) {
      return NextResponse.json(
        {
          error:
            "Choose a time, and give your name, email, reading, and birth details.",
        },
        { status: 400 },
      );
    }
    const result = await bookSlot({
      eventId: body.eventId,
      name,
      email,
      reading: reading.title,
      notes: body.notes,
      births: [birth, otherBirth].filter((line): line is string => Boolean(line)),
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
