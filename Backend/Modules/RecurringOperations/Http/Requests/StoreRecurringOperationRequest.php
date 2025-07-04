<?php

namespace Modules\RecurringOperations\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class StoreRecurringOperationRequest extends FormRequest
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
        /** @var \Illuminate\Http\Request $this */


        $userId = Auth::id();
        $type   = $this->input('type');

        return [
            'description' => 'required|string|max:255',
            'amount'      => 'required|numeric|between:0.01,999999.99',
            'type'        => ['required', Rule::in(['entrata', 'spesa'])],
            'start_date'  => 'required|date',
            'end_date'    => 'nullable|date|after_or_equal:start_date',
            'frequency'   => ['required', Rule::in(['daily', 'weekly', 'monthly', 'annually'])],
            'interval'    => 'required|integer|min:1',
            'is_active'   => 'required|boolean',
            'notes'       => 'nullable|string',
            'category_id' => [
                'nullable',
                Rule::exists('categories', 'id')
                    ->where(
                        fn($q) => $q
                            ->where('user_id', $userId)
                            ->where('type', $type)
                    ),
            ],
            'generate_past_now' => 'boolean',
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
            'start_date.required'  => 'La data di inizio è obbligatoria.',
            'frequency.required'   => 'La frequenza è obbligatoria.',
            'interval.required'    => "L'intervallo è obbligatorio.",
            'type.in'              => 'Il tipo deve essere entrata o spesa.',
            'category_id.exists'   => 'La categoria selezionata non è valida.',
        ];
    }
}