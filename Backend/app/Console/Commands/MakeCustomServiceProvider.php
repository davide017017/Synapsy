<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;

class MakeCustomServiceProvider extends Command
{
    protected $signature = 'make:custom-service-provider {module}';
    protected $description = 'Genera un ServiceProvider custom dentro il modulo specificato';

    public function handle(): void
    {
        $module = Str::studly($this->argument('module'));      
        $moduleLower = Str::kebab($module);                     
        $stubPath = resource_path('modules/stubs/stubs/custom/CustomServiceProvider.stub');
        $providerPath = base_path("Modules/{$module}/Providers/{$module}ServiceProvider.php");

        // Verifica modulo esistente
        if (!is_dir(base_path("Modules/{$module}"))) {
            $this->error("❌ Il modulo {$module} non esiste!");
            return;
        }

        // Verifica esistenza stub
        if (!file_exists($stubPath)) {
            $this->error("❌ Stub non trovato: $stubPath");
            return;
        }

        // Crea la cartella Providers se non esiste
        if (!is_dir(dirname($providerPath))) {
            mkdir(dirname($providerPath), 0755, true);
        }

        $stub = file_get_contents($stubPath);

        $replacements = [
            '{{Module}}' => $module,
            '{{module}}' => $moduleLower,
        ];

        $content = str_replace(array_keys($replacements), array_values($replacements), $stub);

        file_put_contents($providerPath, $content);

        $this->info("✅ ServiceProvider creato in: {$providerPath}");
    }
}

