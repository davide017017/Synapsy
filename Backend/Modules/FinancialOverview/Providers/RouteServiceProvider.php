<?php

namespace Modules\FinancialOverview\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    protected string $moduleName = 'FinancialOverview';

    // =========================================================================
    // Boot (bindings, filters)
    // =========================================================================
    public function boot(): void
    {
        parent::boot();
    }

    // =========================================================================
    // Route mapping
    // =========================================================================
    public function map(): void
    {
        $this->mapWebRoutes();
        $this->mapApiRoutes();
    }

    // =========================================================================
    // Web routes
    // =========================================================================
    protected function mapWebRoutes(): void
    {
        Route::middleware('web')
            ->group(module_path($this->moduleName, 'Routes/web.php'));
    }

    // =========================================================================
    // API routes
    // =========================================================================
    protected function mapApiRoutes(): void
    {
        Route::middleware('api')
            ->prefix('api')
            ->name('api.')
            ->group(module_path($this->moduleName, 'Routes/api.php'));
    }
}
