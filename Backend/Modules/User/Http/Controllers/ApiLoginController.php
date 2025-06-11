<?php

namespace Modules\User\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Routing\Controller;

class ApiLoginController extends Controller
{
    public function login(Request $request)
    {
        logger('🔐 Tentativo login ricevuto');
        logger('📥 Email: ' . $request->input('email'));
        logger('📥 Password: ' . $request->input('password'));

        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($credentials)) {
            logger('⛔️ Credenziali NON valide');
            throw ValidationException::withMessages([
                'email' => ['Credenziali non valide.'],
            ]);
        }

        $user = Auth::user();
        $token = $user->createToken('mobile-token')->plainTextToken;

        logger('✅ Login OK per utente ID ' . $user->id);

        return response()->json([
            'token' => $token,
            'user' => $user,
        ]);
    }

    public function logout(Request $request)
    {
        optional($request->user()?->currentAccessToken())->delete();

        return response()->json([
            'message' => 'Logout effettuato con successo.',
        ]);
    }
}
