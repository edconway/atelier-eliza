import type { BirthInput, NatalChart } from "./types";

export interface AafNative {
  name: string;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  unknownTime: boolean;
  placeName: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

function parseCoord(token: string) {
  const match = token
    .trim()
    .match(/^(\d+(?:\.\d+)?)([nsewNSEW])(\d+)?/);
  if (!match) return undefined;
  const degrees = Number(match[1]);
  const minutes = match[3] ? Number(match[3]) : 0;
  let value = degrees + minutes / 60;
  const dir = match[2].toLowerCase();
  if (dir === "s" || dir === "w") value *= -1;
  return value;
}

function formatCoord(value: number, positive: "n" | "e", negative: "s" | "w") {
  const dir = value >= 0 ? positive : negative;
  const abs = Math.abs(value);
  const degrees = Math.floor(abs);
  const minutes = Math.round((abs - degrees) * 60);
  return `${degrees}${dir}${String(minutes).padStart(2, "0")}`;
}

export function parseAaf(text: string): AafNative[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
  const natives: AafNative[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!/^#?A93:/i.test(line)) continue;
    const payload = line.replace(/^#?A93:/i, "");
    const parts = payload.split(",");
    if (parts.length < 6) continue;

    const last = parts[0]?.trim() ?? "";
    const first = parts[1]?.trim() ?? "";
    const date = parts[3]?.trim() ?? "";
    const time = parts[4]?.trim() ?? "";
    const country = parts[parts.length - 1]?.trim();
    const placeName = parts.slice(5, -1).join(",").trim() || parts[5]?.trim();
    const [day, month, year] = date.split(".").map((bit) => Number(bit));
    if (!day || !month || !year || !placeName) continue;

    const timeBits = time.split(/[:h]/i).map((bit) => Number(bit));
    const unknownTime = !time || Number.isNaN(timeBits[0]);

    const native: AafNative = {
      name: [first, last].filter(Boolean).join(" ") || last || first,
      year,
      month,
      day,
      hour: unknownTime ? 12 : timeBits[0] || 0,
      minute: unknownTime ? 0 : timeBits[1] || 0,
      unknownTime,
      placeName,
      country,
    };

    const next = lines[index + 1];
    if (next && /^#?B93:/i.test(next)) {
      const bParts = next.replace(/^#?B93:/i, "").split(",");
      native.latitude = parseCoord(bParts[1] ?? "");
      native.longitude = parseCoord(bParts[2] ?? "");
    }

    natives.push(native);
  }

  return natives;
}

export function chartsToAaf(charts: NatalChart[]) {
  const lines = ["#: Atelier Eliza AAF export"];
  for (const chart of charts) {
    const bits = chart.input.name.trim().split(/\s+/);
    const last = bits.length > 1 ? bits.at(-1) ?? "" : "";
    const first = bits.length > 1 ? bits.slice(0, -1).join(" ") : bits[0] ?? "";
    const { year, month, day, hour, minute, unknownTime, place } = chart.input;
    const time = unknownTime
      ? ""
      : `${hour}:${String(minute).padStart(2, "0")}`;
    lines.push(
      `#A93:${last},${first},,${day}.${month}.${year},${time},${place.name.replace(/,/g, " ")},${place.country ?? ""}`,
    );
    lines.push(
      `#B93:*,${formatCoord(place.latitude, "n", "s")},${formatCoord(place.longitude, "e", "w")},0,0`,
    );
  }
  return `${lines.join("\n")}\n`;
}

export function nativeToBirthInput(native: AafNative): BirthInput | null {
  if (
    native.latitude === undefined ||
    native.longitude === undefined ||
    Number.isNaN(native.latitude) ||
    Number.isNaN(native.longitude)
  ) {
    return null;
  }
  return {
    name: native.name,
    relationship: "other",
    year: native.year,
    month: native.month,
    day: native.day,
    hour: native.hour,
    minute: native.minute,
    unknownTime: native.unknownTime,
    place: {
      name: native.country
        ? `${native.placeName}, ${native.country}`
        : native.placeName,
      country: native.country,
      latitude: native.latitude,
      longitude: native.longitude,
    },
  };
}
