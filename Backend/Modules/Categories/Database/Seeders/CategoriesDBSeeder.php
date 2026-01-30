<?php

namespace Modules\Categories\Database\Seeders;

use App\Traits\LogsSeederOutput;
use App\Traits\TruncatesTable;
use Illuminate\Database\Seeder;
use Modules\Categories\Models\Category;
use Modules\Categories\Services\CreateDefaultCategoriesForUser;
use Modules\User\Models\User;

class CategoriesDBSeeder extends Seeder
{
  use LogsSeederOutput, TruncatesTable;

  public function run(): void
  {
    $this->initOutput();

    // =========================================================================
    // 🔄 Pulizia tabella
    // =========================================================================
    $this->logInfo('Categories', 'Pulizia tabella `categories`...', '🧹');
    $this->clearTable(Category::class);

    // =========================================================================
    // 👥 Recupero utenti
    // =========================================================================
    $utenti = User::all();
    if ($utenti->isEmpty()) {
      $this->logWarning(
        'Categories',
        'Nessun utente trovato. Seeder categorie SKIPPATO.',
        '⚠️'
      );
      return;
    }


    // =========================================================================
    // 🏷️ Assegnazione categorie
    // =========================================================================
    foreach ($utenti as $utente) {
      CreateDefaultCategoriesForUser::run((int)$utente->id);
      $this->logInfo('Categories', "Categorie standard generate per utente ID {$utente->id}", '➕');
    }

    // =========================================================================
    // ✅ Fine seeding
    // =========================================================================
    $this->logSuccess('Categories', 'Tutti gli utenti hanno le categorie standard.');
    $this->logNewLine();
  }
}

/* ===================================================
File: CategoriesDBSeeder.php
Scopo: seeder ambiente per tabella categories.
Come: pulisce la tabella e rigenera le categorie standard per tutti gli utenti, delegando la creazione al servizio riusabile CreateDefaultCategoriesForUser.
=================================================== */
