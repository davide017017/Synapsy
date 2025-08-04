<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// ============================================================================
// Migrazione per creare la tabella 'entrate'
// ============================================================================

return new class extends Migration
{
    /**
     * Esegue la migrazione.
     * Crea la tabella 'entrate' con tutti i campi e i vincoli necessari.
     */
    public function up(): void
    {
        Schema::create('entrate', function (Blueprint $table) {
            // =========================================================================
            // CHIAVI PRIMARIE E ESTERNE
            // =========================================================================
            $table->id();
            $table->foreignId('user_id')->constrained()->cascadeOnDelete();
            $table->foreignId('category_id')->nullable()->constrained()->nullOnDelete();

            // =========================================================================
            // CAMPI PRINCIPALI
            // =========================================================================
            $table->string('description');
            $table->decimal('amount', 10, 2);
            $table->date('date');
            $table->text('notes')->nullable();

            // =========================================================================
            // TIMESTAMPS E INDICI
            // =========================================================================
            $table->timestamps();
            $table->index('date');

            $table->unique(['user_id', 'date', 'description']);
        });
    }

    /**
     * Annulla la migrazione.
     * Elimina la tabella 'entrate'.
     */
    public function down(): void
    {
        Schema::dropIfExists('entrate');
    }
};

