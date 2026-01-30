<?php

namespace Modules\User\Http\Controllers;

use App\Helpers\ApiResponse;
use Illuminate\Http\JsonResponse;
use Modules\User\Http\Requests\Auth\RegisterRequest;
use Modules\User\Services\CreateUserWithDefaults;

class ApiRegisterController extends Controller
{
  // --------------------------------------------------
  // register: crea utente completo + invia email verifica
  // --------------------------------------------------
  public function register(RegisterRequest $request): JsonResponse
  {
    $data = $request->validated();

    // -----------------------------
    // Default avatar (standard)
    // -----------------------------
    $avatar = 'avatar_01_boy.webp';

    // -----------------------------
    // Payload esplicito per creazione user
    // -----------------------------
    $userData = [
      'name' => $data['name'],
      'surname' => $data['surname'] ?? null,
      'email' => $data['email'],
      'username' => $data['username'],
      'password' => $data['password'],
      'theme' => $data['theme'] ?? 'system',
      'has_accepted_terms' => (bool)($data['has_accepted_terms'] ?? false),
      'avatar' => $avatar,
    ];

    // -----------------------------
    // Crea utente + categorie default
    // NB: per ora verifichiamo subito (come richiesto)
    // -----------------------------
    $user = CreateUserWithDefaults::run($userData, true, false);

    // -----------------------------
    // Email verifica (se vuoi in futuro puoi spegnere verifyNow)
    // -----------------------------
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
Crea un nuovo utente completo (user + categorie default)
tramite CreateUserWithDefaults e invia email di verifica.
------------------------------------------------------ */
