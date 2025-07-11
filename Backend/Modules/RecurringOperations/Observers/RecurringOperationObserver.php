<?php

namespace Modules\RecurringOperations\Observers;

use Modules\RecurringOperations\Models\RecurringOperation;
use Modules\AuditTrail\Services\AuditTrailService;

// =====================================
// Observer: traccia tutte le modifiche
// =====================================
class RecurringOperationObserver
{
    /**
     * Evento: creazione nuova ricorrenza
     */
    public function created(RecurringOperation $recOp): void
    {
        AuditTrailService::log(
            'created',
            $recOp,
            null,
            $recOp->toArray()
        );
    }

    /**
     * Evento: aggiornamento ricorrenza
     */
    public function updated(RecurringOperation $recOp): void
    {
        AuditTrailService::log(
            'updated',
            $recOp,
            $recOp->getOriginal(),   // Stato precedente
            $recOp->toArray()        // Stato attuale
        );
    }

    /**
     * Evento: eliminazione (hard delete)
     */
    public function deleted(RecurringOperation $recOp): void
    {
        AuditTrailService::log(
            'deleted',
            $recOp,
            $recOp->getOriginal(),
            null
        );
    }

    /**
     * Evento: ripristino (soft delete)
     */
    public function restored(RecurringOperation $recOp): void
    {
        AuditTrailService::log(
            'restored',
            $recOp,
            $recOp->getOriginal(),
            $recOp->toArray()
        );
    }

    /**
     * Evento: eliminazione definitiva (force delete)
     */
    public function forceDeleted(RecurringOperation $recOp): void
    {
        AuditTrailService::log(
            'forceDeleted',
            $recOp,
            $recOp->getOriginal(),
            null
        );
    }
}

// ==================================================
// Questo observer registra tutte le operazioni chiave:
// - created, updated, deleted, restored, forceDeleted
// Puoi estendere per loggare altre azioni custom.
// ==================================================