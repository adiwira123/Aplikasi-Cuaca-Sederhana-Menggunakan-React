import React from 'react';
import type { WeatherData } from '../types/weather';
import { Droplets, Wind, Gauge, Eye, Sunrise, Sunset } from 'lucide-react';

interface WeatherDetailsProps {
  weather: WeatherData;
}

export const WeatherDetails: React.FC<WeatherDetailsProps> = ({ weather }) => {
  const details = [
    {
      id: 'humidity',
      label: 'Kelembaban',
      value: `${weather.humidity}%`,
      subtext: weather.humidity > 70 ? 'Kelembaban Tinggi' : weather.humidity < 30 ? 'Kelembaban Rendah' : 'Kelembaban Ideal',
      icon: Droplets,
      color: 'from-blue-500 to-cyan-400',
    },
    {
      id: 'wind',
      label: 'Kecepatan Angin',
      value: `${weather.windSpeed} km/h`,
      subtext: `Arah: ${weather.windDirection}°`,
      icon: Wind,
      color: 'from-teal-500 to-emerald-400',
    },
    {
      id: 'pressure',
      label: 'Tekanan Udara',
      value: `${weather.pressure} hPa`,
      subtext: weather.pressure > 1013 ? 'Tekanan Tinggi' : 'Tekanan Rendah',
      icon: Gauge,
      color: 'from-purple-500 to-indigo-400',
    },
    {
      id: 'visibility',
      label: 'Visibilitas',
      value: `${weather.visibility} km`,
      subtext: weather.visibility >= 10 ? 'Jarak Pandang Sangat Baik' : 'Pandangan Terbatas',
      icon: Eye,
      color: 'from-amber-500 to-orange-400',
    },
    {
      id: 'sunrise',
      label: 'Matahari Terbit',
      value: weather.sunrise,
      subtext: 'Pagi Hari',
      icon: Sunrise,
      color: 'from-amber-400 to-yellow-500',
    },
    {
      id: 'sunset',
      label: 'Matahari Terbenam',
      value: weather.sunset,
      subtext: 'Sore/Malam Hari',
      icon: Sunset,
      color: 'from-rose-500 to-pink-500',
    },
  ];

  return (
    <div className="w-full my-6">
      <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
        <span>Detail Parameter Cuaca</span>
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
        {details.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.id}
              className="glass-card p-4 rounded-2xl border border-white/15 text-white hover:border-white/30 transition-all hover:scale-[1.02] shadow-md flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-300">{item.label}</span>
                <div className={`p-2 rounded-xl bg-gradient-to-tr ${item.color} text-white shadow-sm`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <p className="text-xl md:text-2xl font-bold tracking-tight text-white mb-0.5">
                  {item.value}
                </p>
                <p className="text-[11px] text-slate-300 font-medium truncate">
                  {item.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
