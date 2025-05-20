<?php

use Illuminate\Support\Facades\Route;
use Modules\Spese\Http\Controllers\SpeseController;

Route::middleware(['auth:sanctum'])
    ->prefix('v1')
    ->group(function () {
        Route::apiResource('spese', SpeseController::class)
            ->names('spese')
            ->parameters(['spese' => 'spesa']);
    });
