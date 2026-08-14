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

export async function getWeather(
  lat = DEFAULT_LAT,
  lon = DEFAULT_LON
): Promise<WeatherData> {
  try {
    const res = await apiFetch<any>(`/api/v1/external/weather?lat=${lat}&lon=${lon}`);
    return {
      temperature: res.temperature_celsius ?? res.temperature ?? 28,
      weather_status: res.condition ?? res.weather_status ?? 'Clear',
      wind_speed: res.wind_speed_kmh ?? res.wind_speed ?? 10,
      description: res.source ?? 'Live Kerala Climate'
    };
  } catch (err) {
    // Keyless Fallback 1: Direct Open-Meteo API Call (No API Key Required!)
    try {
      const omRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
      if (omRes.ok) {
        const omData = await omRes.json();
        const curr = omData.current_weather || {};
        const code = curr.weathercode || 0;
        let status = 'Clear';
        if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) status = 'Rain';
        else if ([1, 2, 3].includes(code)) status = 'Clouds';

        return {
          temperature: curr.temperature ?? 28,
          weather_status: status,
          wind_speed: curr.windspeed ?? 10,
          description: 'Open-Meteo Keyless API'
        };
      }
    } catch (_) {}

    // Keyless Fallback 2: Default Kerala Climate Profile
    return {
      temperature: 28.5,
      weather_status: 'Clear',
      wind_speed: 12,
      description: 'Kerala Tropical Climate'
    };
  }
}

// ─── Location Search API ─────────────────────────────────────────────────────

/**
 * Search for locations in Kerala using OpenStreetMap data (Keyless).
 */
export async function searchLocation(query: string): Promise<SearchLocationResult> {
  try {
    return await apiFetch<SearchLocationResult>(
      `/api/v1/external/search-location?query=${encodeURIComponent(query)}`
    );
  } catch (err) {
    // Keyless Fallback: Direct Nominatim OpenStreetMap Search (No API Key Required!)
    try {
      const osmRes = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}+Kerala+India&format=json&limit=5`
      );
      if (osmRes.ok) {
        const osmData = await osmRes.json();
        return {
          results: osmData.map((item: any) => ({
            name: item.display_name?.split(',')[0] || query,
            district: 'Kerala',
            lat: parseFloat(item.lat || '0'),
            lon: parseFloat(item.lon || '0')
          }))
        };
      }
    } catch (_) {}

    return { results: [] };
  }
}
