// src/context/AuthContext.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Gestione auth: token + profilo
// ─────────────────────────────────────────────────────────────────────────────
import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { api, TOKEN_KEY } from '../lib/api';

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

export const AuthProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // ── boot ───────────────────────────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const t = await SecureStore.getItemAsync(TOKEN_KEY);
      if (t) {
        setToken(t);
        await refreshMeInternal(t);
      }
      setLoading(false);
    })();
  }, []);

  // ── helpers ────────────────────────────────────────────────────────────────
  const refreshMeInternal = async (t: string) => {
    const res = await api.get<User>('/me', { headers: { Authorization: `Bearer ${t}` } });
    setUser(res.data);
  };

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.post<{ token: string }>('/login', { email, password });
      const t = res.data.token;
      await SecureStore.setItemAsync(TOKEN_KEY, t);
      setToken(t);
      await refreshMeInternal(t);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshMe = async () => { if (token) await refreshMeInternal(token); };

  const value = useMemo(() => ({ loading, token, user, login, logout, refreshMe }),
    [loading, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
