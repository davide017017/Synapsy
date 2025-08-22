<?php

namespace Modules\DBCore\Database\Seeders;

use Illuminate\Database\Seeder;
use Modules\Categories\Database\Seeders\CategoriesDBSeeder;
use Modules\Entrate\Database\Seeders\EntrateDBSeeder;
use Modules\RecurringOperations\Database\Seeders\RecurringOperationsDBSeeder;
use Modules\Spese\Database\Seeders\SpeseDBSeeder;
use Modules\User\Database\Seeders\DemoUserSeeder;
use Modules\User\Database\Seeders\UserDBSeeder;

/**
 * Seeder centrale che coordina l'esecuzione dei seeder nei vari moduli.
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        echo "\n🔄 Avvio seed centrale da DBCore...\n";

        $this->call(UserDBSeeder::class);
        $this->call(DemoUserSeeder::class); // utente demo beta
        $this->call(CategoriesDBSeeder::class);
        $this->call(EntrateDBSeeder::class);
        $this->call(SpeseDBSeeder::class);
        $this->call(RecurringOperationsDBSeeder::class);

        echo "\n✅ Seeding completo per tutti i moduli principali.\n";
    }
}
