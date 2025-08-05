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
    // =========================================================================
    // 🌐 Pubblica: Avatars
    // =========================================================================
    Route::get('avatars', function () {
        return response()->json([
            ['id' => 1, 'label' => 'Ragazzo con giacca', 'src' => 'images/avatars/avatar_01_boy.webp'],
            ['id' => 2, 'label' => 'Anziano elegante', 'src' => 'images/avatars/avatar_02_anziano.webp'],
            ['id' => 3, 'label' => 'Scimmia felice', 'src' => 'images/avatars/avatar_03_felice.webp'],
            ['id' => 4, 'label' => 'Affamato e sorridente', 'src' => 'images/avatars/avatar_04_affamato.webp'],
            ['id' => 5, 'label' => 'Classico', 'src' => 'images/avatars/avatar_05_classico.webp'],
            ['id' => 6, 'label' => 'Anziana gentile', 'src' => 'images/avatars/avatar_06_anziana.webp'],
            ['id' => 7, 'label' => 'Professionale (rossa)', 'src' => 'images/avatars/avatar_07_professionale.webp'],
            ['id' => 8, 'label' => 'Elegante (rossa)', 'src' => 'images/avatars/avatar_08_elegante_rossa.webp'],
            ['id' => 9, 'label' => 'Elegante (castana)', 'src' => 'images/avatars/avatar_09_elegante_castana.webp'],
            ['id' => 10, 'label' => 'Elegante (chiara)', 'src' => 'images/avatars/avatar_10_elegante_chiara.webp'],
            ['id' => 11, 'label' => 'Muscoloso', 'src' => 'images/avatars/avatar_11_muscoloso.webp'],
            ['id' => 12, 'label' => 'Giovane con verde', 'src' => 'images/avatars/avatar_12_young_verde.webp'],
            ['id' => 13, 'label' => 'Surfista', 'src' => 'images/avatars/avatar_13_surfista.webp'],
            ['id' => 14, 'label' => 'Surfista donna', 'src' => 'images/avatars/avatar_14_surfista_donna.webp'],
            ['id' => 15, 'label' => 'Business con occhiali', 'src' => 'images/avatars/avatar_15_business.webp'],
        ]);
    });

    // =========================================================================
    // 🔐 Auth / Registrazione
    // =========================================================================
    Route::post('login', [ApiLoginController::class, 'login'])->middleware('throttle:5,1');
    Route::post('register', [ApiRegisterController::class, 'register'])->middleware('throttle:5,1');
    Route::get('verify-email/{id}/{hash}', ApiVerifyEmailController::class)->name('api.verification.verify');
    Route::post('forgot-password', [ApiForgotPasswordController::class, 'sendResetLink'])->middleware('throttle:5,1');
    Route::post('reset-password', [ApiResetPasswordController::class, 'reset'])->middleware('throttle:5,1');
    Route::get('verify-new-email/{id}/{hash}', VerifyPendingEmailController::class)
        ->name('verification.pending-email');

    // =========================================================================
    // 🔒 ROTTE PROTETTE
    // =========================================================================
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
