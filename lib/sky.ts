import natal from "circular-natal-horoscope-js";
import { titleCase } from "./glyphs";

const { Origin, Horoscope } = natal as {
  Origin: new (input: Record<string, unknown>) => unknown;
  Horoscope: new (input: Record<string, unknown>) => {
    CelestialBodies: {
      moon: {
        Sign: { label: string };
        ChartPosition: { Ecliptic: { ArcDegreesFormatted30: string } };
      };
    };
  };
};

function moonPhaseName(longitude: number, sunLongitude: number) {
  const delta = (longitude - sunLongitude + 360) % 360;
  if (delta < 22.5 || delta >= 337.5) return "New";
  if (delta < 67.5) return "Waxing crescent";
  if (delta < 112.5) return "First quarter";
  if (delta < 157.5) return "Waxing gibbous";
  if (delta < 202.5) return "Full";
  if (delta < 247.5) return "Waning gibbous";
  if (delta < 292.5) return "Last quarter";
  return "Waning crescent";
}

export function currentSky(at = new Date()) {
  const origin = new Origin({
    year: at.getUTCFullYear(),
    month: at.getUTCMonth(),
    date: at.getUTCDate(),
    hour: at.getUTCHours(),
    minute: at.getUTCMinutes(),
    latitude: 51.481,
    longitude: -2.547,
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
  const moon = horoscope.CelestialBodies.moon as {
    Sign: { label: string };
    ChartPosition: {
      Ecliptic: { DecimalDegrees: number; ArcDegreesFormatted30: string };
    };
  };
  const sun = (
    horoscope.CelestialBodies as unknown as {
      sun: { ChartPosition: { Ecliptic: { DecimalDegrees: number } }; Sign: { label: string } };
    }
  ).sun;

  return {
    moonSign: moon.Sign.label,
    moonDegree: moon.ChartPosition.Ecliptic.ArcDegreesFormatted30.replace(
      /''/g,
      "″",
    ).replace(/'/g, "′"),
    sunSign: sun.Sign.label,
    phase: moonPhaseName(
      moon.ChartPosition.Ecliptic.DecimalDegrees,
      sun.ChartPosition.Ecliptic.DecimalDegrees,
    ),
    placeNote: "from the studio in Bath",
  };
}

export function skySentence(at = new Date()) {
  const sky = currentSky(at);
  return `Tonight the Moon is in ${titleCase(sky.moonSign)}, ${sky.phase.toLowerCase()}, while the Sun walks ${titleCase(sky.sunSign)}.`;
}
