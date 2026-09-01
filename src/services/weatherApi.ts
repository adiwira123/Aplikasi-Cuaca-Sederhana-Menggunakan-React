import type { WeatherData, ForecastData, ForecastItem } from '../types/weather';

const OWM_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const OPEN_METEO_GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const OPEN_METEO_WEATHER_URL = 'https://api.open-meteo.com/v1/forecast';

// Helper to convert WMO Weather Codes (Open-Meteo) to standard descriptions and icon codes
function mapWMOCodeToWeather(code: number): { condition: string; description: string; iconCode: string } {
  switch (code) {
    case 0:
      return { condition: 'Clear', description: 'Cerah Berawan', iconCode: '01d' };
    case 1:
    case 2:
      return { condition: 'Clear', description: 'Cerah Berawan', iconCode: '02d' };
    case 3:
      return { condition: 'Clouds', description: 'Berawan Tebal', iconCode: '04d' };
    case 45:
    case 48:
      return { condition: 'Atmosphere', description: 'Kabut Berembun', iconCode: '50d' };
    case 51:
    case 53:
    case 55:
      return { condition: 'Drizzle', description: 'Gerimis Halus', iconCode: '09d' };
    case 61:
    case 63:
    case 65:
      return { condition: 'Rain', description: 'Hujan Sedang', iconCode: '10d' };
    case 71:
    case 73:
    case 75:
    case 77:
      return { condition: 'Snow', description: 'Hujan Salju', iconCode: '13d' };
    case 80:
    case 81:
    case 82:
      return { condition: 'Rain', description: 'Hujan Lebat', iconCode: '10d' };
    case 95:
    case 96:
    case 99:
      return { condition: 'Thunderstorm', description: 'Badai Petir', iconCode: '11d' };
    default:
      return { condition: 'Clouds', description: 'Berawan', iconCode: '03d' };
  }
}

// Fetch via OpenWeatherMap
async function fetchOpenWeatherMap(city: string, apiKey: string): Promise<{ current: WeatherData; forecast: ForecastData }> {
  // Current Weather
  const res = await fetch(`${OWM_BASE_URL}/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=id`);
  if (!res.ok) {
    if (res.status === 401) {
      throw new Error('API Key OpenWeatherMap tidak valid. Mengalihkan ke Open-Meteo...');
    }
    if (res.status === 404) {
      throw new Error(`Kota "${city}" tidak ditemukan.`);
    }
    throw new Error(`Gagal mengambil data cuaca: HTTP ${res.status}`);
  }
  const data = await res.json();

  // 5 Day / 3 Hour Forecast
  const forecastRes = await fetch(`${OWM_BASE_URL}/forecast?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric&lang=id`);
  const forecastJson = await forecastRes.json();

  const now = new Date();
  const isNight = data.weather[0].icon.endsWith('n');

  const current: WeatherData = {
    city: data.name,
    country: data.sys.country,
    temp: Math.round(data.main.temp),
    feelsLike: Math.round(data.main.feels_like),
    tempMin: Math.round(data.main.temp_min),
    tempMax: Math.round(data.main.temp_max),
    humidity: data.main.humidity,
    windSpeed: Math.round(data.wind.speed * 3.6), // m/s to km/h
    windDirection: data.wind.deg || 0,
    pressure: data.main.pressure,
    visibility: Math.round((data.visibility || 10000) / 1000), // km
    condition: data.weather[0].main,
    description: data.weather[0].description,
    iconCode: data.weather[0].icon,
    iconUrl: `https://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png`,
    isNight,
    sunrise: new Date(data.sys.sunrise * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    sunset: new Date(data.sys.sunset * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    timezone: data.timezone,
  };

  const hourly: ForecastItem[] = [];
  const dailyMap: Record<string, ForecastItem> = {};

  if (forecastJson.list && Array.isArray(forecastJson.list)) {
    forecastJson.list.slice(0, 8).forEach((item: any) => {
      const itemDate = new Date(item.dt * 1000);
      hourly.push({
        dt: item.dt,
        date: itemDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        time: itemDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dayName: itemDate.toLocaleDateString('id-ID', { weekday: 'short' }),
        temp: Math.round(item.main.temp),
        tempMin: Math.round(item.main.temp_min),
        tempMax: Math.round(item.main.temp_max),
        condition: item.weather[0].main,
        description: item.weather[0].description,
        iconUrl: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
        humidity: item.main.humidity,
        windSpeed: Math.round(item.wind.speed * 3.6),
        pop: Math.round((item.pop || 0) * 100),
      });
    });

    // Group daily items (1 per day around 12:00)
    forecastJson.list.forEach((item: any) => {
      const itemDate = new Date(item.dt * 1000);
      const dateStr = itemDate.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' });
      const hours = itemDate.getHours();
      
      if (!dailyMap[dateStr] || Math.abs(hours - 12) < Math.abs(new Date(dailyMap[dateStr].dt * 1000).getHours() - 12)) {
        dailyMap[dateStr] = {
          dt: item.dt,
          date: dateStr,
          time: itemDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          dayName: itemDate.toLocaleDateString('id-ID', { weekday: 'short' }),
          temp: Math.round(item.main.temp),
          tempMin: Math.round(item.main.temp_min),
          tempMax: Math.round(item.main.temp_max),
          condition: item.weather[0].main,
          description: item.weather[0].description,
          iconUrl: `https://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`,
          humidity: item.main.humidity,
          windSpeed: Math.round(item.wind.speed * 3.6),
          pop: Math.round((item.pop || 0) * 100),
        };
      }
    });
  }

  return {
    current,
    forecast: {
      hourly,
      daily: Object.values(dailyMap).slice(0, 5),
    },
  };
}

// Fetch via Open-Meteo (Free, No Key Required)
async function fetchOpenMeteo(city: string): Promise<{ current: WeatherData; forecast: ForecastData }> {
  // 1. Geocoding search
  const geoRes = await fetch(`${OPEN_METEO_GEO_URL}?name=${encodeURIComponent(city)}&count=1&language=id&format=json`);
  if (!geoRes.ok) {
    throw new Error('Gagal mencari lokasi.');
  }
  const geoData = await geoRes.json();
  if (!geoData.results || geoData.results.length === 0) {
    throw new Error(`Kota "${city}" tidak ditemukan.`);
  }

  const loc = geoData.results[0];
  const { latitude, longitude, name, country } = loc;

  // 2. Weather forecast
  const weatherRes = await fetch(
    `${OPEN_METEO_WEATHER_URL}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&hourly=temperature_2m,weather_code,precipitation_probability&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto`
  );
  if (!weatherRes.ok) {
    throw new Error('Gagal mengambil data cuaca dari Open-Meteo.');
  }
  const data = await weatherRes.json();
  const curr = data.current;
  const wmoInfo = mapWMOCodeToWeather(curr.weather_code);

  const now = new Date();
  const isNight = curr.is_day === 0;
  const iconSuffix = isNight ? 'n' : 'd';
  const iconCode = wmoInfo.iconCode.replace(/[dn]$/, iconSuffix);

  const sunriseTime = data.daily?.sunrise?.[0] ? new Date(data.daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '06:00';
  const sunsetTime = data.daily?.sunset?.[0] ? new Date(data.daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '18:00';

  const current: WeatherData = {
    city: name,
    country: country || '',
    temp: Math.round(curr.temperature_2m),
    feelsLike: Math.round(curr.apparent_temperature),
    tempMin: data.daily?.temperature_2m_min?.[0] ? Math.round(data.daily.temperature_2m_min[0]) : Math.round(curr.temperature_2m - 2),
    tempMax: data.daily?.temperature_2m_max?.[0] ? Math.round(data.daily.temperature_2m_max[0]) : Math.round(curr.temperature_2m + 2),
    humidity: Math.round(curr.relative_humidity_2m),
    windSpeed: Math.round(curr.wind_speed_10m),
    windDirection: curr.wind_direction_10m || 0,
    pressure: Math.round(curr.surface_pressure),
    visibility: 10,
    condition: wmoInfo.condition,
    description: wmoInfo.description,
    iconCode,
    iconUrl: `https://openweathermap.org/img/wn/${iconCode}@4x.png`,
    isNight,
    sunrise: sunriseTime,
    sunset: sunsetTime,
    date: now.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }),
    timezone: data.utc_offset_seconds || 0,
  };

  // Hourly (next 8 hours)
  const hourly: ForecastItem[] = [];
  if (data.hourly && data.hourly.time) {
    const currentHourIndex = data.hourly.time.findIndex((t: string) => new Date(t) >= now) || 0;
    for (let i = currentHourIndex; i < Math.min(currentHourIndex + 8, data.hourly.time.length); i++) {
      const hTime = new Date(data.hourly.time[i]);
      const hWmo = mapWMOCodeToWeather(data.hourly.weather_code[i]);
      hourly.push({
        dt: Math.floor(hTime.getTime() / 1000),
        date: hTime.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
        time: hTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dayName: hTime.toLocaleDateString('id-ID', { weekday: 'short' }),
        temp: Math.round(data.hourly.temperature_2m[i]),
        tempMin: Math.round(data.hourly.temperature_2m[i] - 1),
        tempMax: Math.round(data.hourly.temperature_2m[i] + 1),
        condition: hWmo.condition,
        description: hWmo.description,
        iconUrl: `https://openweathermap.org/img/wn/${hWmo.iconCode}@2x.png`,
        humidity: Math.round(curr.relative_humidity_2m),
        windSpeed: Math.round(curr.wind_speed_10m),
        pop: Math.round(data.hourly.precipitation_probability?.[i] || 0),
      });
    }
  }

  // Daily (5 days)
  const daily: ForecastItem[] = [];
  if (data.daily && data.daily.time) {
    for (let i = 0; i < Math.min(5, data.daily.time.length); i++) {
      const dTime = new Date(data.daily.time[i]);
      const dWmo = mapWMOCodeToWeather(data.daily.weather_code[i]);
      const dateStr = dTime.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'short' });
      daily.push({
        dt: Math.floor(dTime.getTime() / 1000),
        date: dateStr,
        time: '12:00',
        dayName: dTime.toLocaleDateString('id-ID', { weekday: 'short' }),
        temp: Math.round((data.daily.temperature_2m_max[i] + data.daily.temperature_2m_min[i]) / 2),
        tempMin: Math.round(data.daily.temperature_2m_min[i]),
        tempMax: Math.round(data.daily.temperature_2m_max[i]),
        condition: dWmo.condition,
        description: dWmo.description,
        iconUrl: `https://openweathermap.org/img/wn/${dWmo.iconCode}@2x.png`,
        humidity: Math.round(curr.relative_humidity_2m),
        windSpeed: Math.round(curr.wind_speed_10m),
        pop: 10,
      });
    }
  }

  return { current, forecast: { hourly, daily } };
}

// Geolocation helper to fetch city name by coordinates
export async function getCityNameByCoords(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=10`);
    if (res.ok) {
      const data = await res.json();
      return data.address.city || data.address.town || data.address.county || data.address.state || 'Jakarta';
    }
  } catch (err) {
    console.error('Reverse geocode error:', err);
  }
  return 'Jakarta';
}

// Master Fetch Function with Fallback
export async function getWeatherData(city: string, apiKey?: string): Promise<{ current: WeatherData; forecast: ForecastData; isFallbackUsed: boolean }> {
  if (apiKey && apiKey.trim().length > 5) {
    try {
      const result = await fetchOpenWeatherMap(city, apiKey.trim());
      return { ...result, isFallbackUsed: false };
    } catch (err: any) {
      console.warn('OpenWeatherMap API error, falling back to Open-Meteo:', err.message);
      if (err.message.includes('tidak ditemukan')) {
        throw err; // City not found, don't fallback
      }
      // Fallback to Open-Meteo if API key is invalid or request fails
      const fallbackResult = await fetchOpenMeteo(city);
      return { ...fallbackResult, isFallbackUsed: true };
    }
  }

  // No API key provided -> use free Open-Meteo
  const fallbackResult = await fetchOpenMeteo(city);
  return { ...fallbackResult, isFallbackUsed: true };
}
