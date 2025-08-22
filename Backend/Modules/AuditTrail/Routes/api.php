<?php

use Illuminate\Support\Facades\Route;
use Modules\AuditTrail\Http\Controllers\AuditTrailController;

// ==========================
// API routes per AuditTrail
// ==========================
Route::middleware(['auth:sanctum'])
    ->prefix('v1')
    ->group(function () {
        Route::apiResource('audittrails', AuditTrailController::class)
            ->parameters(['audittrails' => 'audit_log'])
            ->names('audittrails');
    });
// Nota: le rotte API sono protette da middleware 'auth:sanctum' per garantire che solo utenti autenticati possano accedere.
