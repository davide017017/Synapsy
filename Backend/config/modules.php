<?php

use Nwidart\Modules\Activators\FileActivator;
use Nwidart\Modules\Providers\ConsoleServiceProvider;

return [

    'namespace' => 'Modules',

    // Configurazione dei file di "stubs" generati
    'stubs' => [
        'enabled' => true,
        // 'path' => base_path('vendor/nwidart/laravel-modules/src/Commands/stubs'),
        'path' => resource_path('modules/stubs'),
        'files' => [
            'routes/web' => 'routes/web.php',
            'routes/api' => 'routes/api.php',
            'views/index' => 'resources/views/index.blade.php',
            'views/master' => 'resources/views/layouts/master.blade.php',
            'scaffold/config' => 'config/config.php',
            'composer' => 'composer.json',
            'assets/js/app' => 'resources/assets/js/app.js',
            'assets/sass/app' => 'resources/assets/sass/app.scss',
            'vite' => 'vite.config.js',
            'package' => 'package.json',
        ],
        'replacements' => [
            'routes/web' => ['LOWER_NAME', 'STUDLY_NAME', 'PLURAL_LOWER_NAME', 'KEBAB_NAME', 'MODULE_NAMESPACE', 'CONTROLLER_NAMESPACE'],
            'routes/api' => ['LOWER_NAME', 'STUDLY_NAME', 'PLURAL_LOWER_NAME', 'KEBAB_NAME', 'MODULE_NAMESPACE', 'CONTROLLER_NAMESPACE'],
            'vite' => ['LOWER_NAME', 'STUDLY_NAME', 'KEBAB_NAME'],
            'json' => ['LOWER_NAME', 'STUDLY_NAME', 'KEBAB_NAME', 'MODULE_NAMESPACE', 'PROVIDER_NAMESPACE'],
            'views/index' => ['LOWER_NAME'],
            'views/master' => ['LOWER_NAME', 'STUDLY_NAME', 'KEBAB_NAME'],
            'scaffold/config' => ['STUDLY_NAME'],
            'composer' => [
                'LOWER_NAME', 'STUDLY_NAME', 'VENDOR', 'AUTHOR_NAME',
                'AUTHOR_EMAIL', 'MODULE_NAMESPACE', 'PROVIDER_NAMESPACE', 'APP_FOLDER_NAME',
            ],
        ],
        'gitkeep' => true,
    ],

    // Percorsi principali usati dal modulo
    'paths' => [
        'modules' => base_path('Modules'),
        'assets' => public_path('modules'),
        'migration' => base_path('database/migrations'),
        'app_folder' => 'app/',

        // Generatori attivi personalizzati (usati nei tuoi moduli)
        'generator' => [
            'config'     => ['path' => 'Config',             'generate' => true],
            'command'    => ['path' => 'Console',            'generate' => true],
            'migration'  => ['path' => 'Database/Migrations','generate' => true],
            'model'      => ['path' => 'Models',             'generate' => true],
            'controller' => ['path' => 'Http/Controllers',   'generate' => true],
            'provider'   => ['path' => 'Providers',          'generate' => true],
            'request'    => ['path' => 'Http/Requests',      'generate' => true],
            'routes'     => ['path' => 'Routes',             'generate' => true],
            'views'      => ['path' => 'Resources/views',    'generate' => true],
            'lang'       => ['path' => 'Resources/lang',     'generate' => true],
            'policy'     => ['path' => 'Policies',           'generate' => true],
            'job'        => ['path' => 'Jobs',               'generate' => true],
            'service'    => ['path' => 'Services',           'generate' => true],
        ],

        /*
        // Blocchi generator standard (disabilitati) — utile come riferimento
        'generator' => [
            'actions'         => ['path' => 'app/Actions',           'generate' => false],
            'casts'           => ['path' => 'app/Casts',             'generate' => false],
            'channels'        => ['path' => 'app/Broadcasting',      'generate' => false],
            'command'         => ['path' => 'app/Console',           'generate' => false],
            'component-class' => ['path' => 'app/View/Components',   'generate' => false],
            'emails'          => ['path' => 'app/Emails',            'generate' => false],
            'event'           => ['path' => 'app/Events',            'generate' => false],
            'jobs'            => ['path' => 'app/Jobs',              'generate' => false],
            'model'           => ['path' => 'app/Models',            'generate' => false],
            'notifications'   => ['path' => 'app/Notifications',     'generate' => false],
            'policies'        => ['path' => 'app/Policies',          'generate' => false],
            'provider'        => ['path' => 'app/Providers',         'generate' => true],
            'controller'      => ['path' => 'app/Http/Controllers',  'generate' => true],
            'request'         => ['path' => 'app/Http/Requests',     'generate' => false],
            'config'          => ['path' => 'config',                'generate' => true],
            'factory'         => ['path' => 'database/factories',    'generate' => true],
            'migration'       => ['path' => 'database/migrations',   'generate' => true],
            'seeder'          => ['path' => 'database/seeders',      'generate' => true],
            'views'           => ['path' => 'resources/views',       'generate' => true],
            'routes'          => ['path' => 'routes',                'generate' => true],
            'test-feature'    => ['path' => 'tests/Feature',         'generate' => true],
            'test-unit'       => ['path' => 'tests/Unit',            'generate' => true],
        ],
        */
    ],

    // Auto-discovery
    'auto-discover' => [
        'migrations' => true,
        'translations' => false,
    ],

    // Comandi da registrare
    'commands' => ConsoleServiceProvider::defaultCommands()
        ->merge([
            // Aggiungi qui i tuoi comandi custom
        ])->toArray(),

    'scan' => [
        'enabled' => false,
        'paths' => [base_path('vendor/*/*')],
    ],

    'composer' => [
        'vendor' => env('MODULE_VENDOR', 'nwidart'),
        'author' => [
            'name'  => env('MODULE_AUTHOR_NAME', 'Nicolas Widart'),
            'email' => env('MODULE_AUTHOR_EMAIL', 'n.widart@gmail.com'),
        ],
        'composer-output' => false,
    ],

    'register' => [
        'translations' => true,
        'files' => 'register',
    ],

    'activators' => [
        'file' => [
            'class' => FileActivator::class,
            'statuses-file' => base_path('modules_statuses.json'),
        ],
    ],

    'activator' => 'file',
];
