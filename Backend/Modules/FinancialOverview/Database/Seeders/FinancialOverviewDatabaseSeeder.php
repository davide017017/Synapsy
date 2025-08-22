<?php

namespace Modules\FinancialOverview\Database\Seeders;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Seeder;

/**
 * Seeder per il modulo 'FinancialOverview'.
 * Attualmente non esegue alcun seeding.
 */
class FinancialOverviewDatabaseSeeder extends Seeder
{
    /**
     * Avvia il seeder del database.
     */
    public function run(): void
    {
        Model::withoutEvents(function () {
            // =========================================================================
            // 📦 Seeding FinancialOverview (nessuna operazione definita)
            // =========================================================================
            echo "ℹ️  Nessuna operazione di seeding definita per FinancialOverview.\n";
        });
    }
}
