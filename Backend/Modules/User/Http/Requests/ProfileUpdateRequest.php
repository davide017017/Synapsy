<?php

namespace Modules\User\Http\Requests;

use Modules\User\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * Gestisce validazione e autorizzazione per l'aggiornamento del profilo utente.
 */
class ProfileUpdateRequest extends FormRequest
{
    // ============================
    // Autorizzazione
    // ============================

    /**
     * Determina se l'utente è autorizzato.
     */
    public function authorize(): bool
    {
        return true;
    }

    // ============================
    // Regole di validazione
    // ============================

    /**
     * Regole di validazione per l'update del profilo.
     */
    public function rules(): array
    {
        /** @var \Illuminate\Http\Request $this */
        return [
            'name'  => ['required', 'string', 'max:255'],
            'email' => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($this->user()->id),
            ],
        ];
    }

    // ============================
    // Messaggi personalizzati
    // ============================

    /**
     * Messaggi di errore personalizzati.
     */
    public function messages(): array
    {
        return [
            'name.required'  => 'Il nome è obbligatorio.',
            'email.unique'   => 'Questa email è già in uso.',
        ];
    }

    // ============================
    // Pre-validazione (opzionale)
    // ============================

    // protected function prepareForValidation(): void
    // {
    //     $this->merge([
    //         'email' => strtolower($this->email),
    //     ]);
    // }
}
