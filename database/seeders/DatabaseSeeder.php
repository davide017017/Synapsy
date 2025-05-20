<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Chiamiamo il seeder centrale del modulo DBCore
        $this->call(\Modules\DBCore\Database\Seeders\DatabaseSeeder::class);
    }
}
