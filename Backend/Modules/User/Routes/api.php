<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Laravel\Sanctum\PersonalAccessToken;

use Modules\User\Http\Controllers\UserController;
use Modules\User\Http\Controllers\ProfileController;
use Modules\User\Http\Controllers\DashboardController;
use Modules\User\Http\Controllers\ApiLoginController;

/* ╭─────────────────────────────────────────────╮
 * │   API v1 (prefix /api/v1)                   │
 * ╰─────────────────────────────────────────────╯ */

Route::prefix('v1')->group(function () {

    /* ───────── LOGIN (NO TOKEN RICHIESTO) ───── */
    Route::post('login', [ApiLoginController::class, 'login']);
    /* ─────────────────────────────────────────── */

    /* ╭─────────────────────────────────────────╮
     * │   Rotte protette (auth:sanctum)         │
     * ╰─────────────────────────────────────────╯ */
    Route::middleware('auth:sanctum')->group(function () {

        /* ───────── LOGOUT (revoca) ──────────── */
        Route::post('logout', [ApiLoginController::class, 'logout']);
        /* ────────────────────────────────────── */

        /* ╭──────────────────────────────────╮
         * │  REFRESH (cookie refreshToken)   │
         * ╰──────────────────────────────────╯ */
        Route::post('refresh', function (Request $request) {
            // 1. Leggi il cookie
            $plain = $request->cookie('refreshToken');
            if (!$plain) return response()->json([], 401);

            // 2. Trova e valida il token
            $token = PersonalAccessToken::findToken($plain);
            if (!$token || $token->expires_at->isPast()) {
                return response()->json([], 401);  // scaduto / revocato
            }

            // 3. Nuovo access token (15 min)
            $user = $token->tokenable;
            $new  = $user->createToken('access', ['*'], now()->addMinutes(15));

            return response()->json(['accessToken' => $new->plainTextToken]);
        })->name('token.refresh');
        /* ────────────────────────────────────── */

        /* ───────── ME (chi sono) ───────────── */
        Route::get('me', fn(Request $r) => $r->user())->name('me.show');
        /* ────────────────────────────────────── */

        /* ───────── CRUD Utenti ─────────────── */
        Route::apiResource('users', UserController::class)->names('users');
        /* ────────────────────────────────────── */

        /* ───────── Profilo personale ───────── */
        Route::put('profile', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
        /* ────────────────────────────────────── */

        /* ───────── Dashboard (stat) ────────── */
        Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard.index');
        /* ────────────────────────────────────── */
    });
});
