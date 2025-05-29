<?php

namespace Modules\Entrate\Policies;

use Modules\User\Models\User;
use Modules\Entrate\Models\Entrata;

/**
 * Policy per l'entità Entrata.
 */
class EntrataPolicy
{
    // ============================
    // Visualizzazione
    // ============================

    public function viewAny(User $user): bool
    {
        return true;
    }

    public function view(User $user, Entrata $entrata): bool
    {
        return $user->id === $entrata->user_id;
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

    public function update(User $user, Entrata $entrata): bool
    {
        return $user->id === $entrata->user_id;
    }

    // ============================
    // Eliminazione
    // ============================

    public function delete(User $user, Entrata $entrata): bool
    {
        return $user->id === $entrata->user_id;
    }

    public function restore(User $user, Entrata $entrata): bool
    {
        return false;
    }

    public function forceDelete(User $user, Entrata $entrata): bool
    {
        return false;
    }
}
