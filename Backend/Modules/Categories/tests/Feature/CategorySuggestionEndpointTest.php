<?php

namespace Modules\Categories\Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Http;
use Laravel\Sanctum\Sanctum;
use Modules\User\Models\User;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

// ─────────────────────────────────────────────────────────────────────────────
// Sezione: Test endpoint suggerimento categoria
// Dettagli: verifica la risposta dell'API
// ─────────────────────────────────────────────────────────────────────────────
class CategorySuggestionEndpointTest extends TestCase
{
    use RefreshDatabase;

    // -------------------------------------------------------------------------
    // Metodo: test_suggestion_endpoint
    // Dettagli: invia una descrizione e controlla la struttura della risposta
    // -------------------------------------------------------------------------
    #[Test]
    public function test_suggestion_endpoint(): void
    {
        Http::fake(['*' => Http::response(['category' => 'cibo', 'confidence' => 0.9])]);

        Sanctum::actingAs(User::factory()->create());

        $payload = ['description' => 'Pizza Margherita'];

        $this->postJson('/api/v1/ml/suggest-category', $payload)
            ->assertStatus(200)
            ->assertJsonStructure([
                'description',
                'suggestion' => ['category', 'confidence'],
            ]);
    }
}
