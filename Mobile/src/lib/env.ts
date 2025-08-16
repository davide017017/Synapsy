// src/lib/env.ts
// Expo extra → ENV tipizzato
import Constants from 'expo-constants';

type Extra = { APP_ENV: string; API_BASE_URL: string; TOKEN_HEADER: string };
const extra = (Constants.expoConfig?.extra ?? {}) as Partial<Extra>;
export const ENV: Extra = {
  APP_ENV: extra.APP_ENV ?? 'local',
  API_BASE_URL: extra.API_BASE_URL ?? 'http://localhost:8484/api/v1',
  TOKEN_HEADER: extra.TOKEN_HEADER ?? 'Authorization',
};
export const isProd = ENV.APP_ENV === 'production';
