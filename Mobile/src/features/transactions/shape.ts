import { asCategory } from '../categories/shape';
import type { Transaction } from './types';

export function asTransaction(d: any): Transaction {
  return {
    id: Number(d?.id ?? 0),
    type: d?.type ?? 'spesa',
    description: d?.description ?? '',
    amount: Number(d?.amount ?? 0),
    date: d?.date ?? '',
    category: d?.category ? asCategory(d.category) : undefined,
    notes: d?.notes ?? null,
  };
}

export function asList(data: any): Transaction[] {
  const arr = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
  return arr.map(asTransaction);
}
