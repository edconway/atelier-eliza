import { ASTRO_COM_REGIONS } from "@/lib/astro-com-regions";
import type { BirthInput, NatalChart, Place } from "@/lib/types";

export const ASTRO_COM_ADE_URL = "https://www.astro.com/cgi/ade.cgi";

function normalizeRegion(value: string) {
  return value
    .toLowerCase()
    .replace(/[()]/g, " ")
    .replace(/,/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function lookupRegion(value?: string) {
  if (!value) return undefined;
  const exact = ASTRO_COM_REGIONS[normalizeRegion(value)];
  if (exact) return exact;
  const withoutQualifier = ASTRO_COM_REGIONS[normalizeRegion(value.split("/")[0] ?? "")];
  return withoutQualifier;
}

export function astroComRegionCode(place: Place) {
  const country = lookupRegion(place.country);
  const admin = lookupRegion(place.admin1);
  const usesSubregion =
    country === "USA" ||
    country === "CAN" ||
    country === "GB" ||
    country === "UK" ||
    country === "ENG";
  if (usesSubregion && admin) return admin;
  return country ?? admin ?? "";
}

export function astroComTown(place: Place) {
  const town = place.name.split(",")[0]?.trim();
  return town || place.name;
}

function splitName(name: string) {
  const bits = name.trim().split(/\s+/).filter(Boolean);
  if (bits.length <= 1) {
    return { first: bits[0] ?? "Natal", last: "" };
  }
  return {
    first: bits.slice(0, -1).join(" "),
    last: bits.at(-1) ?? "",
  };
}

/** Hidden fields for a POST to astro.com birth-data entry, which then draws the natal chart. */
export function astroComFormFields(input: BirthInput | NatalChart["input"]) {
  const { first, last } = splitName(input.name);
  const unknown = input.unknownTime;
  return {
    lang: "e",
    sfnm: first,
    snam: last,
    ssx: "e",
    sown: input.relationship === "self" ? "y" : "n",
    sday: String(input.day),
    imon: String(input.month),
    syar: String(input.year),
    ihou: unknown ? "u" : String(input.hour),
    smin: unknown ? "" : String(input.minute),
    sctr: astroComRegionCode(input.place),
    scit: astroComTown(input.place),
    szon: "au",
    extset: "close",
    btyp: "w2gw",
    sprev: "",
    subcon: "continue",
  } satisfies Record<string, string>;
}

function decodeEntities(value: string) {
  return value
    .replace(/&#(\d+);/g, (_, code: string) =>
      String.fromCharCode(Number(code)),
    )
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"');
}

function parseAstroCoord(token: string) {
  const match = token.trim().match(/^(\d+)([nsewNSEW])(\d+)$/);
  if (!match) return null;
  const degrees = Number(match[1]);
  const minutes = Number(match[3]);
  let value = degrees + minutes / 60;
  const dir = match[2].toLowerCase();
  if (dir === "s" || dir === "w") value *= -1;
  return value;
}

function pickAtlasPlace(html: string, place: Place) {
  const values = [...html.matchAll(/<option[^>]*value="([^"]+)"[^>]*>/gi)].map(
    (match) => decodeEntities(match[1]),
  );
  const candidates = values.filter(
    (value) => value.includes(",") && /\d+[ns]/i.test(value),
  );
  if (candidates.length === 0) return null;

  let best = candidates[0];
  let bestDist = Number.POSITIVE_INFINITY;
  for (const value of candidates) {
    const parts = value.split(",");
    const latTok = parts.find((part) => /[ns]/i.test(part) && parseAstroCoord(part) != null);
    const lonTok = parts.find((part) => /[ew]/i.test(part) && parseAstroCoord(part) != null);
    const lat = latTok ? parseAstroCoord(latTok) : null;
    const lon = lonTok ? parseAstroCoord(lonTok) : null;
    if (lat == null || lon == null) continue;
    const dist =
      (lat - place.latitude) ** 2 + (lon - place.longitude) ** 2;
    if (dist < bestDist) {
      bestDist = dist;
      best = value;
    }
  }
  return best;
}

function hiddenValue(html: string, name: string) {
  const match = html.match(
    new RegExp(`<input[^>]*name="${name}"[^>]*value="([^"]*)"`, "i"),
  );
  return match ? decodeEntities(match[1]) : "";
}

function cookieCid(response: Response) {
  const cookies =
    typeof response.headers.getSetCookie === "function"
      ? response.headers.getSetCookie()
      : [response.headers.get("set-cookie") ?? ""];
  for (const cookie of cookies) {
    const match = cookie.match(/(?:^|,\s*)cid=([^;]+)/);
    if (match) return match[1];
  }
  return "";
}

function queryValue(source: string, key: string) {
  const match = source.match(new RegExp(`[?;&]${key}=([^;&]+)`));
  return match?.[1] ? decodeURIComponent(match[1]) : "";
}

async function postAde(
  fields: Record<string, string>,
  cookie = "",
) {
  const response = await fetch(ASTRO_COM_ADE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36",
      ...(cookie ? { Cookie: `cid=${cookie}` } : {}),
    },
    body: new URLSearchParams(fields),
    redirect: "manual",
    signal: AbortSignal.timeout(12000),
  });
  const html = await response.text();
  return {
    response,
    html,
    cookie: cookieCid(response) || cookie,
    location: response.headers.get("location") ?? "",
  };
}

function chartUrl(location: string, html: string, cookie: string) {
  const cid = queryValue(location, "cid") || cookie;
  const nhor = queryValue(location, "nhor") || queryValue(html, "nhor") || "1";
  if (!cid) return null;
  return `https://www.astro.com/cgi/chart.cgi?lang=e&nhor=${nhor}&btyp=w2gw&cid=${encodeURIComponent(cid)}`;
}

/**
 * Astro.com rejects browser POSTs from other origins. Create the natal
 * record server-side, then return a chart URL the member can open.
 */
export async function createAstroComChartUrl(input: BirthInput) {
  const fields = astroComFormFields(input);
  let result = await postAde(fields);

  if (result.html.includes("Please select a place")) {
    const spli = pickAtlasPlace(result.html, input.place);
    if (!spli) {
      throw new Error("Astro.com found no matching town for that birthplace.");
    }
    result = await postAde(
      {
        ...fields,
        spli,
        sprev: hiddenValue(result.html, "sprev"),
      },
      result.cookie,
    );
  }

  const url = chartUrl(result.location, result.html, result.cookie);
  if (!url) {
    throw new Error("Astro.com did not keep that chart. Try again in a moment.");
  }
  return url;
}
