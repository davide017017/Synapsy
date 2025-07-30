<?php

namespace Modules\DBCore\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\DB;

class CreateDatabaseCommand extends Command
{
    /**
     * Nome e firma del comando Artisan.
     *
     * @var string
     */
    protected $signature = 'custom:database-create';

    /**
     * Descrizione del comando.
     *
     * @var string
     */
    protected $description = 'Controlla se il database configurato esiste, e lo crea se non esiste';

    /**
     * Esecuzione del comando.
     */
    public function handle(): void
    {
        $dbName = env('DB_DATABASE', 'synapsi_db_core');

        // Disconnetti temporaneamente il database per creare senza errore
        config(['database.connections.pgsql.database' => 'postgres']);

        try {
            // Creazione DB compatibile con PostgreSQL
            \DB::statement("CREATE DATABASE \"$dbName\""); // @TODO: check postgresql
            $this->info("✅ Database `$dbName` pronto.");

            // 🔁 Ripristina la configurazione del database
            config(['database.connections.pgsql.database' => $dbName]);

            // 🔄 Forza Laravel a riconnettere
            \DB::purge('pgsql');
            \DB::reconnect('pgsql');

        } catch (\Exception $e) {
            $this->error("❌ Errore nella creazione del database: " . $e->getMessage());
        }
    }
}
