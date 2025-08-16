// src/lib/api.ts
// ─────────────────────────────────────────────────────────────────────────────
// Axios centralizzato: bearer header + auto-refresh (se disponibile)
// ─────────────────────────────────────────────────────────────────────────────
import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import { ENV } from './env';
import {
  getAccessToken, setAccessToken, clearTokens,
  getRefreshToken, setRefreshToken
} from './tokenStorage';

// ─── Istanza ─────────────────────────────────────────────────────────────────
export const api = axios.create({
  baseURL: ENV.API_BASE_URL,   // deve già includere /api/v1
  timeout: 15000,
  withCredentials: false,      // niente cookie su web → meno CORS
  headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
});

// ─── Refresh guard (evita race) ──────────────────────────────────────────────
let refreshing: Promise<string | null> | null = null;
async function refreshAccessToken(): Promise<string | null> {
  if (!ENV.REFRESH_PATH) return null;
  const rt = await getRefreshToken();
  if (!rt) return null;

  if (!refreshing) {
    refreshing = (async () => {
      try {
        // Preferisci header Bearer; fallback body {refresh_token}
        const res = await axios.post(
          ENV.API_BASE_URL + ENV.REFRESH_PATH,
          { refresh_token: rt },
          { headers: { [ENV.TOKEN_HEADER]: `Bearer ${rt}` } }
        );
        const newAccess = res.data?.access_token || res.data?.token;
        const newRefresh = res.data?.refresh_token; // opzionale
        if (newAccess) await setAccessToken(newAccess);
        if (newRefresh) await setRefreshToken(newRefresh);
        return newAccess ?? null;
      } catch {
        await clearTokens();
        return null;
      } finally {
        refreshing = null;
      }
    })();
  }
  return refreshing;
}

// ─── Request: attach bearer ──────────────────────────────────────────────────
api.interceptors.request.use(async (cfg) => {
  const t = await getAccessToken();
  if (t) {
    cfg.headers = cfg.headers ?? {};
    cfg.headers[ENV.TOKEN_HEADER] = `Bearer ${t}`;
  }
  return cfg;
});

// ─── Response: 401 → tenta refresh una sola volta ────────────────────────────
api.interceptors.response.use(
  (r) => r,
  async (err: AxiosError) => {
    const original = err.config as (AxiosRequestConfig & { _retry?: boolean });
    const status = err.response?.status;

    if (status === 401 && !original?._retry) {
      original._retry = true;
      const newAccess = await refreshAccessToken();
      if (newAccess) {
        original.headers = original.headers ?? {};
        original.headers[ENV.TOKEN_HEADER] = `Bearer ${newAccess}`;
        return api.request(original);
      }
    }
    throw err;
  }
);
