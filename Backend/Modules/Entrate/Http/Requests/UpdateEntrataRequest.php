<?php

namespace Modules\Entrate\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateEntrataRequest extends FormRequest
{
    // ============================
    // Autorizzazione richiesta
    // ============================
    public function authorize(): bool
    {
        return Auth::check();
    }

    // ============================
    // Regole di validazione
    // ============================
    public function rules(): array
    {
        $userId = Auth::id();

        return [
            'description' => 'required|string|max:255',
            'amount'      => 'required|numeric|between:0.01,999999.99',
            'date'        => 'required|date',

            'category_id' => [
                'nullable',
                Rule::exists('categories', 'id')
                    ->where(fn ($q) => $q
                        ->where('user_id', $userId)
                        ->where('type', 'entrata')
                    ),
            ],

            'notes' => 'nullable|string',
        ];
    }

    // ============================
    // Messaggi personalizzati
    // ============================
    public function messages(): array
    {
        return [
            'category_id.required' => 'La categoria è obbligatoria.',
            'category_id.exists'   => 'La categoria selezionata non è valida.',
        ];
    }
}

