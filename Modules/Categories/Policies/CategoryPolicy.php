<?php

namespace Modules\Categories\Policies;

use Modules\User\Models\User;
use Modules\Categories\Models\Category;

/**
 * Policy per l'entità Category.
 */
class CategoryPolicy
{
    // ============================
    // Visualizzazione
    // ============================

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Category $category): bool
    {
        return $user->id === $category->user_id;
    }

    // ============================
    // Creazione
    // ============================

    public function create(User $user): bool
    {
        return true;
    }

    // ============================
    // Aggiornamento
    // ============================

    public function update(User $user, Category $category): bool
    {
        return $user->id === $category->user_id;
    }

    // ============================
    // Eliminazione
    // ============================

    public function delete(User $user, Category $category): bool
    {
        return $user->id === $category->user_id;
    }

    public function restore(User $user, Category $category): bool
    {
        return false;
    }

    public function forceDelete(User $user, Category $category): bool
    {
        return false;
    }
}
