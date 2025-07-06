<?php

use Illuminate\Support\Facades\Route;
use Modules\Entrate\Http\Controllers\EntrateController;

Route::middleware(['auth:sanctum'])
    ->prefix('v1')
    ->group(function () {
        Route::get('entrate', [EntrateController::class, 'indexApi']);
        Route::get('entrate/{entrata}', [EntrateController::class, 'showApi']);
        Route::post('entrate', [EntrateController::class, 'storeApi']);
        Route::put('entrate/{entrata}', [EntrateController::class, 'updateApi']);
        Route::delete('entrate/{entrata}', [EntrateController::class, 'destroyApi']);
        Route::patch('/entrate/move-category', [EntrateController::class, 'moveCategory']);
        Route::get('entrate/next-occurrences', [EntrateController::class, 'getNextOccurrences']);
    });
