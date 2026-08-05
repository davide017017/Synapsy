<?php

use Illuminate\Support\Facades\Route;
use Modules\FinancialOverview\Http\Controllers\FinancialOverviewController;

/*
|--------------------------------------------------------------------------
| API Routes (JSON)
|--------------------------------------------------------------------------
| Queste rotte sono usate dal frontend React/Next.js.
| Restituiscono SOLO dati JSON, protette da Sanctum.
*/

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
  // Panoramica finanziaria (API JSON)
  Route::get('financialoverview', [FinancialOverviewController::class, 'indexApi'])
    ->name('financialoverview.index');
  // Prossimi pagamenti/incassi (ricorrenze + spese/entrate future)
  Route::get('financialoverview/upcoming', [FinancialOverviewController::class, 'upcomingApi'])
    ->name('financialoverview.upcoming');
  // Puoi aggiungere qui altre rotte API (store, update, ecc) se servono
});
