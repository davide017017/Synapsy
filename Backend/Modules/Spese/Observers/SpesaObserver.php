<?php

namespace Modules\Spese\Observers;

use Modules\AuditTrail\Services\AuditTrailService;
use Modules\Spese\Models\Spesa;

// =====================================
// Observer: traccia tutte le modifiche
// =====================================
class SpesaObserver
{
    /**
     * Evento: creazione nuova spesa
     */
    public function created(Spesa $spesa): void
    {
        AuditTrailService::log(
            'created',
            $spesa,
            null,
            $spesa->toArray()
        );
    }

    /**
     * Evento: aggiornamento spesa
     */
    public function updated(Spesa $spesa): void
    {
        AuditTrailService::log(
            'updated',
            $spesa,
            $spesa->getOriginal(),   // Stato precedente
            $spesa->toArray()        // Stato attuale
        );
    }

    /**
     * Evento: eliminazione (hard delete)
     */
    public function deleted(Spesa $spesa): void
    {
        AuditTrailService::log(
            'deleted',
            $spesa,
            $spesa->getOriginal(),
            null
        );
    }

    /**
     * Evento: ripristino (soft delete)
     */
    public function restored(Spesa $spesa): void
    {
        AuditTrailService::log(
            'restored',
            $spesa,
            $spesa->getOriginal(),
            $spesa->toArray()
        );
    }

    /**
     * Evento: eliminazione definitiva (force delete)
     */
    public function forceDeleted(Spesa $spesa): void
    {
        AuditTrailService::log(
            'forceDeleted',
            $spesa,
            $spesa->getOriginal(),
            null
        );
    }
}

// ==================================================
// Questo observer registra tutte le operazioni chiave:
// - created, updated, deleted, restored, forceDeleted
// Puoi estendere per loggare altre azioni custom.
// ==================================================
