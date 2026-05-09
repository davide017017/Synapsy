<?php

namespace Modules\RecurringOperations\Http\Controllers;

use App\Http\Controllers\Controller;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Modules\Entrate\Models\Entrata;
use Modules\RecurringOperations\Models\RecurringOperation;
use Modules\Spese\Models\Spesa;

class RecurringCatchUpController extends Controller
{
    public function catchUp(): JsonResponse
    {
        $user = auth('sanctum')->user();

        $processed = 0;
        $inserted  = 0;
        $skipped   = 0;
        $errors    = 0;

        $today = Carbon::today();

        $rules = RecurringOperation::where('user_id', $user->id)
            ->where('is_active', true)
            ->where('next_occurrence_date', '<=', $today)
            ->where(function ($q) use ($today) {
                $q->whereNull('end_date')
                  ->orWhere('end_date', '>=', $today);
            })
            ->get();

        foreach ($rules as $rule) {
            $processed++;

            try {
                $currentDate = Carbon::parse($rule->next_occurrence_date)->startOfDay();
                $endDate     = $rule->end_date
                    ? Carbon::parse($rule->end_date)->endOfDay()
                    : null;

                while (
                    $currentDate->lessThanOrEqualTo($today->copy()->endOfDay()) &&
                    ($endDate === null || $currentDate->lessThanOrEqualTo($endDate))
                ) {
                    if ($this->isDuplicate($rule, $currentDate)) {
                        $skipped++;
                    } else {
                        $this->insertTransaction($rule, $currentDate);
                        $inserted++;
                    }

                    $currentDate = $this->calculateNextOccurrence(
                        $currentDate,
                        $rule->frequency,
                        $rule->interval
                    );
                }

                $rule->next_occurrence_date = $currentDate->startOfDay();

                if ($endDate && $rule->next_occurrence_date->greaterThan($endDate)) {
                    $rule->is_active = false;
                }

                $rule->save();

            } catch (\Throwable $e) {
                $errors++;
                // Resetta la connessione per evitare che il 25P02 si propaghi
                try { DB::statement('ROLLBACK'); } catch (\Throwable $_) {}
                continue;
            }
        }

        return response()->json([
            'success'   => true,
            'processed' => $processed,
            'inserted'  => $inserted,
            'skipped'   => $skipped,
            'errors'    => $errors,
        ]);
    }

    // ============================
    // Controllo duplicati
    // Usa lo stesso unique constraint delle tabelle: [user_id, date, description]
    // ============================
    private function isDuplicate(RecurringOperation $rule, Carbon $date): bool
    {
        $model = $rule->type === 'entrata' ? Entrata::class : Spesa::class;

        return $model::where('user_id', $rule->user_id)
            ->whereDate('date', $date->toDateString())
            ->where('description', $rule->description)
            ->exists();
    }

    // ============================
    // Insert — stessi campi e formato del Job ProcessRecurringOperation
    // ============================
    private function insertTransaction(RecurringOperation $rule, Carbon $date): void
    {
        $data = [
            'user_id'     => $rule->user_id,
            'amount'      => $rule->amount,
            'date'        => $date,
            'description' => $rule->description,
            'category_id' => $rule->category_id,
            'notes'       => 'Generata da regola ricorrente ID: ' . $rule->id
                             . ($rule->notes ? " - {$rule->notes}" : ''),
        ];

        match ($rule->type) {
            'entrata' => Entrata::create($data),
            'spesa'   => Spesa::create($data),
            default   => throw new \InvalidArgumentException("Tipo non valido: {$rule->type}"),
        };
    }

    // ============================
    // Calcolo prossima occorrenza — identico al Job (monthly usa NoOverflow)
    // ============================
    private function calculateNextOccurrence(Carbon $date, string $frequency, int $interval): Carbon
    {
        return match ($frequency) {
            'daily'    => $date->copy()->addDays($interval)->startOfDay(),
            'weekly'   => $date->copy()->addWeeks($interval)->startOfDay(),
            'monthly'  => $date->copy()->addMonthsNoOverflow($interval)->startOfDay(),
            'annually' => $date->copy()->addYears($interval)->startOfDay(),
            default    => throw new \InvalidArgumentException("Frequenza non valida: {$frequency}"),
        };
    }
}
