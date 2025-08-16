// src/lib/api.ts
// ── Axios + token cross-platform ────────────────────────────────────────
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ENV } from './env';

const TOKEN_KEY = 'synapsi_access';

// Web fallback: sessionStorage (RN-web) + in-memory
let memToken: string | null = null;
const web = typeof window !== 'undefined';
const storage = {
  get: async () => (web ? sessionStorage.getItem(TOKEN_KEY) : (await SecureStore.getItemAsync(TOKEN_KEY)) ?? memToken),
  set: async (t: string) => {
    memToken = t;
    if (web) sessionStorage.setItem(TOKEN_KEY, t);
    else await SecureStore.setItemAsync(TOKEN_KEY, t);
  },
  del: async () => {
    memToken = null;
    if (web) sessionStorage.removeItem(TOKEN_KEY);
    else await SecureStore.deleteItemAsync(TOKEN_KEY);
  },
};

export { storage as tokenStorage, TOKEN_KEY };

export const api = axios.create({ baseURL: ENV.API_BASE_URL, timeout: 15000 });

api.interceptors.request.use(async (cfg) => {
  const t = await storage.get();
  if (t) {
    cfg.headers = cfg.headers ?? {};
    cfg.headers[ENV.TOKEN_HEADER] = `Bearer ${t}`;
  }
  return cfg;
});
