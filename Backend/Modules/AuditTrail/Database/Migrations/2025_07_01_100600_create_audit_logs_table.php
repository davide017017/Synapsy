<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/*
|--------------------------------------------------------------------------
| Migration: audit_logs (Audit Trail / Storico modifiche)
|--------------------------------------------------------------------------
| Questa tabella registra tutte le operazioni critiche sui modelli:
| - user_id          → Chi ha fatto l’azione (nullable)
| - action           → Azione svolta (created, updated, deleted, moved, ...)
| - auditable_type   → Classe del modello (es: App\Models\Spesa)
| - auditable_id     → ID del modello
| - old_values       → Stato PRIMA (json)
| - new_values       → Stato DOPO (json)
| - reason           → Motivo opzionale (testo libero)
| - ip_address       → IP dell’utente (facoltativo, utile per security)
| - user_agent       → User Agent del browser/dispositivo (facoltativo)
| - created_at/updated_at → Timestamps
*/

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->id();

            // =========================================================
            // Foreign key moderna e compatibile
            // =========================================================
            $table->foreignId('user_id')
                ->nullable()
                ->constrained()
                ->nullOnDelete();

            $table->string('action');           // Azione (es: created, updated, deleted, moved)
            $table->string('auditable_type');   // Classe modello (es: App\Models\Spesa)
            $table->bigInteger('auditable_id'); // ID del modello (puoi lasciarlo così, va bene per FK generiche)

            $table->json('old_values')->nullable(); // Stato PRIMA (json, nullable)
            $table->json('new_values')->nullable(); // Stato DOPO (json, nullable)

            $table->text('reason')->nullable();     // Motivo (testo libero, nullable)
            $table->string('ip_address', 45)->nullable(); // IP compatibile IPv6
            $table->text('user_agent')->nullable();       // User Agent (browser, device...)

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('audit_logs');
    }
};
