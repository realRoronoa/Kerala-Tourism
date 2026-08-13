// ─── Central API configuration ─────────────────────────────────────────────
// Change BASE_URL to your production server when deploying.
// For local development: http://localhost:8000
export const BASE_URL = 'http://localhost:8000';

// ─── Auth token storage key ─────────────────────────────────────────────────
export const AUTH_TOKEN_KEY = 'km_auth_token';
export const USER_ID_KEY = 'km_user_id';

// ─── Simple in-memory token store (AsyncStorage-compatible interface) ────────
// We use a module-level variable so it works on web without AsyncStorage.
let _token: string | null = null;
let _userId: string | null = null;

export function storeToken(token: string, userId: string) {
  _token = token;
  _userId = userId;
  try {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(USER_ID_KEY, userId);
  } catch (_) {}
}

export function getToken(): string | null {
  if (_token) return _token;
  try { return localStorage.getItem(AUTH_TOKEN_KEY); } catch (_) { return null; }
}

export function getUserId(): string | null {
  if (_userId) return _userId;
  try { return localStorage.getItem(USER_ID_KEY); } catch (_) { return null; }
}

export function clearToken() {
  _token = null;
  _userId = null;
  try {
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(USER_ID_KEY);
  } catch (_) {}
}

// ─── Core fetch helper ───────────────────────────────────────────────────────
export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as any)?.detail ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}
