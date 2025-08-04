<?php

namespace Modules\Categories\Observers;

use Modules\Categories\Models\Category;
use Modules\AuditTrail\Services\AuditTrailService;

// =====================================
// Observer: traccia tutte le modifiche
// =====================================
class CategoryObserver
{
    /**
     * Evento: creazione nuova categoria
     */
    public function created(Category $category): void
    {
        AuditTrailService::log(
            'created',
            $category,
            null,
            $category->toArray()
        );
    }

    /**
     * Evento: aggiornamento categoria
     */
    public function updated(Category $category): void
    {
        AuditTrailService::log(
            'updated',
            $category,
            $category->getOriginal(),    // Stato precedente
            $category->toArray()         // Stato attuale
        );
    }

    /**
     * Evento: eliminazione (hard delete)
     */
    public function deleted(Category $category): void
    {
        AuditTrailService::log(
            'deleted',
            $category,
            $category->getOriginal(),
            null
        );
    }

    /**
     * Evento: ripristino (soft delete)
     */
    public function restored(Category $category): void
    {
        AuditTrailService::log(
            'restored',
            $category,
            $category->getOriginal(),
            $category->toArray()
        );
    }

    /**
     * Evento: eliminazione definitiva (force delete)
     */
    public function forceDeleted(Category $category): void
    {
        AuditTrailService::log(
            'forceDeleted',
            $category,
            $category->getOriginal(),
            null
        );
    }
}

// ==================================================
// Questo observer registra tutte le operazioni chiave:
// - created, updated, deleted, restored, forceDeleted
// Puoi estendere per loggare altre azioni custom.
// ==================================================
