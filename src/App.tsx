import { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { SearchBar } from './components/SearchBar';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { WeatherDetails } from './components/WeatherDetails';
import { ForecastSection } from './components/ForecastSection';
import { ApiKeyModal } from './components/ApiKeyModal';
import type { WeatherData, ForecastData, TempUnit } from './types/weather';
import { getWeatherData, getCityNameByCoords } from './services/weatherApi';
import { AlertCircle, Loader2, RefreshCw, Key } from 'lucide-react';

export function App() {
  const [city, setCity] = useState<string>('Jakarta');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [unit, setUnit] = useState<TempUnit>('C');
  const [apiKey, setApiKey] = useState<string>(() => localStorage.getItem('openweather_api_key') || '');
  const [isFallbackUsed, setIsFallbackUsed] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isApiModalOpen, setIsApiModalOpen] = useState<boolean>(false);

  const fetchWeather = useCallback(async (targetCity: string, keyToUse?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const activeKey = keyToUse !== undefined ? keyToUse : apiKey;
      const data = await getWeatherData(targetCity, activeKey);
      setWeather(data.current);
      setForecast(data.forecast);
      setIsFallbackUsed(data.isFallbackUsed);
      setCity(targetCity);
    } catch (err: any) {
      console.error('Fetch weather error:', err);
      setError(err.message || 'Terjadi kesalahan saat memuat data cuaca.');
    } finally {
      setIsLoading(false);
    }
  }, [apiKey]);

  // Initial load
  useEffect(() => {
    fetchWeather(city);
  }, []);

  // Handle Geolocation search
  const handleGeoSearch = () => {
    if (!navigator.geolocation) {
      setError('Geolokasi tidak didukung oleh browser Anda.');
      return;
    }
    setIsLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          const detectedCity = await getCityNameByCoords(lat, lon);
          await fetchWeather(detectedCity);
        } catch (err) {
          setError('Gagal mendeteksi lokasi terkini. Menampilkan cuaca Jakarta.');
          fetchWeather('Jakarta');
        }
      },
      (geoErr) => {
        console.warn('Geolocation permission denied:', geoErr);
        setError('Izin lokasi ditolak. Silakan ketik nama kota secara manual.');
        setIsLoading(false);
      }
    );
  };

  const handleSaveApiKey = (newKey: string) => {
    setApiKey(newKey);
    if (newKey) {
      localStorage.setItem('openweather_api_key', newKey);
    } else {
      localStorage.removeItem('openweather_api_key');
    }
    fetchWeather(city, newKey);
  };

  // Determine dynamic backdrop background theme
  const getBackgroundTheme = () => {
    if (!weather) return 'bg-weather-clear';
    if (weather.isNight) return 'bg-weather-clear-night';
    switch (weather.condition.toLowerCase()) {
      case 'thunderstorm':
        return 'bg-weather-thunderstorm';
      case 'rain':
      case 'drizzle':
        return 'bg-weather-rain';
      case 'snow':
        return 'bg-weather-snow';
      case 'clouds':
      case 'mist':
      case 'fog':
        return 'bg-weather-clouds';
      default:
        return 'bg-weather-clear';
    }
  };

  return (
    <div className={`min-h-screen transition-all duration-700 ease-in-out ${getBackgroundTheme()} py-6 px-4 sm:px-6 lg:px-8 font-sans`}>
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        {/* Navigation Bar */}
        <Navbar
          unit={unit}
          onToggleUnit={() => setUnit((prev) => (prev === 'C' ? 'F' : 'C'))}
          onOpenApiModal={() => setIsApiModalOpen(true)}
          isFallbackUsed={isFallbackUsed}
          hasCustomApiKey={!!apiKey}
        />

        {/* Search Bar */}
        <SearchBar
          onSearch={(searchedCity) => fetchWeather(searchedCity)}
          onGeoSearch={handleGeoSearch}
          isLoading={isLoading}
        />

        {/* Fallback Service Banner Notice */}
        {isFallbackUsed && !error && (
          <div className="w-full mb-4 px-4 py-2.5 bg-amber-500/15 border border-amber-500/30 rounded-2xl backdrop-blur-md flex items-center justify-between text-amber-200 text-xs font-medium shadow-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
              <span>
                Menggunakan <strong>Free Open-Meteo API</strong>. Masukkan API Key OpenWeatherMap Anda untuk akurasi penuh.
              </span>
            </div>
            <button
              onClick={() => setIsApiModalOpen(true)}
              className="inline-flex items-center gap-1 font-bold underline hover:text-white ml-2 shrink-0"
            >
              <Key className="w-3 h-3" />
              <span>Set Key</span>
            </button>
          </div>
        )}

        {/* Error Message Alert */}
        {error && (
          <div className="w-full mb-6 p-4 bg-rose-500/20 border border-rose-500/40 rounded-2xl backdrop-blur-md flex items-center justify-between text-rose-200 text-sm shadow-lg">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => fetchWeather(city)}
              className="p-1.5 bg-rose-500/30 hover:bg-rose-500/50 rounded-xl transition-all ml-2"
              title="Coba Lagi"
            >
              <RefreshCw className="w-4 h-4 text-white" />
            </button>
          </div>
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="w-full py-20 flex flex-col items-center justify-center text-blue-200 gap-3">
            <Loader2 className="w-12 h-12 animate-spin text-blue-400" />
            <p className="text-sm font-semibold tracking-wide animate-pulse">
              Memuat data cuaca real-time untuk {city}...
            </p>
          </div>
        )}

        {/* Main Content when loaded */}
        {!isLoading && weather && forecast && (
          <main className="w-full flex flex-col items-center animate-fade-in">
            {/* Main Weather Card */}
            <CurrentWeatherCard weather={weather} unit={unit} />

            {/* Weather Metrics Grid */}
            <WeatherDetails weather={weather} />

            {/* 5-Day & Hourly Forecast */}
            <ForecastSection forecast={forecast} unit={unit} />
          </main>
        )}

        {/* Footer */}
        <footer className="w-full py-6 text-center text-xs text-slate-400 font-medium border-t border-white/10 mt-8">
          <p>
            WeatherPulse &copy; {new Date().getFullYear()} — Powering real-time weather insights via OpenWeatherMap & Open-Meteo API.
          </p>
        </footer>
      </div>

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        currentApiKey={apiKey}
        onSaveApiKey={handleSaveApiKey}
      />
    </div>
  );
}

export default App;
