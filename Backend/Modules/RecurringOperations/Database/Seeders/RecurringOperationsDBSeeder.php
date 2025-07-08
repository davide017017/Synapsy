<?php

namespace Modules\RecurringOperations\Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Database\Eloquent\Model;
use Modules\User\Models\User;
use Modules\RecurringOperations\Models\RecurringOperation;
use App\Traits\TruncatesTable;
use App\Traits\LogsSeederOutput;

/**
 * Seeder DEMO — genera ricorrenze credibili per utenti demo (tutte già partite).
 */
class RecurringOperationsDBSeeder extends Seeder
{
    use TruncatesTable, LogsSeederOutput;

    public function run(): void
    {
        $this->initOutput();

        Model::withoutEvents(function () {
            // ===============================================================
            // 🔄 Pulizia tabella
            // ===============================================================
            $this->logInfo('Recurring', 'Pulizia tabella `recurring_operations`...', '🧹');
            $this->clearTable(RecurringOperation::class);

            // ===============================================================
            // 👥 Recupero utenti
            // ===============================================================
            $users = User::all();
            if ($users->isEmpty()) {
                $this->logSkip('Recurring', 'Nessun utente trovato. Seeder ignorato.');
                return;
            }

            // ===============================================================
            // Loop utenti e inserimento demo
            // ===============================================================
            $totali = 0;
            $now = now();
            $currentMonth = $now->month;
            $currentDay = $now->day;

            foreach ($users as $user) {
                // ---- Categorie mappate per nome ----
                $categorieUtente = $user->categories()->get()->keyBy('name');

                // Funzione di utility per generare una start_date realistica già passata
                $makeStartDate = function () use ($now, $currentMonth, $currentDay) {
                    $randomMonth = rand(1, $currentMonth);
                    $maxDay = ($randomMonth === $currentMonth) ? $currentDay : $now->copy()->startOfYear()->addMonths($randomMonth - 1)->daysInMonth;
                    $randomDay = rand(1, $maxDay);
                    return $now->copy()->startOfYear()->addMonths($randomMonth - 1)->startOfMonth()->addDays($randomDay - 1)->format('Y-m-d');
                };

                // ==================== ENTRATE ====================
                RecurringOperation::factory()->stipendio()
                    ->forUser($user)
                    ->forCategory($categorieUtente['Stipendio'] ?? null)
                    ->active()
                    ->state(['start_date' => $makeStartDate()])
                    ->create();
                $totali++;

                RecurringOperation::factory()->bonusAnnuale()
                    ->forUser($user)
                    ->forCategory($categorieUtente['Investimenti'] ?? null)
                    ->active()
                    ->state(['start_date' => $makeStartDate()])
                    ->create();
                $totali++;

                RecurringOperation::factory()->interesseDeposito()
                    ->forUser($user)
                    ->forCategory($categorieUtente['Investimenti'] ?? null)
                    ->active()
                    ->state(['start_date' => $makeStartDate()])
                    ->create();
                $totali++;

                RecurringOperation::factory()->affittoPercepito()
                    ->forUser($user)
                    ->forCategory($categorieUtente['Altro (Entrata)'] ?? null)
                    ->active()
                    ->state(['start_date' => $makeStartDate()])
                    ->create();
                $totali++;

                RecurringOperation::factory()->regaloMensile()
                    ->forUser($user)
                    ->forCategory($categorieUtente['Regalo'] ?? null)
                    ->active()
                    ->state(['start_date' => $makeStartDate()])
                    ->create();
                $totali++;

                RecurringOperation::factory()->rimborsoAnnuale()
                    ->forUser($user)
                    ->forCategory($categorieUtente['Altro (Entrata)'] ?? null)
                    ->active()
                    ->state(['start_date' => $makeStartDate()])
                    ->create();
                $totali++;

                // ==================== SPESE ====================
                RecurringOperation::factory()->affitto()
                    ->forUser($user)
                    ->forCategory($categorieUtente['Casa'] ?? null)
                    ->active()
                    ->state(['start_date' => $makeStartDate()])
                    ->create();
                $totali++;

                RecurringOperation::factory()->bolletta()
                    ->forUser($user)
                    ->forCategory($categorieUtente['Utenze'] ?? null)
                    ->active()
                    ->state(['start_date' => $makeStartDate()])
                    ->create();
                $totali++;

                RecurringOperation::factory()->assicurazioneAuto()
                    ->forUser($user)
                    ->forCategory($categorieUtente['Trasporti'] ?? null)
                    ->active()
                    ->state(['start_date' => $makeStartDate()])
                    ->create();
                $totali++;

                RecurringOperation::factory()->tassaRifiuti()
                    ->forUser($user)
                    ->forCategory($categorieUtente['Casa'] ?? null)
                    ->active()
                    ->state(['start_date' => $makeStartDate()])
                    ->create();
                $totali++;

                RecurringOperation::factory()->manutenzioneAuto()
                    ->forUser($user)
                    ->forCategory($categorieUtente['Trasporti'] ?? null)
                    ->active()
                    ->state(['start_date' => $makeStartDate()])
                    ->create();
                $totali++;

                RecurringOperation::factory()->streaming()
                    ->forUser($user)
                    ->forCategory($categorieUtente['Svago'] ?? null)
                    ->active()
                    ->state(['start_date' => $makeStartDate()])
                    ->create();
                $totali++;

                RecurringOperation::factory()->palestraMensile()
                    ->forUser($user)
                    ->forCategory($categorieUtente['Salute'] ?? null)
                    ->active()
                    ->state(['start_date' => $makeStartDate()])
                    ->create();
                $totali++;

                RecurringOperation::factory()->palestraSettimanale()
                    ->forUser($user)
                    ->forCategory($categorieUtente['Salute'] ?? null)
                    ->active()
                    ->state(['start_date' => $makeStartDate()])
                    ->create();
                $totali++;

                RecurringOperation::factory()->babysitterSettimanale()
                    ->forUser($user)
                    ->forCategory($categorieUtente['Altro (Spesa)'] ?? null)
                    ->active()
                    ->state(['start_date' => $makeStartDate()])
                    ->create();
                $totali++;

                RecurringOperation::factory()->donazioneMensile()
                    ->forUser($user)
                    ->forCategory($categorieUtente['Altro (Spesa)'] ?? null)
                    ->active()
                    ->state(['start_date' => $makeStartDate()])
                    ->create();
                $totali++;

                RecurringOperation::factory()->colfMensile()
                    ->forUser($user)
                    ->forCategory($categorieUtente['Altro (Spesa)'] ?? null)
                    ->active()
                    ->state(['start_date' => $makeStartDate()])
                    ->create();
                $totali++;

                $this->logInfo('Recurring', "Ricorrenze demo generate per utente: {$user->name} (ID: {$user->id})");
            }

            // ===============================================================
            // ✅ Fine seeding
            // ===============================================================
            $this->logSuccess('Recurring', "{$totali} operazioni ricorrenti demo generate in totale.");
            $this->logNewLine();
        });
    }
}
