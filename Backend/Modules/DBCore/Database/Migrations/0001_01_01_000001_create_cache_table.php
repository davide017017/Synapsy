<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Crea le tabelle per la gestione della cache e dei lock.
     */
    public function up(): void
    {
        // Tabella principale della cache
        Schema::create('cache', function (Blueprint $table) {
            $table->string('key')->primary();     // Chiave univoca della cache
            // mediumText non esiste su PostgreSQL
            $table->text('value');
            $table->integer('expiration');        // Timestamp di scadenza
        });

        // Lock utilizzati per evitare race condition
        Schema::create('cache_locks', function (Blueprint $table) {
            $table->string('key')->primary();     // Chiave di lock
            $table->string('owner');              // Identificatore del proprietario del lock
            $table->integer('expiration');        // Timeout lock
        });
    }

    /**
     * Elimina le tabelle della cache.
     */
    public function down(): void
    {
        Schema::dropIfExists('cache');
        Schema::dropIfExists('cache_locks');
    }
};
