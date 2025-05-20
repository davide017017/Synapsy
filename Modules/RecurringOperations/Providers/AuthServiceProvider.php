<?php

namespace Modules\RecurringOperations\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Modules\RecurringOperations\Models\RecurringOperation;
use Modules\RecurringOperations\Policies\RecurringOperationPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Mappatura delle policy del modulo.
     */
    protected $policies = [
        RecurringOperation::class => RecurringOperationPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
