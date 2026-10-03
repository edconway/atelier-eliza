import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string };
  const email = body.email?.trim().toLowerCase() ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json(
      { error: "That does not look like an email address." },
      { status: 400 },
    );
  }
  return NextResponse.json({
    ok: true,
    message: "You are on the studio list. Letters go out with the Moon.",
  });
}
