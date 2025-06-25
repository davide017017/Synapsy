<?php

use Illuminate\Support\Facades\Route;
use Modules\Spese\Http\Controllers\SpeseController;

Route::middleware(['web', 'auth', 'verified'])
    ->group(function () {
        Route::get('spese', [SpeseController::class, 'indexWeb'])->name('spese.web.index');
        Route::get('spese/create', [SpeseController::class, 'createWeb'])->name('spese.web.create');
        Route::post('spese', [SpeseController::class, 'storeWeb'])->name('spese.web.store');
        Route::get('spese/{spesa}', [SpeseController::class, 'showWeb'])->name('spese.web.show');
        Route::get('spese/{spesa}/edit', [SpeseController::class, 'editWeb'])->name('spese.web.edit');
        Route::put('spese/{spesa}', [SpeseController::class, 'updateWeb'])->name('spese.web.update');
        Route::delete('spese/{spesa}', [SpeseController::class, 'destroyWeb'])->name('spese.web.destroy');
    });