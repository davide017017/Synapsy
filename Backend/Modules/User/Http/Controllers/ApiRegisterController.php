<?php

namespace Modules\User\Http\Controllers;

use App\Helpers\ApiResponse;
use Illuminate\Http\JsonResponse;
use Modules\User\Http\Requests\Auth\RegisterRequest;
use Modules\User\Models\User;

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
            'has_accepted_terms' => $data['has_accepted_terms'],
            'avatar' => 'images/avatars/avatar_01_boy.webp', // Default avatar
            'is_admin' => false,
        ]);

        $user->sendEmailVerificationNotification();

        return ApiResponse::success('Registrazione completata. Controlla la tua email per confermare l\'account.', null, 201);
    }
}
