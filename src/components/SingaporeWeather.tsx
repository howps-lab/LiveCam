import React, { useEffect, useState } from 'react';
import { Cloud, CloudRain, Sun, CloudLightning, RefreshCw, AlertCircle, Droplets } from 'lucide-react';

interface WeatherData {
  temperature: number;
  humidity: number;
  weatherCode: number;
  isDay: number;
  fetchedAt: Date;
}

// WMO Weather interpretation codes (http://www.nodc.noaa.gov/archive/arc0021/0002199/1.1/data/0-data/HTML/WMO-CODE/WMO4677.HTM)
function getWeatherCondition(code: number, isDay: number): { label: string; icon: React.ReactNode } {
  switch (code) {
    case 0:
      return {
        label: isDay ? 'Clear Sky' : 'Clear Night',
        icon: <Sun className="w-4 h-4 text-amber-400" />,
      };
    case 1:
    case 2:
      return {
        label: 'Partly Cloudy',
        icon: <Cloud className="w-4 h-4 text-cyan-300" />,
      };
    case 3:
      return {
        label: 'Overcast',
        icon: <Cloud className="w-4 h-4 text-slate-300" />,
      };
    case 45:
    case 48:
      return {
        label: 'Hazy / Fog',
        icon: <Cloud className="w-4 h-4 text-slate-400" />,
      };
    case 51:
    case 53:
    case 55:
    case 61:
    case 63:
    case 65:
    case 80:
    case 81:
    case 82:
      return {
        label: 'Tropical Rain',
        icon: <CloudRain className="w-4 h-4 text-[#00D9F5]" />,
      };
    case 95:
    case 96:
    case 99:
      return {
        label: 'Thunderstorm',
        icon: <CloudLightning className="w-4 h-4 text-amber-400" />,
      };
    default:
      return {
        label: 'Fair / Humid',
        icon: <Sun className="w-4 h-4 text-amber-300" />,
      };
  }
}

export const SingaporeWeather: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  const fetchWeather = async (manual = false) => {
    if (manual) setIsRefreshing(true);
    try {
      // Real live weather query for Singapore Downtown coordinates (1.3521 N, 103.8198 E)
      const res = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=1.3521&longitude=103.8198&current=temperature_2m,relative_humidity_2m,weather_code,is_day'
      );

      if (!res.ok) {
        throw new Error(`Weather service returned ${res.status}`);
      }

      const data = await res.json();
      if (!data.current) {
        throw new Error('Invalid weather payload');
      }

      setWeather({
        temperature: Math.round(data.current.temperature_2m * 10) / 10,
        humidity: Math.round(data.current.relative_humidity_2m),
        weatherCode: data.current.weather_code,
        isDay: data.current.is_day,
        fetchedAt: new Date(),
      });
      setError(null);
    } catch (err: unknown) {
      console.warn('Live weather service error:', err);
      // We do not invent weather readings: show error state clearly
      setError('Weather service unavailable');
    } finally {
      setIsLoading(false);
      if (manual) {
        setTimeout(() => setIsRefreshing(false), 500);
      }
    }
  };

  useEffect(() => {
    fetchWeather();
    // Refresh weather every 5 minutes (300,000 ms)
    const interval = window.setInterval(() => {
      fetchWeather();
    }, 5 * 60 * 1000);

    return () => window.clearInterval(interval);
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl bg-[#1D2A3E]/60 border border-[#243149] text-xs text-[#91A9C8] animate-pulse">
        <div className="w-5 h-5 rounded-full bg-[#243149]" />
        <span>Loading Singapore weather...</span>
      </div>
    );
  }

  if (error || !weather) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#1D2A3E]/60 border border-[#243149] text-xs text-[#91A9C8]">
        <AlertCircle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="truncate max-w-[120px] sm:max-w-none">Live weather unavailable</span>
        <button
          onClick={() => fetchWeather(true)}
          className="ml-1 text-[11px] text-[#00C6A2] hover:text-[#00D9F5] underline underline-offset-2 transition-colors cursor-pointer"
          title="Retry loading weather"
        >
          Retry
        </button>
      </div>
    );
  }

  const condition = getWeatherCondition(weather.weatherCode, weather.isDay);

  return (
    <div
      className="flex items-center gap-3 px-3.5 py-2 rounded-xl bg-[#1D2A3E]/70 border border-[#243149] shadow-sm backdrop-blur-xs select-none"
      title={`Singapore Downtown live weather (updated ${weather.fetchedAt.toLocaleTimeString('en-GB', { timeZone: 'Asia/Singapore', hour: '2-digit', minute: '2-digit' })} SGT)`}
    >
      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#00D9F5]/10 border border-[#00D9F5]/20 text-[#00D9F5] shrink-0">
        {condition.icon}
      </div>

      <div className="flex flex-col">
        <div className="flex items-baseline gap-2">
          <span className="text-base font-bold text-[#F5F7FC] font-mono-numbers">
            {weather.temperature}°C
          </span>
          <span className="text-xs font-medium text-[#c4d6ee] truncate max-w-[90px] sm:max-w-none">
            {condition.label}
          </span>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-[#91A9C8]">
          <span className="flex items-center gap-1 font-mono-numbers">
            <Droplets className="w-3 h-3 text-[#00D9F5]" aria-hidden="true" />
            {weather.humidity}% RH
          </span>
          <span className="text-[#243149]">·</span>
          <span className="text-[10px] uppercase text-[#91A9C8]">Singapore</span>
        </div>
      </div>

      <button
        onClick={() => fetchWeather(true)}
        disabled={isRefreshing}
        aria-label="Refresh Singapore weather"
        className="p-1 rounded-md text-[#91A9C8] hover:text-[#00D9F5] hover:bg-[#243149]/60 transition-colors ml-0.5 cursor-pointer disabled:opacity-50"
      >
        <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-[#00C6A2]' : ''}`} />
      </button>
    </div>
  );
};
