<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// ============================================================================
// Migrazione per creare la tabella 'financial_snapshots'
// ============================================================================

return new class extends Migration
{
    /**
     * Esegue la migrazione.
     * Crea la tabella 'financial_snapshots' con tutti i campi e i vincoli necessari.
     */
    public function up(): void
    {
        Schema::create('financial_snapshots', function (Blueprint $table) {
            // =========================================================================
            // CHIAVI PRIMARIE E ESTERNE
            // =========================================================================
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();

            // =========================================================================
            // METADATI DEL PERIODO
            // =========================================================================
            $table->enum('period_type', ['daily', 'monthly', 'yearly', 'current']);
            $table->date('period_start_date');
            $table->date('period_end_date');

            // =========================================================================
            // DATI AGGREGATI
            // =========================================================================
            $table->decimal('total_income', 10, 2)->default(0);
            $table->decimal('total_expense', 10, 2)->default(0);
            $table->decimal('balance', 10, 2)->default(0);

            // =========================================================================
            // TIMESTAMPS E VINCOLI
            // =========================================================================
            $table->timestamps();
            $table->unique(['user_id', 'period_type', 'period_start_date'], 'unique_financial_snapshot');
        });
    }

    /**
     * Annulla la migrazione.
     * Elimina la tabella 'financial_snapshots'.
     */
    public function down(): void
    {
        Schema::dropIfExists('financial_snapshots');
    }
};
