<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;

class MakeCustomController extends Command
{
    protected $signature = 'make:custom-controller {module} {model}';
    protected $description = 'Genera un controller modulare custom basato sullo stub personalizzato';

    public function handle(): void
{
    $module = Str::studly($this->argument('module'));   // Esempio: Blog
    $model  = Str::studly($this->argument('model'));    // Esempio: Post
    $modelLower = Str::camel($model);                   // post
    $modelPlural = Str::pluralStudly($model);           // Posts

    $stubPath = resource_path('modules/stubs/stubs/custom/CustomController.stub');
    $modulePath = base_path("Modules/{$module}");

    if (!is_dir($modulePath)) {
        $this->error("Il modulo {$module} non esiste!");
        return;
    }

    $targetPath = "{$modulePath}/Http/Controllers/{$model}Controller.php";

    if (!file_exists($stubPath)) {
        $this->error("Stub non trovato: $stubPath");
        return;
    }

    // Crea directory se mancante
    if (!is_dir(dirname($targetPath))) {
        mkdir(dirname($targetPath), 0755, true);
    }

    $stub = file_get_contents($stubPath);

    $replacements = [
        '{{Module}}'      => $module,
        '{{module}}'      => Str::kebab($module),
        '{{Model}}'       => $model,
        '{{model}}'       => $modelLower,
        '{{ModelPlural}}' => $modelPlural,
    ];

    $content = str_replace(array_keys($replacements), array_values($replacements), $stub);

    file_put_contents($targetPath, $content);

    $this->info("✅ Controller creato in: {$targetPath}");
}

}
