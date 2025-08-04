<?php

namespace Modules\Spese\Policies;

use Modules\User\Models\User;
use Modules\Spese\Models\Spesa;

/**
 * Policy per l'entità Spesa.
 */
class SpesaPolicy
{
    // ============================
    // Visualizzazione
    // ============================

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Spesa $spesa): bool
    {
        return $user->id === $spesa->user_id;
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

    public function update(User $user, Spesa $spesa): bool
    {
        return $user->id === $spesa->user_id;
    }

    // ============================
    // Eliminazione
    // ============================

    public function delete(User $user, Spesa $spesa): bool
    {
        return $user->id === $spesa->user_id;
    }

    public function restore(User $user, Spesa $spesa): bool
    {
        return false;
    }

    public function forceDelete(User $user, Spesa $spesa): bool
    {
        return false;
    }
}

