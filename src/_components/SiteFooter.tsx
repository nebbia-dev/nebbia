import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

type WeatherResponse = {
  condition: string;
  temperature: number;
};

async function getCremonaWeather(): Promise<WeatherResponse> {
  const response = await fetch('/api/weather');
  if (!response.ok) throw new Error('Meteo non disponibile');
  return response.json() as Promise<WeatherResponse>;
}

export function SiteFooter() {
  const [time, setTime] = useState('');
  const weather = useQuery({
    queryKey: ['weather', 'cremona'],
    queryFn: getCremonaWeather,
    staleTime: 10 * 60 * 1_000,
    refetchInterval: 10 * 60 * 1_000,
  });

  useEffect(() => {
    const update = () => setTime(new Intl.DateTimeFormat('it-IT', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Europe/Rome',
    }).format(new Date()));
    update();
    const timer = window.setInterval(update, 30_000);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <footer className="fixed inset-x-0 bottom-0 z-[60] text-xs max-sm:text-[10px]">
      <div className="flex h-[50px] items-center gap-3 bg-[#1a1a1a] px-[30px] max-sm:h-[42px] max-sm:gap-2 max-sm:px-[18px]">
        <span>Cremona (IT)</span><i className="h-3 w-px bg-white/45" />
        <span>Time: <time>{time || '--:--'}</time></span><i className="h-3 w-px bg-white/45" />
        <span id="weather" className="flex items-center gap-1.5" aria-live="polite">
          {weather.isPending
            ? 'Meteo: --'
            : weather.isError
              ? 'Meteo non disponibile'
              : `${weather.data.condition}, ${weather.data.temperature}°C`}
        </span>
        <small className="ml-auto text-[10px] opacity-50 max-sm:hidden">© {new Date().getFullYear()} Nebbia Phygital Lab</small>
      </div>
    </footer>
  );
}
