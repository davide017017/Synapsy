<?php

namespace Modules\RecurringOperations\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\RecurringOperations\Models\RecurringOperation;
use Modules\User\Models\User;
use Modules\Categories\Models\Category;
use Illuminate\Support\Carbon;

/**
 * Factory per il modello RecurringOperation — SOLO preset demo realistici.
 */
class RecurringOperationFactory extends Factory
{
    protected $model = RecurringOperation::class;

    // =========================================================================
    // DEFAULT: dati casuali (NON USARE PER DEMO REALI)
    // =========================================================================
    public function definition(): array
    {
        // Non viene usato nei preset! Puoi anche lasciarlo o rimuoverlo.
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
    // ENTRATE REALISTICHE
    // =========================================================================

    public function stipendio(): static
    {
        return $this->state(fn() => [
            'type'        => 'entrata',
            'description' => 'Stipendio mensile',
            'amount'      => $this->faker->numberBetween(1300, 1700),
            'frequency'   => 'monthly',
            'interval'    => 1,
            'notes'       => 'Stipendio ricorrente da azienda',
        ]);
    }

    public function bonusAnnuale(): static
    {
        return $this->state(fn() => [
            'type'        => 'entrata',
            'description' => 'Bonus annuale',
            'amount'      => $this->faker->numberBetween(500, 2500),
            'frequency'   => 'annually',
            'interval'    => 1,
            'notes'       => 'Bonus una volta all\'anno',
        ]);
    }

    public function interesseDeposito(): static
    {
        return $this->state(fn() => [
            'type'        => 'entrata',
            'description' => 'Interesse conto deposito',
            'amount'      => $this->faker->numberBetween(20, 200),
            'frequency'   => 'annually',
            'interval'    => 1,
            'notes'       => 'Interesse bancario',
        ]);
    }

    public function affittoPercepito(): static
    {
        return $this->state(fn() => [
            'type'        => 'entrata',
            'description' => 'Affitto percepito',
            'amount'      => $this->faker->numberBetween(400, 900),
            'frequency'   => 'monthly',
            'interval'    => 1,
            'notes'       => 'Affitto da inquilino',
        ]);
    }

    public function regaloMensile(): static
    {
        return $this->state(fn() => [
            'type'        => 'entrata',
            'description' => 'Regalo mensile',
            'amount'      => $this->faker->numberBetween(40, 120),
            'frequency'   => 'monthly',
            'interval'    => 1,
            'notes'       => 'Regalo ricevuto periodicamente',
        ]);
    }

    public function rimborsoAnnuale(): static
    {
        return $this->state(fn() => [
            'type'        => 'entrata',
            'description' => 'Rimborso spese annuale',
            'amount'      => $this->faker->numberBetween(80, 300),
            'frequency'   => 'annually',
            'interval'    => 1,
            'notes'       => 'Rimborso su spese sostenute',
        ]);
    }

    // =========================================================================
    // SPESE REALISTICHE
    // =========================================================================

    public function affitto(): static
    {
        return $this->state(fn() => [
            'type'        => 'spesa',
            'description' => 'Affitto mensile',
            'amount'      => $this->faker->numberBetween(500, 900),
            'frequency'   => 'monthly',
            'interval'    => 1,
            'notes'       => 'Pagamento affitto appartamento',
        ]);
    }

    public function bolletta(): static
    {
        return $this->state(fn() => [
            'type'        => 'spesa',
            'description' => 'Bolletta utenze',
            'amount'      => $this->faker->numberBetween(70, 180),
            'frequency'   => 'monthly',
            'interval'    => 2, // ogni due mesi
            'notes'       => 'Luce, gas, acqua',
        ]);
    }

    public function assicurazioneAuto(): static
    {
        return $this->state(fn() => [
            'type'        => 'spesa',
            'description' => 'Assicurazione auto',
            'amount'      => $this->faker->numberBetween(250, 500),
            'frequency'   => 'annually',
            'interval'    => 1,
            'notes'       => 'Polizza assicurativa auto',
        ]);
    }

    public function tassaRifiuti(): static
    {
        return $this->state(fn() => [
            'type'        => 'spesa',
            'description' => 'Tassa rifiuti',
            'amount'      => $this->faker->numberBetween(100, 300),
            'frequency'   => 'annually',
            'interval'    => 1,
            'notes'       => 'TARI annuale',
        ]);
    }

    public function manutenzioneAuto(): static
    {
        return $this->state(fn() => [
            'type'        => 'spesa',
            'description' => 'Manutenzione auto',
            'amount'      => $this->faker->numberBetween(120, 400),
            'frequency'   => 'annually',
            'interval'    => 1,
            'notes'       => 'Tagliando/revisione',
        ]);
    }

    public function streaming(): static
    {
        return $this->state(fn() => [
            'type'        => 'spesa',
            'description' => 'Abbonamento streaming',
            'amount'      => $this->faker->numberBetween(8, 18),
            'frequency'   => 'monthly',
            'interval'    => 1,
            'notes'       => 'Netflix, Spotify ecc.',
        ]);
    }

    public function palestraMensile(): static
    {
        return $this->state(fn() => [
            'type'        => 'spesa',
            'description' => 'Abbonamento palestra',
            'amount'      => $this->faker->numberBetween(25, 55),
            'frequency'   => 'monthly',
            'interval'    => 1,
            'notes'       => 'Palestra in città',
        ]);
    }

    public function palestraSettimanale(): static
    {
        return $this->state(fn() => [
            'type'        => 'spesa',
            'description' => 'Lezione personal trainer',
            'amount'      => $this->faker->numberBetween(10, 20),
            'frequency'   => 'weekly',
            'interval'    => 1,
            'notes'       => 'Lezione ogni settimana',
        ]);
    }

    public function babysitterSettimanale(): static
    {
        return $this->state(fn() => [
            'type'        => 'spesa',
            'description' => 'Babysitter',
            'amount'      => $this->faker->numberBetween(30, 70),
            'frequency'   => 'weekly',
            'interval'    => 1,
            'notes'       => 'Baby-sitting regolare',
        ]);
    }

    public function colfMensile(): static
    {
        return $this->state(fn() => [
            'type'        => 'spesa',
            'description' => 'Colf/aiuto domestico',
            'amount'      => $this->faker->numberBetween(50, 150),
            'frequency'   => 'monthly',
            'interval'    => 1,
            'notes'       => 'Pulizie domestiche',
        ]);
    }

    public function donazioneMensile(): static
    {
        return $this->state(fn() => [
            'type'        => 'spesa',
            'description' => 'Donazione a ONLUS',
            'amount'      => $this->faker->numberBetween(5, 30),
            'frequency'   => 'monthly',
            'interval'    => 1,
            'notes'       => 'Sostegno solidale mensile',
        ]);
    }

    // =========================================================================
    // STATI EXTRA: active/inactive, forUser, forCategory
    // =========================================================================

    public function active(): static
    {
        return $this->state(fn() => ['is_active' => true]);
    }

    public function inactive(): static
    {
        return $this->state(fn() => ['is_active' => false]);
    }

    public function forUser(User|int $user): static
    {
        return $this->state(fn() => [
            'user_id' => $user instanceof User ? $user->id : $user,
        ]);
    }

    public function forCategory(Category|int $category): static
    {
        return $this->state(fn() => [
            'category_id' => $category instanceof Category ? $category->id : $category,
        ]);
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
    // FACTORY CUSTOM (opzionale)
    // =========================================================================
    protected static function newFactory(): Factory
    {
        return new self();
    }
}
