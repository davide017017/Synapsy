<?php

use Illuminate\Support\Facades\Route;
use Modules\Categories\Http\Controllers\CategoriesController;

Route::middleware(['web', 'auth', 'verified'])
    ->group(function () {
        Route::get('categories', [CategoriesController::class, 'indexWeb'])->name('categories.web.index');
        Route::get('categories/create', [CategoriesController::class, 'createWeb'])->name('categories.web.create');
        Route::post('categories', [CategoriesController::class, 'storeWeb'])->name('categories.web.store');
        Route::get('categories/{category}', [CategoriesController::class, 'showWeb'])->name('categories.web.show');
        Route::get('categories/{category}/edit', [CategoriesController::class, 'editWeb'])->name('categories.web.edit');
        Route::put('categories/{category}', [CategoriesController::class, 'updateWeb'])->name('categories.web.update');
        Route::delete('categories/{category}', [CategoriesController::class, 'destroyWeb'])->name('categories.web.destroy');
    });