<?php

// ─────────────────────────────────────────────────────────────────────────────
// Comando: routes:export-api-json
// Dettagli: esporta le rotte API in JSON, raggruppate per "modulo" ricavato
//           dal primo segmento dell'URI dopo il prefisso (es. /api/v1/spese → spese)
// ─────────────────────────────────────────────────────────────────────────────

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

class ExportApiRoutesJson extends Command
{
    // ============================
    // Configurazione
    // ============================
    protected $signature = 'routes:export-api-json
        {--path=docs/API/ROUTES.json : Percorso file di output JSON}
        {--prefix=/api/v1 : Prefisso URI da esportare (es. /api/v1)}';

    protected $description = 'Esporta le rotte API in formato JSON, organizzate per modulo (in base all’URI).';

    // ============================
    // Handle
    // ============================
    public function handle(): int
    {
        // ─────────────────────────────────────────────────────────────────────
        // Input opzioni + normalizzazione prefisso
        // ─────────────────────────────────────────────────────────────────────
        $path = base_path($this->option('path'));
        $prefixRaw = (string) $this->option('prefix');
        $prefix = trim($prefixRaw) === '' ? '' : ltrim($prefixRaw, '/'); // "api/v1"

        // ─────────────────────────────────────────────────────────────────────
        // Estrae rotte, filtra per prefisso, mappa campi e raggruppa per modulo
        // ─────────────────────────────────────────────────────────────────────
        $routesByModule = collect(Route::getRoutes())
            ->filter(function ($route) use ($prefix) {
                $uri = $route->uri();                   // es. "api/v1/spese/1"
                return $prefix === '' ? true : str_starts_with($uri, $prefix);
            })
            ->map(function ($route) use ($prefix) {
                $methods = array_values(array_diff($route->methods(), ['HEAD']));
                $uri     = $route->uri();
                return [
                    'module'     => $this->moduleFromUri($uri, $prefix),
                    'method'     => implode('|', $methods),
                    'uri'        => $uri,
                    'name'       => $route->getName(),
                    'action'     => $route->getActionName(),
                    'middleware' => $route->middleware(),
                ];
            })
            ->sortBy(fn($r) => $r['uri'])
            ->groupBy('module')
            ->map(fn($group) => $group->values()->all())
            ->toArray();

        // ─────────────────────────────────────────────────────────────────────
        // Scrive JSON (crea cartella se manca)
        // ─────────────────────────────────────────────────────────────────────
        File::ensureDirectoryExists(dirname($path));
        File::put($path, json_encode([
            '_generated' => true,
            '_prefix'    => $prefix === '' ? '/' : "/{$prefix}",
            'routes'     => $routesByModule,
        ], JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES));

        $this->info("✅ File JSON creato in: {$path}");
        return self::SUCCESS;
    }

    // ============================
    // Helpers
    // ============================
    private function moduleFromUri(string $uri, string $prefix): string
    {
        // Esempio: prefix="api/v1", uri="api/v1/spese/1" ⇒ modulo="spese"
        $trimmed = ltrim($uri, '/');
        $pref = rtrim($prefix, '/'); // "api/v1"
        if ($pref !== '' && str_starts_with($trimmed, $pref)) {
            $rest = ltrim(substr($trimmed, strlen($pref)), '/'); // "spese/1"
        } else {
            $rest = $trimmed;
        }
        $first = explode('/', $rest, 2)[0] ?? '';
        return $first !== '' ? $first : 'root';
    }
}
