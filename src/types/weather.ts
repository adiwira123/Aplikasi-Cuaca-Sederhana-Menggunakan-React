export interface WeatherData {
  city: string;
  country: string;
  temp: number;
  feelsLike: number;
  tempMin: number;
  tempMax: number;
  humidity: number;
  windSpeed: number; // km/h
  windDirection: number; // degrees
  pressure: number; // hPa
  uvIndex?: number;
  visibility: number; // km
  condition: string; // Clear, Clouds, Rain, Thunderstorm, Snow, Drizzle, Mist, etc.
  description: string;
  iconCode: string;
  iconUrl: string;
  isNight: boolean;
  sunrise: string;
  sunset: string;
  date: string;
  timezone: number;
}

export interface ForecastItem {
  dt: number;
  date: string;
  time: string;
  dayName: string;
  temp: number;
  tempMin: number;
  tempMax: number;
  condition: string;
  description: string;
  iconUrl: string;
  humidity: number;
  windSpeed: number;
  pop: number; // probability of precipitation (0-100%)
}

export interface ForecastData {
  hourly: ForecastItem[];
  daily: ForecastItem[];
}

export type TempUnit = 'C' | 'F';

export interface ApiSettings {
  openWeatherKey: string;
  useFallbackIfEmpty: boolean;
}
