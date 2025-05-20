<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;

class MakeCustomService extends Command
{
    protected $signature = 'make:custom-service {module} {model}';
    protected $description = 'Genera un service class personalizzato dentro al modulo specificato';

    public function handle(): void
    {
        $module      = Str::studly($this->argument('module'));  // es: Blog
        $model       = Str::studly($this->argument('model'));   // es: Post
        $modelLower  = Str::camel($model);                      // es: post

        $stubPath    = resource_path('modules/stubs/stubs/custom/CustomService.stub');
        $targetDir   = base_path("Modules/{$module}/Services");
        $targetPath  = "{$targetDir}/{$model}Service.php";

        // Verifica esistenza modulo
        if (!is_dir(base_path("Modules/{$module}"))) {
            $this->error("❌ Il modulo {$module} non esiste.");
            return;
        }

        // Verifica esistenza stub
        if (!file_exists($stubPath)) {
            $this->error("❌ Stub mancante: {$stubPath}");
            return;
        }

        // Crea directory se non esiste
        if (!is_dir($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        // Sostituzione placeholder
        $stub = file_get_contents($stubPath);
        $replacements = [
            '{{Module}}' => $module,
            '{{Model}}'  => $model,
            '{{model}}'  => $modelLower,
        ];
        $content = str_replace(array_keys($replacements), array_values($replacements), $stub);

        file_put_contents($targetPath, $content);

        $this->info("✅ Service creato in: Modules/{$module}/Services/{$model}Service.php");
    }
}
