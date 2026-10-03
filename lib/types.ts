export type Relationship =
  | "self"
  | "partner"
  | "child"
  | "parent"
  | "friend"
  | "other";

export type SessionType =
  | "natal"
  | "follow-up"
  | "family"
  | "year-ahead";

export interface Place {
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface BirthInput {
  name: string;
  relationship: Relationship;
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  unknownTime: boolean;
  place: Place;
}

export interface ChartBody {
  id: string;
  name: string;
  longitude: number;
  horizon: number;
  sign: string;
  signDegree: string;
  house: number | null;
  retrograde: boolean;
  kind: "planet" | "point" | "angle";
  dignity?: string;
}

export interface ChartHouse {
  number: number;
  label: string;
  longitude: number;
  horizon: number;
  sign: string;
  signDegree: string;
}

export interface ChartAspect {
  from: string;
  to: string;
  type: string;
  label: string;
  orb: number;
}

export interface ElementBalance {
  fire: number;
  earth: number;
  air: number;
  water: number;
}

export interface ModalityBalance {
  cardinal: number;
  fixed: number;
  mutable: number;
}

export interface NatalChart {
  id: string;
  createdAt: string;
  input: BirthInput;
  timezoneName: string;
  localTime: string;
  utcTime: string;
  houseSystem: "placidus";
  zodiac: "tropical";
  ephemeris: string;
  unknownTime: boolean;
  bodies: ChartBody[];
  houses: ChartHouse[];
  aspects: ChartAspect[];
  elements: ElementBalance;
  modalities: ModalityBalance;
  firstLook: string[];
  summary: {
    sun: string;
    moon: string;
    rising: string;
  };
}

export interface Member {
  name: string;
  email: string;
}

export interface Booking {
  id: string;
  createdAt: string;
  name: string;
  email: string;
  sessionType: SessionType;
  preferredDate: string;
  chartId?: string;
  notes: string;
  status: "requested";
}

export interface SessionFilm {
  id: string;
  title: string;
  date: string;
  duration: string;
  synopsis: string;
  videoSrc: string;
  poster?: string;
}

export interface JournalPost {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  minutes: number;
  topic: string;
  body: string[];
}

export interface NewsletterSignup {
  email: string;
  createdAt: string;
}
