<?php

use Illuminate\Support\Facades\Route;
use Modules\User\Http\Controllers\UserController;
use Modules\User\Http\Controllers\ProfileController;
use Modules\User\Http\Controllers\DashboardController;

Route::middleware(['auth:sanctum'])->prefix('v1')->group(function () {
    // Utenti multipli = resource
    Route::apiResource('users', UserController::class)->names('users');

    // Profilo = rotte esplicite per il proprio utente
    Route::get('profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::put('profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Dashboard
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard.index');
});
