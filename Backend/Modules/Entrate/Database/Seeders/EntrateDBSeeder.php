<?php

namespace Modules\Entrate\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use Modules\User\Models\User;
use Modules\Entrate\Models\Entrata;
use App\Traits\TruncatesTable;
use App\Traits\LogsSeederOutput;

/**
 * Seeder DEMO — genera entrate realistiche per utenti demo.
 */
class EntrateDBSeeder extends Seeder
{
    use TruncatesTable, LogsSeederOutput;

    public function run(): void
    {
        $this->initOutput();

        Model::withoutEvents(function () {
            // ===============================================================
            // Pulizia tabella
            // ===============================================================
            $this->logInfo('Entrate', 'Pulizia tabella `entrate`...', '🧹');
            $this->clearTable(Entrata::class);

            // ===============================================================
            // Recupero utenti
            // ===============================================================
            $users = User::all();
            if ($users->isEmpty()) {
                $this->logSkip('Entrate', 'Nessun utente trovato. Seeder ignorato.');
                return;
            }

            // ===============================================================
            // Loop utenti e inserimento demo
            // ===============================================================
            $totali = 0;
            foreach ($users as $user) {
                // Mappa tutte le categorie entrata per nome
                $categories = $user->categories()->where('type', 'entrata')->get()->keyBy('name');

                // -------- Stipendio: 12 mensilità --------
                for ($i = 1; $i <= 12; $i++) {
                    Entrata::factory()
                        ->stipendio()
                        ->forUser($user)
                        ->forCategory($categories['Stipendio'] ?? null)
                        ->onDate(now()->startOfYear()->addMonths($i - 1)->endOfMonth())
                        ->create();
                    $totali++;
                }

                // -------- Regalo: 3 eventi --------
                foreach ([2, 7, 12] as $month) {
                    Entrata::factory()
                        ->regalo()
                        ->forUser($user)
                        ->forCategory($categories['Regalo'] ?? null)
                        ->onDate(now()->startOfYear()->addMonths($month - 1)->addDays(rand(0, 5)))
                        ->create();
                    $totali++;
                }

                // -------- Investimenti: 4 "vinted" simulate come investimenti --------
                foreach ([3, 6, 9, 11] as $month) {
                    Entrata::factory()
                        ->vinted()
                        ->forUser($user)
                        ->forCategory($categories['Investimenti'] ?? null)
                        ->onDate(now()->startOfYear()->addMonths($month - 1)->addDays(rand(5, 25)))
                        ->create();
                    $totali++;
                }

                // -------- Rimborso: 2 casi su "Altro (Entrata)" --------
                foreach ([4, 10] as $month) {
                    Entrata::factory()
                        ->rimborso()
                        ->forUser($user)
                        ->forCategory($categories['Altro (Entrata)'] ?? null)
                        ->onDate(now()->startOfYear()->addMonths($month - 1)->addDays(rand(10, 20)))
                        ->create();
                    $totali++;
                }

                // -------- Gratta e Vinci: 1 vincita su "Altro (Entrata)" --------
                Entrata::factory()
                    ->grattaEVinci()
                    ->forUser($user)
                    ->forCategory($categories['Altro (Entrata)'] ?? null)
                    ->onDate(now()->startOfYear()->addMonths(rand(0, 11))->addDays(rand(0, 27)))
                    ->create();
                $totali++;

                $this->logInfo('Entrate', "Entrate demo generate per {$user->name} (ID: {$user->id})");
            }

            // ===============================================================
            // Fine seeding
            // ===============================================================
            $this->logSuccess('Entrate', "{$totali} entrate demo generate in totale.");
            $this->logNewLine();
        });
    }
}
