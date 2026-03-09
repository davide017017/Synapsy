<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Aggiunge la colonna is_demo alla tabella users.
 *
 * Sostituisce il controllo fragile via email nel middleware
 * PreventDemoUserModification: invece di comparare
 * $user->email === 'demo@synapsy.app' si usa $user->is_demo.
 *
 * Valore default: false (tutti gli utenti esistenti non sono demo).
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_demo')->default(false)->after('is_admin');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_demo');
        });
    }
};
