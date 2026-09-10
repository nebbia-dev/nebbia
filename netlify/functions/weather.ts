import { findCremonaWeather } from '../../server/weather';

type NetlifyEvent = {
  httpMethod: string;
};

type NetlifyResponse = {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
};

const jsonHeaders = {
  'Content-Type': 'application/json; charset=utf-8',
};

export async function handler(event: NetlifyEvent): Promise<NetlifyResponse> {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: { ...jsonHeaders, Allow: 'GET' },
      body: JSON.stringify({ error: 'Metodo non consentito' }),
    };
  }

  try {
    const data = await findCremonaWeather();
    return {
      statusCode: 200,
      headers: {
        ...jsonHeaders,
        'Cache-Control': 'public, max-age=300, stale-while-revalidate=600',
        'Netlify-CDN-Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600',
      },
      body: JSON.stringify(data),
    };
  } catch {
    return {
      statusCode: 502,
      headers: jsonHeaders,
      body: JSON.stringify({ error: 'Meteo non disponibile' }),
    };
  }
}
