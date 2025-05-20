<?php

namespace Modules\Spese\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\Spese\Models\Spesa;
use Modules\Categories\Models\Category;
use Modules\User\Models\User;
use Illuminate\Support\Carbon;

/**
 * Factory per il modello Spesa.
 */
class SpesaFactory extends Factory
{
    protected $model = Spesa::class;

    // =========================================================================
    // DEFINIZIONE DATI DI DEFAULT
    // =========================================================================
    public function definition(): array
    {
        return [
            'date'        => $this->faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'amount'      => $this->faker->randomFloat(2, 5, 5000),
            'description' => $this->faker->sentence(3),
            'notes'       => $this->faker->optional(0.6)->paragraph(1),
        ];
    }

    // =========================================================================
    // CONFIGURAZIONE POST-CREAZIONE
    // =========================================================================
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

    // =========================================================================
    // STATI PERSONALIZZATI
    // =========================================================================

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

    public function withAmount(float $amount): static
    {
        return $this->state(fn () => ['amount' => $amount]);
    }

    public function onDate(string|Carbon $date): static
    {
        return $this->state(fn () => ['date' => $date]);
    }
}
