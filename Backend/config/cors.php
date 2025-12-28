<?php

// ─────────────────────────────────────────────────────────────
// config/cors.php — PROD (Bearer token, no cross-site cookies)
// ─────────────────────────────────────────────────────────────

return [
  // ── Rotte coperte ──
  'paths' => [
    'api/*',
    'v1/*',
    'v1/jwt/*',
    'sanctum/csrf-cookie',
  ],

  // ── Metodi / Header ──
  'allowed_methods' => ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  'allowed_headers' => [
    'Content-Type',
    'X-Requested-With',
    'Authorization',
    'Accept',
    'Origin',
  ],

  // ── Origin ammessi ──
  'allowed_origins' => [
    // Dev Expo Web
    'http://localhost:8083',
    'http://192.168.0.111:8083',

    // Dev Next.js
    'http://localhost:3000',
    'http://localhost:3001',       // aggiunto

    'http://192.168.0.100:3000',
    'http://192.168.0.100:3001',

    'http://192.168.0.111:3000',
    'http://192.168.0.111:3001',   // aggiunto

    '#^http://192\.168\.0\.\d{1,3}:3000$#',
    '#^http://192\.168\.0\.\d{1,3}:3001$#',
    '#^https://synapsy-frontend-.*\.vercel\.app$#',

    // Dev
    env('FRONTEND_URL', 'https://synapsy-dev.vercel.app/'),
    // Produzione

  ],

  // ── Pattern deploy Vercel (preview builds) ──
  'allowed_origins_patterns' => [
    '#^https://synapsy-frontend-.*\.vercel\.app$#',
  ],

  // ── Header esposti al browser ──
  'exposed_headers' => ['Authorization'],

  // ── Cache preflight ──
  'max_age' => 600,

  // ── Nessun cookie cross-site ──
  'supports_credentials' => false,
];

// ─────────────────────────────────────────────────────────────
// Descrizione file:
// Configurazione CORS per API Laravel con Bearer token. Permette:
// • Origini locali (3000, 3001, 8083 + IP LAN)
// • Origine prod da .env + preview Vercel
// • Header comuni incluso Authorization
// • Cache preflight 10 min
// • Nessun supporto cookie cross-site
// ─────────────────────────────────────────────────────────────