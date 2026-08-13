import { apiFetch } from './client';

// ─── Types ───────────────────────────────────────────────────────────────────
export interface KeralaSpot {
  name: string;
  district: string;
  category: string[];
  description?: string;
  lat?: number;
  lon?: number;
  image_url?: string;
  rating?: number;
}

// ─── Explore / Itinerary API ─────────────────────────────────────────────────

/**
 * Get Kerala tourist spots, optionally filtered by preference/category.
 * @param preference - e.g. "nature", "beach", "wildlife", "mountains", "culture", "peaceful"
 */
export async function getSpots(preference?: string): Promise<KeralaSpot[]> {
  const query = preference ? `?preference=${encodeURIComponent(preference)}` : '';
  return apiFetch<KeralaSpot[]>(`/api/v1/itinerary/spots${query}`);
}
