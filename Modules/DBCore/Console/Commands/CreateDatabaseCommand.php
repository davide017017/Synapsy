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
        $charset = 'utf8mb4';
        $collation = 'utf8mb4_unicode_ci';

        // Disconnetti temporaneamente il database per creare senza errore
        config(['database.connections.mysql.database' => null]);

        try {
            \DB::statement("CREATE DATABASE IF NOT EXISTS `$dbName` CHARACTER SET $charset COLLATE $collation");
            $this->info("✅ Database `$dbName` pronto.");

            // 🔁 Ripristina la configurazione del database
            config(['database.connections.mysql.database' => $dbName]);

            // 🔄 Forza Laravel a riconnettere
            \DB::purge('mysql');
            \DB::reconnect('mysql');

        } catch (\Exception $e) {
            $this->error("❌ Errore nella creazione del database: " . $e->getMessage());
        }
    }
}
