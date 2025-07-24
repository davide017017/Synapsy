<?php

namespace Modules\Categories\Services;

use Modules\Categories\Models\Category;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Collection;

/**
 * Gestione delle categorie per l'utente autenticato.
 */
class CategoryService
{
    // ============================
    // Query methods
    // ============================

    /**
     * Ritorna tutte le categorie dell'utente autenticato, ordinate.
     */
    public function getAllForUser(string $sortBy = 'type', string $sortDirection = 'asc'): Collection
    {
        return Auth::user()
            ->categories()
            ->orderBy($sortBy, $sortDirection)
            ->get();
    }

    /**
     * Trova una categoria per ID se appartiene all'utente autenticato.
     */
    public function findForUser(int $categoryId): ?Category
    {
        return Auth::user()
            ->categories()
            ->find($categoryId);
    }

    // ============================
    // CRUD methods
    // ============================

    /**
     * Crea una nuova categoria per l'utente autenticato.
     *
     * @param array{name: string, type: string, color?: string|null, icon?: string|null} $data
     */
    public function createForUser(array $data): Category
    {
        return Auth::user()
            ->categories()
            ->create([
                'name'  => $data['name'],
                'type'  => $data['type'],
                'color' => $data['color'] ?? null,
                'icon'  => $data['icon'] ?? null,
            ]);
    }


    /**
     * Aggiorna e ritorna la categoria aggiornata.
     *
     * @param array{name: string, type: string} $data
     */
    public function update(Category $category, array $data): Category
    {
        $category->update($data);
        return $category->fresh();
    }

    /**
     * Elimina una categoria.
     */
    public function delete(Category $category): bool
    {
        return $category->delete();
    }
}
