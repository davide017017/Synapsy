<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Crea le tabelle per la gestione delle code di lavoro (jobs).
     */
    public function up(): void
    {
        // Tabella per i job in coda
        Schema::create('jobs', function (Blueprint $table) {
            $table->id();                                 // ID del job
            $table->string('queue')->index();             // Nome della coda
            $table->longText('payload');                  // Dati serializzati del job
            // PostgreSQL non supporta tipi unsigned o tinyint
            $table->smallInteger('attempts'); // @TODO: check postgresql
            $table->integer('reserved_at')->nullable();
            $table->integer('available_at');
            $table->integer('created_at');
        });

        // Tabella per raggruppare job in batch
        Schema::create('job_batches', function (Blueprint $table) {
            $table->string('id')->primary();              // ID del batch
            $table->string('name');                       // Nome descrittivo
            $table->integer('total_jobs');                // Totale job previsti
            $table->integer('pending_jobs');              // Job ancora da completare
            $table->integer('failed_jobs');               // Job falliti
            $table->longText('failed_job_ids');           // Lista ID job falliti
            // mediumText non esiste su PostgreSQL
            $table->text('options')->nullable(); // @TODO: check postgresql
            $table->integer('cancelled_at')->nullable();  // Timestamp annullamento
            $table->integer('created_at');                // Timestamp creazione
            $table->integer('finished_at')->nullable();   // Timestamp completamento
        });

        // Tabella per i job falliti
        Schema::create('failed_jobs', function (Blueprint $table) {
            $table->id();                                 // ID interno
            $table->string('uuid')->unique();             // UUID univoco del job
            $table->text('connection');                   // Tipo connessione (es. database, redis)
            $table->text('queue');                        // Nome coda
            $table->longText('payload');                  // Dati del job
            $table->longText('exception');                // Dettagli eccezione
            $table->timestamp('failed_at')->useCurrent(); // Timestamp del fallimento
        });
    }

    /**
     * Elimina le tabelle relative ai job.
     */
    public function down(): void
    {
        Schema::dropIfExists('jobs');
        Schema::dropIfExists('job_batches');
        Schema::dropIfExists('failed_jobs');
    }
};
