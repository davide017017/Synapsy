<?php

namespace Modules\Entrate\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Modules\Entrate\Models\Entrata;
use Modules\Entrate\Policies\EntrataPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Mappatura delle policy del modulo.
     */
    protected $policies = [
        Entrata::class => EntrataPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}

