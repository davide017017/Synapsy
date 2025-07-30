<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * Crea le tabelle per autenticazione, gestione utenti e sessioni.
     */
    public function up(): void
    {
        // =========================================================
        // 🧑 Tabella 'users'
        // =========================================================
        Schema::create('users', function (Blueprint $table) {
            $table->id(); // PK autoincrement

            // -------------------------
            // Dati anagrafici base
            // -------------------------
            $table->string('name'); // Nome
            $table->string('surname')->nullable(); // Cognome (opzionale)
            $table->string('username', 64)->nullable(false);
            $table->unique('username', 'users_username_unique');

            $table->string('email', 191)->unique(); // Email univoca

            // -------------------------
            // Profilo
            // -------------------------
            $table->string('avatar')->nullable(); // Avatar (path/url, opzionale)
            $table->string('theme', 32)->nullable(); // Tema preferito utente (es: dark, solarized)

            // -------------------------
            // Sicurezza e stato
            // -------------------------
            $table->timestamp('email_verified_at')->nullable(); // Verifica email
            $table->string('password'); // Password hashata
            $table->rememberToken(); // Token "ricordami"
            $table->boolean('is_admin')->default(false); // Flag admin

            // -------------------------
            // Timestamps
            // -------------------------
            $table->timestamps(); // created_at, updated_at

            // -------------------------
            // Opzionali futuri (decommenta se vuoi)
            // -------------------------
            // $table->date('birthdate')->nullable();     // Data di nascita
            // $table->string('phone', 32)->nullable();   // Telefono
            // $table->string('locale', 8)->nullable();   // Lingua preferita
        });

        // =========================================================
        // 🔑 Tabella 'password_reset_tokens'
        // =========================================================
        Schema::create('password_reset_tokens', function (Blueprint $table) {
            $table->string('email', 191)->primary(); // Email = PK
            $table->string('token'); // Token reset
            $table->timestamp('created_at')->nullable();
        });

        // =========================================================
        // 🗝️ Tabella 'sessions'
        // =========================================================
        Schema::create('sessions', function (Blueprint $table) {
            $table->string('id')->primary(); // PK sessione
            $table->foreignId('user_id')->nullable()->index(); // FK utente
            $table->string('ip_address', 45)->nullable();
            $table->text('user_agent')->nullable();
            $table->longText('payload');
            $table->integer('last_activity')->index();
        });
    }

    /**
     * Reverse the migrations.
     *
     * Elimina tutte le tabelle create nel metodo up().
     */
    public function down(): void
    {
        Schema::dropIfExists('sessions');
        Schema::dropIfExists('password_reset_tokens');
        Schema::dropIfExists('users');
    }
};