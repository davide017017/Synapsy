<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use Modules\User\Http\Controllers\UserController;
use Modules\User\Http\Controllers\ProfileController;
use Modules\User\Http\Controllers\DashboardController;
use Modules\User\Http\Controllers\ApiLoginController;

Route::prefix('v1')->group(function () {
    // --- LOGIN: Bearer token ---
    Route::post('login', [ApiLoginController::class, 'login']);

    // --- ROTTE PROTETTE ---
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [ApiLoginController::class, 'logout']);
        Route::get('me', fn(Request $r) => $r->user())->name('me.show');
        Route::apiResource('users', UserController::class)->names('users');
        Route::get('profile', [ProfileController::class, 'show'])->name('profile.show');
        Route::put('profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard.index');
    });
});
