import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { listTransactions } from '@/features/transactions/api';
import type { Transaction } from '@/features/transactions/types';
import { useAuth } from './AuthContext';

type Ctx = {
  items: Transaction[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const TransactionsContext = createContext<Ctx>({} as Ctx);

export const TransactionsProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { token } = useAuth();
  const [items, setItems] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setItems(await listTransactions());
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
    <TransactionsContext.Provider value={{ items, loading, error, refresh }}>
      {children}
    </TransactionsContext.Provider>
  );
};

export const useTransactions = () => useContext(TransactionsContext);
