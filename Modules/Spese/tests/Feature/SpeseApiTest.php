<?php

namespace Modules\Spese\tests\Feature;

use Modules\Spese\Models\Spesa;
use Modules\Categories\Models\Category;
use Tests\AuthenticatedTestCase;
use PHPUnit\Framework\Attributes\Test;

class SpeseApiTest extends AuthenticatedTestCase
{
    // ============================
    // List
    // ============================
    #[Test]
    public function user_can_list_spese(): void
    {
        Spesa::factory()
            ->count(3)
            ->create(['user_id' => $this->user->id]);

        $this->getJson('/api/v1/spese')
            ->assertStatus(200)
            ->assertJsonCount(3);
    }

    // ============================
    // Create
    // ============================
    #[Test]
    public function user_can_create_a_spesa(): void
    {
        $category = Category::factory()
            ->expense()
            ->create(['user_id' => $this->user->id]);

        $payload = [
            'date'        => now()->toDateString(),
            'description' => 'Test Spesa',
            'amount'      => 50.75,
            'category_id' => $category->id,
        ];

        $this->postJson('/api/v1/spese', $payload)
            ->assertStatus(201)
            ->assertJsonFragment(['description' => 'Test Spesa']);
    }

    // ============================
    // Show
    // ============================
    #[Test]
    public function user_can_view_a_spesa(): void
    {
        $spesa = Spesa::factory()
            ->create(['user_id' => $this->user->id]);

        $this->getJson("/api/v1/spese/{$spesa->id}")
            ->assertStatus(200)
            ->assertJsonFragment(['id' => $spesa->id]);
    }

    // ============================
    // Update
    // ============================
    #[Test]
    public function user_can_update_a_spesa(): void
    {
        $spesa = Spesa::factory()
            ->create(['user_id' => $this->user->id]);

        $payload = [
            'description' => 'Spesa Aggiornata',
            'amount'      => 120.00,
            'date'        => now()->toDateString(),
            'category_id' => $spesa->category_id,
        ];

        $this->putJson("/api/v1/spese/{$spesa->id}", $payload)
            ->assertStatus(200)
            ->assertJsonFragment(['description' => 'Spesa Aggiornata']);
    }

    // ============================
    // Delete
    // ============================
    #[Test]
    public function user_can_delete_a_spesa(): void
    {
        $spesa = Spesa::factory()
            ->create(['user_id' => $this->user->id]);

        $this->deleteJson("/api/v1/spese/{$spesa->id}")
            ->assertStatus(204);

        $this->assertDatabaseMissing('spese', ['id' => $spesa->id]);
    }
}
