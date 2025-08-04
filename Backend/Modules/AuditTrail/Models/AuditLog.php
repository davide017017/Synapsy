<?php

namespace Modules\AuditTrail\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

// =======================================
// Modello AuditLog: traccia modifiche
// =======================================
class AuditLog extends Model
{
    protected $table = 'audit_logs';

    protected $fillable = [
        'user_id',         // Chi ha fatto l'azione (nullable)
        'action',          // Tipo azione (created, updated, deleted, ...)
        'auditable_type',  // Classe modello modificato
        'auditable_id',    // ID modello modificato
        'old_values',      // Stato PRIMA (array JSON)
        'new_values',      // Stato DOPO (array JSON)
        'reason',          // Motivo (opzionale)
    ];

    protected $casts = [
        'old_values' => 'array',
        'new_values' => 'array',
    ];

    /**
     * Relazione polimorfica verso il modello modificato (es. Spesa, Entrata)
     */
    public function auditable(): MorphTo
    {
        return $this->morphTo();
    }

    /**
     * Relazione verso l'utente che ha fatto l'azione (può essere null)
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(\Modules\User\Models\User::class, 'user_id');
    }
}

// Questo modello rappresenta un log di audit, che registra le azioni degli utenti su modelli specifici.
// Ha relazioni con il modello auditable (che può essere qualsiasi modello) e con l'utente che ha effettuato l'azione.
// I campi old_values e new_values sono memorizzati come array JSON per tenere traccia dei cambiamenti.
// La relazione con l'utente è opzionale, quindi se l'utente viene eliminato, il campo user_id sarà null.
// Questo modello può essere utilizzato per tracciare le modifiche a qualsiasi modello che implementa
// l'interfaccia Auditable, permettendo di registrare azioni come creazione, aggiornamento e cancellazione.
// La colonna reason è opzionale e può essere utilizzata per fornire un motivo per l'azione eseguita.
// Le colonne old_values e new_values sono utilizzate per memorizzare lo stato del modello prima e dopo l'azione,
// consentendo di vedere esattamente cosa è cambiato.
