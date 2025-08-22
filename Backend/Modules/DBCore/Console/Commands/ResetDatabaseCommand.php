<?php

namespace Modules\DBCore\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;

class ResetDatabaseCommand extends Command
{
    protected $signature = 'custom:database-reset';

    protected $description = 'Drop, recreate and reseed the database';

    public function handle()
    {
        $this->call(DropDatabaseCommand::class);
        $this->call(CreateDatabaseCommand::class);

        $this->info("\n🛠️  Preparing database.\n");

        Artisan::call('migrate', ['--force' => true]);
        $this->info(Artisan::output());

        Artisan::call('db:seed', [
            '--class' => \Modules\DBCore\Database\Seeders\DatabaseSeeder::class,
            '--force' => true,
        ]);
        $this->info(Artisan::output());
    }
}
