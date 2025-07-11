<?php

namespace Modules\AuditTrail\Services;

use Modules\AuditTrail\Models\AuditLog;
use Illuminate\Database\Eloquent\Model;

// ==========================================
// Servizio per scrivere audit trail
// ==========================================
class AuditTrailService
{
    /**
     * Registra una nuova entry nell'audit log.
     *
     * @param string $action          Azione (created, updated, deleted, moved, ...)
     * @param Model $model            Modello su cui agisci
     * @param array|null $oldValues   Stato PRIMA (opzionale)
     * @param array|null $newValues   Stato DOPO (opzionale)
     * @param int|null $userId        ID utente (opzionale)
     * @param string|null $reason     Motivazione (opzionale)
     * @return AuditLog
     */
    public static function log(
        string $action,
        Model $model,
        ?array $oldValues = null,
        ?array $newValues = null,
        ?int $userId = null,
        ?string $reason = null
    ): AuditLog {
        return AuditLog::create([
            'user_id' => $userId ?? (function_exists('auth') ? optional(auth())->id() : null),
            'action'         => $action,
            'auditable_type' => get_class($model),
            'auditable_id'   => $model->getKey(),
            'old_values'     => $oldValues,
            'new_values'     => $newValues,
            'reason'         => $reason,
        ]);
    }
}
