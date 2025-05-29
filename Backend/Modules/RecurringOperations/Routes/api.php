<?php

use Illuminate\Support\Facades\Route;
use Modules\RecurringOperations\Http\Controllers\RecurringOperationController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('recurring-operations', RecurringOperationController::class)->names('recurring-operations');

});
