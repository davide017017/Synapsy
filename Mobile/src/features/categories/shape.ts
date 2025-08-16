import type { Category } from './types';

export function asCategory(d: any): Category {
  return {
    id: Number(d?.id ?? 0),
    name: d?.name ?? '',
    type: d?.type ?? 'spesa',
    color: d?.color ?? '#000000',
    icon: d?.icon ?? '',
  };
}

export function asList(data: any): Category[] {
  const arr = Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : [];
  return arr.map(asCategory);
}
