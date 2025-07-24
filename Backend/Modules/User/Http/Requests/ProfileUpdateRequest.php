<?php

namespace Modules\User\Http\Requests;

use Modules\User\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Validator;

/**
 * Gestisce validazione e autorizzazione per l'aggiornamento del profilo utente.
 */
class ProfileUpdateRequest extends FormRequest
{
    // =======================================================
    // Autorizzazione
    // =======================================================

    /**
     * Determina se l'utente è autorizzato a effettuare questa richiesta.
     */
    public function authorize(): bool
    {
        return true;
    }

    // =======================================================
    // Regole di validazione
    // =======================================================

    /**
     * Regole di validazione per l'update del profilo.
     */
    public function rules(): array
    {
        /** @var \Illuminate\Http\Request $request */
        $request = $this;

        return [
            // ----------------------------
            // Anagrafica
            // ----------------------------
            'name'     => ['required', 'string', 'max:255'],
            'surname'  => ['nullable', 'string', 'max:255'],

            // ----------------------------
            // Username (univoco)
            // ----------------------------
            'username' => [
                'nullable',
                'string',
                'max:64',
                Rule::unique(User::class)->ignore($request->user()->id),
            ],

            // ----------------------------
            // Email (univoca)
            // ----------------------------
            'email'    => [
                'required',
                'string',
                'lowercase',
                'email',
                'max:255',
                Rule::unique(User::class)->ignore($request->user()->id),
            ],

            // ----------------------------
            // Avatar (file o path opzionale)
            // ----------------------------
            'avatar'   => ['nullable', function ($attribute, $value, $fail) {
                if ($this->hasFile($attribute)) {
                    $validator = Validator::make(
                        $this->all(),
                        [$attribute => 'image|max:2048'],
                        $this->messages()
                    );
                    if ($validator->fails()) {
                        foreach ($validator->errors()->get($attribute) as $msg) {
                            $fail($msg);
                        }
                    }
                } elseif ($value !== null && !is_string($value)) {
                    $fail('L\'avatar deve essere un percorso o un file valido.');
                }
            }],

            // ----------------------------
            // Tema preferito
            // ----------------------------
            'theme'    => [
                'nullable',
                'string',
                Rule::in(['system', 'light', 'dark', 'emerald', 'solarized']),
            ],
        ];
    }

    // =======================================================
    // Messaggi personalizzati
    // =======================================================

    /**
     * Messaggi di errore personalizzati.
     */
    public function messages(): array
    {
        return [
            'name.required'     => 'Il nome è obbligatorio.',
            'username.unique'   => 'Questo username è già in uso.',
            'email.unique'      => 'Questa email è già in uso.',
            'avatar.image'      => 'L\'avatar deve essere un\'immagine valida.',
            'avatar.max'        => 'L\'avatar non può superare i 2MB.',
            'theme.in'          => 'Tema selezionato non valido.',
        ];
    }

    // =======================================================
    // Pre-validazione (opzionale)
    // =======================================================

    // protected function prepareForValidation(): void
    // {
    //     if ($this->has('email')) {
    //         $this->merge([
    //             'email' => strtolower($this->email),
    //         ]);
    //     }
    // }
}
