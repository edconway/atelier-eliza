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
    btyp: "w2gw",
    subcon: "continue",
  } satisfies Record<string, string>;
}
