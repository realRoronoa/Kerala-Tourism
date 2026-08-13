import { apiFetch } from './client';

// ─── Types (matching backend TripResponseSchema) ─────────────────────────────
export interface Trip {
  id: number;
  user_id: string;
  origin_lat: number;
  origin_lon: number;
  dest_lat: number;
  dest_lon: number;
  start_time: string;
  end_time: string;
  predicted_mode: string;
  confidence_score: number | null;
  verified_mode: string | null;
  purpose: string | null;
  is_verified: boolean;
}

export interface TripVerifyPayload {
  trip_id: number;
  corrected_mode: string;
  purpose?: string;
}

// ─── Trips API calls ─────────────────────────────────────────────────────────

/**
 * Fetch all unverified trips for a given user ID.
 */
export async function getUnverifiedTrips(userId: string): Promise<Trip[]> {
  return apiFetch<Trip[]>(`/api/v1/trips/unverified/${userId}`);
}

/**
 * Verify/correct a trip. Marks it as verified in the backend.
 */
export async function verifyTrip(payload: TripVerifyPayload): Promise<Trip> {
  return apiFetch<Trip>('/api/v1/trips/verify', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}
