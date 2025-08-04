<?php

namespace Modules\Spese\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateSpesaRequest extends FormRequest
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
                        ->where('type', 'spesa')
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
            'description.required' => 'La descrizione è obbligatoria.',
            'amount.required'      => "L'importo è obbligatorio.",
            'amount.numeric'       => "L'importo deve essere un numero.",
            'amount.between'       => "L'importo deve essere compreso tra :min e :max.",
            'date.required'        => 'La data è obbligatoria.',
            'date.date'            => 'La data non è valida.',
            'category_id.exists'   => 'La categoria selezionata non è valida.',
        ];
    }
}

