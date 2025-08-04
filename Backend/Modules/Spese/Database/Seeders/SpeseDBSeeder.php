<?php

namespace Modules\Spese\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use Modules\User\Models\User;
use Modules\Spese\Models\Spesa;
use App\Traits\TruncatesTable;
use App\Traits\LogsSeederOutput;

/**
 * Seeder DEMO — genera spese realistiche per utenti demo (solo nel passato, senza duplicati per giorno/descrizione/utente).
 */
class SpeseDBSeeder extends Seeder
{
    use TruncatesTable, LogsSeederOutput;

    public function run(): void
    {
        $this->initOutput();

        Model::withoutEvents(function () {
            // =============================
            // Pulizia tabella
            // =============================
            $this->logInfo('Spese', 'Pulizia tabella `spese`...', '🧹');
            $this->clearTable(Spesa::class);

            // =============================
            // Recupero utenti
            // =============================
            $users = User::all();
            if ($users->isEmpty()) {
                $this->logSkip('Spese', 'Nessun utente trovato. Seeder ignorato.');
                return;
            }

            $totali = 0;
            $now = now();
            $currentMonth = $now->month;
            $currentDay   = $now->day;

            foreach ($users as $user) {
                // Mappa tutte le categorie spesa per nome
                $categories = $user->categories()->where('type', 'spesa')->get()->keyBy('name');

                // Array per evitare duplicati: chiave = "$date-$descrizione"
                $usedDates = [];

                // -------- Affitto (Casa): solo mesi passati --------
                for ($i = 1; $i <= $currentMonth; $i++) {
                    $date = $now->copy()->startOfYear()->addMonths($i - 1)->startOfMonth()->addDays(2);
                    $descrizione = "Affitto mensile";
                    $key = $date->format('Y-m-d') . '-' . $descrizione;
                    if ($date->isFuture() || isset($usedDates[$key])) continue;
                    $usedDates[$key] = true;
                    Spesa::factory()
                        ->affitto()
                        ->forUser($user)
                        ->forCategory($categories['Casa'] ?? null)
                        ->onDate($date)
                        ->create();
                    $totali++;
                }

                // -------- Spesa alimentare (Alimentazione): 4/settimane per mese --------
                for ($month = 1; $month <= $currentMonth; $month++) {
                    $firstDayOfMonth = $now->copy()->startOfYear()->addMonths($month - 1)->startOfMonth();
                    $maxDay = ($month == $currentMonth) ? $currentDay : $firstDayOfMonth->daysInMonth;
                    $allDays = range(1, $maxDay);
                    shuffle($allDays);
                    $weekIdx = 0;
                    foreach ($allDays as $day) {
                        if ($weekIdx >= 4) break;
                        $date = $firstDayOfMonth->copy()->addDays($day - 1);
                        $descrizione = "Spesa alimentare";
                        $key = $date->format('Y-m-d') . '-' . $descrizione;
                        if ($date->isFuture() || isset($usedDates[$key])) continue;
                        $usedDates[$key] = true;
                        Spesa::factory()
                            ->spesaAlimentare()
                            ->forUser($user)
                            ->forCategory($categories['Alimentazione'] ?? null)
                            ->onDate($date)
                            ->create();
                        $totali++;
                        $weekIdx++;
                    }
                }

                // -------- Bollette (Utenze): ogni 2 mesi --------
                foreach ([2, 4, 6, 8, 10, 12] as $month) {
                    if ($month > $currentMonth) continue;
                    $firstDay = $now->copy()->startOfYear()->addMonths($month - 1)->startOfMonth();
                    $maxDay = ($month == $currentMonth) ? $currentDay : $firstDay->daysInMonth;
                    $day = rand(10, $maxDay);
                    $date = $firstDay->copy()->addDays($day - 1);
                    $descrizione = "Bolletta utenze";
                    $key = $date->format('Y-m-d') . '-' . $descrizione;
                    if ($date->isFuture() || isset($usedDates[$key])) continue;
                    $usedDates[$key] = true;
                    Spesa::factory()
                        ->bolletta()
                        ->forUser($user)
                        ->forCategory($categories['Utenze'] ?? null)
                        ->onDate($date)
                        ->create();
                    $totali++;
                }

                // -------- Streaming (Svago): solo mesi passati --------
                for ($i = 1; $i <= $currentMonth; $i++) {
                    $firstDay = $now->copy()->startOfYear()->addMonths($i - 1)->startOfMonth();
                    $maxDay = ($i == $currentMonth) ? $currentDay : $firstDay->daysInMonth;
                    $day = rand(1, min(5, $maxDay));
                    $date = $firstDay->copy()->addDays($day - 1);
                    $descrizione = "Abbonamento streaming";
                    $key = $date->format('Y-m-d') . '-' . $descrizione;
                    if ($date->isFuture() || isset($usedDates[$key])) continue;
                    $usedDates[$key] = true;
                    Spesa::factory()
                        ->streaming()
                        ->forUser($user)
                        ->forCategory($categories['Svago'] ?? null)
                        ->onDate($date)
                        ->create();
                    $totali++;
                }

                // -------- Carburante (Trasporti): 2 volte/mese --------
                for ($month = 1; $month <= $currentMonth; $month++) {
                    $firstDay = $now->copy()->startOfYear()->addMonths($month - 1)->startOfMonth();
                    $maxDay = ($month == $currentMonth) ? $currentDay : $firstDay->daysInMonth;
                    for ($j = 1; $j <= 2; $j++) {
                        $tentativi = 0;
                        do {
                            $day = rand(3, $maxDay);
                            $date = $firstDay->copy()->addDays($day - 1);
                            $descrizione = "Carburante auto" . ($j > 1 ? " (rifornimento bis)" : "");
                            $key = $date->format('Y-m-d') . '-' . $descrizione;
                            $tentativi++;
                        } while (($date->isFuture() || isset($usedDates[$key])) && $tentativi < 10);

                        if ($date->isFuture() || isset($usedDates[$key])) continue;
                        $usedDates[$key] = true;

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

            // =============================
            // Fine seeding
            // =============================
            $this->logSuccess('Spese', "{$totali} spese demo generate in totale.");
            $this->logNewLine();
        });
    }
}

