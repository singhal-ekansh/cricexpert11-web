import type { AuthResponse, AuthUser } from "./types";

const AUTH_KEY = "cricratings_auth";

interface StoredAuth {
  access_token: string;
  user: AuthUser;
}

function readRawAuth(): string | null {
  if (typeof window === "undefined") return null;
  const fromLocal = localStorage.getItem(AUTH_KEY);
  if (fromLocal) return fromLocal;
  const fromSession = sessionStorage.getItem(AUTH_KEY);
  if (fromSession) {
    localStorage.setItem(AUTH_KEY, fromSession);
    sessionStorage.removeItem(AUTH_KEY);
    return fromSession;
  }
  return null;
}

export function getStoredAuth(): StoredAuth | null {
  try {
    const raw = readRawAuth();
    return raw ? (JSON.parse(raw) as StoredAuth) : null;
  } catch {
    return null;
  }
}

export function saveAuth(response: AuthResponse): void {
  localStorage.setItem(
    AUTH_KEY,
    JSON.stringify({
      access_token: response.access_token,
      user: response.user,
    }),
  );
}

export function clearAuth(): void {
  localStorage.removeItem(AUTH_KEY);
  sessionStorage.removeItem(AUTH_KEY);
}

export function getAccessToken(): string | null {
  return getStoredAuth()?.access_token ?? null;
}

export function getCurrentUser(): AuthUser | null {
  return getStoredAuth()?.user ?? null;
}
