<?php

namespace Modules\Categories\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use Modules\Categories\Models\Category;
use Modules\Categories\Policies\CategoryPolicy;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * Mappatura delle policy del modulo.
     */
    protected $policies = [
        Category::class => CategoryPolicy::class,
    ];

    public function boot(): void
    {
        $this->registerPolicies();
    }
}
