<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * Mappa evento → listener dell'applicazione.
     * Puoi aggiungere eventi manualmente qui.
     *
     * @var array<class-string, array<int, class-string>>
     */
    protected $listen = [
        // Esempio:
        // Registered::class => [SendEmailVerificationNotification::class],
    ];

    /**
     * Bootstrap di qualsiasi evento registrato.
     */
    public function boot(): void
    {
        //
    }

    /**
     * Indica se Laravel deve scoprire automaticamente gli eventi.
     */
    public function shouldDiscoverEvents(): bool
    {
        return false;
    }
}
