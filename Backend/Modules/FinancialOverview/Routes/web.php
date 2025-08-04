<?php

use Illuminate\Support\Facades\Route;
use Modules\FinancialOverview\Http\Controllers\FinancialOverviewController;

/*
|--------------------------------------------------------------------------
| Web Routes (Blade)
|--------------------------------------------------------------------------
| Solo per utenti autenticati e con email verificata.
| Queste rotte restituiscono le view Blade per il backend/admin.
*/

Route::middleware(['auth', 'verified'])->group(function () {
    // Panoramica finanziaria (pagina Blade)
    Route::get('/financial-overview', [FinancialOverviewController::class, 'indexWeb'])
        ->name('financial-overview.index');
});

