<?php

namespace Modules\FinancialOverview\Tests\Feature;

use Modules\Categories\Models\Category;
use Modules\Entrate\Models\Entrata;
use Modules\Spese\Models\Spesa;
use PHPUnit\Framework\Attributes\Test;
use Tests\AuthenticatedTestCase;

class TransactionsCategoryTest extends AuthenticatedTestCase
{
    #[Test]
    public function all_transactions_have_a_category_with_required_fields(): void
    {
        $incomeCat = Category::factory()->create([
            'user_id' => $this->user->id,
            'type' => 'entrata',
            'color' => '#fff',
            'icon' => 'FaMoneyBillWave',
        ]);

        $expenseCat = Category::factory()->expense()->create([
            'user_id' => $this->user->id,
            'color' => '#000',
            'icon' => 'FaCar',
        ]);

        Entrata::factory()->forUser($this->user)->forCategory($incomeCat)->create();
        Spesa::factory()->forUser($this->user)->forCategory($expenseCat)->create();

        $response = $this->getJson('/api/v1/financialoverview');
        $response->assertStatus(200);

        foreach ($response->json() as $entry) {
            $this->assertNotEmpty($entry['category'], 'Missing category');
            $this->assertArrayHasKey('id', $entry['category']);
            $this->assertArrayHasKey('name', $entry['category']);
            $this->assertArrayHasKey('type', $entry['category']);
            $this->assertArrayHasKey('color', $entry['category']);
            $this->assertArrayHasKey('icon', $entry['category']);
        }
    }
}
