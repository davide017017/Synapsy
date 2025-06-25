<?php

return [

    // Impostazioni predefinite per l'autenticazione
    'defaults' => [
        'guard' => env('AUTH_GUARD', 'web'),
        'passwords' => env('AUTH_PASSWORD_BROKER', 'users'),
    ],

    // Guard di autenticazione disponibili (session = login tradizionale)
    'guards' => [
        'web' => [
            'driver' => 'session',
            'provider' => 'users',
        ],

        'api' => [
            'driver' => 'sanctum',
            'provider' => 'users',
        ],
    ],

    // Provider utenti: definisce da dove recuperare i dati degli utenti
    'providers' => [
        'users' => [
            'driver' => 'eloquent',
            'model' => Modules\User\Models\User::class,
        ],
        // Alternativa con query diretta sul DB (non usata)
        // 'users' => [
        //     'driver' => 'database',
        //     'table' => 'users',
        // ],
    ],

    // Configurazione reset password
    'passwords' => [
        'users' => [
            'provider' => 'users',
            'table' => env('AUTH_PASSWORD_RESET_TOKEN_TABLE', 'password_reset_tokens'),
            'expire' => 60,     // validità del token in minuti
            'throttle' => 60,   // attesa in secondi tra le richieste
        ],
    ],

    // Timeout per conferma password (in secondi)
    'password_timeout' => env('AUTH_PASSWORD_TIMEOUT', 10800), // 3 ore

];
