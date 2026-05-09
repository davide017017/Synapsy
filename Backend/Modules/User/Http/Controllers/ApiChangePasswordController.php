<?php

namespace Modules\User\Http\Controllers;

use App\Helpers\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class ApiChangePasswordController extends Controller
{
    public function update(Request $request): JsonResponse
    {
        $request->validate([
            'current_password'  => ['required', 'string'],
            'password'          => ['required', 'string', 'confirmed', 'min:8', 'regex:/[A-Z]/', 'regex:/[0-9]/'],
            'password_confirmation' => ['required', 'string'],
        ]);

        $user = $request->user();

        if (! Hash::check($request->current_password, $user->password)) {
            return ApiResponse::error('Password attuale non corretta', null, 400);
        }

        $user->update([
            'password' => Hash::make($request->password),
        ]);

        return ApiResponse::success('Password aggiornata con successo');
    }
}
