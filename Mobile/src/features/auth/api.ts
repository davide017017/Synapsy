import { api, tokenStorage } from '@/lib/api';
import { asUser } from './shape';
import type { User } from './types';

export async function login(email: string, password: string): Promise<User> {
  const r = await api.post('/login', { email, password });
  const token = r.data?.access_token || r.data?.token;
  if (token) await tokenStorage.set(token);
  return me();
}

export async function logout(): Promise<void> {
  await api.post('/logout').catch(() => {});
  await tokenStorage.del();
}

export async function me(): Promise<User> {
  const r = await api.get('/me');
  return asUser(r.data);
}
