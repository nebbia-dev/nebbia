declare module 'weather-js' {
  export type WeatherSearchOptions = {
    search: string;
    degreeType?: 'C' | 'F';
    lang?: string;
    timeout?: number;
  };

  export type WeatherSearchResult = {
    current: {
      temperature?: string;
      skycode?: string;
      skytext?: string;
    } | null;
  };

  const weather: {
    find(
      options: WeatherSearchOptions,
      callback: (error: Error | string | null, result: WeatherSearchResult[]) => void,
    ): void;
  };

  export default weather;
}
