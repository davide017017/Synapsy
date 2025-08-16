// src/context/AuthContext.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Auth: login/logout/restore con tokenStorage + chiamata /me
// ─────────────────────────────────────────────────────────────────────────────
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';
import {
  getAccessToken, setAccessToken, removeAccessToken,
  getRefreshToken, setRefreshToken, removeRefreshToken
} from '../lib/tokenStorage';

type User = { id: number; name: string; email: string };
type AuthContextValue = {
  loading: boolean;
  token: string | null;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshMe: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue>({} as AuthContextValue);

// ─── Helper ──────────────────────────────────────────────────────────────────
async function fetchMe(): Promise<User> {
  const res = await api.get<User>('/me');
  return res.data;
}

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [token, setToken]     = useState<string | null>(null);
  const [user, setUser]       = useState<User | null>(null);

  // ─── Restore ───────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const t = await getAccessToken();
      if (t) {
        setToken(t);
        try { setUser(await fetchMe()); } catch { await logout(); }
      }
      setLoading(false);
    })();
  }, []);

  // ─── Login ─────────────────────────────────────────────────────────────────
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const r = await api.post('/login', { email, password });
      const access  = r.data?.access_token || r.data?.token;
      const refresh = r.data?.refresh_token || null;
      if (access) await setAccessToken(access);
      if (refresh) await setRefreshToken(refresh);
      setToken(access ?? null);
      setUser(await fetchMe());
    } finally {
      setLoading(false);
    }
  };

  // ─── Logout ────────────────────────────────────────────────────────────────
  const logout = async () => {
    setLoading(true);
    try {
      // opzionale: await api.post('/logout').catch(() => {});
      await removeAccessToken();
      await removeRefreshToken();
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ─── Me manuale ────────────────────────────────────────────────────────────
  const refreshMe = async () => { setUser(await fetchMe()); };

  const value = useMemo(() => ({ loading, token, user, login, logout, refreshMe }),
    [loading, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
