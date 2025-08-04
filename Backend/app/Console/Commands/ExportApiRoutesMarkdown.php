<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;

class ExportApiRoutesMarkdown extends Command
{
    // 🏷️ Firma e descrizione del comando
    protected $signature = 'routes:export-api-md';
    protected $description = 'Esporta le rotte API in formato Markdown, organizzate per modulo';

    // 🚀 Logica del comando
    public function handle()
    {
        // 🔍 Estrae solo le rotte API
        $routes = collect(Route::getRoutes())
            ->filter(fn($route) => str_starts_with($route->uri(), 'api/'))

            // 🧾 Mappa ogni rotta in un array leggibile
            ->map(function ($route) {
                return [
                    'method' => implode('|', $route->methods()),
                    'uri'    => $route->uri(),
                    'name'   => $route->getName(),
                    'action' => $route->getActionName(),
                ];
            })

            // 🧩 Raggruppa per "modulo" (namespace)
            ->groupBy(fn($route) => explode('\\', $route['action'])[1] ?? 'App');

        $lines = [];

        // 📄 Costruisce il markdown con intestazioni e separatori
        foreach ($routes as $module => $group) {
            $lines[] = "## 🧩 Modulo: `{$module}`";
            $lines[] = "---";

            foreach ($group as $route) {
                $lines[] = "### `{$route['method']}` | `{$route['uri']}`";
                $lines[] = "**Action**: `{$route['action']}`";
                if ($route['name']) {
                    $lines[] = "**Name**: `{$route['name']}`";
                }
                $lines[] = ''; // Spaziatura
            }

            $lines[] = "\n---\n";
        }

        // 💾 Scrive il contenuto markdown su file
        $output = implode("\n", array_filter($lines));
        $path = base_path('routes_api_export.md');
        File::put($path, $output);

        $this->info("✅ File Markdown creato in: {$path}");
    }
}

