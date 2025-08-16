// src/lib/api.ts
// ─────────────────────────────────────────────────────────────────────────────
// Axios preconfigurato + token da SecureStore
// ─────────────────────────────────────────────────────────────────────────────
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ENV } from './env';

export const TOKEN_KEY = 'synapsi_token';

export const api = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 10000,
});

// ── token interceptor ────────────────────────────────────────────────────────
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(TOKEN_KEY);
  if (token) {
    config.headers = config.headers ?? {};
    config.headers[ENV.TOKEN_HEADER] = `Bearer ${token}`;
  }
  return config;
});

export type ApiResponse<T> = { data: T; message?: string };
