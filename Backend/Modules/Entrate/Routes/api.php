<?php

use Illuminate\Support\Facades\Route;
use Modules\Entrate\Http\Controllers\EntrateController;

Route::middleware(['auth:sanctum'])
    ->prefix('v1')
    ->group(function () {
        Route::get('entrate', [EntrateController::class, 'indexApi'])
            ->name('entrate.index');
        Route::get('entrate/{entrata}', [EntrateController::class, 'showApi'])
            ->name('entrate.show');
        Route::post('entrate', [EntrateController::class, 'storeApi'])
            ->name('entrate.store');
        Route::put('entrate/{entrata}', [EntrateController::class, 'updateApi'])
            ->name('entrate.update');
        Route::delete('entrate/{entrata}', [EntrateController::class, 'destroyApi'])
            ->name('entrate.destroy');
        Route::patch('entrate/move-category', [EntrateController::class, 'moveCategory'])
            ->name('entrate.move-category');
    });
