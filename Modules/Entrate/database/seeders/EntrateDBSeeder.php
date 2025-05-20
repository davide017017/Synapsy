<?php

namespace Modules\Entrate\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use Modules\User\Models\User;
use Modules\Entrate\Models\Entrata;
use App\Traits\TruncatesTable;
use App\Traits\LogsSeederOutput;

class EntrateDBSeeder extends Seeder
{
    use TruncatesTable, LogsSeederOutput;

    public function run(): void
    {
        $this->initOutput();

        Model::withoutEvents(function () {
            // =========================================================================
            // 🔄 Pulizia tabella
            // =========================================================================
            $this->logInfo('Entrate', 'Pulizia tabella `entrate`...', '🧹');
            $this->clearTable(Entrata::class);

            // =========================================================================
            // 👥 Recupero utenti
            // =========================================================================
            $users = User::all();
            if ($users->isEmpty()) {
                $this->logSkip('Entrate', 'Nessun utente trovato. Seeder ignorato.');
                return;
            }

            // =========================================================================
            // 🔢 Parametri
            // =========================================================================
            $entriesPerCategory = 2;
            $totali = 0;

            // =========================================================================
            // 🧾 Creazione entrate
            // =========================================================================
            foreach ($users as $user) {
                $categories = $user->categories()->where('type', 'entrata')->get();
                if ($categories->isEmpty()) {
                    continue;
                }

                foreach ($categories as $category) {
                    Entrata::factory()
                        ->count($entriesPerCategory)
                        ->forUser($user)
                        ->forCategory($category)
                        ->create();

                    $totali += $entriesPerCategory;
                }

                $this->logInfo('Entrate', "Entrate generate per utente: {$user->name} (ID: {$user->id})", '➕');
            }

            // =========================================================================
            // ✅ Fine seeding
            // =========================================================================
            $this->logSuccess('Entrate', "{$totali} entrate generate in totale.");
            $this->logNewLine();
        });
    }
}
