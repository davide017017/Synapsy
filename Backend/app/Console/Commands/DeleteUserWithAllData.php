<?php

declare(strict_types=1);

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Modules\User\Models\User;
use Modules\User\Services\DeleteUserWithAllDataService;

class DeleteUserWithAllData extends Command
{
  protected $signature = 'user:delete-hard {user : ID o email}';
  protected $description = 'Elimina DEFINITIVAMENTE un utente e tutti i suoi dati.';

  public function handle(): int
  {
    $identifier = $this->argument('user');

    $user = is_numeric($identifier)
      ? User::find($identifier)
      : User::where('email', $identifier)->first();

    if (! $user) {
      $this->error('Utente non trovato.');
      return self::FAILURE;
    }

    $this->warn("⚠️ Eliminerai DEFINITIVAMENTE l’utente {$user->email}");
    if (! $this->confirm('Vuoi continuare?')) {
      $this->info('Operazione annullata.');
      return self::SUCCESS;
    }

    DeleteUserWithAllDataService::run($user);

    $this->info('Utente e dati eliminati definitivamente.');
    return self::SUCCESS;
  }
}
