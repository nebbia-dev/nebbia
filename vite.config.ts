import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { defineConfig, type Plugin } from 'vite';
import weather, { type WeatherSearchResult } from 'weather-js';

type WeatherPayload = {
  condition: string;
  temperature: number;
};

let weatherCache: { data: WeatherPayload; expiresAt: number } | undefined;

function findCremonaWeather() {
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

async function handleWeatherRequest(request: IncomingMessage, response: ServerResponse) {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (request.method !== 'GET') {
    response.statusCode = 405;
    response.setHeader('Allow', 'GET');
    response.end(JSON.stringify({ error: 'Metodo non consentito' }));
    return;
  }

  try {
    const data = await findCremonaWeather();
    response.statusCode = 200;
    response.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
    response.end(JSON.stringify(data));
  } catch {
    response.statusCode = 502;
    response.end(JSON.stringify({ error: 'Meteo non disponibile' }));
  }
}

const weatherApi = (): Plugin => ({
  name: 'nebbia-weather-api',
  configureServer(server) {
    server.middlewares.use('/api/weather', handleWeatherRequest);
  },
  configurePreviewServer(server) {
    server.middlewares.use('/api/weather', handleWeatherRequest);
  },
});

export default defineConfig({
  plugins: [weatherApi(), react(), tailwindcss()],
});
