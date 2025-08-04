<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\File;

class ExportApiRoutesJson extends Command
{
    // 🏷️ Firma e descrizione del comando
    protected $signature = 'routes:export-api-json';
    protected $description = 'Esporta le rotte API in formato JSON, organizzate per modulo';

    // 🚀 Logica del comando
    public function handle()
    {
        // 🔍 Estrae solo le rotte API
        $routes = collect(Route::getRoutes())
            ->filter(fn($route) => str_starts_with($route->uri(), 'api/'))

            // 🧾 Mappa ogni rotta in un array semplificato
            ->map(function ($route) {
                return [
                    'method'     => implode('|', $route->methods()),
                    'uri'        => $route->uri(),
                    'name'       => $route->getName(),
                    'action'     => $route->getActionName(),
                    'middleware' => $route->middleware(),
                ];
            })

            // 🧩 Raggruppa per "modulo" (basato su namespace)
            ->groupBy(fn($route) => explode('\\', $route['action'])[1] ?? 'App');

        // 💾 Scrive su file JSON con indentazione leggibile
        $path = base_path('routes_api_export.json');
        File::put($path, json_encode($routes, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

        $this->info("✅ File JSON creato in: {$path}");
    }
}

