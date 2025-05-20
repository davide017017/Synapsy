<?php

namespace Modules\RecurringOperations\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\RecurringOperations\Models\RecurringOperation;
use Modules\User\Models\User;
use Modules\Categories\Models\Category;
use Illuminate\Support\Carbon;

/**
 * Factory per il modello RecurringOperation.
 */
class RecurringOperationFactory extends Factory
{
    protected $model = RecurringOperation::class;

    // =========================================================================
    // DEFINIZIONE DATI DI DEFAULT
    // =========================================================================
    public function definition(): array
    {
        $frequency = $this->faker->randomElement(['daily', 'weekly', 'monthly', 'annually']);
        $interval = match ($frequency) {
            'daily'    => $this->faker->numberBetween(1, 7),
            'weekly'   => $this->faker->numberBetween(1, 4),
            'monthly'  => $this->faker->numberBetween(1, 12),
            'annually' => $this->faker->numberBetween(1, 5),
        };

        $startDate = Carbon::parse($this->faker->dateTimeBetween('-1 year', 'now'));
        $endDate   = $this->faker->optional(0.3)->dateTimeBetween($startDate->copy()->addMonth(), '+2 years');
        $nextOccurrence = $this->calculateNextOccurrence($startDate, $interval, $frequency, $endDate);

        $type        = $this->faker->randomElement(['entrata', 'spesa']);
        $description = ($type === 'entrata' ? 'Entrata Ricorrente: ' : 'Spesa Ricorrente: ') . $this->faker->sentence(3);

        return [
            'description'           => $description,
            'amount'                => $this->faker->randomFloat(2, 10, 1000),
            'type'                  => $type,
            'start_date'            => $startDate->format('Y-m-d'),
            'end_date'              => $endDate?->format('Y-m-d'),
            'frequency'             => $frequency,
            'interval'              => $interval,
            'next_occurrence_date'  => $nextOccurrence->format('Y-m-d'),
            'is_active'             => $this->faker->boolean(90),
            'notes'                 => $this->faker->optional(0.4)->paragraph(1),
        ];
    }

    // =========================================================================
    // CALCOLO OCCORRENZA
    // =========================================================================
    protected function calculateNextOccurrence(Carbon $start, int $interval, string $frequency, ?\DateTimeInterface $end): Carbon
    {
        $next = $start->copy();

        match ($frequency) {
            'daily'    => $next->addDays($interval),
            'weekly'   => $next->addWeeks($interval),
            'monthly'  => $next->addMonthsNoOverflow($interval),
            'annually' => $next->addYears($interval),
        };

        if ($next->isPast() || ($end && $next->greaterThan($end))) {
            $next = Carbon::now()->addDays($this->faker->numberBetween(1, 30));
        }

        return $next;
    }

    // =========================================================================
    // STATI PERSONALIZZATI
    // =========================================================================

    public function income(): static
    {
        return $this->state(fn () => [
            'type'        => 'entrata',
            'description' => 'Entrata Ricorrente: ' . $this->faker->sentence(3),
        ]);
    }

    public function expense(): static
    {
        return $this->state(fn () => [
            'type'        => 'spesa',
            'description' => 'Spesa Ricorrente: ' . $this->faker->sentence(3),
        ]);
    }

    public function active(): static
    {
        return $this->state(fn () => ['is_active' => true]);
    }

    public function inactive(): static
    {
        return $this->state(fn () => ['is_active' => false]);
    }

    public function forUser(User|int $user): static
    {
        return $this->state(fn () => [
            'user_id' => $user instanceof User ? $user->id : $user,
        ]);
    }

    public function forCategory(Category|int $category): static
    {
        return $this->state(fn () => [
            'category_id' => $category instanceof Category ? $category->id : $category,
        ]);
    }

    // =========================================================================
    // FACTORY CUSTOM (opzionale)
    // =========================================================================

    protected static function newFactory(): Factory
    {
        return new self();
    }
}
