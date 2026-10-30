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

        // whereDate: sqlite salva il cast 'date' come 'Y-m-d H:i:s'
        $this->assertTrue(
            FinancialSnapshot::where('user_id', $user->id)
                ->where('period_type', 'monthly')
                ->whereDate('period_start_date', '2025-05-01')
                ->where('balance', 700.00)
                ->exists()
        );
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
