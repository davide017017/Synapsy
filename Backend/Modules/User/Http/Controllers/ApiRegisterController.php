<?php

namespace Modules\User\Http\Controllers;

use Illuminate\Http\JsonResponse;
use Modules\User\Models\User;
use Modules\User\Http\Requests\Auth\RegisterRequest;
use App\Helpers\ApiResponse;

class ApiRegisterController extends Controller
{
    public function register(RegisterRequest $request): JsonResponse
    {
        $data = $request->validated();

        $user = User::create([
            'name' => $data['name'],
            'surname' => $data['surname'] ?? null,
            'email' => $data['email'],
            'username' => $data['username'],
            'password' => $data['password'],
            'theme' => $data['theme'] ?? null,
            'avatar' => 'images/avatars/avatar-1.svg',
        ]);

        $user->sendEmailVerificationNotification();

        return ApiResponse::success('Registrazione completata. Controlla la tua email per confermare l\'account.', null, 201);
    }
}
