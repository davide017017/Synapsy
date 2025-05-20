<?php

use Illuminate\Support\Facades\Route;
use Modules\Spese\Http\Controllers\SpeseController;

Route::middleware(['web', 'auth', 'verified'])
    ->group(function () {
        Route::resource('spese', SpeseController::class)
            ->names('spese.web')
            ->parameters(['spese' => 'spesa']);
    });
