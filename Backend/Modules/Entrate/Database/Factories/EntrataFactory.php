<?php

namespace Modules\Entrate\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\Entrate\Models\Entrata;
use Modules\Categories\Models\Category;
use Modules\User\Models\User;
use Illuminate\Support\Carbon;

/**
 * Factory per il modello Entrata — con preset demo realistici.
 */
class EntrataFactory extends Factory
{
    protected $model = Entrata::class;

    // ===============================================================
    // DEFAULT: dati casuali
    // ===============================================================
    public function definition(): array
    {
        return [
            'date'        => $this->faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'amount'      => $this->faker->randomFloat(2, 10, 10000),
            'description' => $this->faker->sentence(4),
            'notes'       => $this->faker->optional(0.5)->paragraph(2),
        ];
    }

    // ===============================================================
    // PRESET DEMO — tipi di entrata realistici
    // ===============================================================
    public function stipendio(): static
    {
        return $this->state(fn() => [
            'description' => 'Stipendio mensile',
            'amount'      => $this->faker->numberBetween(1200, 1800),
            'notes'       => 'Stipendio aziendale',
        ]);
    }

    public function regalo(): static
    {
        return $this->state(fn() => [
            'description' => 'Regalo di compleanno',
            'amount'      => $this->faker->numberBetween(20, 100),
            'notes'       => 'Ricevuto da amici/parenti',
        ]);
    }

    public function grattaEVinci(): static
    {
        return $this->state(fn() => [
            'description' => 'Vincita Gratta e Vinci',
            'amount'      => $this->faker->numberBetween(10, 500),
            'notes'       => 'Vincita occasionale',
        ]);
    }

    public function vinted(): static
    {
        return $this->state(fn() => [
            'description' => 'Vendita Vinted',
            'amount'      => $this->faker->numberBetween(10, 80),
            'notes'       => 'Abbigliamento usato',
        ]);
    }

    public function rimborso(): static
    {
        return $this->state(fn() => [
            'description' => 'Rimborso spese',
            'amount'      => $this->faker->numberBetween(15, 300),
            'notes'       => 'Rimborso da azienda/ente',
        ]);
    }

    // ===============================================================
    // ALTRI METODI STANDARD
    // ===============================================================
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

    public function withAmount(float $amount): static
    {
        return $this->state(fn() => ['amount' => $amount]);
    }

    public function onDate(string|Carbon $date): static
    {
        return $this->state(fn() => ['date' => $date]);
    }

    // ===============================================================
    // CONFIGURAZIONE POST-CREAZIONE (category_id obbligatoria)
    // ===============================================================
    public function configure(): static
    {
        return $this->afterCreating(function (Entrata $entrata) {
            if (!$entrata->category_id) {
                $category = Category::factory()
                    ->income()
                    ->create(['user_id' => $entrata->user_id]);
                $entrata->category_id = $category->id;
                $entrata->save();
            }
        });
    }
}
