<?php

namespace Modules\DBCore\Providers;

use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Blade;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;

class DBCoreServiceProvider extends ServiceProvider
{
    protected string $name = 'DBCore';
    protected string $nameLower = 'dbcore';

    /**
     * Elenco dei comandi Artisan personalizzati forniti dal modulo.
     */
    protected $commands = [
        \Modules\DBCore\Console\Commands\CreateDatabaseCommand::class,
        \Modules\DBCore\Console\Commands\DropDatabaseCommand::class,
        \Modules\DBCore\Console\Commands\ResetDatabaseCommand::class,
    ];

    /**
     * Avvia i servizi del modulo.
     */
    public function boot(): void
    {
        $this->registerCommands();          // Registra i comandi Artisan
        $this->registerCommandSchedules();  // Registra le pianificazioni dei comandi
        $this->registerTranslations();      // Registra i file di traduzione
        $this->registerConfig();            // Registra e unisce i file di configurazione
        $this->loadMigrationsFrom(module_path($this->name, 'Database/Migrations')); // Carica le migrazioni
    }

    /**
     * Registra i binding nel contenitore di servizio.
     */
    public function register(): void
    {
        $this->app->register(EventServiceProvider::class); // Registra il provider degli eventi
        $this->app->register(RouteServiceProvider::class); // Registra il provider delle rotte
    }

    /**
     * Registra i comandi Artisan del modulo.
     */
    protected function registerCommands(): void
    {
        $this->commands($this->commands);
    }

    /**
     * Registra le pianificazioni dei comandi (se necessario).
     */
    protected function registerCommandSchedules(): void
    {
        // Esempio di pianificazione:
        // $this->app->booted(function () {
        //     $schedule = $this->app->make(Schedule::class);
        //     $schedule->command('custom:my-command')->hourly();
        // });
    }

    /**
     * Registra i file di traduzione del modulo.
     */
    public function registerTranslations(): void
    {
        $langPath = resource_path('lang/modules/' . $this->nameLower);

        if (is_dir($langPath)) {
            $this->loadTranslationsFrom($langPath, $this->nameLower);
            $this->loadJsonTranslationsFrom($langPath);
        } else {
            $this->loadTranslationsFrom(module_path($this->name, 'Resources/lang'), $this->nameLower);
            $this->loadJsonTranslationsFrom(module_path($this->name, 'Resources/lang'));
        }
    }

    /**
     * Registra e unisce i file di configurazione del modulo.
     */
    protected function registerConfig(): void
    {
        $configPath = module_path($this->name, config('modules.paths.generator.config.path'));

        if (is_dir($configPath)) {
            $iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($configPath));

            foreach ($iterator as $file) {
                if ($file->isFile() && $file->getExtension() === 'php') {
                    $config = str_replace($configPath . DIRECTORY_SEPARATOR, '', $file->getPathname());
                    $configKey = str_replace(['.php', DIRECTORY_SEPARATOR], ['', '.'], $config);
                    $segments = explode('.', $this->nameLower . '.' . $configKey);
                    $key = ($config === 'config.php') ? $this->nameLower : implode('.', array_unique($segments));

                    $this->publishes([$file->getPathname() => config_path($config)], 'config');
                    $this->mergeConfigFrom($file->getPathname(), $key);
                }
            }
        }
    }

    /**
     * Registra le viste del modulo.
     */
    public function registerViews(): void
    {
        $viewPath = resource_path('views/modules/' . $this->nameLower);
        $sourcePath = module_path($this->name, 'Resources/views');

        $this->publishes([$sourcePath => $viewPath], ['views', $this->nameLower . '-module-views']);
        $this->loadViewsFrom(array_merge($this->getPublishableViewPaths(), [$sourcePath]), $this->nameLower);

        Blade::componentNamespace(config('modules.namespace') . '\\' . $this->name . '\\View\\Components', $this->nameLower);
    }

    /**
     * Ottiene i percorsi delle viste pubblicabili.
     */
    protected function getPublishableViewPaths(): array
    {
        $paths = [];

        foreach (config('view.paths') as $path) {
            if (is_dir($path . '/modules/' . $this->nameLower)) {
                $paths[] = $path . '/modules/' . $this->nameLower;
            }
        }

        return $paths;
    }

    /**
     * Servizi forniti dal provider.
     */
    public function provides(): array
    {
        return [];
    }
}

