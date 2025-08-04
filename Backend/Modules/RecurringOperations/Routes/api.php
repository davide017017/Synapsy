<?php

use Illuminate\Support\Facades\Route;
use Modules\RecurringOperations\Http\Controllers\RecurringOperationController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('recurring-operations', RecurringOperationController::class)->names('recurring-operations');
    Route::patch('recurring-operations/move-category', [RecurringOperationController::class, 'moveCategory'])
        ->name('recurring-operations.move-category');
    Route::get('recurring-operations/next-occurrences', [RecurringOperationController::class, 'getNextOccurrences'])
        ->name('recurring-operations.next-occurrences');
});

