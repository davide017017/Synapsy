// src/lib/tokenStorage.ts
// ─────────────────────────────────────────────────────────────────────────────
// Storage token: SecureStore (native) + sessionStorage (web) + fallback in-mem
// ─────────────────────────────────────────────────────────────────────────────
import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

const ACCESS_KEY  = 'synapsi_access';
const REFRESH_KEY = 'synapsi_refresh';

let memAccess: string | null = null;
let memRefresh: string | null = null;

const isWeb = Platform.OS === 'web';
const webStore = isWeb && typeof window !== 'undefined' ? window.sessionStorage : null;

// ─── Access Token ────────────────────────────────────────────────────────────
export async function getAccessToken() {
  if (isWeb && webStore) return webStore.getItem(ACCESS_KEY);
  const v = await SecureStore.getItemAsync(ACCESS_KEY);
  return v ?? memAccess;
}
export async function setAccessToken(t: string) {
  memAccess = t;
  if (isWeb && webStore) webStore.setItem(ACCESS_KEY, t);
  else await SecureStore.setItemAsync(ACCESS_KEY, t);
}
export async function removeAccessToken() {
  memAccess = null;
  if (isWeb && webStore) webStore.removeItem(ACCESS_KEY);
  else await SecureStore.deleteItemAsync(ACCESS_KEY);
}

// ─── Refresh Token ───────────────────────────────────────────────────────────
export async function getRefreshToken() {
  if (isWeb && webStore) return webStore.getItem(REFRESH_KEY);
  const v = await SecureStore.getItemAsync(REFRESH_KEY);
  return v ?? memRefresh;
}
export async function setRefreshToken(t: string) {
  memRefresh = t;
  if (isWeb && webStore) webStore.setItem(REFRESH_KEY, t);
  else await SecureStore.setItemAsync(REFRESH_KEY, t);
}
export async function removeRefreshToken() {
  memRefresh = null;
  if (isWeb && webStore) webStore.removeItem(REFRESH_KEY);
  else await SecureStore.deleteItemAsync(REFRESH_KEY);
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
export async function clearTokens() {
  await Promise.all([removeAccessToken(), removeRefreshToken()]);
}
