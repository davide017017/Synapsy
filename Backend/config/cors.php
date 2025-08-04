<?php
// ⚠️ In produzione definitiva lascia solo il dominio reale!

return [
    'paths' => [
        'api/*',
        'v1/*',
        'v1/jwt/*',
        'sanctum/csrf-cookie',
    ],

    'allowed_methods' => ['*'],

    // =========================================================================
    // Accetta chiamate sia da produzione che da sviluppo
    // =========================================================================
    'allowed_origins' => [
        'https://synapsy-frontend.vercel.app', // Frontend produzione (Vercel)
        'http://localhost:3000',               // Sviluppo locale
        'http://192.168.0.111:3000',           // Sviluppo su rete LAN (se ti serve)
    ],

    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];

