<?php

namespace Modules\Spese\Observers;

use Illuminate\Support\Facades\Cache;
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

        $this->clearCache($spesa->user_id);
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

        $this->clearCache($spesa->user_id);
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

        $this->clearCache($spesa->user_id);
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

        $this->clearCache($spesa->user_id);
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

        $this->clearCache($spesa->user_id);
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
