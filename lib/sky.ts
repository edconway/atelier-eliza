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
