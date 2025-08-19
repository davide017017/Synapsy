import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { getProfile } from '@/features/profile/api';
import type { Profile } from '@/features/profile/types';
import { useAuth } from './AuthContext';

type Ctx = {
  profile: Profile | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  update: (patch: Partial<Profile>) => void;
};

const UserContext = createContext<Ctx>({} as Ctx);

export const UserProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { token } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setProfile(await getProfile());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const update = useCallback((patch: Partial<Profile>) => {
    setProfile((p) => (p ? { ...p, ...patch } : p));
  }, []);

  useEffect(() => {
    if (token) refresh();
    else setProfile(null);
  }, [token, refresh]);

  return (
    <UserContext.Provider value={{ profile, loading, error, refresh, update }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
