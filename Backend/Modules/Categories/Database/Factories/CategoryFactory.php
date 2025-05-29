<?php

namespace Modules\Categories\Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Modules\User\Models\User;
use Modules\Categories\Models\Category;

/**
 * Factory per il modello Category.
 */
class CategoryFactory extends Factory
{
    protected $model = Category::class;

    // =========================================================================
    // DEFINIZIONE DATI DI DEFAULT
    // =========================================================================
    public function definition(): array
    {
        static $usedNames = [];

        $nomi = [
            'Alimentazione', 'Trasporti', 'Casa', 'Utenze', 'Svago',
            'Salute', 'Istruzione', 'Abbigliamento', 'Viaggi', 'Regali',
            'Stipendio', 'Investimenti', 'Rimborso', 'Altro (Entrata)', 'Altro (Spesa)',
        ];

        // Rimuove nomi già usati per evitare duplicati nei test
        $availableNames = array_diff($nomi, $usedNames);
        $name = $availableNames ? collect($availableNames)->random() : $this->faker->unique()->word;
        $usedNames[] = $name;

        return [
            'name'    => $name,
            'type'    => $this->faker->randomElement(['entrata', 'spesa']),
            'user_id' => User::inRandomOrder()->value('id') ?? User::factory()->create()->id,
        ];
    }

    // =========================================================================
    // STATI PERSONALIZZATI
    // =========================================================================

    public function income(): static
    {
        return $this->state(fn () => ['type' => 'entrata']);
    }

    public function expense(): static
    {
        return $this->state(fn () => ['type' => 'spesa']);
    }
}
