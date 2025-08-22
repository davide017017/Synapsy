<?php

namespace Modules\DBCore\Console\Commands;

use Illuminate\Console\Command;

class SeedAllCommand extends Command
{
    /**
     * Nome del comando Artisan.
     */
    protected $signature = 'custom:seed-all';

    /**
     * Descrizione del comando.
     */
    protected $description = 'Esegue tutti i DBSeeder dei moduli principali.';

    /**
     * Logica di esecuzione del comando.
     */
    public function handle(): void
    {
        $this->info('🚀 Avvio del seeding di tutti i moduli...');

        $seeders = [
            \Modules\User\Database\Seeders\UserDBSeeder::class,
            \Modules\Categories\Database\Seeders\CategoriesDBSeeder::class,
            \Modules\Entrate\Database\Seeders\EntrateDBSeeder::class,
            \Modules\Spese\Database\Seeders\SpeseDBSeeder::class,
            \Modules\RecurringOperations\Database\Seeders\RecurringOperationsDBSeeder::class,
        ];

        foreach ($seeders as $seeder) {
            $this->call($seeder);
        }

        $this->info('✅ Seeding completato con successo!');
    }
}
