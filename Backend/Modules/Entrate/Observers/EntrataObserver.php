<?php

namespace Modules\Entrate\Observers;

use Modules\Entrate\Models\Entrata;
use Modules\AuditTrail\Services\AuditTrailService;

// =====================================
// Observer: traccia tutte le modifiche
// =====================================
class EntrataObserver
{
    /**
     * Evento: creazione nuova entrata
     */
    public function created(Entrata $entrata): void
    {
        AuditTrailService::log(
            'created',
            $entrata,
            null,
            $entrata->toArray()
        );
    }

    /**
     * Evento: aggiornamento entrata
     */
    public function updated(Entrata $entrata): void
    {
        AuditTrailService::log(
            'updated',
            $entrata,
            $entrata->getOriginal(),   // Stato precedente
            $entrata->toArray()        // Stato attuale
        );
    }

    /**
     * Evento: eliminazione (hard delete)
     */
    public function deleted(Entrata $entrata): void
    {
        AuditTrailService::log(
            'deleted',
            $entrata,
            $entrata->getOriginal(),
            null
        );
    }

    /**
     * Evento: ripristino (soft delete)
     */
    public function restored(Entrata $entrata): void
    {
        AuditTrailService::log(
            'restored',
            $entrata,
            $entrata->getOriginal(),
            $entrata->toArray()
        );
    }

    /**
     * Evento: eliminazione definitiva (force delete)
     */
    public function forceDeleted(Entrata $entrata): void
    {
        AuditTrailService::log(
            'forceDeleted',
            $entrata,
            $entrata->getOriginal(),
            null
        );
    }
}

// ==================================================
// Questo observer registra tutte le operazioni chiave:
// - created, updated, deleted, restored, forceDeleted
// Puoi estendere per loggare altre azioni custom.
// ==================================================
