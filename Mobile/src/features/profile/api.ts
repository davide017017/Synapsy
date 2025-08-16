import { api } from '@/lib/api';
import { asProfile } from './shape';
import type { Profile } from './types';

export async function getProfile(): Promise<Profile> {
  const r = await api.get('/me');
  return asProfile(r.data);
}
