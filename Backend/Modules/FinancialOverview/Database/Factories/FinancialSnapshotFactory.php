<?php

namespace Modules\FinancialOverview\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\FinancialOverview\Models\FinancialSnapshot;
use Modules\User\Models\User;
use Illuminate\Support\Carbon;

/**
 * Factory per il modello FinancialSnapshot.
 */
class FinancialSnapshotFactory extends Factory
{
    protected $model = FinancialSnapshot::class;

    // =========================================================================
    // DEFINIZIONE DATI DI DEFAULT
    // =========================================================================
    public function definition(): array
    {
        $start = now()->startOfMonth();
        $end   = now()->endOfMonth();

        $income  = $this->faker->randomFloat(2, 1000, 5000);
        $expense = $this->faker->randomFloat(2, 500, 4000);

        return [
            'user_id'           => User::factory(),
            'period_type'       => 'monthly',
            'period_start_date' => $start->toDateString(),
            'period_end_date'   => $end->toDateString(),
            'total_income'      => $income,
            'total_expense'     => $expense,
            'balance'           => round($income - $expense, 2),
        ];
    }

    // =========================================================================
    // STATI PERSONALIZZATI
    // =========================================================================

    public function forUser(User|int $user): static
    {
        return $this->state(fn () => [
            'user_id' => $user instanceof User ? $user->id : $user,
        ]);
    }

    public function withPeriod(string $type, string|Carbon $start, string|Carbon $end): static
    {
        return $this->state(fn () => [
            'period_type'       => $type,
            'period_start_date' => $start instanceof Carbon ? $start->toDateString() : $start,
            'period_end_date'   => $end instanceof Carbon ? $end->toDateString() : $end,
        ]);
    }

    public function withAmounts(float $income, float $expense): static
    {
        return $this->state(fn () => [
            'total_income'  => $income,
            'total_expense' => $expense,
            'balance'       => round($income - $expense, 2),
        ]);
    }
}
