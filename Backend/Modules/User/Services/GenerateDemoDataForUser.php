<?php

declare(strict_types=1);

namespace Modules\User\Services;

use Illuminate\Support\Arr;
use Modules\User\Models\User;
use Modules\Spese\Models\Spesa;
use Modules\Entrate\Models\Entrata;
use Modules\RecurringOperations\Models\RecurringOperation;
use Modules\Categories\Models\Category;

class GenerateDemoDataForUser
{
  public static function run(
    User $user,
    int $spese = 25,
    int $entrate = 12,
    int $ricorrenze = 8
  ): void {

    // ─────────────────────────
    // CATEGORIE
    // ─────────────────────────
    $categorieSpesa = Category::where('user_id', $user->id)
      ->where('type', 'spesa')
      ->get();

    $categorieEntrata = Category::where('user_id', $user->id)
      ->where('type', 'entrata')
      ->get();

    if ($categorieSpesa->isEmpty() || $categorieEntrata->isEmpty()) {
      return;
    }

    // ─────────────────────────
    // SPESE DEMO
    // ─────────────────────────
    for ($i = 1; $i <= $spese; $i++) {
      Spesa::create([
        'user_id'     => $user->id,
        'category_id' => $categorieSpesa->random()->id,
        'amount'      => rand(5, 180),
        'description' => 'Spesa demo #' . $i,
        'date'        => now()->subDays(rand(1, 120)),
      ]);
    }

    // ─────────────────────────
    // ENTRATE DEMO
    // ─────────────────────────
    for ($i = 1; $i <= $entrate; $i++) {
      Entrata::create([
        'user_id'     => $user->id,
        'category_id' => $categorieEntrata->random()->id,
        'amount'      => rand(600, 2800),
        'description' => 'Entrata demo #' . $i,
        'date'        => now()->subDays(rand(1, 120)),
      ]);
    }

    // ─────────────────────────
    // RICORRENZE DEMO
    // ─────────────────────────
    for ($i = 1; $i <= $ricorrenze; $i++) {

      $isEntrata = rand(0, 1) === 1;
      $frequency = Arr::random(['monthly', 'yearly']);

      $startDate = now()->subMonths(rand(1, 8));

      $nextOccurrenceDate = match ($frequency) {
        'monthly' => $startDate->copy()->addMonth(),
        'yearly'  => $startDate->copy()->addYear(),
      };

      RecurringOperation::create([
        'user_id'              => $user->id,
        'category_id'          => $isEntrata
          ? $categorieEntrata->random()->id
          : $categorieSpesa->random()->id,
        'type'                 => $isEntrata ? 'entrata' : 'spesa',
        'amount'               => rand(30, 600),
        'description'          => 'Ricorrenza demo #' . $i,
        'frequency'            => $frequency,
        'start_date'           => $startDate,
        'next_occurrence_date' => $nextOccurrenceDate,
        'is_active'            => true,
      ]);
    }
  }
}
