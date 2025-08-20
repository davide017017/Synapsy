<?php

namespace Modules\Entrate\Services;

use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Builder;
use Modules\Entrate\Models\Entrata;
use Modules\User\Models\User;
use Illuminate\Pagination\LengthAwarePaginator;

/**
 * Servizio per la gestione delle Entrate utente.
 */
class EntrateService
{
    // ─────────────────────────────────────────────────────────────────────────
    // API: lista paginata con filtri + sort whitelist
    // sort es: "-date,amount"  | allowed: date, amount, created_at
    // ─────────────────────────────────────────────────────────────────────────
    public function listForUserPaginated($user, array $filters, string $sort, int $page, int $perPage): LengthAwarePaginator
    {
        $q = Entrata::query()->where('user_id', $user->id);

        if (!empty($filters['start_date'])) $q->whereDate('date', '>=', $filters['start_date']);
        if (!empty($filters['end_date']))   $q->whereDate('date', '<=', $filters['end_date']);
        if (!empty($filters['category_id'])) $q->where('category_id', $filters['category_id']);
        if (!empty($filters['description'])) {
            $term = $filters['description'];
            $q->where(fn(Builder $qq) => $qq
                ->where('description', 'like', "%{$term}%")
                ->orWhere('notes', 'like', "%{$term}%"));
        }

        $allowed = ['date', 'amount', 'created_at'];
        $parts = array_filter(explode(',', $sort ?: '-date'));
        foreach ($parts as $s) {
            $dir = str_starts_with($s, '-') ? 'desc' : 'asc';
            $col = ltrim($s, '-');
            if (in_array($col, $allowed, true)) $q->orderBy($col, $dir);
        }
        if (empty($parts)) $q->orderBy('date', 'desc');

        return $q->paginate($perPage, ['*'], 'page', $page);
    }

    // ============================
    // Query methods
    // ============================

    /**
     * Restituisce le entrate dell'utente filtrate e ordinate.
     */
    public function getFilteredAndSortedForUser(User $user, array $filters, string $sortBy = 'date', string $sortDirection = 'desc'): Collection
    {
        $query = $user->entrate()->with('category');

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
                ->where('type', 'entrata')
                ->find($filters['category_id']);

            if ($validCategory) {
                $query->where('category_id', $filters['category_id']);
            }
        }

        return $query->orderBy($sortBy, $sortDirection)->get();
    }

    /**
     * Restituisce le categorie di tipo 'entrata' dell'utente.
     */
    public function getCategoriesForUser(User $user): Collection
    {
        return $user->categories()->where('type', 'entrata')->get();
    }

    // ============================
    // CRUD methods
    // ============================

    /**
     * Crea una nuova Entrata per l'utente.
     *
     * @param array{
     *   description: string,
     *   amount: float,
     *   date: string,
     *   category_id?: int|null,
     *   notes?: string|null
     * } $data
     */
    public function createForUser(array $data, User $user): Entrata
    {
        return $user->entrate()->create([
            'description' => $data['description'],
            'amount'      => $data['amount'],
            'date'        => $data['date'],
            'category_id' => $data['category_id'] ?? null,
            'notes'       => $data['notes'] ?? null,
        ]);
    }

    /**
     * Trova un'Entrata per ID e utente.
     */
    public function findForUser(int $entrataId, User $user): ?Entrata
    {
        return $user->entrate()->find($entrataId);
    }

    /**
     * Aggiorna un'Entrata esistente.
     */
    public function update(Entrata $entrata, array $data): bool
    {
        return $entrata->update([
            'description' => $data['description'],
            'amount'      => $data['amount'],
            'date'        => $data['date'],
            'category_id' => $data['category_id'] ?? null,
            'notes'       => $data['notes'] ?? null,
        ]);
    }

    /**
     * Elimina un'Entrata.
     */
    public function delete(Entrata $entrata): bool
    {
        return $entrata->delete();
    }
}
