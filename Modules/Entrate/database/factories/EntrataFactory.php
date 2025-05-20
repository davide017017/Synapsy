<?php

namespace Modules\Entrate\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\Entrate\Models\Entrata;
use Modules\Categories\Models\Category;
use Modules\User\Models\User;
use Illuminate\Support\Carbon;

/**
 * Factory per il modello Entrata.
 */
class EntrataFactory extends Factory
{
    protected $model = Entrata::class;

    // =========================================================================
    // DEFINIZIONE DATI DI DEFAULT
    // =========================================================================
    public function definition(): array
    {
        return [
            'date'        => $this->faker->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'amount'      => $this->faker->randomFloat(2, 10, 10000),
            'description' => $this->faker->sentence(4),
            'notes'       => $this->faker->optional(0.5)->paragraph(2),
        ];
    }

    // =========================================================================
    // CONFIGURAZIONE POST-CREAZIONE
    // =========================================================================
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
