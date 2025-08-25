<?php

namespace Modules\Entrate\Observers;

use Illuminate\Support\Facades\Cache;
use Modules\AuditTrail\Services\AuditTrailService;
use Modules\Entrate\Models\Entrata;

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

        $this->clearCache($entrata->user_id);
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

        $this->clearCache($entrata->user_id);
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

        $this->clearCache($entrata->user_id);
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

        $this->clearCache($entrata->user_id);
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

        $this->clearCache($entrata->user_id);
    }

    protected function clearCache(int $userId): void
    {
        Cache::tags(['financial_overview', 'user:' . $userId])->flush();
    }
}

// ==================================================
// Questo observer registra tutte le operazioni chiave:
// - created, updated, deleted, restored, forceDeleted
// Puoi estendere per loggare altre azioni custom.
// ==================================================
