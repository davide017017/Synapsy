<?php

namespace Modules\Categories\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Services\MachineLearning\CategorySuggestionHttpClient;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

// ─────────────────────────────────────────────────────────────────────────────
// Sezione: API Suggestion Controller
// Dettagli: gestione endpoint di suggerimento categoria
// ─────────────────────────────────────────────────────────────────────────────
class CategorySuggestionApiController extends Controller
{
    public function __construct(private CategorySuggestionHttpClient $client) {}

    // -------------------------------------------------------------------------
    // Metodo: predict
    // Dettagli: valida input e restituisce il suggerimento
    // -------------------------------------------------------------------------
    public function predict(Request $request): JsonResponse
    {
        $data = $request->validate([
            'description' => 'required|min:2',
        ]);

        $suggestion = $this->client->suggest($data['description']);

        // Return the suggestion payload directly so the endpoint responds with
        // { category: ..., confidence: ... }
        return response()->json($suggestion);
    }
}
