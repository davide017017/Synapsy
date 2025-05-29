<?php

namespace Modules\RecurringOperations\Policies;

use Modules\User\Models\User;
use Modules\RecurringOperations\Models\RecurringOperation;

/**
 * Policy per l'entità RecurringOperation.
 */
class RecurringOperationPolicy
{
    // ============================
    // Visualizzazione
    // ============================

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, RecurringOperation $operation): bool
    {
        return $user->id === $operation->user_id;
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

    public function update(User $user, RecurringOperation $operation): bool
    {
        return $user->id === $operation->user_id;
    }

    // ============================
    // Eliminazione
    // ============================

    public function delete(User $user, RecurringOperation $operation): bool
    {
        return $user->id === $operation->user_id;
    }

    public function restore(User $user, RecurringOperation $operation): bool
    {
        return false;
    }

    public function forceDelete(User $user, RecurringOperation $operation): bool
    {
        return false;
    }
}
