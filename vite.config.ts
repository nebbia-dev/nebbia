import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import type { IncomingMessage, ServerResponse } from 'node:http';
import { defineConfig, type Plugin } from 'vite';
import { findCremonaWeather } from './server/weather';

async function handleWeatherRequest(request: IncomingMessage, response: ServerResponse) {
  response.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (request.method !== 'GET') {
    response.statusCode = 405;
    response.setHeader('Allow', 'GET');
    response.end(JSON.stringify({ error: 'Metodo non consentito' }));
    return;
  }

  try {
    const language = new URL(request.url ?? '', 'http://localhost').searchParams.get('lang') === 'en' ? 'en-US' : 'it-IT';
    const data = await findCremonaWeather(language);
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
