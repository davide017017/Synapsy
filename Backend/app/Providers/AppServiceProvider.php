<?php

namespace App\Providers;

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
    }
}

