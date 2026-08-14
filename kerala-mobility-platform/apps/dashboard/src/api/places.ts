import type { Place } from '../types/place';
import mockData from '../mock/kerala_places.json';

/**
 * Fetch places for the admin dashboard.
 * Tries the backend API first; if unavailable, falls back to the bundled mock JSON.
 */
export async function fetchDashboardPlaces(): Promise<Place[]> {
  try {
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'}/api/v1/places`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data: Place[] = await response.json();
    if (Array.isArray(data) && data.length) return data;
    throw new Error('Empty data');
  } catch (e) {
    console.warn('[Dashboard Places] Falling back to mock data', e);
    return mockData;
  }
}
