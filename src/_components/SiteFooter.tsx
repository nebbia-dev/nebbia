import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { Language } from '../language';

type WeatherResponse = {
  condition: string;
  conditionCode?: string;
  temperature: number;
};

const englishConditionsByCode: Record<string, string> = {
  '0': 'Tornado',
  '1': 'Tropical storm',
  '2': 'Hurricane',
  '3': 'Severe thunderstorms',
  '4': 'Thunderstorms',
  '5': 'Mixed rain and snow',
  '6': 'Mixed rain and sleet',
  '7': 'Mixed snow and sleet',
  '8': 'Freezing drizzle',
  '9': 'Drizzle',
  '10': 'Freezing rain',
  '11': 'Showers',
  '12': 'Showers',
  '13': 'Snow flurries',
  '14': 'Light snow showers',
  '15': 'Blowing snow',
  '16': 'Snow',
  '17': 'Hail',
  '18': 'Sleet',
  '19': 'Dusty',
  '20': 'Foggy',
  '21': 'Haze',
  '22': 'Smoky',
  '23': 'Blustery',
  '24': 'Windy',
  '25': 'Cold',
  '26': 'Cloudy',
  '27': 'Mostly cloudy',
  '28': 'Mostly cloudy',
  '29': 'Partly cloudy',
  '30': 'Partly cloudy',
  '31': 'Clear',
  '32': 'Sunny',
  '33': 'Fair',
  '34': 'Fair',
  '35': 'Mixed rain and hail',
  '36': 'Hot',
  '37': 'Isolated thunderstorms',
  '38': 'Scattered thunderstorms',
  '39': 'Scattered showers',
  '40': 'Heavy rain',
  '41': 'Scattered snow showers',
  '42': 'Heavy snow',
  '43': 'Blizzard',
  '44': 'Not available',
  '45': 'Scattered showers',
  '46': 'Snow showers',
  '47': 'Isolated thundershowers',
};

const italianConditions: Record<string, string> = {
  'sereno': 'Clear',
  'prevalentemente sereno': 'Mostly clear',
  'soleggiato': 'Sunny',
  'prevalentemente soleggiato': 'Mostly sunny',
  'parzialmente soleggiato': 'Partly sunny',
  'poco nuvoloso': 'Partly cloudy',
  'parzialmente nuvoloso': 'Partly cloudy',
  'nubi sparse': 'Scattered clouds',
  'nuvoloso': 'Cloudy',
  'prevalentemente nuvoloso': 'Mostly cloudy',
  'molto nuvoloso': 'Mostly cloudy',
  'coperto': 'Overcast',
  'foschia': 'Haze',
  'nebbia': 'Foggy',
  'pioviggine': 'Drizzle',
  'pioggia leggera': 'Light rain',
  'pioggia': 'Rain',
  'pioggia intensa': 'Heavy rain',
  'pioggia gelata': 'Freezing rain',
  'rovesci': 'Showers',
  'rovesci sparsi': 'Scattered showers',
  'temporale': 'Thunderstorm',
  'temporali': 'Thunderstorms',
  'temporali sparsi': 'Scattered thunderstorms',
  'possibili temporali': 'Possible thunderstorms',
  'nevischio': 'Sleet',
  'neve leggera': 'Light snow',
  'neve': 'Snow',
  'rovesci di neve': 'Snow showers',
  'grandine': 'Hail',
  'ventoso': 'Windy',
  'vento forte': 'Strong winds',
};

function weatherCondition({ condition, conditionCode }: WeatherResponse, language: Language) {
  if (language === 'it') return condition;
  if (conditionCode && englishConditionsByCode[conditionCode]) return englishConditionsByCode[conditionCode];
  return italianConditions[condition.trim().toLocaleLowerCase('it-IT')] ?? condition;
}

async function getCremonaWeather(language: Language): Promise<WeatherResponse> {
  const response = await fetch(`/api/weather?lang=${language}`);
  if (!response.ok) throw new Error('Meteo non disponibile');
  return response.json() as Promise<WeatherResponse>;
}

export function SiteFooter({ hiddenOnMobile = false, language = 'it' }: { hiddenOnMobile?: boolean; language?: Language }) {
  const isEnglish = language === 'en';
  const [time, setTime] = useState('');
  const weather = useQuery({
    queryKey: ['weather', 'cremona', language],
    queryFn: () => getCremonaWeather(language),
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
    <footer className={`fixed inset-x-0 bottom-0 z-[60] text-xs max-sm:text-[10px] ${hiddenOnMobile ? 'max-md:hidden' : ''}`}>
      <div className="flex h-[50px] items-center gap-3 bg-[#1a1a1a] px-[30px] max-sm:h-[42px] max-sm:gap-2 max-sm:px-[18px]">
        <span>Cremona (IT)</span><i className="h-3 w-px bg-white/45" />
        <span>Time: <time>{time || '--:--'}</time></span><i className="h-3 w-px bg-white/45" />
        <span id="weather" className="flex items-center gap-1.5" aria-live="polite">
          {weather.isPending
            ? `${isEnglish ? 'Weather' : 'Meteo'}: --`
            : weather.isError
              ? (isEnglish ? 'Weather unavailable' : 'Meteo non disponibile')
              : `${weatherCondition(weather.data, language)}, ${weather.data.temperature}°C`}
        </span>
        <small className="ml-auto text-[10px] opacity-50 max-sm:hidden">© {new Date().getFullYear()} Nebbia Phygital Lab</small>
      </div>
    </footer>
  );
}
