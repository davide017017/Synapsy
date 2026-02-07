<?php

namespace Modules\User\Database\Seeders;

use App\Traits\LogsSeederOutput;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Modules\User\Models\User;
use Modules\Categories\Services\CreateDefaultCategoriesForUser;
use Modules\User\Services\GenerateDemoDataForUser;
use Modules\User\Services\DeleteUserWithAllDataService;

class DemoUserSeeder extends Seeder
{
  use LogsSeederOutput;

  public function run(): void
  {
    $this->initOutput();

    $this->logInfo('User', 'Creazione/rigenerazione utente demo', '👤');

    // ─────────────────────────────────────────
    // 1️⃣ SE ESISTE → PULIZIA TOTALE
    // ─────────────────────────────────────────
    $existingUser = User::where('email', 'demo@synapsy.app')->first();

    if ($existingUser) {
      $this->logInfo('User', 'Utente demo esistente → pulizia dati', '🧹');
      DeleteUserWithAllDataService::run($existingUser);
    }

    // ─────────────────────────────────────────
    // 2️⃣ CREAZIONE UTENTE DEMO "PULITO"
    // ─────────────────────────────────────────
    $user = User::create([
      'name'               => 'Demo',
      'surname'            => 'User',
      'username'           => 'demo',
      'email'              => 'demo@synapsy.app',
      'password'           => Hash::make('demo'),
      'theme'              => 'dark',
      'avatar'             => 'avatar_12_pink_beta.webp',
      'is_admin'           => false,
      'email_verified_at'  => now(),
      'remember_token'     => Str::random(10),
      'has_accepted_terms' => true,
    ]);

    // ─────────────────────────────────────────
    // 3️⃣ CATEGORIE DEFAULT
    // ─────────────────────────────────────────
    CreateDefaultCategoriesForUser::run($user);

    // ─────────────────────────────────────────
    // 4️⃣ DATI DEMO
    // ─────────────────────────────────────────
    GenerateDemoDataForUser::run($user);

    $this->logSuccess('User', 'Utente demo completo (categorie + dati demo).');
    $this->logNewLine();
  }
}
