<?php

namespace Modules\Categories\Tests\Feature;

use Modules\Categories\Models\Category;
use Modules\User\Models\User;
use Tests\AuthenticatedTestCase;
use PHPUnit\Framework\Attributes\Test;

class CategoriesAuthorizationTest extends AuthenticatedTestCase
{
    #[Test]
    public function user_cannot_view_another_users_category(): void
    {
        $otherUser = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $otherUser->id]);

        $this->getJson("/api/v1/categories/{$category->id}")
            ->assertStatus(403);
    }

    #[Test]
    public function user_cannot_update_another_users_category(): void
    {
        $otherUser = User::factory()->create();
        $category = Category::factory()->create([
            'user_id' => $otherUser->id,
            'name' => 'Originale',
        ]);

        $this->putJson("/api/v1/categories/{$category->id}", [
            'name' => 'Aggiornata',
            'type' => $category->type,
        ])->assertStatus(403);

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
            'name' => 'Originale',
        ]);
    }

    #[Test]
    public function user_cannot_delete_another_users_category(): void
    {
        $otherUser = User::factory()->create();
        $category = Category::factory()->create(['user_id' => $otherUser->id]);

        $this->deleteJson("/api/v1/categories/{$category->id}")
            ->assertStatus(403);

        $this->assertDatabaseHas('categories', [
            'id' => $category->id,
        ]);
    }
}
