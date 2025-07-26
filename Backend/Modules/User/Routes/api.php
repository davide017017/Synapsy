<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

use Modules\User\Http\Controllers\UserController;
use Modules\User\Http\Controllers\ProfileController;
use Modules\User\Http\Controllers\DashboardController;
use Modules\User\Http\Controllers\ApiLoginController;
use Modules\User\Http\Controllers\ApiRegisterController;
use Modules\User\Http\Controllers\VerifyPendingEmailController;
use Modules\User\Http\Controllers\ApiVerifyEmailController;
use Modules\User\Http\Controllers\ApiForgotPasswordController;
use Modules\User\Http\Controllers\ApiResetPasswordController;

Route::prefix('v1')->group(function () {
    // --- Auth / Registrazione ---
    Route::post('login', [ApiLoginController::class, 'login']);
    Route::post('register', [ApiRegisterController::class, 'register']);
    Route::get('verify-email/{id}/{hash}', ApiVerifyEmailController::class)->name('api.verification.verify');
    Route::post('forgot-password', [ApiForgotPasswordController::class, 'sendResetLink']);
    Route::post('reset-password', [ApiResetPasswordController::class, 'reset']);
    Route::get('verify-new-email/{id}/{hash}', VerifyPendingEmailController::class)
        ->name('verification.pending-email');

    // --- ROTTE PROTETTE ---
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [ApiLoginController::class, 'logout']);
        Route::get('me', fn(Request $r) => $r->user())->name('me.show');
        Route::apiResource('users', UserController::class)->names('users');
        Route::get('profile', [ProfileController::class, 'show'])->name('profile.show');
        Route::put('profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('profile/pending-email', [ProfileController::class, 'cancelPendingEmail'])->name('profile.pending-email.cancel');
        Route::post('profile/pending-email/resend', [ProfileController::class, 'resendPendingEmail'])->name('profile.pending-email.resend');
        Route::delete('profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard.index');
    });
});
