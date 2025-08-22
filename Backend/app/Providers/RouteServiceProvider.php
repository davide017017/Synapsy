<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider as ServiceProvider;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

class RouteServiceProvider extends ServiceProvider
{
    public function boot(): void
    {
        parent::boot();

        $this->mapModuleApiRoutes();
        $this->mapModuleWebRoutes();
    }

    protected function mapModuleApiRoutes(): void
    {
        $modulesPath = base_path('Modules');

        foreach (File::directories($modulesPath) as $moduleDir) {
            $routePath = $moduleDir.'/Routes';

            if (! File::isDirectory($routePath)) {
                continue;
            }

            foreach (File::glob($routePath.'/api*.php') as $file) {
                Route::middleware('api')
                    ->prefix('api')
                    ->group($file);
            }
        }
    }

    protected function mapModuleWebRoutes(): void
    {
        $modulesPath = base_path('Modules');

        foreach (File::directories($modulesPath) as $moduleDir) {
            $routePath = $moduleDir.'/Routes';

            if (! File::isDirectory($routePath)) {
                continue;
            }

            foreach (File::glob($routePath.'/{web,auth}*.php') as $file) {
                Route::middleware('web')
                    ->group($file);
            }
        }
    }
}
