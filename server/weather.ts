import weather, { type WeatherSearchResult } from 'weather-js';

export type WeatherPayload = {
  condition: string;
  conditionCode?: string;
  temperature: number;
};

const weatherCache = new Map<string, { data: WeatherPayload; expiresAt: number }>();

export function findCremonaWeather(language = 'it-IT') {
  const cached = weatherCache.get(language);
  if (cached && cached.expiresAt > Date.now()) {
    return Promise.resolve(cached.data);
  }

  return new Promise<WeatherPayload>((resolve, reject) => {
    weather.find(
      { search: 'Cremona, Italy', degreeType: 'C', lang: language, timeout: 8_000 },
      (error: Error | string | null, results: WeatherSearchResult[]) => {
        if (error) {
          reject(error instanceof Error ? error : new Error(error));
          return;
        }

        const current = results.find((result) => result.current)?.current;
        const temperature = Number(current?.temperature);
        const condition = current?.skytext?.trim();
        const conditionCode = current?.skycode?.trim();

        if (!condition || !Number.isFinite(temperature)) {
          reject(new Error('Dati meteo non disponibili'));
          return;
        }

        const data = { condition, conditionCode, temperature };
        weatherCache.set(language, { data, expiresAt: Date.now() + 10 * 60 * 1_000 });
        resolve(data);
      },
    );
  });
}
