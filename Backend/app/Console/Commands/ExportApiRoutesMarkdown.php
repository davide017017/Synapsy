<?php

// ─────────────────────────────────────────────────────────────────────────────
// Comando: routes:export-api-md
// Dettagli: esporta le rotte API in Markdown (docs/API/ROUTES.md) raggruppate
//           per "modulo" ricavato dal primo segmento dopo il prefisso
// ─────────────────────────────────────────────────────────────────────────────

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Route;

class ExportApiRoutesMarkdown extends Command
{
    // ============================
    // Configurazione
    // ============================
    protected $signature = 'routes:export-api-md
        {--path=docs/API/ROUTES.md : Percorso file di output MD}
        {--prefix=/api/v1 : Prefisso URI da esportare (es. /api/v1)}';

    protected $description = 'Esporta le rotte API in formato Markdown, organizzate per modulo (in base all’URI).';

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
        $grouped = collect(Route::getRoutes())
            ->filter(function ($route) use ($prefix) {
                $uri = $route->uri();
                return $prefix === '' ? true : str_starts_with($uri, $prefix);
            })
            ->map(function ($route) use ($prefix) {
                $methods = array_values(array_diff($route->methods(), ['HEAD']));
                $uri     = $route->uri();
                return [
                    'module' => $this->moduleFromUri($uri, $prefix),
                    'method' => implode('|', $methods),
                    'uri'    => $uri,
                    'name'   => $route->getName() ?: '—',
                    'action' => $route->getActionName() ?: '—',
                ];
            })
            ->sortBy(fn($r) => $r['uri'])
            ->groupBy('module')
            ->sortKeys();

        // ─────────────────────────────────────────────────────────────────────
        // Costruzione Markdown (header + gruppi con tabella ordinata)
        // ─────────────────────────────────────────────────────────────────────
        $lines = [];
        $lines[] = '<!-- ─────────────────────────────────────────────────────────────────────────────';
        $lines[] = '  Documento: docs/API/ROUTES.md';
        $lines[] = '  Scopo: elenco rotte API (generato automaticamente) — non modificare a mano';
        $lines[] = '────────────────────────────────────────────────────────────────────────────── -->';
        $lines[] = '';
        $lines[] = '> ⚠️ **Documento generato automaticamente**';
        $lines[] = '> Rigenera con:';
        $lines[] = '>';
        $lines[] = '```bash';
        $lines[] = "php artisan routes:export-api-json --path=docs/API/ROUTES.json --prefix=/" . ($prefix === '' ? '' : $prefix);
        $lines[] = "php artisan routes:export-api-md   --path=docs/API/ROUTES.md   --prefix=/" . ($prefix === '' ? '' : $prefix);
        $lines[] = '```';
        $lines[] = '';
        $lines[] = '# 📜 API Routes';
        $lines[] = '';

        foreach ($grouped as $module => $routes) {
            $lines[] = "## 🧩 Modulo: `{$module}`";
            $lines[] = '---';
            $lines[] = '| Method | URI | Name | Action |';
            $lines[] = '|---|---|---|---|';

            foreach ($routes as $r) {
                $m  = str_replace('|', '\\|', $r['method']);
                $u  = $r['uri'];
                $n  = $r['name'];
                $a  = str_replace('|', '\\|', $r['action']);
                $lines[] = "| {$m} | `{$u}` | {$n} | `{$a}` |";
            }
            $lines[] = '';
        }

        // ─────────────────────────────────────────────────────────────────────
        // Scrive MD (crea cartella se manca)
        // ─────────────────────────────────────────────────────────────────────
        File::ensureDirectoryExists(dirname($path));
        File::put($path, implode("\n", $lines) . "\n");

        $this->info("✅ File Markdown creato in: {$path}");
        return self::SUCCESS;
    }

    // ============================
    // Helpers
    // ============================
    private function moduleFromUri(string $uri, string $prefix): string
    {
        // Esempio: prefix="api/v1", uri="api/v1/entrate/1" ⇒ modulo="entrate"
        $trimmed = ltrim($uri, '/');
        $pref = rtrim($prefix, '/'); // "api/v1"
        if ($pref !== '' && str_starts_with($trimmed, $pref)) {
            $rest = ltrim(substr($trimmed, strlen($pref)), '/'); // "entrate/1"
        } else {
            $rest = $trimmed;
        }
        $first = explode('/', $rest, 2)[0] ?? '';
        return $first !== '' ? $first : 'root';
    }
}
