<?php

namespace Modules\RecurringOperations\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use Modules\User\Models\User;
use Modules\RecurringOperations\Models\RecurringOperation;
use App\Traits\TruncatesTable;
use App\Traits\LogsSeederOutput;

class RecurringOperationsDBSeeder extends Seeder
{
    use TruncatesTable, LogsSeederOutput;

    public function run(): void
    {
        $this->initOutput();

        Model::withoutEvents(function () {
            // =========================================================================
            // 🔄 Pulizia tabella
            // =========================================================================
            $this->logInfo('Recurring', 'Pulizia tabella `recurring_operations`...', '🧹');
            $this->clearTable(RecurringOperation::class);

            // =========================================================================
            // 👥 Recupero utenti
            // =========================================================================
            $users = User::all();
            if ($users->isEmpty()) {
                $this->logSkip('Recurring', 'Nessun utente trovato. Seeder ignorato.');
                return;
            }

            // =========================================================================
            // 🔢 Parametri
            // =========================================================================
            $entriesPerCategory = 2;
            $totali = 0;

            // =========================================================================
            // 🔁 Creazione ricorrenze
            // =========================================================================
            foreach ($users as $user) {
                $categories = $user->categories()->get();
                if ($categories->isEmpty()) {
                    continue;
                }

                foreach ($categories as $category) {
                    RecurringOperation::factory()
                        ->count($entriesPerCategory)
                        ->forUser($user)
                        ->forCategory($category)
                        ->state([
                            'type' => $category->type,
                        ])
                        ->create();

                    $totali += $entriesPerCategory;
                }

                $this->logInfo('Recurring', "Ricorrenze generate per utente: {$user->name} (ID: {$user->id})", '➕');
            }

            // =========================================================================
            // ✅ Fine seeding
            // =========================================================================
            $this->logSuccess('Recurring', "{$totali} operazioni ricorrenti generate in totale.");
            $this->logNewLine();
        });
    }
}
