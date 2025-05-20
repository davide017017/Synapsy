<?php

namespace Modules\FinancialOverview\Tests\Unit;

use Tests\TestCase;
use Modules\User\Models\User;
use Modules\FinancialOverview\Models\FinancialSnapshot;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use PHPUnit\Framework\Attributes\Test;

class FinancialSnapshotTest extends TestCase
{
    use RefreshDatabase;

    // =========================================================================
    // Creazione e validazione dei dati
    // =========================================================================

    #[Test]
    public function it_creates_a_valid_snapshot(): void
    {
        $user = User::factory()->create();

        $snapshot = FinancialSnapshot::factory()->forUser($user)->create([
            'period_type'       => 'monthly',
            'period_start_date' => '2025-05-01',
            'period_end_date'   => '2025-05-31',
            'total_income'      => 1500.00,
            'total_expense'     => 500.00,
            'balance'           => 1000.00,
        ]);
        
        $this->assertIsFloat($snapshot->balance);

        $this->assertDatabaseHas('financial_snapshots', [
            'user_id'           => $user->id,
            'period_type'       => 'monthly',
            'period_start_date' => '2025-05-01',
            'balance'           => 1000.00,
        ]);
    }

    // =========================================================================
    // Casts e integrità dei dati
    // =========================================================================

    #[Test]
    public function it_casts_dates_and_floats_correctly(): void
    {
        $snapshot = FinancialSnapshot::factory()->create([
            'period_start_date' => '2025-05-01',
            'period_end_date'   => '2025-05-31',
            'total_income'      => 1000.456,
            'total_expense'     => 250.12,
        ]);

        $this->assertInstanceOf(Carbon::class, $snapshot->period_start_date);
        $this->assertEquals(1000.46, round($snapshot->total_income, 2));
    }

    // =========================================================================
    // Relazioni
    // =========================================================================

    #[Test]
    public function it_belongs_to_a_user(): void
    {
        $snapshot = FinancialSnapshot::factory()->create();
        $this->assertInstanceOf(User::class, $snapshot->user);
    }
}
