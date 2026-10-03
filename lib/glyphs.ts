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
  aries: "#c45c3e",
  taurus: "#6b7a4a",
  gemini: "#8a7a4d",
  cancer: "#6a7d8c",
  leo: "#c4a05a",
  virgo: "#7a6b52",
  libra: "#9a6d78",
  scorpio: "#5c3d4a",
  sagittarius: "#b07048",
  capricorn: "#4d5a4a",
  aquarius: "#4d6270",
  pisces: "#6a5c78",
};

export const ASPECT_COLORS: Record<string, string> = {
  conjunction: "#c4a05a",
  opposition: "#a85a62",
  square: "#b07048",
  trine: "#6b7a4a",
  sextile: "#5a7388",
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
