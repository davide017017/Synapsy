<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;

class MakeCustomModuleJson extends Command
{
    protected $signature = 'make:custom-module-json {module}';
    protected $description = 'Genera un file module.json standard per un modulo personalizzato';

    public function handle(): void
    {
        $module       = Str::studly($this->argument('module'));    // es: Blog
        $moduleLower  = Str::kebab($module);                       // es: blog
        $stubPath     = resource_path('modules/stubs/stubs/custom/CustomModuleJson.stub');
        $targetPath   = base_path("Modules/{$module}/module.json");

        // Verifica modulo esistente
        if (!is_dir(base_path("Modules/{$module}"))) {
            $this->error("❌ Il modulo {$module} non esiste.");
            return;
        }

        // Verifica stub
        if (!file_exists($stubPath)) {
            $this->error("❌ Stub non trovato: {$stubPath}");
            return;
        }

        // Sostituzione placeholder
        $stub = file_get_contents($stubPath);
        $replacements = [
            '{{Module}}' => $module,
            '{{module}}' => $moduleLower,
        ];

        $content = str_replace(array_keys($replacements), array_values($replacements), $stub);

        file_put_contents($targetPath, $content);

        $this->info("✅ module.json creato in: Modules/{$module}/module.json");
    }
}
