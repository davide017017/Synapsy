<?php

use Illuminate\Support\Facades\Route;
use Modules\Spese\Http\Controllers\SpeseController;

Route::middleware(['auth:sanctum'])
    ->prefix('v1')
    ->group(function () {
        Route::get('spese', [SpeseController::class, 'indexApi']);
        Route::get('spese/{spesa}', [SpeseController::class, 'showApi']);
        Route::post('spese', [SpeseController::class, 'storeApi']);
        Route::put('spese/{spesa}', [SpeseController::class, 'updateApi']);
        Route::delete('spese/{spesa}', [SpeseController::class, 'destroyApi']);
        Route::patch('/spese/move-category', [SpeseController::class, 'moveCategory']);
        Route::get('spese/next-occurrences', [SpeseController::class, 'getNextOccurrences']);
    });

