<?php

namespace App\Services\MachineLearning;

use Illuminate\Support\Facades\Http;

// ─────────────────────────────────────────────────────────────────────────────
// Sezione: Client per microservizio
// Dettagli: invia descrizioni e riceve suggerimenti categoria
// ─────────────────────────────────────────────────────────────────────────────
class CategorySuggestionHttpClient
{
    // -------------------------------------------------------------------------
    // Metodo: suggest
    // Dettagli: chiama il microservizio per ottenere la categoria
    // -------------------------------------------------------------------------
    public function suggest(string $description): array
    {
        $baseUrl = config('ml_category_suggester.base_url');

        if (empty($baseUrl)) {
            return ['category' => null, 'confidence' => 0.0];
        }

        try {
            $response = Http::timeout(3)
                ->acceptJson()
                ->post($baseUrl.'/predict-category', [
                    'description' => $description,
                ]);

            $data = $response->json();
        } catch (\Throwable $e) {
            $data = [];
        }

        return [
            'category' => $data['category'] ?? null,
            'confidence' => isset($data['confidence']) ? (float) $data['confidence'] : 0.0,
        ];
    }
}
