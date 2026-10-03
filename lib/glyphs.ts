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
  aries: "#f0a0b8",
  taurus: "#c9b4e8",
  gemini: "#e8d4a8",
  cancer: "#b8d4f0",
  leo: "#f0c878",
  virgo: "#d4c4e8",
  libra: "#f0b8d0",
  scorpio: "#c090c8",
  sagittarius: "#e8b898",
  capricorn: "#a8c0d8",
  aquarius: "#b8a8e8",
  pisces: "#d8b8e8",
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
