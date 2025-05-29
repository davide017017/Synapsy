<?php

use Illuminate\Support\Facades\Route;
use Modules\Entrate\Http\Controllers\EntrateController;

Route::middleware(['web', 'auth', 'verified']) 
    ->group(function () {
        Route::resource('entrate', EntrateController::class)
            ->names('entrate.web')
            ->parameters(['entrate' => 'entrata']);
});