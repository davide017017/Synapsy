<?php

namespace Modules\DBCore\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class DropDatabaseCommand extends Command
{
    /**
     * Il nome e la signature del comando.
     */
    protected $signature = 'custom:database-drop';

    /**
     * Descrizione del comando.
     */
    protected $description = 'Elimina il database configurato, se esiste. Utile solo in ambienti di sviluppo.';

    /**
     * Esecuzione del comando.
     */
    public function handle(): void
    {
        $dbName = env('DB_DATABASE');

        if (!$dbName) {
            $this->error('❌ Nessun nome di database definito in DB_DATABASE.');
            return;
        }

        // Disconnetti per evitare errore su "database in uso"
        config(['database.connections.pgsql.database' => 'postgres']);

        try {
            DB::statement("DROP DATABASE IF EXISTS \"$dbName\"");
            $this->info("🗑️  Database `$dbName` eliminato (se esiste).");
        } catch (\Exception $e) {
            $this->error("❌ Errore durante l'eliminazione del database: " . $e->getMessage());
        }
    }
}
