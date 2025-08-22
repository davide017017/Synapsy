<?php

return [

    // Nome dell'applicazione (usato in email, UI, notifiche, ecc.)
    'name' => env('APP_NAME', 'Laravel'),

    // Ambiente dell'app (local, production, ecc.)
    'env' => env('APP_ENV', 'production'),

    // Modalità debug (true per sviluppo, false in produzione)
    'debug' => (bool) env('APP_DEBUG', false),

    // URL base dell'applicazione
    'url' => env('APP_URL', 'http://localhost'),

    // Fuso orario di default
    'timezone' => 'UTC',

    // Localizzazione principale
    'locale' => env('APP_LOCALE', 'en'),
    'fallback_locale' => env('APP_FALLBACK_LOCALE', 'en'),
    'faker_locale' => env('APP_FAKER_LOCALE', 'en_US'),

    // Chiave di cifratura (obbligatoria per la sicurezza)
    'cipher' => 'AES-256-CBC',
    'key' => env('APP_KEY'),

    // Chiavi di cifratura precedenti, se supporti la rotazione
    'previous_keys' => [
        ...array_filter(explode(',', env('APP_PREVIOUS_KEYS', ''))),
    ],

    // Modalità di manutenzione
    'maintenance' => [
        'driver' => env('APP_MAINTENANCE_DRIVER', 'file'),
        'store' => env('APP_MAINTENANCE_STORE', 'database'),
    ],

    // Alias globali per classi usabili ovunque (facoltativi)
    'aliases' => [
        'ApiResponse' => App\Helpers\ApiResponse::class,
    ],

];
