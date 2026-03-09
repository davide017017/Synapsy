<?php

namespace Modules\User\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Routing\Controller;
use Illuminate\Support\Facades\Hash;

class ApiLoginController extends Controller
{
    /**
     * Login API: restituisce Bearer token (no cookie, solo JSON).
     */
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $user = \Modules\User\Models\User::where('email', $credentials['email'])->first();

        if (! $user || ! Hash::check($credentials['password'], $user->password)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $token = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    /**
     * Logout API: revoca solo il token corrente.
     */
    public function logout(Request $request)
    {
        optional($request->user()?->currentAccessToken())->delete();

        return response()->json(['message' => 'Logout effettuato']);
    }

    /**
     * Refresh token: revoca il token corrente e ne emette uno nuovo.
     *
     * POST /api/v1/refresh-token (auth:sanctum)
     * Utile quando il JWT lato NextAuth si avvicina alla scadenza.
     */
    public function refreshToken(Request $request)
    {
        $user = $request->user();

        // Revoca il token attuale
        $request->user()->currentAccessToken()->delete();

        // Emette un nuovo token Sanctum
        $newToken = $user->createToken('api-token')->plainTextToken;

        return response()->json([
            'token' => $newToken,
            'user'  => $user,
        ]);
    }
}
