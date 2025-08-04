<?php

namespace Modules\Spese\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Modules\Spese\Models\Spesa;
use Modules\Spese\Policies\SpesaPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Mappatura delle policy del modulo.
     */
    protected $policies = [
        Spesa::class => SpesaPolicy::class,
    ];

    /**
     * Avvio del provider.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
}

