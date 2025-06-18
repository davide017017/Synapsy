<?php

namespace Modules\User\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Validation\ValidationException;
use Illuminate\Routing\Controller;

class ApiLoginController extends Controller
{
    /* ╭──────────────────────────────────────────────────────────────╮
     * │ LOGIN – emette:                                             │
     * │   • accessToken  15 min  (nel JSON)                         │
     * │   • refreshToken 30 gg  (in cookie Http-Only)               │
     * ╰──────────────────────────────────────────────────────────────╯ */
    public function login(Request $request)
    {
        // ─── 0) VALIDAZIONE INPUT ───────────────────────────────────
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        // ─── 1) AUTENTICAZIONE ──────────────────────────────────────
        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['Credenziali non valide.'],
            ]);
        }

        $user = Auth::user();

        // ─── 2) CREA ACCESS TOKEN (15 min) ──────────────────────────
        $accessToken = $user->createToken(
            'access',           // nome token
            ['*'],              // abilities
            now()->addMinutes(15)
        )->plainTextToken;

        // ─── 3) CREA REFRESH TOKEN (30 gg) ──────────────────────────
        $refreshToken = $user->createToken(
            'refresh',
            ['*'],
            now()->addDays(30)
        )->plainTextToken;

        // ─── 4) COOKIE HTTP-ONLY CON REFRESH ────────────────────────
        $cookie = Cookie::make(
            'refreshToken',          // nome
            $refreshToken,           // valore
            60 * 24 * 30,            // durata (min) = 30 gg
            '/',                     // path
            null,                    // dominio
            true,                    // secure (⚠︎ solo HTTPS in prod)
            true,                    // httpOnly
            false,                   // raw
            'Lax'                    // SameSite
        );

        // ─── 5) RISPOSTA ────────────────────────────────────────────
        return response()->json([
            'accessToken' => $accessToken,
            'user'        => $user,
        ])->withCookie($cookie);
    }

    /* ╭──────────────────────────────────────────────────────────────╮
     * │ LOGOUT – revoca access + refresh e cancella il cookie       │
     * ╰──────────────────────────────────────────────────────────────╯ */
    public function logout(Request $request)
    {
        // ─── 1) REVOCA ACCESS TOKEN CORRENTE ────────────────────────
        optional($request->user()?->currentAccessToken())->delete();

        // ─── 2) REVOCA TUTTI I REFRESH TOKEN DELL’UTENTE ────────────
        $request->user()?->tokens()->where('name', 'refresh')->delete();

        // ─── 3) CANCELLA IL COOKIE DAL BROWSER ──────────────────────
        return response()
            ->json(['message' => 'Logout effettuato'])
            ->withCookie(Cookie::forget('refreshToken'));
    }
}
