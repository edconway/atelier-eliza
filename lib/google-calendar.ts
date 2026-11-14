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

function slotFrom(event: CalendarEvent): OpenSlot | null {
  const start = event.start?.dateTime;
  const end = event.end?.dateTime;
  if (!event.id || !start || !end) return null;
  if (new Date(start).getTime() <= Date.now()) return null;
  return { id: event.id, start, end };
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

export async function listOpenSlots(): Promise<OpenSlot[]> {
  const params = new URLSearchParams({
    singleEvents: "true",
    orderBy: "startTime",
    timeMin: new Date().toISOString(),
    maxResults: "50",
  });
  const response = await calendarFetch(`/events?${params}`);
  if (!response.ok) {
    throw new CalendarUnavailable("The calendar could not be reached.");
  }
  const body = (await response.json()) as { items?: CalendarEvent[] };
  return (body.items ?? [])
    .filter(isOpen)
    .map(slotFrom)
    .filter((slot): slot is OpenSlot => slot !== null);
}

export async function bookSlot(input: {
  eventId: string;
  name: string;
  email: string;
  reading: string;
  notes?: string;
  births?: string[];
}) {
  const current = await calendarFetch(
    `/events/${encodeURIComponent(input.eventId)}`,
  );
  if (current.status === 404) {
    throw new CalendarUnavailable("That time has just been taken.");
  }
  if (!current.ok) {
    throw new CalendarUnavailable("The calendar could not be reached.");
  }
  const event = (await current.json()) as CalendarEvent;
  if (!isOpen(event)) {
    throw new CalendarUnavailable("That time has just been taken.");
  }

  const description = [
    `Email: ${input.email}`,
    `Reading: ${input.reading}`,
    ...(input.births ?? []),
    input.notes?.trim() ? `Notes: ${input.notes.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const updated = await calendarFetch(
    `/events/${encodeURIComponent(input.eventId)}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(event.etag ? { "If-Match": event.etag } : {}),
      },
      body: JSON.stringify({
        summary: `${input.reading} — ${input.name}`,
        description,
        extendedProperties: {
          private: { atelierBooked: "true" },
        },
      }),
    },
  );
  if (updated.status === 412) {
    throw new CalendarUnavailable("That time has just been taken.");
  }
  if (!updated.ok) {
    throw new CalendarUnavailable("The calendar could not be updated.");
  }
  return { emailed: false };
}
