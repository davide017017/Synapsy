import { api } from '@/lib/api';
import { asList } from './shape';
import type { Transaction } from './types';

export async function listTransactions(page = 1, perPage = 20): Promise<Transaction[]> {
  const r = await api.get('/transactions', { params: { page, per_page: perPage } });
  return asList(r.data);
}
