import natal from "circular-natal-horoscope-js";
import type {
  BirthInput,
  ChartAspect,
  ChartBody,
  ChartHouse,
  ElementBalance,
  ModalityBalance,
  NatalChart,
} from "./types";
import {
  BODY_ORDER,
  DIGNITIES,
  SIGN_ELEMENTS,
  SIGN_MODALITIES,
  titleCase,
} from "./glyphs";

const { Origin, Horoscope } = natal as {
  Origin: new (input: {
    year: number;
    month: number;
    date: number;
    hour: number;
    minute: number;
    latitude: number;
    longitude: number;
  }) => {
    timezone: { name?: string };
    localTimeFormatted: string;
    utcTimeFormatted: string;
  };
  Horoscope: new (input: Record<string, unknown>) => HoroscopeLike;
};

type HoroscopeLike = {
  Ascendant: BodyLike;
  Midheaven: BodyLike;
  CelestialBodies: { all: BodyLike[] };
  CelestialPoints: { all: BodyLike[] };
  Houses: HouseLike[];
  Aspects: { all: AspectLike[] };
};

type BodyLike = {
  key: string;
  label: string;
  isRetrograde?: boolean;
  Sign?: { key: string; label: string };
  House?: { id: number };
  ChartPosition: {
    Ecliptic: { DecimalDegrees: number; ArcDegreesFormatted30: string };
    Horizon: { DecimalDegrees: number };
  };
};

type HouseLike = {
  id: number;
  label: string;
  Sign: { key: string; label: string };
  ChartPosition: {
    StartPosition: {
      Ecliptic: { DecimalDegrees: number; ArcDegreesFormatted30: string };
      Horizon: { DecimalDegrees: number };
    };
  };
};

type AspectLike = {
  point1Key: string;
  point2Key: string;
  aspectKey: string;
  label: string;
  orb: number;
};

const SKIP_BODIES = new Set(["sirius"]);

function dignityFor(id: string, sign: string) {
  const table = DIGNITIES[id];
  if (!table) return undefined;
  if (table.domicile.includes(sign)) return "in domicile";
  if (table.exaltation === sign) return "exalted";
  return undefined;
}

function mapBody(body: BodyLike, kind: ChartBody["kind"]): ChartBody {
  const sign = body.Sign?.key ?? "aries";
  return {
    id: body.key,
    name: body.label,
    longitude: body.ChartPosition.Ecliptic.DecimalDegrees,
    horizon: body.ChartPosition.Horizon.DecimalDegrees,
    sign,
    signDegree: body.ChartPosition.Ecliptic.ArcDegreesFormatted30.replace(
      /''/g,
      "″",
    ).replace(/'/g, "′"),
    house: body.House?.id ?? null,
    retrograde: Boolean(body.isRetrograde),
    kind,
    dignity: dignityFor(body.key, sign),
  };
}

function countBalances(bodies: ChartBody[]) {
  const elements: ElementBalance = { fire: 0, earth: 0, air: 0, water: 0 };
  const modalities: ModalityBalance = { cardinal: 0, fixed: 0, mutable: 0 };
  const counted = new Set([
    "sun",
    "moon",
    "mercury",
    "venus",
    "mars",
    "jupiter",
    "saturn",
  ]);
  for (const body of bodies) {
    if (!counted.has(body.id)) continue;
    const element = SIGN_ELEMENTS[body.sign];
    const modality = SIGN_MODALITIES[body.sign];
    if (element) elements[element] += 1;
    if (modality) modalities[modality] += 1;
  }
  return { elements, modalities };
}

function firstLook(chart: {
  sun?: ChartBody;
  moon?: ChartBody;
  rising?: ChartBody;
  elements: ElementBalance;
  unknownTime: boolean;
  name: string;
}) {
  const lines: string[] = [];
  if (chart.sun) {
    lines.push(`Sun in ${titleCase(chart.sun.sign)}.`);
  }
  if (chart.moon) {
    lines.push(
      `Moon in ${titleCase(chart.moon.sign)}${chart.moon.house ? `, house ${chart.moon.house}` : ""}.`,
    );
  }
  if (chart.unknownTime) {
    lines.push(
      "Birth time unknown. Rising sign and houses are a noon estimate.",
    );
  } else if (chart.rising) {
    lines.push(`${titleCase(chart.rising.sign)} rising.`);
  }
  const dominant = (
    Object.entries(chart.elements) as [keyof ElementBalance, number][]
  ).sort((a, b) => b[1] - a[1])[0];
  if (dominant && dominant[1] > 0) {
    lines.push(
      `Most personal planets are in ${dominant[0]} (${dominant[1]}).`,
    );
  }
  return lines;
}

export function calculateNatalChart(input: BirthInput): NatalChart {
  const hour = input.unknownTime ? 12 : input.hour;
  const minute = input.unknownTime ? 0 : input.minute;

  const origin = new Origin({
    year: input.year,
    month: input.month - 1,
    date: input.day,
    hour,
    minute,
    latitude: input.place.latitude,
    longitude: input.place.longitude,
  });

  const horoscope = new Horoscope({
    origin,
    houseSystem: "placidus",
    zodiac: "tropical",
    aspectPoints: ["bodies", "points", "angles"],
    aspectWithPoints: ["bodies", "points", "angles"],
    aspectTypes: ["major"],
    language: "en",
  });

  const planets = horoscope.CelestialBodies.all
    .filter((body) => !SKIP_BODIES.has(body.key))
    .map((body) => mapBody(body, "planet"));
  const points = horoscope.CelestialPoints.all.map((body) =>
    mapBody(body, "point"),
  );
  const ascendant = mapBody(
    { ...horoscope.Ascendant, key: "ascendant", label: "Ascendant" },
    "angle",
  );
  const midheaven = mapBody(
    { ...horoscope.Midheaven, key: "midheaven", label: "Midheaven" },
    "angle",
  );

  const bodies = [...planets, ...points, ascendant, midheaven].sort(
    (a, b) => BODY_ORDER.indexOf(a.id as (typeof BODY_ORDER)[number]) -
      BODY_ORDER.indexOf(b.id as (typeof BODY_ORDER)[number]),
  );

  const houses: ChartHouse[] = horoscope.Houses.map((house) => ({
    number: house.id,
    label: house.label,
    longitude: house.ChartPosition.StartPosition.Ecliptic.DecimalDegrees,
    horizon: house.ChartPosition.StartPosition.Horizon.DecimalDegrees,
    sign: house.Sign.key,
    signDegree:
      house.ChartPosition.StartPosition.Ecliptic.ArcDegreesFormatted30.replace(
        /''/g,
        "″",
      ).replace(/'/g, "′"),
  }));

  const allowed = new Set(bodies.map((body) => body.id));
  const aspects: ChartAspect[] = horoscope.Aspects.all
    .filter(
      (aspect) =>
        allowed.has(aspect.point1Key) && allowed.has(aspect.point2Key),
    )
    .map((aspect) => ({
      from: aspect.point1Key,
      to: aspect.point2Key,
      type: aspect.aspectKey,
      label: aspect.label,
      orb: Number(aspect.orb.toFixed(2)),
    }));

  const { elements, modalities } = countBalances(bodies);
  const sun = bodies.find((body) => body.id === "sun");
  const moon = bodies.find((body) => body.id === "moon");
  const rising = bodies.find((body) => body.id === "ascendant");

  const timezoneName =
    origin.timezone?.name || input.place.timezone || "local mean time";

  return {
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    input,
    timezoneName,
    localTime: String(origin.localTimeFormatted),
    utcTime: String(origin.utcTimeFormatted),
    houseSystem: "placidus",
    zodiac: "tropical",
    ephemeris: "Moshier (tropical, Placidus)",
    unknownTime: input.unknownTime,
    bodies,
    houses,
    aspects,
    elements,
    modalities,
    firstLook: firstLook({
      sun,
      moon,
      rising,
      elements,
      unknownTime: input.unknownTime,
      name: input.name,
    }),
    summary: {
      sun: sun ? `${sun.signDegree} ${titleCase(sun.sign)}` : "—",
      moon: moon ? `${moon.signDegree} ${titleCase(moon.sign)}` : "—",
      rising: input.unknownTime
        ? "estimated (noon)"
        : rising
          ? `${rising.signDegree} ${titleCase(rising.sign)}`
          : "—",
    },
  };
}

export function polar(horizon: number, radius: number, cx = 0, cy = 0) {
  const theta = ((180 + horizon) * Math.PI) / 180;
  return {
    x: cx + radius * Math.cos(theta),
    y: cy + radius * Math.sin(theta),
  };
}

export function formatBirthSentence(input: BirthInput) {
  const date = new Date(Date.UTC(input.year, input.month - 1, input.day));
  const pretty = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
  const time = input.unknownTime
    ? "time unknown"
    : `${String(input.hour).padStart(2, "0")}:${String(input.minute).padStart(2, "0")}`;
  return `${input.name}, born ${pretty}, ${time}, in ${input.place.name}`;
}
