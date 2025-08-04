<?php

namespace Modules\RecurringOperations\Providers;

use Illuminate\Support\ServiceProvider;
use Modules\RecurringOperations\Models\RecurringOperation;
use Modules\RecurringOperations\Observers\RecurringOperationObserver;
use Modules\RecurringOperations\Console\Commands\GenerateRecurringOperationsCommand;

class RecurringOperationsServiceProvider extends ServiceProvider
{
    protected string $moduleName = 'RecurringOperations';
    protected string $moduleNameLower = 'recurringoperations';

    // =========================================================================
    // Register internal providers
    // =========================================================================
    public function register(): void
    {
        $this->app->register(RouteServiceProvider::class);
        $this->app->register(EventServiceProvider::class);
        $this->app->register(AuthServiceProvider::class);
    }

    // =========================================================================
    // Bootstrap module services
    // =========================================================================
    public function boot(): void
    {
        $this->registerTranslations();
        $this->registerConfig();
        $this->registerViews();
        $this->registerCommands();
        $this->registerCommandSchedules();

        $this->loadMigrationsFrom(
            module_path($this->moduleName, 'Database/Migrations')
        );

        // ==========================
        // Observer: ricorrenze
        // ==========================
        RecurringOperation::observe(RecurringOperationObserver::class);
    }

    // =========================================================================
    // Config registration
    // =========================================================================
    protected function registerConfig(): void
    {
        $relativePath = config('modules.paths.generator.config.path');
        $configPath = module_path($this->moduleName, $relativePath);

        if (!is_dir($configPath)) return;

        $iterator = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($configPath));
        foreach ($iterator as $file) {
            if (!$file->isFile() || $file->getExtension() !== 'php') continue;

            $relative = str_replace($configPath . DIRECTORY_SEPARATOR, '', $file->getPathname());
            $key = ($relative === 'config.php')
                ? $this->moduleNameLower
                : $this->moduleNameLower . '.' . str_replace(['/', '\\', '.php'], ['.', '.', ''], $relative);

            $this->publishes([
                $file->getPathname() => config_path($relative)
            ], 'config');

            $this->mergeConfigFrom($file->getPathname(), $key);
        }
    }

    // =========================================================================
    // Translation registration
    // =========================================================================
    protected function registerTranslations(): void
    {
        $langPath = resource_path("lang/modules/{$this->moduleNameLower}");
        $fallbackPath = module_path($this->moduleName, 'Resources/lang');

        if (is_dir($langPath)) {
            $this->loadTranslationsFrom($langPath, $this->moduleNameLower);
            $this->loadJsonTranslationsFrom($langPath);
        } else {
            $this->loadTranslationsFrom($fallbackPath, $this->moduleNameLower);
            $this->loadJsonTranslationsFrom($fallbackPath);
        }
    }

    // =========================================================================
    // Views registration
    // =========================================================================
    protected function registerViews(): void
    {
        $viewPath = resource_path("views/modules/{$this->moduleNameLower}");
        $sourcePath = module_path($this->moduleName, 'Resources/views');

        $this->publishes([
            $sourcePath => $viewPath
        ], ['views', "{$this->moduleNameLower}-views"]);

        $this->loadViewsFrom(
            array_merge($this->getPublishableViewPaths(), [$sourcePath]),
            $this->moduleNameLower
        );
    }

    protected function getPublishableViewPaths(): array
    {
        $paths = [];
        foreach (config('view.paths') as $path) {
            $fullPath = "{$path}/modules/{$this->moduleNameLower}";
            if (is_dir($fullPath)) {
                $paths[] = $fullPath;
            }
        }
        return $paths;
    }

    // =========================================================================
    // COMANDI & SCHEDULE
    // =========================================================================
    protected function registerCommands(): void
    {
        if ($this->app->runningInConsole()) {
            $this->commands([
                GenerateRecurringOperationsCommand::class,
            ]);
        }
    }

    protected function registerCommandSchedules(): void
    {
        // Lo scheduling va nel Kernel principale dell’app.
    }

    // =========================================================================
    // BINDINGS (opzionale)
    // =========================================================================
    public function provides(): array
    {
        return [];
    }
}

