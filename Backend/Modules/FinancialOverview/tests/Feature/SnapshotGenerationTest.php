<?php

namespace Modules\FinancialOverview\Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Modules\Entrate\Models\Entrata;
use Modules\FinancialOverview\Models\FinancialSnapshot;
use Modules\FinancialOverview\Services\FinancialOverviewService;
use Modules\Spese\Models\Spesa;
use Modules\User\Models\User;
use PHPUnit\Framework\Attributes\Test;
use Tests\TestCase;

class SnapshotGenerationTest extends TestCase
{
    use RefreshDatabase;

    protected FinancialOverviewService $service;

    protected function setUp(): void
    {
        parent::setUp();
        $this->service = app(FinancialOverviewService::class);
    }

    // =========================================================================
    // Snapshot Mensile
    // =========================================================================

    #[Test]
    public function it_generates_a_monthly_snapshot_for_the_user(): void
    {
        $user = User::factory()->create();
        $date = Carbon::create(2025, 5, 1);

        Entrata::factory()->forUser($user)->onDate('2025-05-10')->withAmount(1000)->create();
        Spesa::factory()->forUser($user)->onDate('2025-05-15')->withAmount(300)->create();

        $this->service->snapshotMonthly($user, $date);

        $this->assertDatabaseHas('financial_snapshots', [
            'user_id' => $user->id,
            'period_type' => 'monthly',
            'period_start_date' => '2025-05-01',
            'balance' => 700.00,
        ]);
    }

    #[Test]
    public function it_overwrites_existing_monthly_snapshot(): void
    {
        $user = User::factory()->create();
        $date = Carbon::create(2025, 5, 1);

        $this->service->snapshotMonthly($user, $date);
        $this->assertEquals(1, FinancialSnapshot::count());

        // Rilancio: deve aggiornare, non duplicare
        $this->service->snapshotMonthly($user, $date);
        $this->assertEquals(1, FinancialSnapshot::count());
    }
}
