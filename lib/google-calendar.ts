import { createSign } from "crypto";

const TOKEN_URL = "https://oauth2.googleapis.com/token";
const CALENDAR_SCOPE = "https://www.googleapis.com/auth/calendar";

export class CalendarUnavailable extends Error {
  constructor(message = "Slots are unavailable.") {
    super(message);
    this.name = "CalendarUnavailable";
  }
}

type ServiceAccount = {
  client_email: string;
  private_key: string;
};

type CalendarEvent = {
  id: string;
  etag?: string;
  summary?: string;
  description?: string;
  start?: { dateTime?: string; date?: string; timeZone?: string };
  end?: { dateTime?: string; date?: string; timeZone?: string };
  attendees?: { email?: string; responseStatus?: string }[];
  extendedProperties?: { private?: Record<string, string> };
};

export type OpenSlot = {
  id: string;
  start: string;
  end: string;
};

let cachedToken: { value: string; expiresAt: number } | null = null;

function account(): ServiceAccount {
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const calendarId = process.env.GOOGLE_CALENDAR_ID;
  if (!raw || !calendarId) {
    throw new CalendarUnavailable();
  }
  let parsed: ServiceAccount;
  try {
    parsed = JSON.parse(raw) as ServiceAccount;
  } catch {
    throw new CalendarUnavailable("The calendar credentials could not be read.");
  }
  if (!parsed.client_email || !parsed.private_key) {
    throw new CalendarUnavailable("The calendar credentials are incomplete.");
  }
  return {
    client_email: parsed.client_email,
    private_key: parsed.private_key.replace(/\\n/g, "\n"),
  };
}

function calendarId() {
  const id = process.env.GOOGLE_CALENDAR_ID;
  if (!id) throw new CalendarUnavailable();
  return id;
}

function signJwt(email: string, privateKey: string) {
  const now = Math.floor(Date.now() / 1000);
  const header = Buffer.from(
    JSON.stringify({ alg: "RS256", typ: "JWT" }),
  ).toString("base64url");
  const payload = Buffer.from(
    JSON.stringify({
      iss: email,
      scope: CALENDAR_SCOPE,
      aud: TOKEN_URL,
      iat: now,
      exp: now + 3600,
    }),
  ).toString("base64url");
  const unsigned = `${header}.${payload}`;
  const signer = createSign("RSA-SHA256");
  signer.update(unsigned);
  return `${unsigned}.${signer.sign(privateKey).toString("base64url")}`;
}

async function accessToken() {
  if (cachedToken && cachedToken.expiresAt > Date.now() + 60_000) {
    return cachedToken.value;
  }
  const credentials = account();
  const assertion = signJwt(credentials.client_email, credentials.private_key);
  const response = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion,
    }),
  });
  if (!response.ok) {
    throw new CalendarUnavailable("The calendar could not be reached.");
  }
  const body = (await response.json()) as {
    access_token?: string;
    expires_in?: number;
  };
  if (!body.access_token) {
    throw new CalendarUnavailable("The calendar could not be reached.");
  }
  cachedToken = {
    value: body.access_token,
    expiresAt: Date.now() + (body.expires_in ?? 3600) * 1000,
  };
  return body.access_token;
}

function isOpen(event: CalendarEvent) {
  if (event.extendedProperties?.private?.atelierBooked === "true") return false;
  const summary = (event.summary ?? "").trim().toLowerCase();
  const attendees = (event.attendees ?? []).filter(
    (attendee) => attendee.responseStatus !== "declined" && attendee.email,
  );
  return summary === "open" || attendees.length === 0;
}

async function calendarFetch(path: string, init?: RequestInit) {
  const token = await accessToken();
  const response = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId())}${path}`,
    {
      ...init,
      headers: {
        Authorization: `Bearer ${token}`,
        ...(init?.headers ?? {}),
      },
    },
  );
  return response;
}

const STEP_MS = 90 * 60 * 1000;

async function listUpcomingEvents() {
  const params = new URLSearchParams({
    singleEvents: "true",
    orderBy: "startTime",
    timeMin: new Date().toISOString(),
    maxResults: "250",
  });
  const response = await calendarFetch(`/events?${params}`);
  if (!response.ok) {
    throw new CalendarUnavailable("The calendar could not be reached.");
  }
  const body = (await response.json()) as { items?: CalendarEvent[] };
  return body.items ?? [];
}

function span(event: CalendarEvent) {
  const start = event.start?.dateTime;
  const end = event.end?.dateTime;
  if (!start || !end) return null;
  const startMs = new Date(start).getTime();
  const endMs = new Date(end).getTime();
  if (!Number.isFinite(startMs) || !Number.isFinite(endMs) || endMs <= startMs) {
    return null;
  }
  return { startMs, endMs };
}

function overlaps(startMs: number, endMs: number, other: { startMs: number; endMs: number }) {
  return startMs < other.endMs && other.startMs < endMs;
}

export async function listAppointmentSlots(minutes: number): Promise<OpenSlot[]> {
  const duration = Math.min(Math.max(minutes, 15), 240) * 60 * 1000;
  const events = await listUpcomingEvents();
  const windows = events.filter(isOpen).flatMap((event) => {
    const range = span(event);
    return range && event.id ? [{ id: event.id, ...range }] : [];
  });
  const busy = events.filter((event) => !isOpen(event)).flatMap((event) => {
    const range = span(event);
    return range ? [range] : [];
  });
  const slots: OpenSlot[] = [];
  for (const window of windows) {
    for (let startMs = window.startMs; startMs + duration <= window.endMs; startMs += STEP_MS) {
      const endMs = startMs + duration;
      if (busy.some((item) => overlaps(startMs, endMs, item))) continue;
      const start = new Date(startMs).toISOString();
      slots.push({
        id: `${window.id}|${start}`,
        start,
        end: new Date(endMs).toISOString(),
      });
    }
  }
  return slots;
}

export async function bookSlot(input: {
  eventId: string;
  start: string;
  minutes: number;
  name: string;
  email: string;
  reading: string;
  notes?: string;
  births?: string[];
}) {
  const startMs = new Date(input.start).getTime();
  const endMs = startMs + input.minutes * 60 * 1000;
  if (!Number.isFinite(startMs) || endMs <= Date.now()) {
    throw new CalendarUnavailable("That time has just been taken.");
  }
  const events = await listUpcomingEvents();
  const window = events.find((event) => event.id === input.eventId);
  const windowSpan = window ? span(window) : null;
  if (!window || !isOpen(window) || !windowSpan) {
    throw new CalendarUnavailable("That time has just been taken.");
  }
  if (startMs < windowSpan.startMs || endMs > windowSpan.endMs) {
    throw new CalendarUnavailable("That time has just been taken.");
  }
  const busy = events.filter((event) => !isOpen(event)).flatMap((event) => {
    const range = span(event);
    return range ? [range] : [];
  });
  if (busy.some((item) => overlaps(startMs, endMs, item))) {
    throw new CalendarUnavailable("That time has just been taken.");
  }

  const description = [
    `Email: ${input.email}`,
    `Reading: ${input.reading}`,
    ...(input.births ?? []),
    input.notes?.trim() ? `Notes: ${input.notes.trim()}` : "",
    "This is a request. Leave the event to accept it, or delete it to decline.",
  ]
    .filter(Boolean)
    .join("\n");

  const created = await calendarFetch("/events", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      summary: `Request: ${input.reading} — ${input.name}`,
      description,
      status: "tentative",
      start: { dateTime: new Date(startMs).toISOString() },
      end: { dateTime: new Date(endMs).toISOString() },
      extendedProperties: { private: { atelierBooked: "true" } },
    }),
  });
  if (!created.ok) {
    throw new CalendarUnavailable("The calendar could not be updated.");
  }
  return { emailed: false };
}
