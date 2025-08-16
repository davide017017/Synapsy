import type { User } from './types';

export function asUser(d: any): User {
  return {
    id: Number(d?.id ?? 0),
    name: d?.name ?? '',
    email: d?.email ?? '',
  };
}
