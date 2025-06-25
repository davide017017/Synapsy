<?php

use Illuminate\Support\Facades\Route;
use Modules\Entrate\Http\Controllers\EntrateController;

Route::middleware(['web', 'auth', 'verified'])
    ->group(function () {
        Route::get('entrate', [EntrateController::class, 'indexWeb'])->name('entrate.web.index');
        Route::get('entrate/create', [EntrateController::class, 'createWeb'])->name('entrate.web.create');
        Route::post('entrate', [EntrateController::class, 'storeWeb'])->name('entrate.web.store');
        Route::get('entrate/{entrata}', [EntrateController::class, 'showWeb'])->name('entrate.web.show');
        Route::get('entrate/{entrata}/edit', [EntrateController::class, 'editWeb'])->name('entrate.web.edit');
        Route::put('entrate/{entrata}', [EntrateController::class, 'updateWeb'])->name('entrate.web.update');
        Route::delete('entrate/{entrata}', [EntrateController::class, 'destroyWeb'])->name('entrate.web.destroy');
    });