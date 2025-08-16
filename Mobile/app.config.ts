// app.config.ts
// ─────────────────────────────────────────────────────────────────────────────
// Expo config – espone ENV a runtime tramite `extra`
// ─────────────────────────────────────────────────────────────────────────────
import 'dotenv/config';

export default {
  name: 'Synapsi Mobile',
  slug: 'synapsi-mobile',
  version: '1.0.0',
  orientation: 'portrait',
  extra: {
    APP_ENV: process.env.APP_ENV ?? 'local',
    API_BASE_URL: process.env.API_BASE_URL ?? 'http://192.168.0.111:8484/api/v1',
    TOKEN_HEADER: process.env.TOKEN_HEADER ?? 'Authorization',
  },
} as const;
