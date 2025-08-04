<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// ============================================================================
// Migrazione per creare la tabella 'recurring_operations'
// ============================================================================
return new class extends Migration
{
    /**
     * Crea la tabella 'recurring_operations'.
     */
    public function up(): void
    {
        Schema::create('recurring_operations', function (Blueprint $table) {
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
            $table->string('type'); // 'entrata' o 'spesa'
            $table->date('start_date');
            $table->date('end_date')->nullable();
            $table->string('frequency'); // daily, weekly, monthly, annually
            $table->integer('interval')->default(1);
            $table->date('next_occurrence_date');
            $table->boolean('is_active')->default(true);
            $table->text('notes')->nullable();

            // =========================================================================
            // TIMESTAMPS E INDICI
            // =========================================================================
            $table->timestamps();
            $table->index('next_occurrence_date');
            $table->index(['user_id', 'is_active']);
        });
    }

    /**
     * Elimina la tabella 'recurring_operations'.
     */
    public function down(): void
    {
        Schema::dropIfExists('recurring_operations');
    }
};

