<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Questo metodo crea le tabelle necessarie per l'autenticazione e la gestione delle sessioni.
     */
    public function up(): void
    {
        // Crea la tabella 'users'
        Schema::create('users', function (Blueprint $table) {
            $table->id(); // Colonna ID autoincrementante (chiave primaria)
            $table->string('name'); // Colonna per il nome
            $table->string('surname')->nullable(); // 👤 Colonna per il cognome (opzionale)
            $table->string('email')->unique(); // Colonna email unica
            $table->string('avatar')->nullable(); // 🖼️ Avatar opzionale (path immagine)
            $table->timestamp('email_verified_at')->nullable(); // Data verifica email
            $table->string('password'); // Colonna per password hashata
            $table->rememberToken(); // Token "ricordami"
            $table->boolean('is_admin')->default(false); // Flag amministratore
            $table->timestamps(); // created_at e updated_at
        });

        // Crea la tabella 'password_reset_tokens' per il reset password
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email')->primary(); // Email come chiave primaria
            $table->string('token'); // Token di reset
            $table->timestamp('created_at')->nullable(); // Timestamp di creazione
        });

        // Crea la tabella 'sessions' per la gestione delle sessioni utente
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary(); // ID della sessione
            $table->foreignId('user_id')->nullable()->index(); // FK all’utente
            $table->string('ip_address', 45)->nullable(); // IP dell’utente
            $table->text('user_agent')->nullable(); // Info sul browser
            $table->longText('payload'); // Dati sessione serializzati
            $table->integer('last_activity')->index(); // Ultima attività
        });
    }

    /**
     * Reverse the migrations.
     *
     * Questo metodo elimina le tabelle create nel metodo up().
     */
    public function down(): void
    {
        Schema::dropIfExists('users');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('sessions');
    }
};
