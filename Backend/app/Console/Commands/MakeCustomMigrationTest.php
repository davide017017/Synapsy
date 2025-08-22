<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Str;

class MakeCustomMigrationTest extends Command
{
    protected $signature = 'make:custom-migration-test {module} {model} {table}';

    protected $description = 'Genera un test unitario per la migration di una tabella nel modulo specificato';

    public function handle(): void
    {
        $module = Str::studly($this->argument('module'));   // es: Entrate
        $model = Str::studly($this->argument('model'));    // es: Entrata
        $table = Str::snake($this->argument('table'));     // es: entrate

        $stubPath = resource_path('modules/stubs/stubs/custom/CustomMigrationTest.stub');
        $targetDir = base_path("Modules/{$module}/Tests/Unit");
        $targetPath = "{$targetDir}/{$model}MigrationTest.php";

        // Verifica esistenza modulo
        if (! is_dir(base_path("Modules/{$module}"))) {
            $this->error("❌ Il modulo {$module} non esiste.");

            return;
        }

        if (! file_exists($stubPath)) {
            $this->error("❌ Stub non trovato: {$stubPath}");

            return;
        }

        if (! is_dir($targetDir)) {
            mkdir($targetDir, 0755, true);
        }

        $stub = file_get_contents($stubPath);

        $replacements = [
            '{{Module}}' => $module,
            '{{Model}}' => $model,
            '{{table}}' => $table,
        ];

        $content = str_replace(array_keys($replacements), array_values($replacements), $stub);

        file_put_contents($targetPath, $content);

        $this->info("✅ Migration test creato in: Modules/{$module}/Tests/Unit/{$model}MigrationTest.php");
    }
}
