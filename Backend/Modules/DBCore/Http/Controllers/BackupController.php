<?php

namespace Modules\DBCore\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Storage;
use Symfony\Component\HttpFoundation\BinaryFileResponse;

// ─────────────────────────────────────────────────────────────────────────────
// Controller: BackupController
// Gestisce la creazione, il listing, il download e l'eliminazione dei backup
// del database. Tutti gli endpoint richiedono is_admin === true.
//
// POST   /api/v1/admin/backup                    → crea backup
// GET    /api/v1/admin/backups                   → lista backup
// GET    /api/v1/admin/backups/{filename}/download → scarica
// DELETE /api/v1/admin/backups/{filename}        → elimina
// ─────────────────────────────────────────────────────────────────────────────
class BackupController extends Controller {
  private const BACKUP_DIR = 'backups';

  // ─────────────────────────────────────────────────────────────────────────
  // POST /api/v1/admin/backup
  // Avvia custom:backup-database via Artisan e restituisce il filename.
  // ─────────────────────────────────────────────────────────────────────────
  public function create(Request $request): JsonResponse {
    if (! $request->user()?->isAdmin()) {
      return response()->json(['error' => 'Accesso non autorizzato.'], 403);
    }

    try {
      $exitCode = Artisan::call('custom:backup-database');

      if ($exitCode !== 0) {
        return response()->json([
          'error'   => 'Backup fallito. Verificare che pg_dump sia installato sul server.',
          'details' => trim(Artisan::output()),
        ], 500);
      }

      // Restituisce le info del file appena creato (il più recente)
      $latest = collect(Storage::disk('local')->files(self::BACKUP_DIR))
        ->sortByDesc(fn($f) => Storage::disk('local')->lastModified($f))
        ->first();

      return response()->json([
        'message'  => 'Backup completato con successo.',
        'filename' => $latest ? basename($latest) : null,
        'size'     => $latest ? Storage::disk('local')->size($latest) : null,
      ]);
    } catch (\Throwable $e) {
      return response()->json(['error' => $e->getMessage()], 500);
    }
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GET /api/v1/admin/backups
  // Lista tutti i backup ordinati dal più recente.
  // ─────────────────────────────────────────────────────────────────────────
  public function index(Request $request): JsonResponse {
    if (! $request->user()?->isAdmin()) {
      return response()->json(['error' => 'Accesso non autorizzato.'], 403);
    }

    // Leggi direttamente dal filesystem (più affidabile di Storage::disk)
    $backupPath = storage_path('app/backups');

    if (!is_dir($backupPath)) {
      mkdir($backupPath, 0755, true);
    }

    $files = [];
    $items = scandir($backupPath, SCANDIR_SORT_DESCENDING);
    foreach ($items as $item) {
      if ($item !== '.' && $item !== '..' && is_file($backupPath . '/' . $item)) {
        $fullPath = $backupPath . '/' . $item;
        $files[] = [
          'filename'   => basename($item),
          'size'       => filesize($fullPath),
          'created_at' => date('Y-m-d H:i:s', filemtime($fullPath)),
        ];
      }
    }

    return response()->json(['data' => $files]);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // GET /api/v1/admin/backups/{filename}/download
  // Scarica il file. Il filename viene sanitizzato con basename() per
  // prevenire path traversal.
  // ─────────────────────────────────────────────────────────────────────────
  public function download(Request $request, string $filename): BinaryFileResponse|JsonResponse {
    if (! $request->user()?->isAdmin()) {
      return response()->json(['error' => 'Accesso non autorizzato.'], 403);
    }

    $filename = basename($filename); // path traversal prevention
    $fullPath = storage_path('app/' . self::BACKUP_DIR . '/' . $filename);

    if (! file_exists($fullPath)) {
      return response()->json(['error' => 'File non trovato.'], 404);
    }

    return response()->download($fullPath, $filename, [
      'Content-Type' => 'application/octet-stream',
    ]);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // DELETE /api/v1/admin/backups/{filename}
  // ─────────────────────────────────────────────────────────────────────────
  public function destroy(Request $request, string $filename): JsonResponse {
    if (! $request->user()?->isAdmin()) {
      return response()->json(['error' => 'Accesso non autorizzato.'], 403);
    }

    $filename = basename($filename);
    $fullPath = storage_path('app/' . self::BACKUP_DIR . '/' . $filename);

    if (! file_exists($fullPath)) {
      return response()->json(['error' => 'File non trovato.'], 404);
    }

    unlink($fullPath);

    return response()->json(['message' => 'Backup eliminato.']);
  }
}
