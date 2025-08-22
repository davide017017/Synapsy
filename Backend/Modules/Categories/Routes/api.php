<?php

use Illuminate\Support\Facades\Route;
use Modules\Categories\Http\Controllers\CategoriesController;

Route::middleware(['auth:sanctum'])
    ->prefix('v1')
    ->group(function () {
        Route::get('categories', [CategoriesController::class, 'indexApi'])
            ->name('categories.index');
        Route::get('categories/{category}', [CategoriesController::class, 'showApi'])
            ->name('categories.show');
        Route::post('categories', [CategoriesController::class, 'storeApi'])
            ->name('categories.store');
        Route::put('categories/{category}', [CategoriesController::class, 'updateApi'])
            ->name('categories.update');
        Route::delete('categories/{category}', [CategoriesController::class, 'destroyApi'])
            ->name('categories.destroy');
    });
