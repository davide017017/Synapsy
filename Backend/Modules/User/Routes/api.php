<?php

use Illuminate\Support\Facades\Route;
use Modules\User\Http\Controllers\UserController;
use Modules\User\Http\Controllers\ProfileController;
use Modules\User\Http\Controllers\DashboardController;
use Modules\User\Http\Controllers\ApiLoginController;

Route::prefix('v1')->group(function () {
    // ✅ Login token-based per mobile/app
    Route::post('login', [ApiLoginController::class, 'login']);

    // ✅ Rotte protette
    Route::middleware(['auth:sanctum'])->group(function () {
        Route::post('logout', [ApiLoginController::class, 'logout']);

        // Utenti
        Route::apiResource('users', UserController::class)->names('users');

        // // Profilo
        // Route::get('profile',    [ProfileController::class, 'edit'])->name('profile.edit');
        Route::put('profile',    [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

        // Dashboard
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard.index');
    });
});
