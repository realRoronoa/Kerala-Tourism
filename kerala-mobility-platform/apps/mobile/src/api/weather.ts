import { apiFetch } from './client';

// ─── Types ───────────────────────────────────────────────────────────────────
export interface WeatherData {
  temperature: number;        // °C
  weather_status: string;     // "Clear" | "Rain" | "Clouds" | etc.
  wind_speed: number;         // km/h
  description?: string;
}

export interface SearchLocationResult {
  results: Array<{
    name: string;
    district: string;
    lat: number;
    lon: number;
  }>;
}

// Default Kerala coordinates (Thiruvananthapuram)
const DEFAULT_LAT = 8.5241;
const DEFAULT_LON = 76.9366;

// ─── Weather API ─────────────────────────────────────────────────────────────

/**
 * Get current weather for Kerala (defaults to Thiruvananthapuram).
 */
export async function getWeather(
  lat = DEFAULT_LAT,
  lon = DEFAULT_LON
): Promise<WeatherData> {
  return apiFetch<WeatherData>(`/api/v1/external/weather?lat=${lat}&lon=${lon}`);
}

// ─── Location Search API ─────────────────────────────────────────────────────

/**
 * Search for locations in Kerala using OpenStreetMap data.
 */
export async function searchLocation(query: string): Promise<SearchLocationResult> {
  return apiFetch<SearchLocationResult>(
    `/api/v1/external/search-location?query=${encodeURIComponent(query)}`
  );
}
