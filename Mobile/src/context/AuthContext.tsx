// src/context/AuthContext.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Auth: login/logout/restore con tokenStorage + chiamata /me
// ─────────────────────────────────────────────────────────────────────────────
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { tokenStorage } from '@/lib/api';
import { login as apiLogin, logout as apiLogout, me } from '@/features/auth/api';
import type { User } from '@/features/auth/types';

type AuthContextValue = {
  loading: boolean;
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // ─── Restore ───────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const t = await tokenStorage.get();
      if (t) {
        setToken(t);
        try { setUser(await me()); } catch { await apiLogout(); }
      }
      setLoading(false);
    })();
  }, []);

  // ─── Login ─────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const u = await apiLogin(email, password);
      setToken(await tokenStorage.get());
      setUser(u);
    } finally {
      setLoading(false);
    }
  };

  // ─── Logout ────────────────────────────────────────────────────────────────
  const logout = async () => {
    setLoading(true);
    try {
      await apiLogout();
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ─── Me manuale ────────────────────────────────────────────────────────────
  const refreshMe = async () => { setUser(await me()); };

  const value = useMemo(() => ({ loading, token, user, login, logout, refreshMe }),
    [loading, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
