<?php

use Illuminate\Support\Facades\Route;
use Modules\Entrate\Http\Controllers\EntrateController;

Route::middleware(['auth:sanctum'])
    ->prefix('v1')
    ->group(function () {
        Route::apiResource('entrate', EntrateController::class)
            ->names('entrate.api')
            ->parameters(['entrate' => 'entrata']);
    });

