<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

// ============================================================================
// Migrazione per creare la tabella 'categories'
// ============================================================================

return new class extends Migration
{
  public $withinTransaction = false;
  /**
   * Esegui la migrazione.
   * Crea la tabella 'categories' con tutti i campi e i vincoli necessari.
   */
  public function up(): void
  {
    Schema::create('categories', function (Blueprint $table) {
      // =========================================================================
      // CHIAVI PRIMARIE E ESTERNE
      // =========================================================================
      $table->id();

      $table->foreignId('user_id')
        ->constrained()
        ->cascadeOnDelete();

      // =========================================================================
      // CAMPI PRINCIPALI
      // =========================================================================
      $table->string('name');
      // PostgreSQL non supporta il tipo ENUM di MySQL
      $table->string('type')->default('spesa');

      $table->string('color', 32)->nullable();
      $table->string('icon', 64)->nullable();

      // =========================================================================
      // TIMESTAMPS E INDICI
      // =========================================================================
      $table->timestamps();

      // =========================================================================
      // VINCOLI DI UNICITÀ
      // =========================================================================
      $table->unique(['user_id', 'name']);
    });
  }

  /**
   * Annulla la migrazione.
   * Elimina la tabella 'categories'.
   */
  public function down(): void
  {
    Schema::dropIfExists('categories');
  }
};
