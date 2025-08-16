// src/lib/env.ts
// ─────────────────────────────────────────────────────────────────────────────
// Expo extra → ENV tipizzato
// ─────────────────────────────────────────────────────────────────────────────
import Constants from 'expo-constants';

type Extra = {
  APP_ENV: string;
  API_BASE_URL: string;   // Deve già includere /api/v1 (es: http://192.168.0.111:8484/api/v1)
  TOKEN_HEADER: string;   // "Authorization"
  REFRESH_PATH?: string;  // opzionale (es: "/refresh")
};

const extra = (Constants.expoConfig?.extra ?? {}) as Partial<Extra>;

export const ENV: Extra = {
  APP_ENV: extra.APP_ENV ?? 'local',
  API_BASE_URL: extra.API_BASE_URL ?? 'http://localhost:8484/api/v1',
  TOKEN_HEADER: extra.TOKEN_HEADER ?? 'Authorization',
  REFRESH_PATH: extra.REFRESH_PATH ?? '/refresh', // usato solo se esiste lato backend
};
export const isProd = ENV.APP_ENV === 'production';
export const isDev  = !isProd;
