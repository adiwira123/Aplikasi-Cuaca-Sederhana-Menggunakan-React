import React, { useState } from 'react';
import type { ForecastData, TempUnit } from '../types/weather';
import { Calendar, Clock, Umbrella } from 'lucide-react';

interface ForecastSectionProps {
  forecast: ForecastData;
  unit: TempUnit;
}

export const ForecastSection: React.FC<ForecastSectionProps> = ({ forecast, unit }) => {
  const [activeTab, setActiveTab] = useState<'daily' | 'hourly'>('daily');

  const formatTemp = (celsius: number) => {
    if (unit === 'F') {
      return Math.round((celsius * 9) / 5 + 32);
    }
    return celsius;
  };

  const list = activeTab === 'daily' ? forecast.daily : forecast.hourly;

  return (
    <div className="w-full my-6 glass-card p-5 md:p-6 rounded-3xl border border-white/15 shadow-xl">
      {/* Header & Tab Buttons */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
        <h3 className="text-lg font-bold text-white flex items-center gap-2">
          {activeTab === 'daily' ? <Calendar className="w-5 h-5 text-blue-400" /> : <Clock className="w-5 h-5 text-blue-400" />}
          <span>Prakiraan Cuaca</span>
        </h3>

        <div className="flex items-center p-1 bg-white/10 rounded-xl border border-white/10 backdrop-blur-sm self-stretch sm:self-auto">
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'daily'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            5 Hari
          </button>
          <button
            onClick={() => setActiveTab('hourly')}
            className={`flex-1 sm:flex-initial px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeTab === 'hourly'
                ? 'bg-blue-600 text-white shadow-md'
                : 'text-slate-300 hover:text-white'
            }`}
          >
            Per Jam
          </button>
        </div>
      </div>

      {/* Forecast Cards Horizontal Scroll */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 overflow-x-auto pb-2 no-scrollbar">
        {list.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-between p-3.5 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all hover:scale-105 shadow-sm text-white"
          >
            <div className="text-center">
              <p className="text-xs font-semibold text-slate-300">
                {activeTab === 'daily' ? item.dayName : item.time}
              </p>
              <p className="text-[10px] text-slate-400 font-medium">
                {item.date}
              </p>
            </div>

            <img
              src={item.iconUrl}
              alt={item.description}
              className="w-14 h-14 object-contain filter drop-shadow-md my-1"
            />

            <div className="text-center w-full">
              <p className="text-base font-bold text-white">
                {formatTemp(item.temp)}°{unit}
              </p>

              {activeTab === 'daily' && (
                <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-300 mt-0.5">
                  <span className="text-emerald-300">{formatTemp(item.tempMax)}°</span>
                  <span>/</span>
                  <span className="text-rose-300">{formatTemp(item.tempMin)}°</span>
                </div>
              )}

              <p className="text-[10px] capitalize text-slate-300 truncate mt-1 max-w-[100px] mx-auto">
                {item.description}
              </p>

              {item.pop > 0 && (
                <div className="flex items-center justify-center gap-1 text-[10px] text-cyan-300 mt-1 font-medium">
                  <Umbrella className="w-3 h-3" />
                  <span>{item.pop}%</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
