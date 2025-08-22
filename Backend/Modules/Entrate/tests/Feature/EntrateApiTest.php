<?php

namespace Modules\Entrate\Tests\Feature;

use Modules\Categories\Models\Category;
use Modules\Entrate\Models\Entrata;
use PHPUnit\Framework\Attributes\Test;
use Tests\AuthenticatedTestCase;

class EntrateApiTest extends AuthenticatedTestCase
{
    // ============================
    // List
    // ============================
    #[Test]
    public function user_can_list_entrate(): void
    {
        Entrata::factory()
            ->count(3)
            ->create(['user_id' => $this->user->id]);

        $this->getJson('/api/v1/entrate')
            ->assertStatus(200)
            ->assertJsonCount(3);
    }

    // ============================
    // Create
    // ============================
    #[Test]
    public function user_can_create_an_entrata(): void
    {
        $category = Category::factory()
            ->income()
            ->create(['user_id' => $this->user->id]);

        $payload = [
            'date' => now()->toDateString(),
            'description' => 'Test Entrata',
            'amount' => 100.50,
            'category_id' => $category->id,
        ];

        $this->postJson('/api/v1/entrate', $payload)
            ->assertStatus(201)
            ->assertJsonFragment(['description' => 'Test Entrata']);
    }

    // ============================
    // Show
    // ============================
    #[Test]
    public function user_can_view_an_entrata(): void
    {
        $entrata = Entrata::factory()
            ->create(['user_id' => $this->user->id]);

        $this->getJson("/api/v1/entrate/{$entrata->id}")
            ->assertStatus(200)
            ->assertJsonFragment(['id' => $entrata->id]);
    }

    // ============================
    // Update
    // ============================
    #[Test]
    public function user_can_update_an_entrata(): void
    {
        $entrata = Entrata::factory()
            ->create(['user_id' => $this->user->id]);

        $payload = [
            'description' => 'Entrata Aggiornata',
            'amount' => 200.00,
            'date' => now()->toDateString(),
            'category_id' => $entrata->category_id,
        ];

        $this->putJson("/api/v1/entrate/{$entrata->id}", $payload)
            ->assertStatus(200)
            ->assertJsonFragment(['description' => 'Entrata Aggiornata']);
    }

    // ============================
    // Delete
    // ============================
    #[Test]
    public function user_can_delete_an_entrata(): void
    {
        $entrata = Entrata::factory()
            ->create(['user_id' => $this->user->id]);

        $this->deleteJson("/api/v1/entrate/{$entrata->id}")
            ->assertStatus(204);

        $this->assertDatabaseMissing('entrate', ['id' => $entrata->id]);
    }
}
