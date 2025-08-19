// ─────────────────────────────────────────────────────────────────────────────
// API client — Axios + token cross-platform (usa storage adapter)
// ─────────────────────────────────────────────────────────────────────────────

import axios from "axios";
import { ENV } from "./env";
import { storage } from "@/utils/storage";

// ── Chiave token condivisa ───────────────────────────────────────────────────
export const TOKEN_KEY = "auth:token";

// ── Token storage wrapper (unico punto di accesso) ───────────────────────────
export const tokenStorage = {
    get: () => storage.get(TOKEN_KEY),
    set: (t: string) => storage.set(TOKEN_KEY, t),
    del: () => storage.remove(TOKEN_KEY),
};

// ── Istanza Axios ────────────────────────────────────────────────────────────
export const api = axios.create({
    baseURL: ENV.API_BASE_URL,
    timeout: 15000,
});

// ── Interceptor: aggiunge header di autenticazione se presente ──────────────
api.interceptors.request.use(async (cfg) => {
    const t = await tokenStorage.get();
    if (t) {
        cfg.headers = cfg.headers ?? {};
        // es. ENV.TOKEN_HEADER = "Authorization"
        cfg.headers[ENV.TOKEN_HEADER] = t.startsWith("Bearer ") ? t : `Bearer ${t}`;
    }
    return cfg;
});

// ─────────────────────────────────────────────────────────────────────────────
