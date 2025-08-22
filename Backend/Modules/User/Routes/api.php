<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Modules\User\Http\Controllers\ApiForgotPasswordController;
use Modules\User\Http\Controllers\ApiLoginController;
use Modules\User\Http\Controllers\ApiRegisterController;
use Modules\User\Http\Controllers\ApiResetPasswordController;
use Modules\User\Http\Controllers\ApiVerifyEmailController;
use Modules\User\Http\Controllers\DashboardController;
use Modules\User\Http\Controllers\ProfileController;
use Modules\User\Http\Controllers\UserController;
use Modules\User\Http\Controllers\VerifyPendingEmailController;

Route::prefix('v1')->group(function () {
    // =========================================================================
    // 🌐 Pubblica: Avatars
    // =========================================================================
    Route::get('avatars', function () {
        return response()->json([
            ['id' => 1, 'label' => 'Ragazzo con giacca', 'src' => 'avatar_01_boy.webp'],
            ['id' => 2, 'label' => 'Anziano elegante', 'src' => 'avatar_02_anziano.webp'],
            ['id' => 3, 'label' => 'Scimmia felice', 'src' => 'avatar_03_felice.webp'],
            ['id' => 4, 'label' => 'Affamato e sorridente', 'src' => 'avatar_04_affamato.webp'],
            ['id' => 5, 'label' => 'Classico', 'src' => 'avatar_05_classico.webp'],
            ['id' => 6, 'label' => 'Anziana gentile', 'src' => 'avatar_06_anziana.webp'],
            ['id' => 7, 'label' => 'Professionale (rossa)', 'src' => 'avatar_07_professionale.webp'],
            ['id' => 8, 'label' => 'Elegante (rossa)', 'src' => 'avatar_08_elegante_rossa.webp'],
            ['id' => 9, 'label' => 'Elegante (castana)', 'src' => 'avatar_09_elegante_castana.webp'],
            ['id' => 10, 'label' => 'Elegante (chiara)', 'src' => 'avatar_10_elegante_chiara.webp'],
            ['id' => 11, 'label' => 'Muscoloso', 'src' => 'avatar_11_muscoloso.webp'],
            ['id' => 12, 'label' => 'Giovane Rosa', 'src' => 'avatar_12_pink_beta.webp'],
            ['id' => 13, 'label' => 'Surfista', 'src' => 'avatar_13_surfista.webp'],
            ['id' => 14, 'label' => 'Surfista donna', 'src' => 'avatar_14_surfista_donna.webp'],
            ['id' => 15, 'label' => 'Business con occhiali', 'src' => 'avatar_15_business.webp'],
        ]);
    });

    // =========================================================================
    // 🔐 Auth / Registrazione
    // =========================================================================
    Route::post('login', [ApiLoginController::class, 'login'])
        ->middleware('throttle:5,1')
        ->name('login');
    Route::post('register', [ApiRegisterController::class, 'register'])
        ->middleware('throttle:5,1')
        ->name('register');
    Route::get('verify-email/{id}/{hash}', ApiVerifyEmailController::class)
        ->name('verification.verify');
    Route::post('forgot-password', [ApiForgotPasswordController::class, 'sendResetLink'])
        ->middleware('throttle:5,1')
        ->name('forgot-password');
    Route::post('reset-password', [ApiResetPasswordController::class, 'reset'])
        ->middleware('throttle:5,1')
        ->name('reset-password');
    Route::get('verify-new-email/{id}/{hash}', VerifyPendingEmailController::class)
        ->name('verification.pending-email');

    // =========================================================================
    // 🔒 ROTTE PROTETTE
    // =========================================================================
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('logout', [ApiLoginController::class, 'logout'])
            ->name('logout');
        Route::get('me', fn (Request $r) => $r->user())
            ->name('me.show');
        Route::middleware('block-demo-user')->group(function () {
            Route::apiResource('users', UserController::class)
                ->names('users');
            Route::put('profile', [ProfileController::class, 'update'])
                ->name('profile.update');
            Route::delete('profile/pending-email', [ProfileController::class, 'cancelPendingEmail'])
                ->name('profile.pending-email.cancel');
            Route::post('profile/pending-email/resend', [ProfileController::class, 'resendPendingEmail'])
                ->name('profile.pending-email.resend');
            Route::delete('profile', [ProfileController::class, 'destroy'])
                ->name('profile.destroy');
        });
        Route::get('profile', [ProfileController::class, 'show'])
            ->name('profile.show');
        Route::get('dashboard', [DashboardController::class, 'index'])
            ->name('dashboard.index');
    });
});
