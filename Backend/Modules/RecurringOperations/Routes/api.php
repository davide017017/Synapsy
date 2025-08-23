<?php

use Illuminate\Support\Facades\Route;
use Modules\RecurringOperations\Http\Controllers\RecurringOperationController as C;

// ─────────────────────────────────────────────────────────────────────────────
// Sezione: API v1 - Recurring Operations
// Dettagli: il RouteServiceProvider del modulo aggiunge già '/api' e 'api.'
//           Qui aggiungiamo SOLO '/v1/recurring-operations' e 'recurring-operations.'
// ─────────────────────────────────────────────────────────────────────────────

Route::middleware(['auth:sanctum'])
    ->prefix('v1/recurring-operations')
    ->name('recurring-operations.')
    ->group(function () {

        // ============================
        // Listing & create
        // ============================
        Route::get('/', [C::class, 'index'])->name('index');
        Route::post('/', [C::class, 'store'])->name('store');

        // ============================
        // ROTTE STATICHE (prima delle parametrizzate)
        // ============================
        Route::patch('/move-category', [C::class, 'moveCategory'])->name('move-category');
        Route::get('/next-occurrences', [C::class, 'getNextOccurrences'])->name('next-occurrences');

        // ============================
        // ROTTE CON PARAMETRO (vincolo numerico)
        // ============================
        Route::get('/{recurring_operation}', [C::class, 'show'])
            ->whereNumber('recurring_operation')->name('show');

        Route::match(['put', 'patch'], '/{recurring_operation}', [C::class, 'update'])
            ->whereNumber('recurring_operation')->name('update');

        Route::delete('/{recurring_operation}', [C::class, 'destroy'])
            ->whereNumber('recurring_operation')->name('destroy');
    });
