<?php

namespace Modules\User\Providers;

use Illuminate\Foundation\Support\Providers\EventServiceProvider as ServiceProvider;

class EventServiceProvider extends ServiceProvider
{
    /**
     * Mappatura eventi → listener.
     *
     * @var array<string, array<int, string>>
     */
    protected $listen = [];

    /**
     * Abilita il discovery automatico degli eventi.
     *
     * @var bool
     */
    protected static $shouldDiscoverEvents = true;

    /**
     * Configura eventuali listener per la verifica email.
     */
    protected function configureEmailVerification(): void
    {
        // Da implementare se necessario
    }
}

