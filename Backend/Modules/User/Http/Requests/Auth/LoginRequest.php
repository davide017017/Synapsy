<?php

namespace Modules\User\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * Request per autenticazione utente (login).
 */
class LoginRequest extends FormRequest
{
    // =======================================================
    // Autorizzazione
    // =======================================================

    /**
     * Autorizza la richiesta.
     */
    public function authorize(): bool
    {
        return true;
    }

    // =======================================================
    // Regole di validazione
    // =======================================================

    /**
     * Regole di validazione per il login.
     *
     * Puoi accettare anche username (scommenta e modifica in base alle tue rotte/API):
     * 
     * return [
     *   'login' => ['required', 'string'], // email **o** username
     *   'password' => ['required', 'string'],
     * ];
     */
    public function rules(): array
    {
        return [
            'email'    => ['required', 'string', 'email'],
            // 'login' => ['required', 'string'], // se vuoi login anche con username/email
            'password' => ['required', 'string'],
        ];
    }

    // =======================================================
    // Logica di autenticazione
    // =======================================================

    /**
     * Esegue il tentativo di login.
     *
     * @throws ValidationException
     */
    public function authenticate(): void
    {
        /** @var \Illuminate\Http\Request|static $this */
        $this->ensureIsNotRateLimited();

        // --- Variante solo email ---
        if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());
            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        // --- Variante username/email auto (decommenta se vuoi supportare entrambi) ---
        // $loginField = filter_var($this->input('login'), FILTER_VALIDATE_EMAIL) ? 'email' : 'username';
        // if (! Auth::attempt([$loginField => $this->input('login'), 'password' => $this->input('password')], $this->boolean('remember'))) {
        //     RateLimiter::hit($this->throttleKey());
        //     throw ValidationException::withMessages([
        //         'login' => trans('auth.failed'),
        //     ]);
        // }

        RateLimiter::clear($this->throttleKey());
    }

    // =======================================================
    // Protezione rate limiting
    // =======================================================

    /**
     * Impedisce login brute-force.
     *
     * @throws ValidationException
     */
    protected function ensureIsNotRateLimited(): void
    {
        if (! RateLimiter::tooManyAttempts($this->throttleKey(), 5)) {
            return;
        }

        event(new Lockout($this));

        $seconds = RateLimiter::availableIn($this->throttleKey());

        throw ValidationException::withMessages([
            'email' => trans('auth.throttle', [
                'seconds' => $seconds,
                'minutes' => ceil($seconds / 60),
            ]),
        ]);
    }

    // =======================================================
    // Identificatore per RateLimiter
    // =======================================================

    /**
     * Chiave unica per rate limiting.
     */
    public function throttleKey(): string
    {
        // --- Variante email ---
        return Str::transliterate(Str::lower($this->string('email')) . '|' . $this->ip());

        // --- Variante login (username o email) ---
        // return Str::transliterate(Str::lower($this->string('login')) . '|' . $this->ip());
    }
}
