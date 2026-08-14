import { apiFetch } from './client';
import type { Place } from '../types/place';
import mockData from '../mock/kerala_places.json';

/**
 * Fetch places data. In development we try the real backend first;
 * if that fails (or if the env flag forces mock) we return the bundled
 * mock JSON. This allows the mobile app and the dashboard to work
 * without any backend dependency.
 */
export async function fetchPlaces(): Promise<Place[]> {
  try {
    const data = await apiFetch<Place[]>('/api/v1/places');
    if (Array.isArray(data) && data.length) return data;
    throw new Error('Empty response');
  } catch (e) {
    console.warn('[Places] Falling back to bundled mock data', e);
    return mockData;
  }
}
