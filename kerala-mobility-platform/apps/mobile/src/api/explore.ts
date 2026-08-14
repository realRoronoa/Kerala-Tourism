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

// ─── AI Itinerary Generation ──────────────────────────────────────────────────

export interface ItineraryRequest {
  user_request: string;
  days?: number;
  preferred_categories?: string[];
  origin_city?: string;
}

export interface ItineraryDay {
  day: number;
  theme: string;
  activities: {
    time: string;
    location_name: string;
    description: string;
    lat: number;
    lon: number;
    duration_hours: number;
  }[];
}

export interface GeneratedItinerary {
  itinerary_title: string;
  destination: string;
  total_days: number;
  summary: string;
  days: ItineraryDay[];
  spots_used?: {
    rank: number;
    name: string;
    score: number;
    lat: number;
    lon: number;
    district: string;
  }[];
}

export async function generateItinerary(payload: ItineraryRequest): Promise<GeneratedItinerary> {
  return apiFetch<GeneratedItinerary>('/api/v1/itinerary/generate', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
