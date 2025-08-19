import type { Profile } from './types';

export function asProfile(d: any): Profile {
  return {
    id: Number(d?.id ?? 0),
    name: d?.name ?? '',
    surname: d?.surname ?? '',
    username: d?.username ?? '',
    email: d?.email ?? '',
    avatar: d?.avatar ?? '',
  };
}
