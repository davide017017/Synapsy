import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { listCategories } from '@/features/categories/api';
import type { Category } from '@/features/categories/types';
import { useAuth } from './AuthContext';

type Ctx = {
  items: Category[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const CategoriesContext = createContext<Ctx>({} as Ctx);

export const CategoriesProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { token } = useAuth();
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await listCategories());
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) refresh();
    else setItems([]);
  }, [token, refresh]);

  return (
    <CategoriesContext.Provider value={{ items, loading, error, refresh }}>
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategories = () => useContext(CategoriesContext);
