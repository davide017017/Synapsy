<?php

namespace Modules\Categories\Tests\Feature;

use Modules\Categories\Models\Category;
use PHPUnit\Framework\Attributes\Test;
use Tests\AuthenticatedTestCase;

class CategoriesApiTest extends AuthenticatedTestCase
{
    // ============================
    // List
    // ============================
    #[Test]
    public function user_can_list_categories(): void
    {
        Category::factory()->count(3)->create(['user_id' => $this->user->id]);

        $this->getJson('/api/v1/categories')
            ->assertStatus(200)
            ->assertJsonCount(3);
    }

    // ============================
    // Create
    // ============================
    #[Test]
    public function user_can_create_a_category(): void
    {
        $payload = [
            'name' => 'Test Categoria',
            'type' => 'spesa',
        ];

        $this->postJson('/api/v1/categories', $payload)
            ->assertStatus(201)
            ->assertJsonFragment(['name' => 'Test Categoria']);
    }

    // ============================
    // Show
    // ============================
    #[Test]
    public function user_can_view_a_category(): void
    {
        $category = Category::factory()->create(['user_id' => $this->user->id]);

        $this->getJson("/api/v1/categories/{$category->id}")
            ->assertStatus(200)
            ->assertJsonFragment(['id' => $category->id]);
    }

    // ============================
    // Update
    // ============================
    #[Test]
    public function user_can_update_a_category(): void
    {
        $category = Category::factory()->create(['user_id' => $this->user->id]);

        $this->putJson("/api/v1/categories/{$category->id}", [
            'name' => 'Aggiornata',
            'type' => 'entrata',
        ])
            ->assertStatus(200)
            ->assertJsonFragment(['name' => 'Aggiornata']);
    }

    // ============================
    // Delete
    // ============================
    #[Test]
    public function user_can_delete_a_category(): void
    {
        $category = Category::factory()->create(['user_id' => $this->user->id]);

        $this->deleteJson("/api/v1/categories/{$category->id}")
            ->assertStatus(204);

        $this->assertDatabaseMissing('categories', ['id' => $category->id]);
    }
}
