<?php

use Illuminate\Support\Facades\Route;
use Modules\DBCore\Http\Controllers\BackupController;

// ══════════════════════════════════════════════════════════════════
// API routes per DBCore — Admin Backup
// Prefisso finale: /api/v1/admin/...
// Protezione: auth:sanctum + check isAdmin() nel controller
// ══════════════════════════════════════════════════════════════════
Route::middleware(['auth:sanctum'])
    ->prefix('v1/admin')
    ->group(function () {
        // Crea un nuovo backup del database
        Route::post('backup', [BackupController::class, 'create']);

        // Lista tutti i backup esistenti
        Route::get('backups', [BackupController::class, 'index']);

        // Scarica un backup specifico
        Route::get('backups/{filename}/download', [BackupController::class, 'download'])
            ->where('filename', '.+');

        // Elimina un backup specifico
        Route::delete('backups/{filename}', [BackupController::class, 'destroy'])
            ->where('filename', '.+');
    });
