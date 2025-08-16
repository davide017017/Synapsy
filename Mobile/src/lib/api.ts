// ─────────────────────────────────────────────────────────────────────────────
// src/lib/api.ts — client Axios per API a token (Bearer)
// • Evita problemi CORS sul web (no cookie, no withCredentials)
// • Evita "localhost" sui device fisici (usa IP della LAN nel .env)
// • Log leggibili in DEV + handler 401 centralizzato
// ─────────────────────────────────────────────────────────────────────────────

import axios, { AxiosError } from "axios";
import { Platform } from "react-native";
import { getEnv } from "./env";

// ─────────────────────────────────────────────────────────────────────────────
// 1) Normalizza la BASE URL
//    • Sul WEB: usa esattamente ciò che hai in .env (CORS lato backend).
//    • Su device FISICI: NON usare "localhost": metti l'IP LAN nel .env
//      Esempio .env (già usato da te):
//      API_BASE_URL=http://192.168.0.111:8484/api
//    • Su emulatore Android: se proprio hai "localhost", mappa a 10.0.2.2
// ─────────────────────────────────────────────────────────────────────────────
function normalizeBaseURL(raw: string) {
    try {
        const u = new URL(raw);
        // Android emulator: "localhost" -> "10.0.2.2"
        if (Platform.OS === "android" && (u.hostname === "localhost" || u.hostname === "127.0.0.1")) {
            u.hostname = "10.0.2.2";
        }
        // Device fisici (iOS/Android): evita localhost (usa IP LAN nel .env)
        // Qui non forziamo, assumiamo che tu abbia già messo l'IP corretto.
        // (Se restasse 'localhost' su device fisico avrai "Network request failed")
        return u.toString().replace(/\/+$/, ""); // niente trailing slash
    } catch {
        // Se non è una URL valida, lascio com'è
        return raw.replace(/\/+$/, "");
    }
}

const BASE_URL = normalizeBaseURL(getEnv().API_BASE_URL);

// ─────────────────────────────────────────────────────────────────────────────
// 2) Istanza Axios
//    • withCredentials: false → niente cookie/CSRF → CORS semplificato
//    • Header base: JSON
//    • timeout: per evitare richieste appese
// ─────────────────────────────────────────────────────────────────────────────
const api = axios.create({
    baseURL: BASE_URL,
    withCredentials: false, // fondamentale per evitare CORS con cookie
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
    timeout: 15000,
});

// ─────────────────────────────────────────────────────────────────────────────
// 3) Token Bearer (login/logout)
// ─────────────────────────────────────────────────────────────────────────────
export const setAuthToken = (token: string | null) => {
    if (token) {
        api.defaults.headers.common.Authorization = `Bearer ${token}`;
    } else {
        delete api.defaults.headers.common.Authorization;
    }
};

// ─────────────────────────────────────────────────────────────────────────────
// 4) Intercettori
//    • Log in DEV (richieste/risposte/errori) per debug rapido
//    • Logout auto su 401
// ─────────────────────────────────────────────────────────────────────────────
export const registerInterceptor = (logout: () => void) => {
    api.interceptors.request.use((cfg) => {
        if (__DEV__) {
            // Log sintetico
            console.log(
                "→",
                cfg.method?.toUpperCase(),
                cfg.baseURL ? cfg.baseURL.replace(/^https?:\/\//, "") : "",
                cfg.url,
                cfg.params ?? "",
            );
        }
        return cfg;
    });

    api.interceptors.response.use(
        (res) => {
            if (__DEV__) {
                console.log("←", res.status, res.config.url);
            }
            return res;
        },
        (err: AxiosError) => {
            const status = err.response?.status;
            if (status === 401) {
                logout?.();
            }
            if (__DEV__) {
                console.log("×", status ?? "ERR", err.config?.url, (err.response as any)?.data ?? err.message);
            }
            return Promise.reject(err);
        },
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// 5) (Opzionale) Ping per testare rapidamente conness./CORS da Web
//     Esempio d'uso: await ping();
// ─────────────────────────────────────────────────────────────────────────────
export async function ping() {
    // se la tua API ha /health oppure /api/health, cambialo qui
    return api
        .get("/health")
        .then((r) => r.data)
        .catch((e) => {
            throw e;
        });
}

export default api;
