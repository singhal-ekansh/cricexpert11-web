import type { AuthResponse, AuthUser } from "./types";

const AUTH_KEY = "cricratings_auth";

interface StoredAuth {
  access_token: string;
  user: AuthUser;
}

export function getStoredAuth(): StoredAuth | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(AUTH_KEY);
    return raw ? (JSON.parse(raw) as StoredAuth) : null;
  } catch {
    return null;
  }
}

export function saveAuth(response: AuthResponse): void {
  sessionStorage.setItem(
    AUTH_KEY,
    JSON.stringify({
      access_token: response.access_token,
      user: response.user,
    }),
  );
}

export function clearAuth(): void {
  sessionStorage.removeItem(AUTH_KEY);
}

export function getAccessToken(): string | null {
  return getStoredAuth()?.access_token ?? null;
}

export function getCurrentUser(): AuthUser | null {
  return getStoredAuth()?.user ?? null;
}
