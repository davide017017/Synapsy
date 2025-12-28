<?php

namespace Modules\User\Http\Controllers;

use App\Helpers\ApiResponse;
use Illuminate\Http\JsonResponse;
use Modules\User\Http\Requests\Auth\RegisterRequest;
use Modules\User\Models\User;

class ApiRegisterController extends Controller
{
  // --------------------------------------------------
  // register: crea utente + invia email verifica
  // --------------------------------------------------
  public function register(RegisterRequest $request): JsonResponse
  {
    $data = $request->validated();

    // ─────────────────────────────────────────
    // Default avatar (standard: SOLO filename)
    // ─────────────────────────────────────────
    $avatar = 'avatar_01_boy.webp';

    $user = User::create([
      'name'              => $data['name'],
      'surname'           => $data['surname'] ?? null,
      'email'             => $data['email'],
      'username'          => $data['username'],
      'password'          => $data['password'],
      'theme'             => $data['theme'] ?? null,
      'has_accepted_terms' => (bool)$data['has_accepted_terms'],
      'avatar'            => $avatar,
      'is_admin'          => false,
    ]);

    // ─────────────────────────────────────────
    // Email verifica (dipende da MAIL/QUEUE)
    // ─────────────────────────────────────────
    $user->sendEmailVerificationNotification();

    return ApiResponse::success(
      "Registrazione completata. Controlla la tua email per confermare l'account.",
      null,
      201
    );
  }
}

/* ------------------------------------------------------
Descrizione file:
ApiRegisterController.php: gestisce registrazione API.
Crea un nuovo utente con avatar di default (standardizzato)
e invia email di verifica tramite notification Laravel.
------------------------------------------------------ */
