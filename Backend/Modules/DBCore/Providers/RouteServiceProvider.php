<?php

namespace Modules\DBCore\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    /**
     * Prefisso per le rotte API del modulo.
     */
    protected string $apiPrefix = 'api';

    /**
     * Inizializza il caricamento delle rotte.
     */
    public function boot(): void
    {
        $this->routes(function () {
            $this->mapWebRoutes();
            $this->mapApiRoutes();
        });
    }

    /**
     * Registra le rotte web del modulo.
     */
    protected function mapWebRoutes(): void
    {
        $webRoutesPath = module_path('DBCore', 'Routes/web.php');

        if (file_exists($webRoutesPath)) {
            Route::middleware('web')
                ->namespace($this->namespace)
                ->group($webRoutesPath);
        }
    }

    /**
     * Registra le rotte API del modulo.
     */
    protected function mapApiRoutes(): void
    {
        $apiRoutesPath = module_path('DBCore', 'Routes/api.php');

        if (file_exists($apiRoutesPath)) {
            Route::prefix($this->apiPrefix)
                ->middleware('api')
                ->namespace($this->namespace)
                ->group($apiRoutesPath);
        }
    }
}

