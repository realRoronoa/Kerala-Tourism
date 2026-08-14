import { apiFetch, storeToken } from './client';

// ─── Types ───────────────────────────────────────────────────────────────────
export interface UserResponse {
  id: number;
  email: string;
  full_name: string | null;
  role: string;
  created_at: string;
  is_active: boolean;
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name?: string;
}

export interface LoginPayload {
  username: string; // OAuth2 form uses "username" field
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

// ─── Auth API calls ──────────────────────────────────────────────────────────

/**
 * Register a new user with email + password + full name.
 * The backend auto-assigns role="user".
 */
export async function registerUser(payload: RegisterPayload): Promise<UserResponse> {
  return apiFetch<UserResponse>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Exchange a Firebase ID token for a backend JWT session token.
 * The backend verifies the Firebase token, auto‑creates a user if needed,
 * and returns a JWT used for all subsequent API calls.
 */
export async function loginWithFirebaseToken(idToken: string) {
  // Call the backend endpoint that verifies the Firebase token
  const data = await apiFetch<TokenResponse>('/api/v1/auth/firebase-login', {
    method: 'POST',
    body: JSON.stringify({ id_token: idToken }),
    headers: { 'Content-Type': 'application/json' },
  });
  // Persist the JWT for future requests
  storeToken(data.access_token, `fb_${Date.now()}`);
  return data;
}
  return apiFetch<UserResponse>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

/**
 * Login with email + password (OAuth2 form format).
 * Stores returned token automatically.
 */
export async function loginUser(payload: LoginPayload): Promise<TokenResponse> {
  // OAuth2 login requires form-urlencoded
  const res = await fetch(`${(await import('./client')).BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ username: payload.username, password: payload.password }).toString(),
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as any)?.detail ?? `HTTP ${res.status}`);
  }

  const data: TokenResponse = await res.json();
  return data;
}

/**
 * Get current user's profile (requires valid token).
 */
export async function getCurrentUser(): Promise<UserResponse> {
  return apiFetch<UserResponse>('/api/v1/auth/me');
}
