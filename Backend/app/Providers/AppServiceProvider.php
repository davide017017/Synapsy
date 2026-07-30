<?php

namespace App\Providers;

use ApiResponse;
use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Registra binding e servizi nel container.
     */
    public function register(): void
    {
        // Esempio:
        // $this->app->bind(MyInterface::class, MyImplementation::class);
    }

    /**
     * Avvia i servizi dopo la registrazione di tutti i provider.
     */
    public function boot(): void
    {
        // Esempio:
        // Schema::defaultStringLength(191);

        // Reseed dati demo: 1 richiesta al giorno, per utente (non per IP).
        RateLimiter::for('reseed-demo', function (Request $request) {
            return Limit::perDay(1)
                ->by($request->user()?->id ?? $request->ip())
                ->response(fn (Request $request, array $headers) => ApiResponse::error(
                    'Puoi rigenerare i dati demo una sola volta al giorno. Riprova domani.',
                    null,
                    429
                )->withHeaders($headers));
        });
    }
}
