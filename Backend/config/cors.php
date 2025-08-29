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

    // ── Origin del frontend ──
    'allowed_origins' => [
        'http://localhost:8083',        // Expo Web
        'http://192.168.0.111:8083',    // Expo Web via IP
        'http://localhost:3000',        // Next/CRA locale
        'http://192.168.0.111:3000',    // Next/CRA via IP
        // Produzione (ENV fallback a prod URL)
        env('FRONTEND_URL', 'https://synapsy-frontend.vercel.app'),
    ],

    // ── Pattern per deploy Vercel (preview) ──
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
// Configurazione CORS per API Laravel con Bearer. Permette header
// comuni (incluso Authorization), origini locali + prod + preview
// Vercel, preflight cache 10 min. Nessun supporto a cookie cross-site.
// ─────────────────────────────────────────────────────────────