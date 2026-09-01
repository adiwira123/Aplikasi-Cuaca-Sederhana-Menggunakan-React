import React, { useState } from 'react';
import { Search, MapPin, X, Loader2 } from 'lucide-react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  onGeoSearch: () => void;
  isLoading: boolean;
}

const POPULAR_CITIES = ['Jakarta', 'Bandung', 'Surabaya', 'Bali', 'Tokyo', 'London'];

export const SearchBar: React.FC<SearchBarProps> = ({ onSearch, onGeoSearch, isLoading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
    }
  };

  const handlePillClick = (city: string) => {
    setQuery(city);
    onSearch(city);
  };

  return (
    <div className="w-full mb-6 flex flex-col gap-3">
      <form onSubmit={handleSubmit} className="relative w-full flex items-center">
        <div className="relative w-full">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama kota (cth: Jakarta, Tokyo, London)..."
            className="w-full pl-12 pr-12 py-3.5 bg-white/10 hover:bg-white/15 focus:bg-white/20 border border-white/20 focus:border-blue-400/80 rounded-2xl text-white placeholder-slate-300 font-medium text-base outline-none backdrop-blur-md transition-all shadow-lg"
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 pointer-events-none" />
          
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white p-1 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Current Location Button */}
        <button
          type="button"
          onClick={onGeoSearch}
          disabled={isLoading}
          className="ml-3 p-3.5 bg-blue-600 hover:bg-blue-500 active:scale-95 text-white rounded-2xl border border-blue-400/30 transition-all shadow-lg flex items-center justify-center disabled:opacity-50"
          title="Gunakan Lokasi Saya Saat Ini"
        >
          {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <MapPin className="w-5 h-5" />}
        </button>
      </form>

      {/* Popular City Quick Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-semibold text-slate-300 whitespace-nowrap">Populer:</span>
        {POPULAR_CITIES.map((city) => (
          <button
            key={city}
            onClick={() => handlePillClick(city)}
            className="px-3 py-1 bg-white/10 hover:bg-white/20 border border-white/10 rounded-full text-xs font-medium text-slate-200 hover:text-white whitespace-nowrap transition-all shadow-sm active:scale-95"
          >
            {city}
          </button>
        ))}
      </div>
    </div>
  );
};
