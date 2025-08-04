<?php

namespace Modules\User\Providers;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Blade;
use Illuminate\Support\ServiceProvider;
use Nwidart\Modules\Traits\PathNamespace;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use Modules\User\Models\User;
use Modules\User\Observers\UserObserver;

class UserServiceProvider extends ServiceProvider
{
    use PathNamespace;

    protected string $name = 'User';
    protected string $nameLower = 'user';

    /**
     * Boot del provider del modulo.
     */
    public function boot(): void
    {
        $this->registerCommands();
        $this->registerCommandSchedules();
        $this->registerTranslations();
        $this->registerConfig();
        $this->registerViews();

        $this->loadMigrationsFrom(module_path($this->name, 'Database/Migrations'));

        // ✅ Carica anche le rotte API
        $this->loadRoutesFrom(module_path($this->name, 'Routes/web.php'));
        $this->loadRoutesFrom(module_path($this->name, 'Routes/api.php'));

        Factory::guessFactoryNamesUsing(
            fn(string $modelName) =>
            "Modules\\User\\Database\\Factories\\" . class_basename($modelName) . 'Factory'
        );

        // Register model observers
        User::observe(UserObserver::class);
    }


    /**
     * Register dei service provider interni.
     */
    public function register(): void
    {
        $this->app->register(EventServiceProvider::class);
        $this->app->register(RouteServiceProvider::class);
    }

    /**
     * Comandi CLI custom (se presenti).
     */
    protected function registerCommands(): void
    {
        // $this->commands([]);
    }

    /**
     * Scheduling comandi (se necessario).
     */
    protected function registerCommandSchedules(): void
    {
        // $this->app->booted(function () {
        //     $schedule = $this->app->make(Schedule::class);
        //     $schedule->command('inspire')->hourly();
        // });
    }

    /**
     * Registra i file di traduzione.
     */
    public function registerTranslations(): void
    {
        $langPath = resource_path("lang/modules/{$this->nameLower}");

        if (is_dir($langPath)) {
            $this->loadTranslationsFrom($langPath, $this->nameLower);
            $this->loadJsonTranslationsFrom($langPath);
        } else {
            $fallback = module_path($this->name, 'Resources/lang');
            $this->loadTranslationsFrom($fallback, $this->nameLower);
            $this->loadJsonTranslationsFrom($fallback);
        }
    }

    /**
     * Registra i file di configurazione del modulo.
     */
    protected function registerConfig(): void
    {
        $configPath = module_path($this->name, config('modules.paths.generator.config.path'));

        if (!is_dir($configPath)) return;

        $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($configPath));

        foreach ($iterator as $file) {
            if (!$file->isFile() || $file->getExtension() !== 'php') continue;

            $relative = str_replace($configPath . DIRECTORY_SEPARATOR, '', $file->getPathname());
            $key = ($relative === 'config.php')
                ? $this->nameLower
                : $this->nameLower . '.' . str_replace(['/', '\\', '.php'], ['.', '.', ''], $relative);

            $this->publishes([
                $file->getPathname() => config_path($relative),
            ], 'config');

            $this->merge_config_from($file->getPathname(), $key);
        }
    }

    /**
     * Merge ricorsivo della configurazione.
     */
    protected function merge_config_from(string $path, string $key): void
    {
        $existing = config($key, []);
        $moduleConfig = require $path;

        config([$key => array_replace_recursive($existing, $moduleConfig)]);
    }

    /**
     * Registra e pubblica le viste del modulo.
     */
    public function registerViews(): void
    {
        $viewPath = resource_path("views/modules/{$this->nameLower}");
        $sourcePath = module_path($this->name, 'Resources/views');

        $this->publishes([$sourcePath => $viewPath], ['views', "{$this->nameLower}-module-views"]);

        $this->loadViewsFrom(array_merge($this->getPublishableViewPaths(), [$sourcePath]), $this->nameLower);

        Blade::componentNamespace(config('modules.namespace') . '\\' . $this->name . '\\View\\Components', $this->nameLower);
    }

    /**
     * Percorsi da cui caricare le viste pubblicate.
     */
    private function getPublishableViewPaths(): array
    {
        $paths = [];

        foreach (config('view.paths') as $path) {
            $modulePath = "{$path}/modules/{$this->nameLower}";
            if (is_dir($modulePath)) {
                $paths[] = $modulePath;
            }
        }

        return $paths;
    }

    /**
     * Servizi forniti da questo provider.
     */
    public function provides(): array
    {
        return [];
    }
}

