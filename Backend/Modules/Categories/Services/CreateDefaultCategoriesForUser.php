<?php

declare(strict_types=1);

namespace Modules\Categories\Services;

use Modules\Categories\Models\Category;
use Modules\User\Models\User;

// ────────────────────────────────────────────────────────────────
// CreateDefaultCategoriesForUser — crea categorie standard per 1 user
// ────────────────────────────────────────────────────────────────
class CreateDefaultCategoriesForUser
{
  // ------------------------------------------------------------
  // Crea categorie default (idempotente: evita duplicati)
  // ------------------------------------------------------------
  public static function run(User $user): void
  {
    $userId = $user->id;
    if ($userId <= 0) return;

    $categorieStandard = CategoryDefaults::standard();
    $categoryMeta = CategoryDefaults::meta();

    foreach ($categorieStandard as $nomeCategoria => $tipo) {
      $meta = $categoryMeta[$nomeCategoria] ?? ['color' => null, 'icon' => null];

      // Idempotenza: se esiste già per quell'utente, non ricreare
      Category::query()->firstOrCreate(
        [
          'user_id' => $userId,
          'name' => $nomeCategoria,
          'type' => $tipo,
        ],
        [
          'color' => $meta['color'],
          'icon' => $meta['icon'],
        ]
      );
    }
  }
}

/* ===================================================
File: CreateDefaultCategoriesForUser.php
Scopo: crea le categorie standard per un singolo utente.
Come: usa firstOrCreate su (user_id,name,type) per non duplicare; applica color/icon dalle defaults.
=================================================== */
