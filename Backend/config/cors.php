<?php

// ─────────────────────────────────────────────────────────────────────────────
// config/cors.php — DEV (token/Bearer, niente cookie)
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
    'allowed_headers' => ['*'],

    // ── Origin del frontend in DEV ──
    'allowed_origins' => [
        'http://localhost:8083',        // Expo Web
        'http://192.168.0.111:8083',    // Expo Web via IP
        // Se usi ancora Next/CRA su 3000, lascia pure:
        'http://localhost:3000',
        'http://192.168.0.111:3000',
        // Produzione:
        'https://synapsy-frontend.vercel.app',
    ],

    // ── Pattern (non indispensabile qui) ──
    'allowed_origins_patterns' => [],

    // ── Header esposti al browser (se invii token in header) ──
    'exposed_headers' => ['Authorization'],

    // ── Cache preflight ──
    'max_age' => 0,

    // ── IMPORTANTE: niente cookie/sessioni cross-site ──
    'supports_credentials' => false,
];
