"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fetchMe, loginWithGoogle as apiLogin } from "@/lib/api";
import {
  clearAuth,
  getCurrentUser,
  getStoredAuth,
  saveAuth,
} from "@/lib/auth";
import type { AuthUser } from "@/lib/types";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  loginWithGoogle: (credential: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const stored = getStoredAuth();
    if (!stored) {
      setUser(null);
      return;
    }
    try {
      const me = await fetchMe();
      setUser(me);
    } catch {
      clearAuth();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const stored = getCurrentUser();
    if (!stored) {
      setLoading(false);
      return;
    }
    setUser(stored);
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const loginWithGoogle = useCallback(async (credential: string) => {
    const response = await apiLogin(credential);
    saveAuth(response);
    setUser(response.user);
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, loginWithGoogle, logout, refreshUser }),
    [user, loading, loginWithGoogle, logout, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
