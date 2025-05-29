<?php

namespace Modules\Categories\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
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
        $userId     = Auth::id();
        $category   = $this->route('category'); // type-hint automatico da Route Model Binding
        $categoryId = $category?->id;

        return [
            'name' => [
                'required',
                'string',
                'max:255',
                Rule::unique('categories')
                    ->where(fn ($q) => $q->where('user_id', $userId))
                    ->ignore($categoryId),
            ],
            'type' => [
                'required',
                'string',
                Rule::in(['entrata', 'spesa']),
            ],
        ];
    }

    // ============================
    // Messaggi personalizzati
    // ============================
    public function messages(): array
    {
        return [
            'name.required' => 'Il nome della categoria è obbligatorio.',
            'name.unique'   => 'Hai già una categoria con questo nome.',
            'type.required' => 'Il tipo della categoria è obbligatorio.',
            'type.in'       => 'Il tipo deve essere "entrata" o "spesa".',
        ];
    }
}
