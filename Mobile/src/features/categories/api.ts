import { api } from '@/lib/api';
import { asList } from './shape';
import type { Category } from './types';

export async function listCategories(page = 1, perPage = 20): Promise<Category[]> {
  const r = await api.get('/categories', { params: { page, per_page: perPage } });
  return asList(r.data);
}
