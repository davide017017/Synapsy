<?php

namespace Modules\RecurringOperations\tests\Feature;

use Modules\RecurringOperations\Models\RecurringOperation;
use Modules\Categories\Models\Category;
use Tests\AuthenticatedTestCase;
use PHPUnit\Framework\Attributes\Test;

class RecurringOperationsApiTest extends AuthenticatedTestCase
{
    // ============================
    // List
    // ============================
    #[Test]
    public function user_can_list_recurring_operations(): void
    {
        RecurringOperation::factory()
            ->count(3)
            ->forUser($this->user)
            ->income()
            ->create();

        $this->getJson('/api/v1/recurring-operations')
            ->assertStatus(200)
            ->assertJsonCount(3);
    }

    // ============================
    // Create
    // ============================
    #[Test]
    public function user_can_create_a_recurring_operation(): void
    {
        $category = Category::factory()
            ->income()
            ->create(['user_id' => $this->user->id]);

        $payload = [
            'description' => 'Stipendio mensile',
            'amount' => 2500.00,
            'type' => 'entrata',
            'start_date' => now()->toDateString(),
            'frequency' => 'monthly',
            'interval' => 1,
            'is_active' => true,
            'category_id' => $category->id,
        ];

        $this->postJson('/api/v1/recurring-operations', $payload)
            ->assertStatus(201)
            ->assertJsonFragment(['description' => 'Stipendio mensile']);
    }

    // ============================
    // Show
    // ============================
    #[Test]
    public function user_can_view_a_recurring_operation(): void
    {
        $operation = RecurringOperation::factory()
            ->forUser($this->user)
            ->income()
            ->create();

        $this->getJson("/api/v1/recurring-operations/{$operation->id}")
            ->assertStatus(200)
            ->assertJsonFragment(['id' => $operation->id]);
    }

    // ============================
    // Update
    // ============================
    #[Test]
    public function user_can_update_a_recurring_operation(): void
    {
        $operation = RecurringOperation::factory()
            ->forUser($this->user)
            ->income()
            ->create();

        $payload = [
            'description' => 'Modificata',
            'amount' => 1200,
            'type' => 'entrata',
            'start_date' => now()->toDateString(),
            'frequency' => 'monthly',
            'interval' => 1,
            'is_active' => true,
            'category_id' => $operation->category_id,
        ];

        $this->putJson("/api/v1/recurring-operations/{$operation->id}", $payload)
            ->assertStatus(200)
            ->assertJsonFragment(['description' => 'Modificata']);
    }

    // ============================
    // Delete
    // ============================
    #[Test]
    public function user_can_delete_a_recurring_operation(): void
    {
        $operation = RecurringOperation::factory()
            ->forUser($this->user)
            ->income()
            ->create();

        $this->deleteJson("/api/v1/recurring-operations/{$operation->id}")
            ->assertStatus(204);

        $this->assertDatabaseMissing('recurring_operations', ['id' => $operation->id]);
    }
}
