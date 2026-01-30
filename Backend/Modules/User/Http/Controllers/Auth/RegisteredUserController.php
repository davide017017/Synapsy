<?php

namespace Modules\User\Http\Controllers\Auth;

use Illuminate\Auth\Events\Registered;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules;
use Illuminate\View\View;
use Modules\User\Http\Controllers\Controller;
use Modules\User\Models\User;
use Modules\User\Services\CreateUserWithDefaults;

class RegisteredUserController extends Controller
{
  // --------------------------------------------------
  // create: pagina registrazione
  // --------------------------------------------------
  public function create(): View
  {
    return view('auth.register');
  }

  // --------------------------------------------------
  // store: crea utente completo + login
  // --------------------------------------------------
  public function store(Request $request): RedirectResponse
  {
    // -----------------------------
    // Validazione
    // -----------------------------
    $validated = $request->validate([
      'name' => ['required', 'string', 'max:255'],
      'surname' => ['nullable', 'string', 'max:255'],
      'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:' . User::class],
      'username' => ['required', 'string', 'max:64', 'unique:' . User::class],
      'has_accepted_terms' => ['accepted'],
      'theme' => ['nullable', 'string', Rule::in(['system', 'light', 'dark', 'emerald', 'solarized'])],
      'password' => ['required', 'confirmed', Rules\Password::defaults()],
    ]);

    // -----------------------------
    // Default avatar (se vuoi allineare anche il web)
    // -----------------------------
    $avatar = 'avatar_01_boy.webp';

    // -----------------------------
    // Payload esplicito
    // -----------------------------
    $userData = [
      'name' => $validated['name'],
      'surname' => $validated['surname'] ?? null,
      'email' => $validated['email'],
      'username' => $validated['username'],
      'password' => $validated['password'],
      'theme' => $validated['theme'] ?? 'system',
      'has_accepted_terms' => (bool)($validated['has_accepted_terms'] ?? false),
      'avatar' => $avatar,
    ];

    // -----------------------------
    // Crea utente + categorie default
    // NB: per ora verifichiamo subito (come richiesto)
    // -----------------------------
    $user = CreateUserWithDefaults::run($userData, true, false);

    // -----------------------------
    // Event standard Laravel (invia email verifica ecc.)
    // NB: se verifichi subito, l’email è “non necessaria” ma lasciamo compatibilità
    // -----------------------------
    event(new Registered($user));

    // -----------------------------
    // Login
    // -----------------------------
    Auth::login($user);

    return redirect(route('dashboard', absolute: false));
  }
}

/* ------------------------------------------------------
Descrizione file:
RegisteredUserController.php: gestisce registrazione web.
Valida input, crea utente completo (user + categorie default)
tramite CreateUserWithDefaults, lancia evento Registered e fa login.
------------------------------------------------------ */
