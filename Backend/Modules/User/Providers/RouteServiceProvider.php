<?php

namespace Modules\User\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    protected string $name = 'User';

    /**
     * Configura binding e filtri prima del caricamento route.
     */
    public function boot(): void
    {
        parent::boot();
    }

    /**
     * Mappa le route API e WEB.
     */
    public function map(): void
    {
        $this->mapApiRoutes();
        $this->mapWebRoutes();
    }

    /**
     * Route web (con sessioni, CSRF, ecc).
     */
    protected function mapWebRoutes(): void
    {
        Route::middleware('web')
            ->group(module_path($this->name, 'Routes/web.php'));

        Route::middleware('web')
            ->group(module_path($this->name, 'Routes/auth.php'));
    }

    /**
     * Route API (stateless).
     */
    protected function mapApiRoutes(): void
    {
        Route::middleware('api')
            ->prefix('api')
            ->name('api.')
            ->group(module_path($this->name, 'Routes/api.php'));
    }
}
