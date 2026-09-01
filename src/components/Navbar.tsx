import React from 'react';
import { CloudSun, Key, Thermometer } from 'lucide-react';
import type { TempUnit } from '../types/weather';

interface NavbarProps {
  unit: TempUnit;
  onToggleUnit: () => void;
  onOpenApiModal: () => void;
  isFallbackUsed: boolean;
  hasCustomApiKey: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  unit,
  onToggleUnit,
  onOpenApiModal,
  isFallbackUsed,
  hasCustomApiKey,
}) => {
  return (
    <header className="w-full flex items-center justify-between py-4 px-6 glass-nav rounded-2xl mb-6 shadow-lg backdrop-blur-md">
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-xl text-white shadow-md shadow-blue-500/30 animate-pulse-slow">
          <CloudSun className="w-7 h-7" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200 tracking-tight">
            Weather<span className="text-blue-400">Pulse</span>
          </h1>
          <p className="text-xs text-slate-300 font-medium">Real-Time Forecast</p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {/* API Status Badge */}
        <button
          onClick={onOpenApiModal}
          className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all border ${
            hasCustomApiKey
              ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/30'
              : isFallbackUsed
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 hover:bg-amber-500/30'
              : 'bg-blue-500/20 text-blue-300 border-blue-500/40 hover:bg-blue-500/30'
          }`}
          title="Klik untuk mengatur OpenWeatherMap API Key"
        >
          <Key className="w-3.5 h-3.5" />
          <span>{hasCustomApiKey ? 'OpenWeather API' : 'Free Demo API'}</span>
        </button>

        {/* Temperature Unit Toggle */}
        <button
          onClick={onToggleUnit}
          className="flex items-center gap-1 px-3 py-1.5 bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 text-white text-sm font-semibold rounded-xl transition-all shadow-inner"
          title={`Ubah ke °${unit === 'C' ? 'F' : 'C'}`}
        >
          <Thermometer className="w-4 h-4 text-blue-300" />
          <span>°{unit}</span>
        </button>

        {/* API Key Modal Mobile Button */}
        <button
          onClick={onOpenApiModal}
          className="sm:hidden p-2 bg-white/10 hover:bg-white/20 active:scale-95 border border-white/15 text-white rounded-xl transition-all"
          title="API Key"
        >
          <Key className="w-4 h-4 text-amber-300" />
        </button>
      </div>
    </header>
  );
};
