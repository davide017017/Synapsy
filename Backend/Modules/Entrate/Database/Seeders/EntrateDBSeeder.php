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
            $this->logInfo('Entrate', 'Pulizia tabella `entrate`...', '🧹');
            $this->clearTable(Entrata::class);

            $users = User::all();
            if ($users->isEmpty()) {
                $this->logSkip('Entrate', 'Nessun utente trovato. Seeder ignorato.');
                return;
            }

            $totali = 0;
            $now = now();
            $currentMonth = $now->month;
            $currentDay   = $now->day;

            foreach ($users as $user) {
                $categories = $user->categories()->where('type', 'entrata')->get()->keyBy('name');
                $usedDates = [];

                // Stipendio
                for ($i = 1; $i <= $currentMonth; $i++) {
                    $descrizione = "Stipendio mensile";
                    $date = ($i == $currentMonth)
                        ? $now->copy()->startOfMonth()->addDays($currentDay - 1)
                        : $now->copy()->startOfYear()->addMonths($i - 1)->endOfMonth();
                    $key = $date->format('Y-m-d') . '-' . $descrizione;
                    if ($date->isFuture() || isset($usedDates[$key])) continue;
                    $usedDates[$key] = true;
                    Entrata::factory()
                        ->stipendio()
                        ->forUser($user)
                        ->forCategory($categories['Stipendio'] ?? null)
                        ->onDate($date)
                        ->state(['description' => $descrizione])
                        ->create();
                    $totali++;
                }

                // Regalo
                foreach ([2, 7, 12] as $month) {
                    if ($month > $currentMonth) continue;
                    $descrizione = "Regalo di compleanno";
                    $maxDay = ($month == $currentMonth) ? $currentDay : $now->copy()->startOfYear()->addMonths($month - 1)->daysInMonth;
                    $day = rand(1, $maxDay);
                    $date = $now->copy()->startOfYear()->addMonths($month - 1)->startOfMonth()->addDays($day - 1);
                    $key = $date->format('Y-m-d') . '-' . $descrizione;
                    if ($date->isFuture() || isset($usedDates[$key])) continue;
                    $usedDates[$key] = true;
                    Entrata::factory()
                        ->regalo()
                        ->forUser($user)
                        ->forCategory($categories['Regalo'] ?? null)
                        ->onDate($date)
                        ->state(['description' => $descrizione])
                        ->create();
                    $totali++;
                }

                // Investimenti/Vinted
                foreach ([3, 6, 9, 11] as $month) {
                    if ($month > $currentMonth) continue;
                    $descrizione = "Vendita Vinted";
                    $maxDay = ($month == $currentMonth) ? $currentDay : $now->copy()->startOfYear()->addMonths($month - 1)->daysInMonth;
                    $day = rand(5, $maxDay);
                    $day = min($day, $maxDay);
                    $date = $now->copy()->startOfYear()->addMonths($month - 1)->startOfMonth()->addDays($day - 1);
                    $key = $date->format('Y-m-d') . '-' . $descrizione;
                    if ($date->isFuture() || isset($usedDates[$key])) continue;
                    $usedDates[$key] = true;
                    Entrata::factory()
                        ->vinted()
                        ->forUser($user)
                        ->forCategory($categories['Investimenti'] ?? null)
                        ->onDate($date)
                        ->state(['description' => $descrizione])
                        ->create();
                    $totali++;
                }

                // Rimborso
                foreach ([4, 10] as $month) {
                    if ($month > $currentMonth) continue;
                    $descrizione = "Rimborso spese";
                    $maxDay = ($month == $currentMonth) ? $currentDay : $now->copy()->startOfYear()->addMonths($month - 1)->daysInMonth;
                    $day = rand(10, $maxDay);
                    $day = min($day, $maxDay);
                    $date = $now->copy()->startOfYear()->addMonths($month - 1)->startOfMonth()->addDays($day - 1);
                    $key = $date->format('Y-m-d') . '-' . $descrizione;
                    if ($date->isFuture() || isset($usedDates[$key])) continue;
                    $usedDates[$key] = true;
                    Entrata::factory()
                        ->rimborso()
                        ->forUser($user)
                        ->forCategory($categories['Altro (Entrata)'] ?? null)
                        ->onDate($date)
                        ->state(['description' => $descrizione])
                        ->create();
                    $totali++;
                }

                // Gratta e Vinci
                $grattaMonth = rand(1, $currentMonth);
                $descrizione = "Vincita Gratta e Vinci";
                $maxDay = ($grattaMonth == $currentMonth) ? $currentDay : $now->copy()->startOfYear()->addMonths($grattaMonth - 1)->daysInMonth;
                $day = rand(1, $maxDay);
                $date = $now->copy()->startOfYear()->addMonths($grattaMonth - 1)->startOfMonth()->addDays($day - 1);
                $key = $date->format('Y-m-d') . '-' . $descrizione;
                if (!$date->isFuture() && !isset($usedDates[$key])) {
                    $usedDates[$key] = true;
                    Entrata::factory()
                        ->grattaEVinci()
                        ->forUser($user)
                        ->forCategory($categories['Altro (Entrata)'] ?? null)
                        ->onDate($date)
                        ->state(['description' => $descrizione])
                        ->create();
                    $totali++;
                }

                $this->logInfo('Entrate', "Entrate demo generate per {$user->name} (ID: {$user->id})");
            }

            $this->logSuccess('Entrate', "{$totali} entrate demo generate in totale.");
            $this->logNewLine();
        });
    }
}
