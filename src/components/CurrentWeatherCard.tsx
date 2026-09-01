import React from 'react';
import type { WeatherData, TempUnit } from '../types/weather';
import { MapPin, Calendar, ArrowUp, ArrowDown } from 'lucide-react';

interface CurrentWeatherCardProps {
  weather: WeatherData;
  unit: TempUnit;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({ weather, unit }) => {
  const formatTemp = (celsius: number) => {
    if (unit === 'F') {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return celsius;
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl glass-card p-6 md:p-8 text-white shadow-2xl transition-all border border-white/20">
      {/* Background Glow Effect */}
      <div className="absolute -top-24 -right-24 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left Side: Location & Temperature Info */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left w-full md:w-auto">
          {/* Location Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/15 border border-white/20 backdrop-blur-md mb-3">
            <MapPin className="w-4 h-4 text-blue-300 animate-bounce-slow" />
            <span className="text-sm font-semibold tracking-wide">
              {weather.city}, {weather.country}
            </span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1.5 text-xs text-slate-300 mb-4 font-medium">
            <Calendar className="w-3.5 h-3.5" />
            <span>{weather.date}</span>
          </div>

          {/* Main Temperature Display */}
          <div className="flex items-baseline justify-center md:justify-start gap-2 my-1">
            <span className="text-6xl md:text-7xl font-extrabold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-blue-100 drop-shadow-md">
              {formatTemp(weather.temp)}°
            </span>
            <span className="text-2xl md:text-3xl font-bold text-blue-300">
              {unit}
            </span>
          </div>

          {/* Weather Description */}
          <p className="text-lg md:text-xl font-semibold capitalize text-blue-100 mt-1">
            {weather.description}
          </p>

          {/* Feels like & Temp min/max */}
          <div className="flex items-center gap-4 text-xs font-medium text-slate-200 mt-4 bg-black/10 py-2 px-4 rounded-xl border border-white/10">
            <span>Terasa: <strong>{formatTemp(weather.feelsLike)}°{unit}</strong></span>
            <span className="text-white/30">|</span>
            <span className="flex items-center gap-0.5 text-emerald-300">
              <ArrowUp className="w-3 h-3" /> {formatTemp(weather.tempMax)}°
            </span>
            <span className="flex items-center gap-0.5 text-rose-300">
              <ArrowDown className="w-3 h-3" /> {formatTemp(weather.tempMin)}°
            </span>
          </div>
        </div>

        {/* Right Side: Real-Time Weather Icon */}
        <div className="flex flex-col items-center justify-center p-4">
          <div className="relative group">
            <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-2xl group-hover:bg-blue-400/40 transition-all duration-500" />
            <img
              src={weather.iconUrl}
              alt={weather.description}
              className="relative w-36 h-36 md:w-44 md:h-44 object-contain filter drop-shadow-2xl animate-float"
              onError={(e) => {
                // Fallback standard icon if image fails to load
                (e.target as HTMLImageElement).src = 'https://openweathermap.org/img/wn/02d@4x.png';
              }}
            />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300 px-3 py-1 bg-white/10 rounded-full border border-white/15 backdrop-blur-sm shadow-sm">
            {weather.condition}
          </span>
        </div>
      </div>
    </div>
  );
};
