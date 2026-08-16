<?php

namespace Modules\RecurringOperations\Jobs;

use Carbon\Carbon;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Modules\Entrate\Models\Entrata;
use Modules\RecurringOperations\Models\RecurringOperation;
use Modules\Spese\Models\Spesa;

/**
 * Job per la generazione delle occorrenze da una regola ricorrente.
 */
class ProcessRecurringOperation implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected RecurringOperation $recurringOperation;

    // ============================
    // Costruttore
    // ============================
    public function __construct(RecurringOperation $recurringOperation)
    {
        $this->recurringOperation = $recurringOperation;
    }

    // ============================
    // Esecuzione del job
    // ============================
    public function handle(): void
    {
        $rule = $this->recurringOperation;

        $currentDate = $rule->next_occurrence_date->copy()->startOfDay();

        /** @var \Carbon\Carbon|null $endDate */
        $endDate = null;

        if ($rule->end_date !== null) {
            $endDate = Carbon::parse($rule->end_date)->endOfDay();
        }

        $today = Carbon::today()->endOfDay();

        while (
            $currentDate->lessThanOrEqualTo($today) &&
            ($endDate === null || $currentDate->lessThanOrEqualTo($endDate))
        ) {
            try {
                match ($rule->type) {
                    'entrata' => $this->createEntrata($rule, $currentDate),
                    'spesa' => $this->createSpesa($rule, $currentDate),
                    default => Log::error("⚠️ Tipo regola non valido: {$rule->type} (ID: {$rule->id})"),
                };
            } catch (\Throwable $e) {
                Log::error("❌ Errore nella generazione per regola ID {$rule->id}, data {$currentDate->toDateString()}: {$e->getMessage()}");
            }

            $currentDate = $this->calculateNextOccurrence($currentDate, $rule->frequency, $rule->interval);
        }

        // Aggiorna next_occurrence_date con la prima data non elaborata
        $rule->next_occurrence_date = $currentDate->startOfDay();

        // Se la prossima data è oltre end_date, disattiva la regola
        if ($endDate && $rule->next_occurrence_date->greaterThan($endDate)) {
            $rule->is_active = false;
            Log::info("📅 Regola ID {$rule->id} disattivata: superata data di fine.");
        }

        $rule->save();

        Log::info("✅ Job completato per regola ID {$rule->id}.");
    }

    // ============================
    // Generazione entrata
    // ============================
    protected function createEntrata(RecurringOperation $rule, Carbon $date): void
    {
        Entrata::create([
            'user_id' => $rule->user_id,
            'amount' => $rule->amount,
            'date' => $date,
            'description' => $this->resolveUniqueDescription($rule, $date),
            'category_id' => $rule->category_id,
            'notes' => "Generata da regola ricorrente ID: {$rule->id}".($rule->notes ? " - {$rule->notes}" : ''),
        ]);

        Log::info("Entrata generata da regola ID {$rule->id} per {$date->toDateString()}");
    }

    // ============================
    // Generazione spesa
    // ============================
    protected function createSpesa(RecurringOperation $rule, Carbon $date): void
    {
        Spesa::create([
            'user_id' => $rule->user_id,
            'amount' => $rule->amount,
            'date' => $date,
            'description' => $this->resolveUniqueDescription($rule, $date),
            'category_id' => $rule->category_id,
            'notes' => "Generata da regola ricorrente ID: {$rule->id}".($rule->notes ? " - {$rule->notes}" : ''),
        ]);

        Log::info("Spesa generata da regola ID {$rule->id} per {$date->toDateString()}");
    }

    // ============================
    // Risoluzione descrizione univoca
    // (vincolo unico [user_id, date, description] su spese/entrate: in caso
    // di collisione, aggiunge un suffisso incrementale "(2)", "(3)", ecc.
    // finché non trova un valore libero, invece di far fallire l'insert)
    // ============================
    protected function resolveUniqueDescription(RecurringOperation $rule, Carbon $date): string
    {
        $model = $rule->type === 'entrata' ? Entrata::class : Spesa::class;

        $candidate = $rule->description;
        $suffix = 2;

        while (
            $model::where('user_id', $rule->user_id)
                ->whereDate('date', $date->toDateString())
                ->where('description', $candidate)
                ->exists()
        ) {
            $candidate = "{$rule->description} ({$suffix})";
            $suffix++;
        }

        return $candidate;
    }

    // ============================
    // Calcolo prossima occorrenza
    // ============================
    protected function calculateNextOccurrence(Carbon $date, string $frequency, int $interval): Carbon
    {
        $nextDate = match ($frequency) {
            'daily' => $date->copy()->addDays($interval),
            'weekly' => $date->copy()->addWeeks($interval),
            'monthly' => $date->copy()->addMonthsNoOverflow($interval),
            'annually' => $date->copy()->addYears($interval),
            default => throw new \InvalidArgumentException("Frequenza non valida: {$frequency}"),
        };

        return $nextDate->startOfDay();
    }
}
