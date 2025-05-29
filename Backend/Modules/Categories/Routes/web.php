<?php

use Illuminate\Support\Facades\Route;
use Modules\Categories\Http\Controllers\CategoriesController;

Route::middleware(['web', 'auth', 'verified']) 
    ->group(function () {
        Route::resource('categories', CategoriesController::class)
            ->names('categories.web')
            ->parameters( ['categories' => 'category']);
});
