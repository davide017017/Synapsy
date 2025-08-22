<?php

use Illuminate\Support\Facades\Route;
use Modules\Spese\Http\Controllers\SpeseController;

Route::middleware(['auth:sanctum'])
    ->prefix('v1')
    ->group(function () {
        Route::get('spese', [SpeseController::class, 'indexApi'])
            ->name('spese.index');
        Route::get('spese/{spesa}', [SpeseController::class, 'showApi'])
            ->name('spese.show');
        Route::post('spese', [SpeseController::class, 'storeApi'])
            ->name('spese.store');
        Route::put('spese/{spesa}', [SpeseController::class, 'updateApi'])
            ->name('spese.update');
        Route::delete('spese/{spesa}', [SpeseController::class, 'destroyApi'])
            ->name('spese.destroy');
        Route::patch('spese/move-category', [SpeseController::class, 'moveCategory'])
            ->name('spese.move-category');
    });
