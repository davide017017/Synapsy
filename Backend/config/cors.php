<?php

// ─────────────────────────────────────────────────────────────────────────────
// config/cors.php — PROD (Bearer token, no cross-site cookies)
// ─────────────────────────────────────────────────────────────────────────────

return [
    // ── Rotte coperte ──
    'paths' => [
        'api/*',
        'v1/*',
        'v1/jwt/*',
        'sanctum/csrf-cookie',
    ],

    // ── Metodi / Header ──
    'allowed_methods' => ['*'],
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
        // Se usi ancora Next/CRA su 3000, lascia pure:
        'http://localhost:3000',
        'http://192.168.0.111:3000',
        // Produzione:
        'https://synapsy-frontend.vercel.app',
    ],

    // ── Pattern per deploy Vercel (preview) ──
    'allowed_origins_patterns' => [
        '#^https://synapsy-frontend-.*\\.vercel\\.app$#',
    ],

    // ── Header esposti al browser (se invii token in header) ──
    'exposed_headers' => ['Authorization'],

    // ── Cache preflight ──
    'max_age' => 600,

    // ── IMPORTANTE: niente cookie/sessioni cross-site ──
    'supports_credentials' => false,
];
