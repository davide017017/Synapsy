<?php

namespace Modules\RecurringOperations\Services;

use Illuminate\Support\Collection;
use Carbon\Carbon;
use Modules\User\Models\User;
use Modules\RecurringOperations\Models\RecurringOperation;

use Illuminate\Support\Facades\Log;


/**
 * Servizio per la gestione delle operazioni ricorrenti utente.
 */
class RecurringOperationService
{
    // ============================
    // Query methods
    // ============================

    /**
     * Restituisce le operazioni ricorrenti dell'utente filtrate e ordinate.
     */
    public function getFilteredAndSortedForUser(User $user, array $filters, string $sortBy = 'next_occurrence_date', string $sortDirection = 'asc'): Collection
    {
        $query = $user->recurringOperations()->with('category');

        if (!empty($filters['start_date'])) {
            $query->whereDate('start_date', '>=', $filters['start_date']);
        }

        if (!empty($filters['end_date'])) {
            $query->whereDate('start_date', '<=', $filters['end_date']);
        }

        if (!empty($filters['next_occurrence_start_date'])) {
            $query->whereDate('next_occurrence_date', '>=', $filters['next_occurrence_start_date']);
        }

        if (!empty($filters['next_occurrence_end_date'])) {
            $query->whereDate('next_occurrence_date', '<=', $filters['next_occurrence_end_date']);
        }

        if (!empty($filters['description'])) {
            $query->where('description', 'like', '%' . $filters['description'] . '%');
        }

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['type']) && in_array($filters['type'], ['entrata', 'spesa'])) {
            $query->where('type', $filters['type']);
        }

        if (isset($filters['is_active']) && $filters['is_active'] !== '') {
            $query->where('is_active', (bool) $filters['is_active']);
        }

        return $query->orderBy($sortBy, $sortDirection)->get();
    }

    /**
     * Restituisce le categorie compatibili per tipo.
     */
    public function getCategoriesForUser(User $user, string $type = 'spesa'): Collection
    {
        return $user->categories()->where('type', $type)->get();
    }

    /**
     * Trova un'operazione ricorrente per ID e utente.
     */
    public function findForUser(int $id, User $user): ?RecurringOperation
    {
        return $user->recurringOperations()->find($id);
    }

    // ============================
    // CRUD methods
    // ============================

    /**
     * Crea una nuova operazione ricorrente.
     */
    public function createOperation(array $data, User $user): RecurringOperation
    {
        unset($data['next_occurrence_date']);

        $data['next_occurrence_date'] = Carbon::parse($data['start_date'])->startOfDay();

        return $user->recurringOperations()->create($data);
    }

    /**
     * Aggiorna un'operazione ricorrente esistente.
     */
    public function updateOperation(RecurringOperation $operation, array $data): bool
    {
        unset($data['next_occurrence_date']);

        return $operation->update($data);
    }

    /**
     * Elimina un'operazione ricorrente.
     */
    public function deleteOperation(RecurringOperation $operation): bool
    {
        return $operation->delete();
    }

    // ============================
    // Utility
    // ============================

    /**
     * Calcola la prossima occorrenza a partire da una data di riferimento.
     */
    public function calculateInitialOrNextOccurrence(Carbon $startDate, string $frequency, int $interval, ?Carbon $relativeToDate = null): Carbon
    {
        $date = $relativeToDate ?? $startDate->copy();

        switch ($frequency) {
            case 'daily':
                $date->addDays($interval);
                break;
            case 'weekly':
                $date->addWeeks($interval);
                break;
            case 'monthly':
                $date->addMonthsNoOverflow($interval);
                break;
            case 'annually':
                $date->addYears($interval);
                break;
            default:
                throw new \InvalidArgumentException("Frequenza ricorrente non valida: {$frequency}");
        }

        return $date->startOfDay();
    }
}