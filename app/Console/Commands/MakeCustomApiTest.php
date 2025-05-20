<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;

class MakeCustomApiTest extends Command
{
    protected $signature = 'make:custom-api-test {module} {model}';
    protected $description = 'Genera un test API per il modello specificato all’interno di un modulo';

    public function handle(): void
    {
        $module       = Str::studly($this->argument('module'));      // es: Blog
        $model        = Str::studly($this->argument('model'));       // es: Post
        $modelLower   = Str::camel($model);                          // es: post
        $moduleKebab  = Str::kebab($module);                         // es: blog

        $stubPath     = resource_path('modules/stubs/stubs/custom/CustomApiTest.stub');
        $testDir      = base_path("Modules/{$module}/Tests/Feature");
        $testPath     = "{$testDir}/{$model}ApiTest.php";

        // Verifica esistenza modulo
        if (!is_dir(base_path("Modules/{$module}"))) {
            $this->error("❌ Il modulo {$module} non esiste.");
            return;
        }

        // Verifica stub
        if (!file_exists($stubPath)) {
            $this->error("❌ Stub non trovato: {$stubPath}");
            return;
        }

        // Crea directory se non esiste
        if (!is_dir($testDir)) {
            mkdir($testDir, 0755, true);
        }

        // Sostituzioni
        $stub = file_get_contents($stubPath);
        $replacements = [
            '{{Module}}' => $module,
            '{{module}}' => $moduleKebab,
            '{{Model}}'  => $model,
            '{{model}}'  => $modelLower,
        ];

        $content = str_replace(array_keys($replacements), array_values($replacements), $stub);

        file_put_contents($testPath, $content);

        $this->info("✅ Test API creato in: Modules/{$module}/Tests/Feature/{$model}ApiTest.php");
    }
}
