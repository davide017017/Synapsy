<?php

namespace Modules\Spese\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use Modules\User\Models\User;
use Modules\Spese\Models\Spesa;
use App\Traits\TruncatesTable;
use App\Traits\LogsSeederOutput;

/**
 * Seeder DEMO — genera spese realistiche per utenti demo.
 */
class SpeseDBSeeder extends Seeder
{
    use TruncatesTable, LogsSeederOutput;

    public function run(): void
    {
        $this->initOutput();

        Model::withoutEvents(function () {
            // ===============================================================
            // Pulizia tabella
            // ===============================================================
            $this->logInfo('Spese', 'Pulizia tabella `spese`...', '🧹');
            $this->clearTable(Spesa::class);

            // ===============================================================
            // Recupero utenti
            // ===============================================================
            $users = User::all();
            if ($users->isEmpty()) {
                $this->logSkip('Spese', 'Nessun utente trovato. Seeder ignorato.');
                return;
            }

            // ===============================================================
            // Loop utenti e inserimento demo
            // ===============================================================
            $totali = 0;
            foreach ($users as $user) {
                // Mappa tutte le categorie spesa per nome
                $categories = $user->categories()->where('type', 'spesa')->get()->keyBy('name');

                // -------- Affitto (Casa): 12 mesi --------
                for ($i = 1; $i <= 12; $i++) {
                    Spesa::factory()
                        ->affitto()
                        ->forUser($user)
                        ->forCategory($categories['Casa'] ?? null)
                        ->onDate(now()->startOfYear()->addMonths($i - 1)->startOfMonth()->addDays(2))
                        ->create();
                    $totali++;
                }

                // -------- Spesa alimentare (Alimentazione): 4 settimane/mese * 12 mesi --------
                for ($month = 1; $month <= 12; $month++) {
                    for ($week = 1; $week <= 4; $week++) {
                        $date = now()->startOfYear()->addMonths($month - 1)->startOfMonth()->addDays(($week - 1) * 7 + rand(0, 2));
                        Spesa::factory()
                            ->spesaAlimentare()
                            ->forUser($user)
                            ->forCategory($categories['Alimentazione'] ?? null)
                            ->onDate($date)
                            ->create();
                        $totali++;
                    }
                }

                // -------- Bollette (Utenze): una ogni 2 mesi --------
                foreach ([2, 4, 6, 8, 10, 12] as $month) {
                    Spesa::factory()
                        ->bolletta()
                        ->forUser($user)
                        ->forCategory($categories['Utenze'] ?? null)
                        ->onDate(now()->startOfYear()->addMonths($month - 1)->addDays(rand(10, 18)))
                        ->create();
                    $totali++;
                }

                // -------- Streaming (Svago): ogni mese --------
                for ($i = 1; $i <= 12; $i++) {
                    Spesa::factory()
                        ->streaming()
                        ->forUser($user)
                        ->forCategory($categories['Svago'] ?? null)
                        ->onDate(now()->startOfYear()->addMonths($i - 1)->startOfMonth()->addDays(rand(0, 4)))
                        ->create();
                    $totali++;
                }

                // -------- Carburante (Trasporti): 2 volte/mese --------
                for ($month = 1; $month <= 12; $month++) {
                    $usedDates = [];
                    for ($j = 1; $j <= 2; $j++) {
                        // Tenta finché non trova una data univoca per questo mese
                        do {
                            $date = now()->startOfYear()->addMonths($month - 1)->startOfMonth()->addDays(rand(3, 25));
                        } while (in_array($date->format('Y-m-d'), $usedDates));
                        $usedDates[] = $date->format('Y-m-d');

                        // Puoi anche variare leggermente la descrizione se vuoi (non obbligatorio se la data è sempre diversa)
                        $descrizione = "Carburante auto";
                        if ($j > 1) $descrizione .= " (rifornimento bis)";

                        Spesa::factory()
                            ->carburante()
                            ->forUser($user)
                            ->forCategory($categories['Trasporti'] ?? null)
                            ->onDate($date)
                            ->state(['description' => $descrizione])
                            ->create();
                        $totali++;
                    }
                }


                $this->logInfo('Spese', "Spese demo generate per {$user->name} (ID: {$user->id})");
            }

            // ===============================================================
            // Fine seeding
            // ===============================================================
            $this->logSuccess('Spese', "{$totali} spese demo generate in totale.");
            $this->logNewLine();
        });
    }
}
