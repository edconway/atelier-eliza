import natal from "circular-natal-horoscope-js";
import { titleCase } from "./glyphs";

const { Origin, Horoscope } = natal as {
  Origin: new (input: Record<string, unknown>) => unknown;
  Horoscope: new (input: Record<string, unknown>) => {
    CelestialBodies: {
      moon: Body;
      sun: Body;
    };
  };
};

type Body = {
  Sign: { label: string };
  ChartPosition: {
    Ecliptic: { DecimalDegrees: number };
  };
};

// Reykjavik stays on UTC all year. The library treats the clock as local
// time at the coordinates, so this keeps the instant we pass as the real one.
// Sign and phase are geocentric; the place does not move the Moon’s longitude.
const UTC_LATITUDE = 64.1466;
const UTC_LONGITUDE = -21.9426;

function phaseName(elongation: number) {
  const delta = (elongation + 360) % 360;
  if (delta < 22.5 || delta >= 337.5) return "New";
  if (delta < 67.5) return "Waxing crescent";
  if (delta < 112.5) return "First quarter";
  if (delta < 157.5) return "Waxing gibbous";
  if (delta < 202.5) return "Full";
  if (delta < 247.5) return "Waning gibbous";
  if (delta < 292.5) return "Last quarter";
  return "Waning crescent";
}

function formatInSign(longitude: number) {
  const within = ((longitude % 30) + 30) % 30;
  let degrees = Math.floor(within);
  let minutes = Math.round((within - degrees) * 60);
  if (minutes === 60) {
    degrees += 1;
    minutes = 0;
  }
  if (degrees >= 30) {
    degrees = 29;
    minutes = 59;
  }
  return `${degrees}°${String(minutes).padStart(2, "0")}′`;
}

type Rgb = [number, number, number];

const SKY_STOPS: {
  at: number;
  top: Rgb;
  bottom: Rgb;
  night: number;
  when: string;
}[] = [
  { at: 0, top: [168, 208, 230], bottom: [226, 238, 246], night: 0, when: "Seen in the daytime" },
  { at: 45, top: [32, 52, 108], bottom: [214, 132, 92], night: 0.45, when: "Seen after sunset" },
  { at: 90, top: [20, 40, 92], bottom: [176, 96, 84], night: 0.6, when: "Seen in the evening" },
  { at: 135, top: [12, 22, 52], bottom: [24, 40, 78], night: 0.88, when: "Seen in the evening and at night" },
  { at: 180, top: [6, 10, 22], bottom: [12, 18, 38], night: 1, when: "Seen through the night" },
  { at: 225, top: [10, 16, 36], bottom: [28, 42, 68], night: 0.82, when: "Seen after midnight" },
  { at: 270, top: [142, 190, 220], bottom: [244, 226, 204], night: 0.08, when: "Seen in the morning" },
  { at: 315, top: [104, 164, 206], bottom: [240, 186, 150], night: 0.12, when: "Seen before sunrise" },
  { at: 360, top: [168, 208, 230], bottom: [226, 238, 246], night: 0, when: "Seen in the daytime" },
];

function mixChannel(start: number, end: number, t: number) {
  return Math.round(start + (end - start) * t);
}

function mixRgb(start: Rgb, end: Rgb, t: number) {
  return `rgb(${mixChannel(start[0], end[0], t)}, ${mixChannel(start[1], end[1], t)}, ${mixChannel(start[2], end[2], t)})`;
}

export function moonViewSky(elongation: number) {
  const angle = ((elongation % 360) + 360) % 360;
  let index = 0;
  while (SKY_STOPS[index + 1].at < angle) index += 1;
  const from = SKY_STOPS[index];
  const to = SKY_STOPS[index + 1];
  const t = (angle - from.at) / (to.at - from.at);
  return {
    top: mixRgb(from.top, to.top, t),
    bottom: mixRgb(from.bottom, to.bottom, t),
    night: from.night + (to.night - from.night) * t,
    when: t < 0.5 ? from.when : to.when,
  };
}

export type CurrentSky = {
  phase: string;
  waxing: boolean;
  elongation: number;
  illumination: number;
  moonSign: string;
  moonDegree: string;
  sunSign: string;
  sunDegree: string;
};

export function currentSky(at = new Date()): CurrentSky {
  const origin = new Origin({
    year: at.getUTCFullYear(),
    month: at.getUTCMonth(),
    date: at.getUTCDate(),
    hour: at.getUTCHours(),
    minute: at.getUTCMinutes(),
    latitude: UTC_LATITUDE,
    longitude: UTC_LONGITUDE,
  });
  const horoscope = new Horoscope({
    origin,
    houseSystem: "placidus",
    zodiac: "tropical",
    aspectPoints: ["bodies"],
    aspectWithPoints: ["bodies"],
    aspectTypes: ["major"],
    language: "en",
  });
  const moon = horoscope.CelestialBodies.moon;
  const sun = horoscope.CelestialBodies.sun;
  const moonLongitude = moon.ChartPosition.Ecliptic.DecimalDegrees;
  const sunLongitude = sun.ChartPosition.Ecliptic.DecimalDegrees;
  const elongation = (moonLongitude - sunLongitude + 360) % 360;

  return {
    phase: phaseName(elongation),
    waxing: elongation < 180,
    elongation,
    illumination: (1 - Math.cos((elongation * Math.PI) / 180)) / 2,
    moonSign: titleCase(moon.Sign.label),
    moonDegree: formatInSign(moonLongitude),
    sunSign: titleCase(sun.Sign.label),
    sunDegree: formatInSign(sunLongitude),
  };
}
