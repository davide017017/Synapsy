<?php

namespace Modules\User\Http\Requests\Auth;

use Illuminate\Auth\Events\Lockout;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

/**
 * Request per autenticazione utente.
 * 
 */
class LoginRequest extends FormRequest
{
    // ============================
    // Autorizzazione
    // ============================

    /**
     * Autorizza la richiesta.
     */
    public function authorize(): bool
    {
        return true;
    }

    // ============================
    // Regole di validazione
    // ============================

    /**
     * Regole di validazione per il login.
     */
    public function rules(): array
    {
        return [
            'email'    => ['required', 'string', 'email'],
            'password' => ['required', 'string'],
        ];
    }

    // ============================
    // Logica di autenticazione
    // ============================

    /**
     * Esegue il tentativo di login.
     *
     * @throws ValidationException
     */
    public function authenticate(): void
    {
        /** @var \Illuminate\Http\Request $this */
        $this->ensureIsNotRateLimited();

        if (! Auth::attempt($this->only('email', 'password'), $this->boolean('remember'))) {
            RateLimiter::hit($this->throttleKey());

            throw ValidationException::withMessages([
                'email' => trans('auth.failed'),
            ]);
        }

        RateLimiter::clear($this->throttleKey());
    }

    // ============================
    // Protezione rate limiting
    // ============================

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

    // ============================
    // Identificatore per RateLimiter
    // ============================

    /**
     * Chiave unica per rate limiting.
     */
    public function throttleKey(): string
    {
        /** @var \Illuminate\Http\Request $this */
        return Str::transliterate(Str::lower($this->string('email')) . '|' . $this->ip());
    }
}
