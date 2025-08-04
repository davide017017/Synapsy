<?php

namespace Modules\User\Http\Controllers;

use App\Helpers\ApiResponse;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Password;
use Modules\User\Models\User;
use Modules\User\Notifications\CustomResetPassword;

class ApiForgotPasswordController extends Controller
{
    public function sendResetLink(Request $request): JsonResponse
    {
        $request->validate(['email' => ['required', 'email']]);
        $user = \Modules\User\Models\User::where('email', $request->email)->first();
        if ($user) {
            $token = Password::createToken($user);
            $user->notify(new \Modules\User\Notifications\CustomResetPassword($token));
        }

        return ApiResponse::success("Se l'email esiste riceverai un messaggio con le istruzioni per il reset");
    }
}

