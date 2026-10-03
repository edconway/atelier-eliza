declare module "circular-natal-horoscope-js" {
  const natal: {
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
    Horoscope: new (input: Record<string, unknown>) => unknown;
  };
  export default natal;
}
