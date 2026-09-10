const WEATHER_CACHE_TTL = 10 * 60 * 1_000;
let weatherCache;

function readXmlAttribute(xml, element, attribute) {
  const elementMatch = xml.match(new RegExp(`<${element}\\b[^>]*>`, 'i'));
  const attributeMatch = elementMatch?.[0].match(new RegExp(`\\b${attribute}="([^"]*)"`, 'i'));

  return attributeMatch?.[1]
    .replaceAll('&amp;', '&')
    .replaceAll('&quot;', '"')
    .replaceAll('&apos;', "'")
    .replaceAll('&lt;', '<')
    .replaceAll('&gt;', '>');
}

async function getCremonaWeather() {
  if (weatherCache && weatherCache.expiresAt > Date.now()) return weatherCache.data;

  const weatherUrl = new URL('https://weather.service.msn.com/find.aspx');
  weatherUrl.searchParams.set('src', 'outlook');
  weatherUrl.searchParams.set('weadegreetype', 'C');
  weatherUrl.searchParams.set('culture', 'it-IT');
  weatherUrl.searchParams.set('weasearchstr', 'Cremona, Italy');

  const weatherResponse = await fetch(weatherUrl, { signal: AbortSignal.timeout(8_000) });
  if (!weatherResponse.ok) throw new Error('Weather provider request failed');

  const xml = await weatherResponse.text();
  const condition = readXmlAttribute(xml, 'current', 'skytext')?.trim();
  const temperature = Number(readXmlAttribute(xml, 'current', 'temperature'));

  if (!condition || !Number.isFinite(temperature)) throw new Error('Weather data missing');

  const data = { condition, temperature };
  weatherCache = { data, expiresAt: Date.now() + WEATHER_CACHE_TTL };
  return data;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/weather') {
      if (request.method !== 'GET') {
        return Response.json({ error: 'Metodo non consentito' }, { status: 405, headers: { Allow: 'GET' } });
      }

      try {
        return Response.json(await getCremonaWeather(), {
          headers: { 'Cache-Control': 'public, max-age=300, stale-while-revalidate=600' },
        });
      } catch {
        return Response.json({ error: 'Meteo non disponibile' }, { status: 502 });
      }
    }

    const response = await env.ASSETS.fetch(request);
    if (response.status !== 404 || request.method !== 'GET') return response;
    const fallback = new URL('/index.html', request.url);
    return env.ASSETS.fetch(new Request(fallback, request));
  },
};
