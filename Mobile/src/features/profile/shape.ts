import type { Profile } from './types';

export function asProfile(d: any): Profile {
  return {
    id: Number(d?.id ?? 0),
    name: d?.name ?? '',
    email: d?.email ?? '',
  };
}
