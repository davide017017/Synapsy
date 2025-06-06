<?php

use Illuminate\Support\Facades\Route;
use Modules\FinancialOverview\Http\Controllers\FinancialOverviewController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    Route::apiResource('financialoverview', FinancialOverviewController::class)->names('financialoverview');
});
