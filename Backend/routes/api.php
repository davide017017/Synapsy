<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\RecurringWebhookController;

// =============================================================================
// 🔧 ROTTE INTERNE — machine-to-machine, protette da CRON_SECRET
// Non richiedono autenticazione Sanctum: sono chiamate da servizi esterni
// (cron-job.org, UptimeRobot, ecc.) per svegliare il server e processare le
// ricorrenti su hosting free tier (Render.com) dove lo scheduler non è affidabile.
// =============================================================================
Route::prefix('v1/internal')->group(function () {
    Route::get('process-recurring', [RecurringWebhookController::class, 'process'])
        ->name('internal.process-recurring');
});
