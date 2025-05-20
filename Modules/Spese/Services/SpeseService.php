<?php

namespace Modules\Spese\Services;

use Illuminate\Database\Eloquent\Collection;
use Modules\Spese\Models\Spesa;
use Modules\User\Models\User;

/**
 * Servizio per la gestione delle Spese utente.
 */
class SpeseService
{
    // ============================
    // Query methods
    // ============================

    /**
     * Restituisce le spese dell'utente filtrate e ordinate.
     */
    public function getFilteredAndSortedForUser(User $user, array $filters, string $sortBy = 'date', string $sortDirection = 'desc'): Collection
    {
        $query = $user->spese()->with('category');

        if (!empty($filters['start_date'])) {
            $query->whereDate('date', '>=', $filters['start_date']);
        }

        if (!empty($filters['end_date'])) {
            $query->whereDate('date', '<=', $filters['end_date']);
        }

        if (!empty($filters['description'])) {
            $query->where('description', 'like', '%' . $filters['description'] . '%');
        }

        if (!empty($filters['category_id'])) {
            $validCategory = $user->categories()
                ->where('type', 'spesa')
                ->find($filters['category_id']);

            if ($validCategory) {
                $query->where('category_id', $filters['category_id']);
            }
        }

        return $query->orderBy($sortBy, $sortDirection)->get();
    }

    /**
     * Restituisce le categorie di tipo 'spesa' dell'utente.
     */
    public function getCategoriesForUser(User $user): Collection
    {
        return $user->categories()->where('type', 'spesa')->get();
    }

    // ============================
    // CRUD methods
    // ============================

    /**
     * Crea una nuova Spesa per l'utente.
     *
     * @param array{
     *   description: string,
     *   amount: float,
     *   date: string,
     *   category_id?: int|null,
     *   notes?: string|null
     * } $data
     */
    public function createForUser(array $data, User $user): Spesa
    {
        return $user->spese()->create([
            'description' => $data['description'],
            'amount'      => $data['amount'],
            'date'        => $data['date'],
            'category_id' => $data['category_id'] ?? null,
            'notes'       => $data['notes'] ?? null,
        ]);
    }

    /**
     * Trova una Spesa per ID e utente.
     */
    public function findForUser(int $spesaId, User $user): ?Spesa
    {
        return $user->spese()->find($spesaId);
    }

    /**
     * Aggiorna una Spesa esistente.
     */
    public function update(Spesa $spesa, array $data): bool
    {
        return $spesa->update([
            'description' => $data['description'],
            'amount'      => $data['amount'],
            'date'        => $data['date'],
            'category_id' => $data['category_id'] ?? null,
            'notes'       => $data['notes'] ?? null,
        ]);
    }

    /**
     * Elimina una Spesa.
     */
    public function delete(Spesa $spesa): bool
    {
        return $spesa->delete();
    }
}
