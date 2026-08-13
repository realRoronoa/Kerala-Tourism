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
