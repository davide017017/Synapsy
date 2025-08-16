import type { Category } from '../categories/types';

export type Transaction = {
  id: number;
  type: 'entrata' | 'spesa';
  description: string;
  amount: number;
  date: string;
  category?: Category;
  notes?: string | null;
};
