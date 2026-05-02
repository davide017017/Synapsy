<?php

namespace Modules\DBCore\Console\Commands;

use Illuminate\Console\Command;

// ─────────────────────────────────────────────────────────────────────────────
// Command: custom:backup-database
// Crea un dump pg_dump del database PostgreSQL configurato e lo salva in
// storage/app/backups/ con nome: backup_YYYY-MM-DD_HH-II-SS_{dbname}.sql
// ─────────────────────────────────────────────────────────────────────────────
class BackupDatabaseCommand extends Command {
  protected $signature = 'custom:backup-database';

  protected $description = 'Crea un backup pg_dump del database PostgreSQL in storage/app/backups/';

  public function handle(): int {
    $connection = config('database.default');
    $dbConfig   = config("database.connections.{$connection}");

    if (($dbConfig['driver'] ?? '') !== 'pgsql') {
      $this->error('Backup supportato solo per driver PostgreSQL.');
      return self::FAILURE;
    }

    // Crea la directory di backup se non esiste
    $backupDir = storage_path('app/backups');
    if (! is_dir($backupDir)) {
      mkdir($backupDir, 0755, true);
    }

    $timestamp = now()->format('Y-m-d_H-i-s');
    $dbName    = $dbConfig['database'];
    $filename  = "backup_{$timestamp}_{$dbName}.sql";
    $filePath  = "{$backupDir}/{$filename}";

    $host     = $dbConfig['host'];
    $port     = (int) ($dbConfig['port'] ?? 5432);
    $username = $dbConfig['username'];
    $password = $dbConfig['password'];

    // Imposta PGPASSWORD per evitare il prompt interattivo di pg_dump
    putenv("PGPASSWORD={$password}");

    // Determina il percorso di pg_dump (Windows vs Unix)
    $pgDumpPath = $this->getPgDumpPath();
    if (!$pgDumpPath) {
      putenv('PGPASSWORD');
      $this->error('pg_dump non trovato. Verificare che PostgreSQL sia installato e nel PATH.');
      return self::FAILURE;
    }

    $cmd = sprintf(
      '%s --host=%s --port=%d --username=%s --no-password --format=plain %s',
      escapeshellarg($pgDumpPath),
      escapeshellarg($host),
      $port,
      escapeshellarg($username),
      escapeshellarg($dbName)
    );

    $descriptors = [
      0 => ['pipe', 'r'],           // stdin
      1 => ['file', $filePath, 'w'], // stdout → file
      2 => ['pipe', 'w'],           // stderr → variabile
    ];

    $process = proc_open($cmd, $descriptors, $pipes);

    if (! is_resource($process)) {
      putenv('PGPASSWORD');
      $this->error('Impossibile avviare pg_dump. Verificare che sia installato sul server.');
      return self::FAILURE;
    }

    fclose($pipes[0]);
    $stderr   = stream_get_contents($pipes[2]);
    fclose($pipes[2]);
    $exitCode = proc_close($process);

    // Rimuove PGPASSWORD dall'ambiente del processo corrente
    putenv('PGPASSWORD');

    if ($exitCode !== 0) {
      $this->error("pg_dump fallito (exit {$exitCode}): {$stderr}");
      if (file_exists($filePath)) {
        unlink($filePath); // rimuove file parziale
      }
      return self::FAILURE;
    }

    if (! file_exists($filePath) || filesize($filePath) === 0) {
      $this->error('Il file di backup risulta vuoto o non è stato creato.');
      return self::FAILURE;
    }

    $size = $this->formatBytes(filesize($filePath));
    $this->info("✅ Backup completato: {$filename} ({$size})");

    return self::SUCCESS;
  }

  /**
   * Trova il percorso di pg_dump sul sistema (Windows o Unix)
   */
  private function getPgDumpPath(): ?string {
    // Su Windows, prova le posizioni comuni di PostgreSQL
    if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
      $commonPaths = [
        'C:\\Program Files\\PostgreSQL\\18\\bin\\pg_dump.exe',
        'C:\\Program Files\\PostgreSQL\\17\\bin\\pg_dump.exe',
        'C:\\Program Files\\PostgreSQL\\16\\bin\\pg_dump.exe',
        'C:\\Program Files\\PostgreSQL\\15\\bin\\pg_dump.exe',
        'C:\\Program Files (x86)\\PostgreSQL\\18\\bin\\pg_dump.exe',
        'C:\\Program Files (x86)\\PostgreSQL\\17\\bin\\pg_dump.exe',
      ];

      foreach ($commonPaths as $path) {
        if (file_exists($path)) {
          return $path;
        }
      }

      // Se non trovato negli standard, prova via where
      $output = [];
      $returnVar = 0;
      @exec('where pg_dump 2>nul', $output, $returnVar);
      if ($returnVar === 0 && !empty($output[0])) {
        return trim($output[0]);
      }
    }

    // Su Unix/Linux, usa which
    $output = [];
    $returnVar = 0;
    @exec('which pg_dump', $output, $returnVar);
    if ($returnVar === 0 && !empty($output[0])) {
      return trim($output[0]);
    }

    // Fallback: prova pg_dump direttamente (se è nel PATH)
    $output = [];
    $returnVar = 0;
    @exec('pg_dump --version', $output, $returnVar);
    if ($returnVar === 0) {
      return 'pg_dump';
    }

    return null;
  }

  private function formatBytes(int $bytes): string {
    if ($bytes >= 1_048_576) {
      return round($bytes / 1_048_576, 2) . ' MB';
    }
    if ($bytes >= 1_024) {
      return round($bytes / 1_024, 2) . ' KB';
    }
    return $bytes . ' B';
  }
}
