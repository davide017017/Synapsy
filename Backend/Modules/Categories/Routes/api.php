<?php

use Illuminate\Support\Facades\Route;
use Modules\Categories\Http\Controllers\CategoriesController;

Route::middleware(['auth:sanctum'])
    ->prefix('v1')
    ->group(function () {
        Route::get('categories', [CategoriesController::class, 'indexApi']);
        Route::get('categories/{category}', [CategoriesController::class, 'showApi']);
        Route::post('categories', [CategoriesController::class, 'storeApi']);
        Route::put('categories/{category}', [CategoriesController::class, 'updateApi']);
        Route::delete('categories/{category}', [CategoriesController::class, 'destroyApi']);
    });