<?php

use Illuminate\Support\Facades\Route;
use Modules\AuditTrail\Http\Controllers\AuditTrailController;

// ==========================
// Web routes per AuditTrail
// ==========================
Route::middleware(['auth', 'verified'])
    ->name('audittrail.')
    ->group(function () {
        Route::resource('audittrails', AuditTrailController::class)
            ->parameters(['audittrails' => 'audit_log'])
            ->names('audittrails');
    });
// Nota: le rotte sono protette da middleware 'auth' e 'verified' per garantire che solo utenti autenticati possano accedere.
