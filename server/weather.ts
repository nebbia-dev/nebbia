import weather, { type WeatherSearchResult } from 'weather-js';

export type WeatherPayload = {
  condition: string;
  temperature: number;
};

let weatherCache: { data: WeatherPayload; expiresAt: number } | undefined;

export function findCremonaWeather() {
  if (weatherCache && weatherCache.expiresAt > Date.now()) {
    return Promise.resolve(weatherCache.data);
  }

  return new Promise<WeatherPayload>((resolve, reject) => {
    weather.find(
      { search: 'Cremona, Italy', degreeType: 'C', lang: 'it-IT', timeout: 8_000 },
      (error: Error | string | null, results: WeatherSearchResult[]) => {
        if (error) {
          reject(error instanceof Error ? error : new Error(error));
          return;
        }

        const current = results.find((result) => result.current)?.current;
        const temperature = Number(current?.temperature);
        const condition = current?.skytext?.trim();

        if (!condition || !Number.isFinite(temperature)) {
          reject(new Error('Dati meteo non disponibili'));
          return;
        }

        const data = { condition, temperature };
        weatherCache = { data, expiresAt: Date.now() + 10 * 60 * 1_000 };
        resolve(data);
      },
    );
  });
}
