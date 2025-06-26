<?php
// ⚠️ Modifica allowed_origins prima del deploy! Lascia SOLO il dominio reale della tua app!

return [
    'paths' => [
        'api/*',
        'v1/*',
        'v1/jwt/*',
        'sanctum/csrf-cookie',
    ],

    'allowed_methods' => ['*'],

    // --- SVILUPPO: accetta chiamate dal frontend in locale o LAN ---
    'allowed_origins' => [
        'http://localhost:3000',           // Frontend locale
        'http://192.168.0.111:3000',       // Frontend su rete locale
    ],

    // --- DEPLOY: per la produzione decommenta SOLO il dominio reale ---
    // 'allowed_origins' => [
    //     'https://app.synapsi.com',       // Dominio reale di produzione (modifica con il tuo)
    // ],

    'allowed_origins_patterns' => [],
    'allowed_headers' => ['*'],
    'exposed_headers' => [],
    'max_age' => 0,
    'supports_credentials' => true,
];
