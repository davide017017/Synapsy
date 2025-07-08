<?php

namespace Modules\Spese\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\Spese\Models\Spesa;
use Modules\Categories\Models\Category;
use Modules\User\Models\User;
use Illuminate\Support\Carbon;

/**
 * Factory per il modello Spesa — preset demo realistici.
 */
class SpesaFactory extends Factory
{
    protected $model = Spesa::class;

    // ===============================================================
    // DEFAULT: dati casuali
    // ===============================================================
    public function definition(): array
    {
        return [
            'date'        => $this->faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'amount'      => $this->faker->randomFloat(2, 5, 5000),
            'description' => $this->faker->sentence(3),
            'notes'       => $this->faker->optional(0.6)->paragraph(1),
        ];
    }

    // ===============================================================
    // PRESET DEMO — tipi di spesa realistici
    // ===============================================================
    public function affitto(): static
    {
        return $this->state(fn() => [
            'description' => 'Affitto appartamento',
            'amount'      => $this->faker->numberBetween(500, 900),
            'notes'       => 'Pagamento mensile affitto',
        ]);
    }

    public function spesaAlimentare(): static
    {
        return $this->state(fn() => [
            'description' => 'Spesa alimentare',
            'amount'      => $this->faker->numberBetween(40, 120),
            'notes'       => 'Supermercato o mercato',
        ]);
    }

    public function bolletta(): static
    {
        return $this->state(fn() => [
            'description' => 'Bollette utenze',
            'amount'      => $this->faker->numberBetween(60, 180),
            'notes'       => 'Luce/gas/acqua',
        ]);
    }

    public function streaming(): static
    {
        return $this->state(fn() => [
            'description' => 'Abbonamento streaming',
            'amount'      => $this->faker->numberBetween(8, 18),
            'notes'       => 'Netflix, Spotify ecc.',
        ]);
    }

    public function carburante(): static
    {
        return $this->state(fn() => [
            'description' => 'Carburante auto',
            'amount'      => $this->faker->numberBetween(35, 100),
            'notes'       => 'Rifornimento benzina/diesel',
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
        return $this->afterCreating(function (Spesa $spesa) {
            if (!$spesa->category_id) {
                $category = Category::factory()
                    ->expense()
                    ->create(['user_id' => $spesa->user_id]);
                $spesa->category_id = $category->id;
                $spesa->save();
            }
        });
    }
}
