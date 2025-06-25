<?php

namespace Modules\User\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Routing\Controller;

class ApiLoginController extends Controller
{
    /**
     * Login API: restituisce Bearer token (no cookie, solo JSON).
     */
    public function login(Request $request)
    {
        // 1. Validazione input
        $credentials = $request->validate([
            'email'    => ['required', 'email'],
            'password' => ['required'],
        ]);

        // 2. Trova utente
        $user = \Modules\User\Models\User::where('email', $credentials['email'])->first();

        // 3. Verifica credenziali
        if (!$user || !Hash::check($credentials['password'], $user->password)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // 4. Crea il token Sanctum (Bearer)
        $token = $user->createToken('api-token')->plainTextToken;

        // 5. Risposta
        return response()->json([
            'token' => $token,
            'user'  => $user,
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
}
