export const PLANET_GLYPHS: Record<string, string> = {
  sun: "☉",
  moon: "☽",
  mercury: "☿",
  venus: "♀",
  mars: "♂",
  jupiter: "♃",
  saturn: "♄",
  uranus: "♅",
  neptune: "♆",
  pluto: "♇",
  chiron: "⚷",
  northnode: "☊",
  southnode: "☋",
  lilith: "⚸",
  ascendant: "ASC",
  midheaven: "MC",
};

export const SIGN_GLYPHS: Record<string, string> = {
  aries: "♈",
  taurus: "♉",
  gemini: "♊",
  cancer: "♋",
  leo: "♌",
  virgo: "♍",
  libra: "♎",
  scorpio: "♏",
  sagittarius: "♐",
  capricorn: "♑",
  aquarius: "♒",
  pisces: "♓",
};

export const SIGN_ELEMENTS: Record<string, keyof import("./types").ElementBalance> = {
  aries: "fire",
  leo: "fire",
  sagittarius: "fire",
  taurus: "earth",
  virgo: "earth",
  capricorn: "earth",
  gemini: "air",
  libra: "air",
  aquarius: "air",
  cancer: "water",
  scorpio: "water",
  pisces: "water",
};

export const SIGN_MODALITIES: Record<string, keyof import("./types").ModalityBalance> = {
  aries: "cardinal",
  cancer: "cardinal",
  libra: "cardinal",
  capricorn: "cardinal",
  taurus: "fixed",
  leo: "fixed",
  scorpio: "fixed",
  aquarius: "fixed",
  gemini: "mutable",
  virgo: "mutable",
  sagittarius: "mutable",
  pisces: "mutable",
};

export const SIGN_COLORS: Record<string, string> = {
  aries: "#c45a78",
  taurus: "#7a62b0",
  gemini: "#b08940",
  cancer: "#4f7eb0",
  leo: "#c48a20",
  virgo: "#7a6498",
  libra: "#c45f88",
  scorpio: "#8a4098",
  sagittarius: "#b06a48",
  capricorn: "#4a6a88",
  aquarius: "#5c4aa8",
  pisces: "#8a5aa0",
};

export const ASPECT_COLORS: Record<string, string> = {
  conjunction: "#f0c878",
  opposition: "#f0a0b8",
  square: "#e8b898",
  trine: "#c9b4e8",
  sextile: "#b8d4f0",
};

export const BODY_ORDER = [
  "sun",
  "moon",
  "mercury",
  "venus",
  "mars",
  "jupiter",
  "saturn",
  "uranus",
  "neptune",
  "pluto",
  "chiron",
  "northnode",
  "southnode",
  "lilith",
  "ascendant",
  "midheaven",
] as const;

export const DIGNITIES: Record<string, { domicile: string[]; exaltation?: string }> = {
  sun: { domicile: ["leo"], exaltation: "aries" },
  moon: { domicile: ["cancer"], exaltation: "taurus" },
  mercury: { domicile: ["gemini", "virgo"], exaltation: "virgo" },
  venus: { domicile: ["taurus", "libra"], exaltation: "pisces" },
  mars: { domicile: ["aries", "scorpio"], exaltation: "capricorn" },
  jupiter: { domicile: ["sagittarius", "pisces"], exaltation: "cancer" },
  saturn: { domicile: ["capricorn", "aquarius"], exaltation: "libra" },
};

export function titleCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
